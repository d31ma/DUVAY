/* DuVay — Minimal JS behaviors (~5 KB target)
 *
 * Zero dependencies. Behaviors are wired through data-w-* attributes.
 * Motion hooks live in a separate duvay-motion.js add-on.
 * No build step required — import this file directly or inline it.
 */

(function () {
  'use strict';

  /* ── Theme ────────────────────────────────────────────────────────────── */

  const THEME_KEY = 'w-theme';
  const THEME_ATTR = 'data-w-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch (_) {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) { /* storage full or unavailable */ }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
  }

  function cycleTheme(current) {
    const next = current === 'light' ? 'dark'
      : current === 'dark' ? 'auto'
      : 'light';
    applyTheme(next);
    setStoredTheme(next);
    return next;
  }

  // Initialize theme from storage or default to light
  const initialTheme = getStoredTheme() || 'light';
  applyTheme(initialTheme);

  // Auto-theme: listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
      if (document.documentElement.getAttribute(THEME_ATTR) === 'auto') {
        // Force a repaint by re-applying
        applyTheme('auto');
      }
    });
  }

  // Wire theme toggle buttons
  document.addEventListener('click', function (e) {
    const toggle = e.target.closest('[data-w-theme-toggle]');
    if (!toggle) return;

    const current = document.documentElement.getAttribute(THEME_ATTR) || 'light';
    cycleTheme(current);
  });

  /* ── Dropdown ─────────────────────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    const trigger = e.target.closest('[data-w-dropdown-trigger]');
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const targetId = trigger.getAttribute('aria-controls') || trigger.getAttribute('data-w-dropdown-trigger');
    const dropdown = document.getElementById(targetId) || document.querySelector('[data-w-dropdown="' + targetId + '"]');
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains('open');

    // Close all other dropdowns first
    document.querySelectorAll('[data-w-dropdown].open').forEach(function (d) {
      if (d !== dropdown) {
        d.classList.remove('open');
        var t = document.querySelector('[aria-controls="' + d.id + '"]');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });

    dropdown.classList.toggle('open', !isOpen);
    trigger.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
  });

  // Close dropdowns on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('[data-w-dropdown]') && !e.target.closest('[data-w-dropdown-trigger]')) {
      document.querySelectorAll('[data-w-dropdown].open').forEach(function (d) {
        d.classList.remove('open');
        var t = document.querySelector('[aria-controls="' + d.id + '"]');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('[data-w-dropdown].open').forEach(function (d) {
        d.classList.remove('open');
        var t = document.querySelector('[aria-controls="' + d.id + '"]');
        if (t) {
          t.setAttribute('aria-expanded', 'false');
          t.focus();
        }
      });
    }
  });

  /* ── Collapsible sections ─────────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    const header = e.target.closest('[data-w-section-toggle]');
    if (!header) return;

    const section = header.closest('.w-sidebar-section') || header.parentElement;
    if (!section) return;

    section.classList.toggle('collapsed');
  });

  /* ── Toast ────────────────────────────────────────────────────────────── */

  /**
   * Show a toast notification.
   * @param {string} message - Text to display.
   * @param {number} [duration=3000] - Milliseconds before auto-dismiss.
   */
  window.WToast = function (message, duration) {
    duration = duration || 3000;

    // Remove any existing toast
    var existing = document.querySelector('.w-toast');
    if (existing) existing.remove();

    var toast = document.createElement('div');
    toast.className = 'w-toast';
    toast.textContent = message;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);

    setTimeout(function () {
      toast.remove();
    }, duration);
  };

  /* ── Sidebar overlay (for mobile) ─────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var toggle = e.target.closest('[data-w-sidebar-toggle]');
    if (!toggle) return;

    var sidebar = document.querySelector('.w-sidebar');
    if (!sidebar) return;

    var overlay = document.querySelector('.w-sidebar-overlay');
    var isOpen = sidebar.classList.contains('open');

    if (isOpen) {
      sidebar.classList.remove('open');
      document.body.classList.remove('w-sidebar-open');
      if (overlay) overlay.remove();
    } else {
      sidebar.classList.add('open');

      // Create overlay
      var ov = document.createElement('div');
      ov.className = 'w-sidebar-overlay';
      ov.setAttribute('data-w-sidebar-overlay', '');
      ov.addEventListener('click', function () {
        sidebar.classList.remove('open');
        document.body.classList.remove('w-sidebar-open');
        ov.remove();
      });
      document.body.appendChild(ov);
      document.body.classList.add('w-sidebar-open');
    }
  });

  /* ── Dialog / Modal ────────────────────────────────────────────────────── */

  function getTargetEl(el, attr) {
    var targetId = el.getAttribute(attr);
    if (!targetId) return null;
    return document.getElementById(targetId) || document.querySelector('[data-w-dialog="' + targetId + '"]') || document.querySelector('[data-w-sheet="' + targetId + '"]') || document.querySelector('[data-w-expand="' + targetId + '"]');
  }

  // Open dialog/sheet
  document.addEventListener('click', function (e) {
    var opener = e.target.closest('[data-w-dialog-open], [data-w-sheet-open]');
    if (!opener) return;

    var isDialog = opener.hasAttribute('data-w-dialog-open');
    var targetEl = getTargetEl(opener, isDialog ? 'data-w-dialog-open' : 'data-w-sheet-open');
    if (!targetEl) return;

    // Show overlay if present
    var overlayId = targetEl.getAttribute('data-w-overlay');
    var overlay = overlayId ? document.getElementById(overlayId) : document.querySelector('.w-overlay');
    if (overlay) { overlay.classList.add('open'); }

    targetEl.classList.add('open');
    targetEl.setAttribute('aria-hidden', 'false');

    // Focus first focusable element in dialog
    if (isDialog) {
      setTimeout(function () {
        var focusable = targetEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      }, 100);
    }
  });

  // Close dialog/sheet
  document.addEventListener('click', function (e) {
    var closer = e.target.closest('[data-w-dialog-close], [data-w-sheet-close]');
    if (!closer) return;

    var isDialog = closer.hasAttribute('data-w-dialog-close');
    var targetEl = getTargetEl(closer, isDialog ? 'data-w-dialog-close' : 'data-w-sheet-close');
    if (!targetEl) {
      // Close the nearest open wrapper
      targetEl = closer.closest('.w-dialog-wrapper.open, .w-sheet-bottom.open');
    }
    if (!targetEl) return;

    targetEl.classList.remove('open');
    targetEl.setAttribute('aria-hidden', 'true');

    // Hide overlay
    var overlayId = targetEl.getAttribute('data-w-overlay');
    var overlay = overlayId ? document.getElementById(overlayId) : document.querySelector('.w-overlay');
    if (overlay && !document.querySelector('.w-dialog-wrapper.open, .w-sheet-bottom.open')) {
      overlay.classList.remove('open');
    }
  });

  // Close dialog/sheet on overlay click
  document.addEventListener('click', function (e) {
    var overlay = e.target.closest('.w-overlay');
    if (!overlay) return;

    document.querySelectorAll('.w-dialog-wrapper.open, .w-sheet-bottom.open').forEach(function (el) {
      el.classList.remove('open');
      el.setAttribute('aria-hidden', 'true');
    });
    overlay.classList.remove('open');
  });

  // Close dialog/sheet on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;

    var openDialogs = document.querySelectorAll('.w-dialog-wrapper.open, .w-sheet-bottom.open');
    if (openDialogs.length === 0) return;

    var last = openDialogs[openDialogs.length - 1];
    last.classList.remove('open');
    last.setAttribute('aria-hidden', 'true');

    var overlayId = last.getAttribute('data-w-overlay');
    var overlay = overlayId ? document.getElementById(overlayId) : document.querySelector('.w-overlay');
    if (overlay && !document.querySelector('.w-dialog-wrapper.open, .w-sheet-bottom.open')) {
      overlay.classList.remove('open');
    }
  });

  /* ── Expansion Panel ──────────────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var header = e.target.closest('[data-w-expand-toggle]');
    if (!header) return;

    var panel = header.closest('.w-expand');
    if (!panel) {
      var targetId = header.getAttribute('data-w-expand-toggle');
      panel = document.getElementById(targetId) || document.querySelector('[data-w-expand="' + targetId + '"]');
    }
    if (!panel) return;

    const next = !panel.classList.contains('open');
    if (window.WMotion && typeof window.WMotion.setExpand === 'function') {
      window.WMotion.setExpand(panel, next);
    } else {
      panel.classList.toggle('open', next);
      header.setAttribute('aria-expanded', String(next));
    }
  });

  /* ── Speed Dial ───────────────────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-w-speed-dial]');
    if (!trigger) return;

    var dial = trigger.closest('.w-speed-dial');
    if (dial) {
      dial.classList.toggle('open');
    } else {
      trigger.classList.toggle('open');
    }
  });

  // Close speed dial on outside click
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.w-speed-dial')) {
      document.querySelectorAll('.w-speed-dial.open').forEach(function (d) {
        d.classList.remove('open');
      });
    }
  });

  /* ── Alert dismiss ────────────────────────────────────────────────────── */

  document.addEventListener('click', function (e) {
    var dismiss = e.target.closest('[data-w-alert-dismiss]');
    if (!dismiss) return;

    var alert = dismiss.closest('.w-alert');
    if (!alert) return;
    if (window.WMotion && typeof window.WMotion.leave === 'function') {
      window.WMotion.leave(alert, 'fade', { hide: false }).then(function () { alert.remove(); });
    } else {
      alert.remove();
    }
  });

  /* ── Keyboard shortcuts ───────────────────────────────────────────────── */

  document.addEventListener('keydown', function (e) {
    // Cmd/Ctrl + K: focus search input
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      var searchInput = document.querySelector('[data-w-search]');
      if (searchInput) searchInput.focus();
    }
  });

  /* ── Auto-init ────────────────────────────────────────────────────────── */

  // Expose the theme API for programmatic control
  window.WTheme = {
    get: function () {
      return document.documentElement.getAttribute(THEME_ATTR) || 'light';
    },
    set: function (theme) {
      applyTheme(theme);
      setStoredTheme(theme);
    },
    cycle: function () {
      return cycleTheme(this.get());
    }
  };

})();
