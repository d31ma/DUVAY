/* <w-file-upload-dropzone> — standalone drag-and-drop target.
 *
 * The same surface as <w-file-upload> (title, subtitle, icon, browse button,
 * divider, file list, scrim, error state) with the dropzone's own presentation
 * knobs on top. Authored children render inside the dropzone.
 *
 * Attributes (beyond the <w-file-upload> set):
 *   length      - divider length; a bare number is pixels
 *   thickness   - divider thickness; a bare number is pixels
 *   opacity     - opacity of the whole dropzone
 *   open-delay  - ms to wait before the scrim fades in
 *   close-delay - ms to wait before the scrim fades out
 */
import { WFileUpload } from './file-upload.js';
import { wCssLength } from './file-input.js';

// Delays are milliseconds, as they are in Vuetify; a bare number gains the unit.
function wMsDelay(value) {
  const text = String(value == null ? '' : value).trim();
  if (!text) return '';
  return /^-?\d*\.?\d+$/.test(text) ? `${text}ms` : text;
}

export class WFileUploadDropzone extends WFileUpload {
  static attrs = ['length', 'thickness', 'opacity', 'open-delay', 'close-delay'];

  // Every dropzone knob is a custom property (or a plain declaration for
  // `opacity`) layered onto the ones <w-file-upload> already writes.
  _styleProps() {
    return super._styleProps().concat(WFileUploadDropzone.styleProps
      .map(([attr, prop, cast]) => [prop, cast(this._attr(attr, ''))])
      .filter(([, value]) => value)
      .map(([prop, value]) => `${prop}:${value}`));
  }

  static styleProps = [
    ['length', '--w-file-upload-divider-length', wCssLength],
    ['thickness', '--w-file-upload-divider-thickness', wCssLength],
    ['open-delay', '--w-file-upload-open-delay', wMsDelay],
    ['close-delay', '--w-file-upload-close-delay', wMsDelay],
    ['opacity', 'opacity', (value) => String(value).trim()],
  ];

  _slotMarkup() { return '<slot></slot>'; }
}

if (!customElements.get('w-file-upload-dropzone')) {
  customElements.define('w-file-upload-dropzone', WFileUploadDropzone);
}
