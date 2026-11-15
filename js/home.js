// ReChord website — home page sections below the hook.
(() => {
  'use strict';
  const { $, $$, clamp, fakePeaks, waveHTML, rng, APP_STORE, reduced } = RC;

  // ---------- "how it works": pinned phone that changes screen with scroll ----------
  const how = $('#how');
  if (how) {
    const phone = $('.phone', how), updateApp = RCApp.mount(phone);
    const onScroll = () => {
      const rect = how.getBoundingClientRect(), total = rect.height - innerHeight;
      const p = clamp(-rect.top / total);
      const step = Math.min(2, Math.floor(p * 3));
      if (how.dataset.step !== String(step)) how.dataset.step = step;
      const local = p * 3 - step;                       // 0..1 inside the current step
      phone.style.setProperty('--tilt', ((local - .5) * 1.2).toFixed(3));
      updateApp(step, local);
    };
    addEventListener('scroll', onScroll, { passive: true }); addEventListener('resize', onScroll); onScroll();
  }

  // ---------- manifesto: words light up as you scroll ----------
  const mt = $('#manifesto-text');
  if (mt) {
    const accent = new Set(['voice,', 'place', 'next.']);
    mt.innerHTML = mt.textContent.trim().split(/\s+/).map(w => `<span class="mw${accent.has(w) ? ' accent' : ''}">${w}</span>`).join(' ');
    const words = $$('.mw', mt);
    const light = () => {
      const rect = mt.getBoundingClientRect();
      const p = clamp((innerHeight * .82 - rect.top) / (rect.height + innerHeight * .42));
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('lit', reduced || i < n));
    };
    addEventListener('scroll', light, { passive: true }); light();
  }

  // ---------- bento: tiny living map ----------
  const am = $('#art-map');
  if (am) {
    const pins = [['maya', 14, 38], ['jonas', 33, 68], ['aiko', 52, 30], ['leo', 68, 62], ['noor', 86, 36], ['zara', 45, 78]];
    am.innerHTML = `<svg viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" fill="none" stroke-linecap="round">
      <g stroke="rgba(140,196,255,.3)" stroke-width="5"><path d="M-20 200C120 170 220 240 380 190S640 120 820 170"/><path d="M260 -20C250 80 330 160 300 320"/><path d="M560 -20C590 90 520 180 570 320"/></g>
      <g stroke="rgba(140,196,255,.13)" stroke-width="2.5"><path d="M-20 80 260 60 560 100 820 60M100 -20 120 320M420 -20 400 320M700 -20 690 320M-20 270 820 250M150 130 420 150M600 210 820 230"/></g>
      <path d="M-20 300C150 250 250 300 400 280S700 250 820 290V320H-20Z" fill="rgba(93,168,255,.1)" stroke="none"/></svg>` +
      pins.map(([id, x, y], i) => `<span class="mp" style="left:${x}%;top:${y}%;--rd:${(i * .5).toFixed(1)}s"><img src="assets/img/avatar_${id}.png" alt="" loading="lazy"></span>`).join('');
  }

  // ---------- stories: the app's own voice cards, with demo voices you can play ----------
  const strip = $('#strip');
  if (strip) {
    // MOCK DATA: fictional people, places and counts; audio is text-to-speech.
    const stories = [
      { u: 'leo',  n: 'Leo',  img: '01_street.jpg',   title: 'My street, at night',     place: 'Rue Cler, Paris',      likes: 8143,  plays: 42100 },
      { u: 'noor', n: 'Noor', img: '02_bench.jpg',    title: 'She said yes, right here', place: 'Cliff Walk, Howth',   likes: 31020, plays: 210400 },
      { u: 'maya', n: 'Maya', img: '03_cafe.jpg',     title: 'Table by the window',     place: 'Le Marais, Paris',     likes: 12400, plays: 86300 },
      { u: 'sam',  n: 'Sam',  img: '04_musician.jpg', title: 'Stay for one song',       place: 'Via Zamboni, Bologna', likes: 5210,  plays: 19800 },
      { u: 'aiko', n: 'Aiko', img: '05_platform.jpg', title: 'Platform two',            place: 'Zürich HB',            likes: 2764,  plays: 11200 },
      { u: 'zara', n: 'Zara', img: '06_window.jpg',   title: 'Rain sounds like home',   place: 'Notting Hill, London', likes: 9480,  plays: 37600 }
    ];
    const fmtK = n => n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'K' : String(n);
    const ic = {
      pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5c0 4.2 5.5 9.5 5.5 9.5s5.5-5.3 5.500-9.500A5.500 5.500 0 0 0 12 2.500z"/><circle cx="12" cy="8" r="1.8" fill="currentColor"/><ellipse cx="12" cy="20" rx="7" ry="2.2"/></svg>',
      heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-7.6-4.7-9.3-9.4C1.4 7.6 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.1 4.3 6.6-1.7 4.7-9.3 9.4-9.3 9.4z" stroke-width="2" stroke-linejoin="round"/></svg>',
      play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M7 4.5v15l12.5-7.5z"/></svg>',
      share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M8 10H5v11h14V10h-3"/></svg>',
      report: '<svg viewBox="0 0 24 24"><path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" fill="#E53935"/><path d="M12 7v6.5M12 16.5v.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>',
      btn: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="15" fill="#0A417B"/><path class="g-play" d="M13 10v12l9.5-6z" fill="#fff"/><g class="g-pause" fill="#fff"><rect x="11" y="10" width="3.6" height="12" rx="1"/><rect x="17.4" y="10" width="3.6" height="12" rx="1"/></g></svg>'
    };
    strip.innerHTML = stories.map((s, i) => `
      <article class="acard" data-i="${i}" data-hot>
        <img class="acard-bg" src="assets/img/${s.img}" alt="" loading="lazy" draggable="false">
        <span class="acard-report">${ic.report}</span>
        <div class="acard-head"><img src="assets/img/avatar_${s.u}.png" alt="" draggable="false"><div><b>${s.n}</b><span>${s.title}</span></div></div>
        <div class="acard-mid">
          <div class="acard-place">${ic.pin}<span>${s.place}</span></div>
          <div class="acard-side">
            <button class="a-like" type="button" aria-label="Like" aria-pressed="false">${ic.heart}<span>${fmtK(s.likes)}</span></button>
            <div class="a-plays">${ic.play}<span>${fmtK(s.plays)}</span></div>
            <div class="a-share">${ic.share}</div>
          </div>
        </div>
        <div class="acard-player"><button class="a-play" type="button" aria-label="Play ${s.n}'s voice">${ic.btn}</button><div class="a-wave">${fakePeaks(i + 70, 44).map(h => `<i style="height:${Math.max(12, h * 100).toFixed(0)}%"></i>`).join('')}</div></div>
      </article>`).join('');

    const audio = new Audio(); let cur = -1, raf = 0;
    const cardAt = i => strip.children[i];
    const stop = () => { audio.pause(); cancelAnimationFrame(raf); if (cur >= 0) cardAt(cur).classList.remove('playing'); };
    const tick = () => {
      if (cur < 0 || audio.paused) return;
      const bars = $$('.a-wave i', cardAt(cur)), d = isFinite(audio.duration) && audio.duration ? audio.duration : 6, n = Math.round(audio.currentTime / d * bars.length);
      bars.forEach((b, k) => b.classList.toggle('on', k < n)); raf = requestAnimationFrame(tick);
    };
    const toggle = i => {
      if (i === cur && !audio.paused) return stop();
      if (i !== cur) { stop(); if (cur >= 0) $$('.a-wave i', cardAt(cur)).forEach(b => b.classList.remove('on')); cur = i; audio.src = `assets/audio/story_${stories[i].u}.m4a`; const s = stories[i]; s.plays++; $('.a-plays span', cardAt(i)).textContent = fmtK(s.plays); }
      audio.play().then(() => { cardAt(i).classList.add('playing'); tick(); }).catch(() => {});
    };
    audio.addEventListener('ended', () => { if (cur >= 0) { cardAt(cur).classList.remove('playing'); $$('.a-wave i', cardAt(cur)).forEach(b => b.classList.remove('on')); } });

    // drag to scroll on desktop; a drag must not count as a tap on a card
    let down = false, sx = 0, sl = 0, moved = 0;
    strip.addEventListener('pointerdown', e => { moved = 0; if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = strip.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 6) strip.classList.add('drag'); strip.scrollLeft = sl - dx; });
    addEventListener('pointerup', () => { if (down) { down = false; strip.classList.remove('drag'); } });
    strip.addEventListener('click', e => {
      if (moved > 6) return;
      const card = e.target.closest('.acard'); if (!card) return; const i = +card.dataset.i;
      const like = e.target.closest('.a-like');
      if (like) { const on = like.getAttribute('aria-pressed') !== 'true'; like.setAttribute('aria-pressed', on); $('span', like).textContent = fmtK(stories[i].likes + (on ? 1 : 0)); return; }
      if (e.target.closest('.a-share')) return;
      toggle(i);
    });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
    new IntersectionObserver(es => { if (!es[0].isIntersecting) stop(); }).observe(strip);
  }

  // ---------- closing CTA: the Earth settles as you arrive ----------
  const earth = $('#cta-earth'), cta = $('#get');
  if (earth && !reduced) {
    const move = () => { const b = cta.getBoundingClientRect(); earth.style.setProperty('--p', clamp(1 - b.top / innerHeight).toFixed(3)); };
    addEventListener('scroll', move, { passive: true }); move();
  } else if (earth) earth.style.setProperty('--p', 1);

  const qrEl = $('#qr');
  if (qrEl && window.qrcode) { const q = qrcode(0, 'M'); q.addData(APP_STORE); q.make(); qrEl.innerHTML = q.createSvgTag({ cellSize: 4, margin: 0, scalable: true }); }
})();
