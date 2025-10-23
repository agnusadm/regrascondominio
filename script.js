(function () {
  const overlay = document.getElementById('mobile-only-overlay');
  const btnAbrirMesmoAssim = document.getElementById('btn-abrir-mesmo-assim');
  const backBtn = document.querySelector('.back-btn');
  const anoAtual = document.getElementById('ano-atual');
  const overlayPanelSelector = '.overlay-panel';
  let overlayOpen = false;

  if (anoAtual) {
    anoAtual.textContent = new Date().getFullYear();
  }

  function isDesktopLike() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    const ua = navigator.userAgent || '';
    const isWide = width >= 768;
    const uaDesktopHints = /(Windows NT|Macintosh|X11; Linux|CrOS)/i.test(ua);
    return isWide || uaDesktopHints;
  }

  function openOverlay() {
    if (!overlay) return;
    overlay.hidden = false;
    overlayOpen = true;
    trapFocus(overlay);
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.hidden = true;
    overlayOpen = false;
    releaseFocusTrap();
  }

  function evaluateMobileOnly() {
    if (isDesktopLike()) {
      openOverlay();
    } else {
      closeOverlay();
    }
  }

  if (btnAbrirMesmoAssim) {
    btnAbrirMesmoAssim.addEventListener('click', () => {
      closeOverlay();
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '#'; // Fallback simples
      }
    });
  }

  window.addEventListener('resize', debounce(evaluateMobileOnly, 150));
  window.addEventListener('orientationchange', debounce(evaluateMobileOnly, 150));

  evaluateMobileOnly();

  // Focus trap básico
  let lastFocusedElement = null;
  let focusableEls = [];
  let firstFocusable = null;
  let lastFocusable = null;

  function trapFocus(container) {
    lastFocusedElement = document.activeElement;
    focusableEls = Array.from(container.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
      .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    if (focusableEls.length) {
      firstFocusable = focusableEls[0];
      lastFocusable = focusableEls[focusableEls.length - 1];
      firstFocusable.focus();
    }

    document.addEventListener('keydown', handleKeydown);
  }

  function releaseFocusTrap() {
    document.removeEventListener('keydown', handleKeydown);
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try { lastFocusedElement.focus(); } catch (e) {}
    }
  }

  function handleKeydown(e) {
    if (!overlayOpen) return;
    if (e.key === 'Escape') {
      closeOverlay();
      return;
    }
    if (e.key !== 'Tab') return;

    if (focusableEls.length === 0) {
      e.preventDefault();
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  // Util: debounce
  function debounce(fn, wait) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
})();


