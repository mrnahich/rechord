// ReChord website — Team, Updates and Investors pages.
(() => {
  'use strict';
  const { $, $$, clamp, fakePeaks, waveHTML, logoSVG, APP_STORE, reduced, observe } = RC;

  // PLACEHOLDER: replace with the real contact address before publishing.
  const CONTACT_EMAIL = 'hello@rechord.life';

  $$('[data-store]').forEach(a => a.href = APP_STORE);
  $$('[data-mail]').forEach(a => a.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(a.dataset.mail)}`);
  const fine = $('#mail-fine'); if (fine) fine.textContent = `Or write to ${CONTACT_EMAIL}`;
  const core = $('#loop-core'); if (core) core.insertAdjacentHTML('afterbegin', logoSVG());

  // ---------- team: an imaginary town where each of us left a voice ----------
  // Drop a recording at assets/team/voice/<id>.m4a (or .mp3) and that person's pin becomes playable.
  const tmap = $('#tmap');
  if (tmap) {
    const people = [ // x,y = position on desktop (% of the map); mx,my = position on phones
      { id: 'shayan',  name: 'Shayan Ebrahimi', role: 'Tech Lead',      place: 'The Engine Yard',  x: 15, y: 34, mx: 26, my: 15, link: 'https://www.linkedin.com/in/shayan-ebrahimi/' },
      { id: 'oguzhan', name: 'Oguzhan Dal',     role: 'Business Lead',  place: 'Harbour Exchange', x: 36, y: 68, mx: 72, my: 30, link: 'https://www.linkedin.com/in/ozzydal/' },
      { id: 'jim',     name: 'Jim Bristow',     role: 'Chairman',       place: 'Lighthouse Hill',  x: 52, y: 24, mx: 28, my: 47, link: null },
      { id: 'aslan',   name: 'Aslan Nahich',    role: 'Dreamer',        place: 'Dreamers’ Park', x: 68, y: 58, mx: 72, my: 63, link: 'https://www.linkedin.com/in/aslan-nahich-86a950137/' },
      { id: 'mahdi',   name: 'Mahdi Tahvilian', role: 'Marketing Lead', place: 'Market Square',    x: 86, y: 30, mx: 32, my: 81, link: 'https://www.linkedin.com/in/mohammad-mahdi-tahvilian-56a08b215/' }
    ].map((p, i) => ({ ...p, i, peaks: fakePeaks(i + 60, 40), src: null, dur: 0 }));

    const pinsEl = $('#tm-pins'), card = $('#tm-card'), routePath = $('#tm-route');
    const small = () => innerWidth < 760;
    pinsEl.innerHTML = people.map(p => `
      <button class="tm-pin" type="button" data-id="${p.id}" style="--x:${p.x}%;--y:${p.y}%;--mx:${p.mx}%;--my:${p.my}%;--rd:${(p.i * .55).toFixed(2)}s" aria-label="${p.name}, ${p.role}">
        <span class="rings"><i></i><i></i></span><img src="assets/team/${p.id}.jpg" alt="" draggable="false">
        <span class="tm-label"><b>${p.name.split(' ')[0]}</b><em>${p.place}</em></span>
      </button>`).join('');
    const pinOf = p => $(`.tm-pin[data-id="${p.id}"]`, pinsEl);

    // route through everyone, like a playlist drawn on the map
    const drawRoute = () => {
      const r = tmap.getBoundingClientRect();
      const pts = people.map(p => { const b = pinOf(p).getBoundingClientRect(); return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top]; });
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; d += small() ? ` C${x0} ${y0 + (y1 - y0) * .5} ${x1} ${y1 - (y1 - y0) * .5} ${x1} ${y1}` : ` C${x0 + (x1 - x0) * .5} ${y0} ${x1 - (x1 - x0) * .5} ${y1} ${x1} ${y1}`; }
      routePath.setAttribute('d', d);
    };
    addEventListener('resize', () => { drawRoute(); if (current) place(current); }); addEventListener('load', drawRoute); drawRoute();

    // find real recordings, if any have been added
    const audio = new Audio(); let current = null, touring = false, tourTimer = 0;
    people.forEach(async p => {
      for (const ext of ['m4a', 'mp3']) {
        const url = `assets/team/voice/${p.id}.${ext}`;
        try {
          const res = await fetch(url, { method: 'HEAD' }); if (!res.ok) continue;
          p.src = url; pinOf(p).classList.add('has-voice');
          try { // real waveform from the recording
            const buf = await (await fetch(url)).arrayBuffer(), AC = window.AudioContext || window.webkitAudioContext, ac = new AC();
            const a = await ac.decodeAudioData(buf), ch = a.getChannelData(0), n = 40, step = Math.floor(ch.length / n), pk = [];
            for (let k = 0; k < n; k++) { let m = 0; for (let j = k * step; j < (k + 1) * step; j += 64) m = Math.max(m, Math.abs(ch[j])); pk.push(m); }
            const mx = Math.max(.05, ...pk); p.peaks = pk.map(v => clamp(v / mx, .12, 1)); p.dur = a.duration; ac.close();
          } catch { /* keep the placeholder waveform */ }
          if (current === p) show(p, false);
          break;
        } catch { /* offline or blocked: stays "soon" */ }
      }
    });

    const fmt = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
    function place(p) { // desktop: pop the card beside the pin; phones: CSS puts it under the map
      if (small()) { card.style.left = card.style.top = ''; return; }
      const r = tmap.getBoundingClientRect(), b = pinOf(p).getBoundingClientRect(), cw = card.offsetWidth, chh = card.offsetHeight;
      const cx = b.left + b.width / 2 - r.left, cy = b.top + b.height / 2 - r.top;
      const left = cx > r.width * .56 ? cx - cw - 56 : cx + 56;
      card.style.left = `${clamp(left, 16, r.width - cw - 16)}px`; card.style.top = `${clamp(cy - chh / 2, 70, r.height - chh - 16)}px`;
    }
    function show(p, autoplay) {
      $$('.tm-pin', pinsEl).forEach(el => el.classList.remove('active', 'playing'));
      current = p; pinOf(p).classList.add('active'); tmap.classList.add('has-card');
      card.hidden = false; card.classList.toggle('soon', !p.src); card.classList.remove('playing');
      card.style.animation = 'none'; void card.offsetWidth; card.style.animation = '';
      $('#tm-photo').src = `assets/team/${p.id}.jpg`; $('#tm-role').textContent = p.role; $('#tm-name').textContent = p.name; $('#tm-place').textContent = `Pinned at ${p.place}`;
      $('#tm-wave').innerHTML = waveHTML(p.peaks); $('#tm-time').textContent = p.src ? (p.dur ? fmt(p.dur) : '') : 'Voice lands here soon';
      const l = $('#tm-link'); l.hidden = !p.link; if (p.link) l.href = p.link;
      audio.pause(); if (p.src) { audio.src = p.src; if (autoplay) play(); }
      place(p);
    }
    function play() { audio.play().then(() => { card.classList.add('playing'); pinOf(current).classList.add('playing'); tick(); }).catch(() => {}); }
    function pause() { audio.pause(); card.classList.remove('playing'); current && pinOf(current).classList.remove('playing'); }
    function tick() {
      if (audio.paused) return; const d = isFinite(audio.duration) ? audio.duration : current.dur || 1, bars = $('#tm-wave').children, n = Math.round(audio.currentTime / d * bars.length);
      for (let i = 0; i < bars.length; i++) bars[i].classList.toggle('on', i < n);
      $('#tm-time').textContent = fmt(audio.currentTime); requestAnimationFrame(tick);
    }
    const hop = d => show(people[((current ? current.i : -1) + d + people.length) % people.length], true);
    audio.addEventListener('ended', () => { pause(); if (touring) nextStop(900); });
    pinsEl.addEventListener('click', e => { const b = e.target.closest('.tm-pin'); if (!b) return; stopTour(); show(people.find(p => p.id === b.dataset.id), true); });
    $('#tm-play').addEventListener('click', () => { if (!current?.src) return; audio.paused ? play() : pause(); });
    $('#tm-close').addEventListener('click', () => { stopTour(); pause(); card.hidden = true; tmap.classList.remove('has-card'); $$('.tm-pin', pinsEl).forEach(el => el.classList.remove('active')); current = null; });
    $('#tm-prev').addEventListener('click', () => { stopTour(); hop(-1); }); $('#tm-next').addEventListener('click', () => { stopTour(); hop(1); });

    // the tour: walk the route, play each voice (or pause a moment where a voice is still to come)
    const tourLabel = $('#tm-tour-label');
    function nextStop(delay) { clearTimeout(tourTimer); tourTimer = setTimeout(() => { if (!touring) return; if (current && current.i === people.length - 1) return stopTour(); hop(1); if (!current.src) nextStop(2600); }, delay); }
    function stopTour() { touring = false; clearTimeout(tourTimer); tmap.classList.remove('touring'); tourLabel.textContent = 'Take the tour'; }
    $('#tm-tour').addEventListener('click', () => {
      if (touring) { stopTour(); pause(); return; }
      touring = true; tmap.classList.add('touring'); tourLabel.textContent = 'Stop the tour';
      show(people[0], true); if (!people[0].src) nextStop(2600);
    });

    // the map leans a little toward the pointer
    if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
      tmap.addEventListener('pointermove', e => { const r = tmap.getBoundingClientRect(); tmap.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3)); tmap.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3)); });
      tmap.addEventListener('pointerleave', () => { tmap.style.setProperty('--px', 0); tmap.style.setProperty('--py', 0); });
    }
    document.addEventListener('visibilitychange', () => { if (document.hidden) { stopTour(); pause(); } });
  }

  // ---------- updates: a route you scroll along ----------
  const route = $('#route');
  if (route) {
    // MOCK DATA: sample release notes. Features are real; versions and dates are placeholders.
    const stops = [
      { ver: '1.4', date: 'Sample date', place: 'the share sheet', title: 'Share a voice with one link', body: 'Send a single link and it opens the voice exactly where it lives on the map. No screenshots, no explaining where it was.', by: 'maya' },
      { ver: '1.3', date: 'Sample date', place: 'your profile', title: 'Private voices', body: 'Flip one switch while recording and a voice is yours alone. Some places are not for everyone.', by: 'noor' },
      { ver: '1.2', date: 'Sample date', place: 'the pin', title: 'Exact spot, or just nearby', body: 'Choose how precise a pin is. Mark the very bench, or keep it to the neighbourhood.', by: 'jonas' },
      { ver: '1.1', date: 'Sample date', place: 'the activity tab', title: 'Likes and activity', body: 'See who listened and who loved it. Every like comes back to the place it was left.', by: 'leo' },
      { ver: '1.0', date: 'Sample date', place: 'the App Store', title: 'ReChord lands on iPhone', body: 'Record up to 60 seconds, pin it where you stand, and explore a world map of voices.', by: 'zara' }
    ];
    $('#stops').innerHTML = stops.map((s, i) => `
      <article class="stop">
        <span class="stop-dot"></span>
        <div class="card stop-card">
          <div class="stop-meta"><span class="ver">v${s.ver}</span><span>${s.date}</span></div>
          <h3>${s.title}</h3><p>${s.body}</p>
          <div class="stop-note"><img src="assets/img/avatar_${s.by}.png" alt="" loading="lazy"><div class="wave">${waveHTML(fakePeaks(i + 40, 30))}</div><span>Voice note from the team, soon</span></div>
        </div>
        <div class="stop-side">Stop ${String(stops.length - i).padStart(2, '0')}<br>at ${s.place}</div>
      </article>`).join('');

    const bg = $('#r-bg'), fg = $('#r-fg'), trav = $('#traveller'), items = $$('.stop', route);
    let len = 0, pts = [];
    const build = () => {
      const rr = route.getBoundingClientRect();
      pts = items.map(el => { const d = $('.stop-dot', el).getBoundingClientRect(); return [d.left + d.width / 2 - rr.left, d.top + d.height / 2 - rr.top]; });
      if (!pts.length) return;
      const end = $('.route-end', route).getBoundingClientRect();
      const all = [[pts[0][0], 0], ...pts, [innerWidth < 820 ? pts[0][0] : rr.width / 2, end.top - rr.top - 30]];
      let d = `M${all[0][0]} ${all[0][1]}`;
      for (let i = 1; i < all.length; i++) { const [x0, y0] = all[i - 1], [x1, y1] = all[i], m = (y1 - y0) * .5; d += ` C${x0} ${y0 + m} ${x1} ${y1 - m} ${x1} ${y1}`; }
      bg.setAttribute('d', d); fg.setAttribute('d', d);
      len = fg.getTotalLength(); fg.style.strokeDasharray = len; draw();
    };
    const draw = () => {
      if (!len) return;
      const rr = route.getBoundingClientRect();
      const p = reduced ? 1 : clamp((innerHeight * .55 - rr.top) / rr.height);
      fg.style.strokeDashoffset = len * (1 - p);
      const pt = fg.getPointAtLength(len * p);
      trav.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      items.forEach((el, i) => el.classList.toggle('on', reduced || pt.y >= pts[i][1] - 40));
    };
    addEventListener('scroll', draw, { passive: true });
    addEventListener('resize', build);
    document.fonts?.ready.then(build); addEventListener('load', build); build();
  }
})();
