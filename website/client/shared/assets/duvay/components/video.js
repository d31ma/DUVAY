/* <w-video>, <w-video-controls>, and <w-video-volume> — native media player. */

import { wSafeUrl } from './utils.js';

export class WVideo extends WElement {
  static attrs = [
    'type', 'error', 'playing', 'progress', 'src', 'image', 'color', 'density',
    'floating', 'variant', 'hide-overlay', 'aspect-ratio', 'track-color', 'autoplay',
    'muted', 'no-fullscreen', 'start-at', 'controls-transition', 'controls-variant',
    'controls-props', 'background-color', 'hide-play', 'hide-volume',
    'hide-fullscreen', 'hide-progress-bar', 'split-time', 'pills', 'detached',
    'duration', 'volume', 'volume-props', 'src-object',
  ];

  get srcObject() { return this._srcObject; }
  set srcObject(value) { this._srcObject = value; const video = this._q('video'); if (video) video.srcObject = value || null; }

  _template() {
    const src = wSafeUrl(this._attr('src', ''));
    const poster = wSafeUrl(this._attr('image', ''));
    const ratio = this._ratio();
    const nativeControls = this._attr('controls-variant', 'default') === 'default' && !this._customControlsRequested();
    return `<div class="w-video w-video--${this._esc(this._attr('variant', 'player'))}${this._bool('floating') ? ' w-video--floating' : ''}" style="--w-video-aspect-ratio:${ratio}"><video${this._attrs({ src, poster, autoplay: this._bool('autoplay'), muted: this._bool('muted'), controls: nativeControls, preload: this._bool('eager') ? 'auto' : 'metadata', playsinline: true })}><slot name="source"></slot><slot name="track"></slot></video>${nativeControls ? '' : this._controls()}</div>`;
  }

  _controls() {
    return `<w-video-controls${this._attrs({
      variant: this._attr('controls-variant', 'default'),
      'hide-play': this._bool('hide-play'), 'hide-volume': this._bool('hide-volume'),
      'hide-fullscreen': this._bool('hide-fullscreen') || this._bool('no-fullscreen'),
      'hide-progress-bar': this._bool('hide-progress-bar'), 'split-time': this._bool('split-time'),
      pills: this._bool('pills'), detached: this._bool('detached'), volume: this._attr('volume', '1'),
    })}></w-video-controls>`;
  }

  _customControlsRequested() {
    return ['controls-variant', 'hide-play', 'hide-volume', 'hide-fullscreen', 'hide-progress-bar', 'split-time', 'pills', 'detached'].some((name) => this.hasAttribute(name));
  }
  _ratio() { const raw = this._attr('aspect-ratio', '16/9'); return /^\d+(?:\.\d+)?(?:\s*\/\s*\d+(?:\.\d+)?)?$/.test(raw) ? raw.replace('/', ' / ') : '16 / 9'; }

  _events() {
    const video = this._q('video');
    const controls = this._q('w-video-controls');
    if (!video) return;
    if (this._srcObject) video.srcObject = this._srcObject;
    const start = Number(this._attr('start-at', ''));
    if (Number.isFinite(start) && start > 0) video.addEventListener('loadedmetadata', () => { video.currentTime = Math.min(start, video.duration || start); }, { once: true });
    const volume = Number(this._attr('volume', ''));
    if (Number.isFinite(volume)) video.volume = Math.min(1, Math.max(0, volume));
    const sync = () => {
      const progress = video.duration ? video.currentTime / video.duration : 0;
      this._silentSet('playing', !video.paused);
      this._silentSet('progress', progress);
      this._silentSet('duration', Number.isFinite(video.duration) ? video.duration : 0);
      if (controls) {
        controls.media = video;
        controls.sync();
      }
      this._emit('timeupdate', { currentTime: video.currentTime, duration: video.duration, progress });
    };
    ['play', 'pause', 'timeupdate', 'durationchange', 'volumechange'].forEach((eventName) => video.addEventListener(eventName, sync));
    video.addEventListener('error', () => { this._silentSet('error', true); this._emit('error', { error: video.error }); });
    sync();
  }
}

export class WVideoControls extends WElement {
  static attrs = [
    'density', 'elevation', 'hover-elevation', 'theme', 'color', 'variant',
    'floating', 'playing', 'progress', 'fullscreen', 'background-color',
    'track-color', 'hide-play', 'hide-volume', 'hide-fullscreen',
    'hide-progress-bar', 'split-time', 'pills', 'detached', 'duration', 'volume',
    'volume-props',
  ];

