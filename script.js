(function () {
function initSlider(wrapId, clipId, dividerId) {
  const wrap    = document.getElementById(wrapId);
  const clip    = document.getElementById(clipId);
  const divider = document.getElementById(dividerId);
  const afterImg = clip.querySelector('.img-after');

  let dragging = false;

  function syncAfterWidth() {
    const w = wrap.offsetWidth;
    afterImg.style.width = w + 'px';
  }

  function setPosition(pct) {
    pct = Math.max(1, Math.min(99, pct));
    clip.style.width   = pct + '%';
    divider.style.left = pct + '%';
  }

  function toPercent(clientX) {
    const rect = wrap.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  wrap.addEventListener('mousedown', function(e) {
    dragging = true;
    wrap.classList.add('dragging');
    setPosition(toPercent(e.clientX));
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return;
    setPosition(toPercent(e.clientX));
  });

  document.addEventListener('mouseup', function() {
    dragging = false;
    wrap.classList.remove('dragging');
  });

  wrap.addEventListener('touchstart', function(e) {
    dragging = true;
    setPosition(toPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('touchmove', function(e) {
    if (!dragging) return;
    setPosition(toPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('touchend', function() {
    dragging = false;
  });

  wrap.setAttribute('tabindex', '0');
  wrap.addEventListener('keydown', function(e) {
    const curPct = parseFloat(clip.style.width) || 50;
    if (e.key === 'ArrowLeft')  setPosition(curPct - 2);
    if (e.key === 'ArrowRight') setPosition(curPct + 2);
  });

  syncAfterWidth();
  new ResizeObserver(syncAfterWidth).observe(wrap);
  setPosition(50);
}

// Add or remove lines here for each slider
initSlider('sliderWrap',  'clipPanel',  'divider');
initSlider('sliderWrap2', 'clipPanel2', 'divider2');
// initSlider('sliderWrap3', 'clipPanel3', 'divider3');
}());
