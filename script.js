(function () {
  const wrap     = document.getElementById('sliderWrap');
  const clip     = document.getElementById('clipPanel');
  const divider  = document.getElementById('divider');
  const hint     = document.getElementById('hint');
  const afterImg = clip.querySelector('.img-after');

  let dragging = false;
  let hintHidden = false;

  /* Keep the after-image width in sync with the container so it
     never appears squashed as the clip panel shrinks.            */
  function syncAfterWidth() {
    const w = wrap.offsetWidth;
    afterImg.style.width = w + 'px';
    wrap.style.setProperty('--container-width', w + 'px');
  }

  /* Move the divider to a percentage (0–100) across the container */
  function setPosition(pct) {
    pct = Math.max(1, Math.min(99, pct));
    clip.style.width    = pct + '%';
    divider.style.left  = pct + '%';
  }

  /* Convert a pointer/touch X position to a percentage */
  function toPercent(clientX) {
    const rect = wrap.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  /* ── Mouse ──────────────────────────────────────────── */
  wrap.addEventListener('mousedown', function (e) {
    dragging = true;
    wrap.classList.add('dragging');
    setPosition(toPercent(e.clientX));
    hideHint();
    e.preventDefault();
  });

  document.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    setPosition(toPercent(e.clientX));
  });

  document.addEventListener('mouseup', function () {
    dragging = false;
    wrap.classList.remove('dragging');
  });

  /* ── Touch ──────────────────────────────────────────── */
  wrap.addEventListener('touchstart', function (e) {
    dragging = true;
    setPosition(toPercent(e.touches[0].clientX));
    hideHint();
  }, { passive: true });

  document.addEventListener('touchmove', function (e) {
    if (!dragging) return;
    setPosition(toPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('touchend', function () {
    dragging = false;
  });

  /* ── Keyboard accessibility ─────────────────────────── */
  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', function (e) {
    const rect = wrap.getBoundingClientRect();
    const curPct = (parseFloat(clip.style.width) || 50);
    if (e.key === 'ArrowLeft')  { setPosition(curPct - 2); hideHint(); }
    if (e.key === 'ArrowRight') { setPosition(curPct + 2); hideHint(); }
  });

  /* ── Helpers ────────────────────────────────────────── */
  function hideHint() {
    if (!hintHidden && hint) {
      hintHidden = true;
      hint.classList.add('hidden');
    }
  }

  /* ── Init ───────────────────────────────────────────── */
  syncAfterWidth();
  new ResizeObserver(syncAfterWidth).observe(wrap);

  /* Start at 50% */
  setPosition(50);
}());
