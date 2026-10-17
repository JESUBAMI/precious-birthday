(function () {
  var $ = function (s, r) { return (r || document).querySelector(s) }, $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  var mobile = function () { return innerWidth <= 760 }, order = [], placed = {}, settings = window.BIRTHDAY_SETTINGS || {}, photos = window.PHOTOS || [];

  /* confetti */
  var cv = $('#cf'), cx = cv.getContext('2d'), bits = [], run = false, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function sz() { cv.width = innerWidth; cv.height = innerHeight } sz(); addEventListener('resize', sz);
  var cols = ['#ff5c93', '#ffd166', '#ffffff', '#c9c1d6', '#ff8fb3'];
  function burst() {
    if (reduce) return;
    for (var n = 0; n < 170; n++) bits.push({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 17, vy: Math.random() * -14 - 2, w: 6 + Math.random() * 7, h: 4 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[Math.floor(Math.random() * cols.length)], l: 0 });
    if (!run) { run = true; requestAnimationFrame(tick) }
  }
  function tick() {
    cx.clearRect(0, 0, cv.width, cv.height); bits = bits.filter(function (b) { return b.y < cv.height + 20 && b.l < 260 });
    bits.forEach(function (b) { b.vy += .35; b.x += b.vx; b.y += b.vy; b.vx *= .99; b.r += b.vr; b.l++; cx.save(); cx.translate(b.x, b.y); cx.rotate(b.r); cx.fillStyle = b.c; cx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h); cx.restore() });
    if (bits.length) requestAnimationFrame(tick); else { run = false; cx.clearRect(0, 0, cv.width, cv.height) }
  }

  /* windows */
  function z() { order.forEach(function (id, i) { $('#w-' + id).style.zIndex = 10 + i }) }
  function front(id) { order = order.filter(function (x) { return x !== id }); order.push(id); z() }
  function sync() { $$('.dock button').forEach(function (b) { b.classList.toggle('on', !$('#w-' + b.dataset.app).hidden) }) }
  var spots = { welcome: [170, 70], msg: [620, 110], photos: [200, 90], video: [460, 80], wish: [300, 100], pray: [380, 130] };
  function open(id) {
    var w = $('#w-' + id); if (!w) return;
    if (mobile()) $$('.win').forEach(function (o) { if (o !== w) o.hidden = true });
    w.hidden = false;
    if (!placed[id] && !mobile()) { var p = spots[id] || [200, 90]; w.style.left = Math.min(p[0], Math.max(10, innerWidth - w.offsetWidth - 10)) + 'px'; w.style.top = p[1] + 'px'; placed[id] = 1 }
    front(id); sync();
  }
  function close(id) { $('#w-' + id).hidden = true; order = order.filter(function (x) { return x !== id }); sync() }
  $$('[data-app]').forEach(function (b) { b.addEventListener('click', function () { open(b.dataset.app) }) });
  $$('.win').forEach(function (w) {
    var id = w.id.slice(2);
    w.addEventListener('pointerdown', function () { front(id) });
    $('.x', w).addEventListener('click', function () { close(id) });
    $('.z', w).addEventListener('click', function () { w.classList.toggle('max') });
    var tb = $('.tb', w), ox, oy, dr = false;
    tb.addEventListener('pointerdown', function (e) { if (mobile() || e.target.closest('button') || w.classList.contains('max')) return; dr = true; ox = e.clientX - w.offsetLeft; oy = e.clientY - w.offsetTop; tb.setPointerCapture(e.pointerId); tb.style.cursor = 'grabbing' });
    tb.addEventListener('pointermove', function (e) { if (!dr) return; w.style.left = Math.max(-w.offsetWidth + 80, Math.min(innerWidth - 80, e.clientX - ox)) + 'px'; w.style.top = Math.max(34, Math.min(innerHeight - 60, e.clientY - oy)) + 'px' });
    tb.addEventListener('pointerup', function () { dr = false; tb.style.cursor = '' });
  });

  /* boot / login */
  $('#boot').addEventListener('click', function () {
    this.classList.add('off'); $('#desk').hidden = false; burst();
    setTimeout(function () { $('#boot').remove() }, 650);
    open('welcome'); if (!mobile()) open('msg');
  });
  $('#boot').focus();
  $('#party').addEventListener('click', burst);

  /* clock */
  function clk() { var d = new Date(); $('#clk').textContent = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } clk(); setInterval(clk, 30000);

  /* photos */
  var cats = ['All'], cur = 'All', list = [];
  photos.forEach(function (p) { if (cats.indexOf(p.c) === -1) cats.push(p.c) });
  function render() {
    list = photos.filter(function (p) { return cur === 'All' || p.c === cur });
    $('#pgrid').innerHTML = list.length ? list.map(function (p, i) { return '<button type="button" data-i="' + i + '" aria-label="Open photo: ' + p.a.replace(/"/g, '&quot;') + '"><img src="' + p.s + '" alt="' + p.a.replace(/"/g, '&quot;') + '" loading="lazy"></button>' }).join('') : '<p class="photo-empty">Their photos will appear here as soon as you add them.</p>';
    $$('#tabs button').forEach(function (b) { b.setAttribute('aria-selected', b.textContent.split(' ')[0] === cur) });
  }
  $('#tabs').innerHTML = cats.map(function (c) { var n = c === 'All' ? photos.length : photos.filter(function (p) { return p.c === c }).length; return '<button type="button" role="tab">' + c + ' <small>' + n + '</small></button>' }).join('');
  $$('#tabs button').forEach(function (b, i) { b.addEventListener('click', function () { cur = cats[i]; render() }) });
  render();
  var lb = $('#lb'), li = $('#li'), lc = $('#lc'), ix = 0, lastB = null;
  function show(i) { ix = (i + list.length) % list.length; li.src = list[ix].s; li.alt = list[ix].a; lc.textContent = (ix + 1) + ' / ' + list.length }
  $('#pgrid').addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; lastB = b; show(+b.dataset.i); lb.showModal() });
  $('#lp').addEventListener('click', function () { show(ix - 1) }); $('#ln').addEventListener('click', function () { show(ix + 1) }); $('#lx').addEventListener('click', function () { lb.close() });
  lb.addEventListener('close', function () { if (lastB && document.contains(lastB)) lastB.focus() });
  lb.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(ix + 1); if (e.key === 'ArrowLeft') show(ix - 1) });
  var sx = null; lb.addEventListener('touchstart', function (e) { sx = e.changedTouches[0].clientX }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (sx === null) return; var d = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(d) > 50) show(d < 0 ? ix + 1 : ix - 1) }, { passive: true });

  /* prayers */
  var pr = settings.prayers || ["May this new age open doors that no one can shut.", "May God give you wisdom in every decision and peace in every season.", "May your hard work be rewarded, and your project end in success.", "May you always be surrounded by people who love and encourage you.", "May your health be strong and your joy overflow all year.", "May everything you lay your hands on prosper.", "Happy birthday, Precious. This year will be your best yet."], pi = 0;
  $('#pn').addEventListener('click', function () { $('#pt').textContent = pr[pi % pr.length]; pi++; this.textContent = 'Open another prayer'; if (pi === pr.length) burst() });

  /* WhatsApp wish */
  var num = String(settings.whatsappNumber || '2349092643159').replace(/\D/g, ''), greeting = settings.wishGreeting || 'Happy birthday Precious! \uD83C\uDF89', wa = $('#wa'), wn = $('#wn'), wt = $('#wt'), ww = $('#ww');
  function link() { var who = wn.value.trim(), m = wt.value.trim(); wa.href = 'https://wa.me/' + num + '?text=' + encodeURIComponent(greeting + '\n\n' + m + (who ? '\n\n- ' + who : '')) }
  wn.addEventListener('input', link); wt.addEventListener('input', link); link();
  wa.addEventListener('click', function (e) { if (!wt.value.trim()) { e.preventDefault(); ww.textContent = 'Please write your wish first.'; wt.focus() } else { ww.textContent = ''; link() } });
})();
