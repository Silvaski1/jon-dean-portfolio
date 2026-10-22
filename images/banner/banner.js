(function () {
  var banner = document.getElementById('banner');
  var cfg = window.BANNER_CONFIG;
  if (!banner || !cfg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var TOTAL = 3000;
  var FADE = 900;

  banner.classList.add('anim');
  banner.style.aspectRatio = cfg.aspect;

  var els = cfg.tiles.map(function (t) {
    var img = new Image();
    img.className = 'banner-tile';
    img.alt = '';
    img.style.left = t.x + '%';
    img.style.top = t.y + '%';
    img.style.width = t.w + '%';
    img.style.height = t.h + '%';
    img.src = cfg.base + t.src;
    banner.appendChild(img);
    return img;
  });

  Promise.all(els.map(function (img) {
    return img.decode().catch(function () {});
  })).then(function () {
    var order = els.slice();
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    var step = TOTAL / order.length;
    order.forEach(function (img, i) {
      img.style.transitionDelay = Math.round(i * step + Math.random() * step * 0.5) + 'ms';
    });
    requestAnimationFrame(function () {
      order.forEach(function (img) { img.classList.add('show'); });
    });
    setTimeout(function () { banner.classList.add('done'); }, TOTAL + FADE + 300);
  });
})();