  _template() {
    const duration = Number(this._attr('duration', '0')) || 0;
    const progress = Math.min(1, Math.max(0, Number(this._attr('progress', '0')) || 0));
    return `<div class="w-video-controls w-video-controls--${this._esc(this._attr('variant', 'default'))}" role="group" aria-label="Video controls">${this._bool('hide-play') ? '' : `<button type="button" data-video-action="play" aria-label="${this._bool('playing') ? 'Pause' : 'Play'}">${this._bool('playing') ? '❚❚' : '▶'}</button>`}${this._bool('hide-progress-bar') ? '' : `<input type="range" data-video-action="seek" min="0" max="1" step="0.001" value="${progress}" aria-label="Video progress">`}<span class="w-video-time">${this._time(progress * duration)}${this._bool('split-time') ? ` / ${this._time(duration)}` : ''}</span>${this._bool('hide-volume') ? '' : `<w-video-volume model-value="${this._esc(this._attr('volume', '1'))}"></w-video-volume>`}${this._bool('hide-fullscreen') ? '' : '<button type="button" data-video-action="fullscreen" aria-label="Toggle fullscreen">⛶</button>'}</div>`;
  }

  _events() {
    this._q('[data-video-action="play"]')?.addEventListener('click', () => this.media?.paused ? this.media.play() : this.media?.pause());
    this._q('[data-video-action="seek"]')?.addEventListener('input', (event) => {
      if (this.media?.duration) this.media.currentTime = Number(event.target.value) * this.media.duration;
    });
    this._q('w-video-volume')?.addEventListener('input', (event) => { if (this.media) this.media.volume = event.detail.value; });
    this._q('[data-video-action="fullscreen"]')?.addEventListener('click', () => {
      const target = this.closest('w-video') || this.parentElement;
      if (document.fullscreenElement) document.exitFullscreen?.(); else target?.requestFullscreen?.();
    });
  }
  sync() {
    if (!this.media) return;
    const playing = !this.media.paused;
    const duration = Number.isFinite(this.media.duration) ? this.media.duration : 0;
    const current = Number.isFinite(this.media.currentTime) ? this.media.currentTime : 0;
    const progress = duration ? current / duration : 0;
    this._syncState(playing, progress, duration);
    if (!this._rendered) return;

    this._syncPlay(playing);
    this._syncTimeline(current, duration, progress);
    this._syncVolume();
  }

  _syncState(playing, progress, duration) {
    this._silentSet('playing', playing);
    this._silentSet('progress', progress);
    this._silentSet('duration', duration);
    this._silentSet('volume', this.media.volume);
  }

  _syncPlay(playing) {
    const play = this._q('[data-video-action="play"]');
    play?.setAttribute('aria-label', playing ? 'Pause' : 'Play');
    if (play) play.textContent = playing ? '❚❚' : '▶';
  }

  _syncTimeline(current, duration, progress) {
    const seek = this._q('[data-video-action="seek"]');
    if (seek) seek.value = String(progress);
    const time = this._q('.w-video-time');
    if (time) time.textContent = `${this._time(current)}${this._bool('split-time') ? ` / ${this._time(duration)}` : ''}`;
  }

  _syncVolume() {
    const volume = this._q('w-video-volume');
    volume?._silentSet('model-value', this.media.volume);
    const volumeInput = volume?._q('input');
    if (volumeInput) volumeInput.value = String(this.media.volume);
  }
  _time(seconds) { const value = Math.max(0, Number(seconds) || 0); return `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, '0')}`; }
}

export class WVideoVolume extends WElement {
  static attrs = ['label', 'model-value', 'menu-props', 'direction', 'inline', 'slider-props'];
  _template() {
    const value = Math.min(1, Math.max(0, Number(this._attr('model-value', '1')) || 0));
    return `<label class="w-video-volume${this._attr('direction', 'horizontal') === 'vertical' ? ' w-video-volume--vertical' : ''}"><span aria-hidden="true">${value ? '🔊' : '🔇'}</span><span class="w-sr-only">${this._esc(this._attr('label', 'Volume'))}</span><input type="range" min="0" max="1" step="0.01" value="${value}" aria-label="${this._esc(this._attr('label', 'Volume'))}"></label>`;
  }
  _events() {
    this._q('input')?.addEventListener('input', (event) => {
      event.stopPropagation();
      const value = Number(event.target.value);
      this._silentSet('model-value', value);
      this._emit('input', { value });
      this._emit('update:modelValue', { value });
    });
  }
}

if (!customElements.get('w-video')) customElements.define('w-video', WVideo);
if (!customElements.get('w-video-controls')) customElements.define('w-video-controls', WVideoControls);
if (!customElements.get('w-video-volume')) customElements.define('w-video-volume', WVideoVolume);
