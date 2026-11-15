// ReChord website — the iPhone app's real screens, rebuilt in HTML from the iOS code
// (same layouts, colours and icons as motion/app-intro.html), filled with fictional people and places.
// Three screens for the "how it works" steps: Record, Map, Home feed.
(() => {
  'use strict';
  const IMG = 'assets/img/', TAB = 'assets/ui/';
  const SW = 393, SH = 852;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const prog = (t, a, b) => clamp((t - a) / (b - a));
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  const U = { maya: ['Maya', '#5DA8FF'], leo: ['Leo', '#F28B54'], aiko: ['Aiko', '#C06BF0'], sam: ['Sam', '#43A047'], noor: ['Noor', '#E5739B'], jonas: ['Jonas', '#3FB7C9'], zara: ['Zara', '#FBC02D'], theo: ['Theo', '#8C9EFF'] };
  const avatar = (k, size, extra = '') => `<div class="av" style="width:${size}px;height:${size}px;background-color:${U[k][1]};background-image:url(${IMG}avatar_${k}.png);${extra}"></div>`;
  const WAVE = (() => { const r = rng(9); return Array.from({ length: 46 }, (_, i) => 0.18 + 0.82 * Math.abs(Math.sin(i * 0.47) * 0.55 + (r() - .5) * 0.9)); })();
  const waveBars = (color, n = 46, key = '') => `<div class="row" ${key ? `data-k="${key}"` : ''} style="flex:1;height:30px;gap:2px;align-items:center">${WAVE.slice(0, n).map(v => `<i style="flex:1;height:${Math.max(8, v * 100).toFixed(0)}%;border-radius:2px;background:${color}"></i>`).join('')}</div>`;

  const I = {
    heart: (fill, c) => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M12 20.5s-7.6-4.7-9.3-9.4C1.4 7.6 3.6 4.5 7 4.5c2.1 0 3.6 1.2 5 3 1.4-1.8 2.9-3 5-3 3.4 0 5.6 3.1 4.3 6.6-1.7 4.7-9.3 9.4-9.3 9.4z" fill="${fill ? c : 'none'}" stroke="${c}" stroke-width="2" stroke-linejoin="round"/></svg>`,
    play: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M7 4.5v15l12.5-7.5z" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/></svg>`,
    share: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M8 10H5v11h14V10h-3"/></svg>`,
    pinEll: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="1.8"><path d="M12 2.5a5.5 5.5 0 0 0-5.5 5.5c0 4.2 5.5 9.5 5.5 9.5s5.5-5.3 5.5-9.5A5.5 5.5 0 0 0 12 2.5z"/><circle cx="12" cy="8" r="1.8" fill="${c}"/><ellipse cx="12" cy="20" rx="7" ry="2.2"/></svg>`,
    octagon: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M8 2h8l6 6v8l-6 6H8l-6-6V8z" fill="${c}"/><path d="M12 7v6.5M12 16.5v.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    circleFill: (glyph, c) => `<svg viewBox="0 0 32 32" width="100%" height="100%"><circle cx="16" cy="16" r="15" fill="${c}"/>${glyph}</svg>`,
    camera: c => `<svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M3 8.5A2 2 0 0 1 5 6.5h2.2l1.5-2h6.6l1.5 2H19a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="${c}"/><circle cx="12" cy="13" r="3.6" fill="none" stroke="#0A417B" stroke-width="1.8"/></svg>`,
    scope: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="${c}" stroke-width="1.8"><circle cx="12" cy="12" r="7"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/></svg>`,
    person2: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="${c}"><circle cx="9" cy="8" r="3.4"/><path d="M2.5 19c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6z"/><circle cx="16.5" cy="9" r="2.6" opacity=".6"/><path d="M16 13.3c3 .2 5.5 2.3 5.5 5.7h-4.4" opacity=".6"/></svg>`,
    personOne: c => `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="${c}"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c0-4 3.3-6.6 7.5-6.6s7.5 2.6 7.5 6.6z"/></svg>`
  };
  const statusIcons = c => `<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="${c}"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="${c}"/><rect x="10" y="3" width="3" height="9" rx="1" fill="${c}"/><rect x="15" y="0" width="3" height="12" rx="1" fill="${c}"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5 5.6 9a3.4 3.4 0 0 1 4.8 0zM3.6 7a6.2 6.2 0 0 1 8.8 0l-1.4 1.4a4.2 4.2 0 0 0-6 0zM1.2 4.6a9.6 9.6 0 0 1 13.6 0L13.4 6a7.6 7.6 0 0 0-10.8 0z" fill="${c}"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.8" fill="none" stroke="${c}" opacity=".4"/><rect x="2" y="2" width="18" height="9" rx="2.4" fill="${c}"/><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="${c}" opacity=".45"/></svg>`;

  // procedural city in the iOS dark map palette
  function mapSvg() {
    const pal = { land: '#202226', road: '#34373C', major: '#4A4E55', water: '#1A2635', park: '#1F2B25' };
    const r = rng(11); let minor = '', major = '';
    const ang = -0.3, ca = Math.cos(ang), sa = Math.sin(ang);
    const P = (u, v) => { const wu = u + Math.sin(v * 0.006 + 1.3) * 16, wv = v + Math.sin(u * 0.005) * 14; return [(wu * ca - wv * sa + 600).toFixed(1), (wu * sa + wv * ca + 800).toFixed(1)]; };
    const E = 1100;
    for (let pass = 0; pass < 2; pass++) { let k = 0; for (let f = -E; f <= E; f += 26 + Math.floor(r() * 22)) {
      const isMajor = (k++ % 5 === 2); let d = '', pen = false;
      for (let s = -E; s <= E; s += 22) { if (!isMajor && r() < 0.04) { pen = false; continue; } const [x, y] = pass ? P(s, f) : P(f, s); d += (pen ? 'L' : 'M') + x + ' ' + y; pen = true; }
      if (isMajor) major += d; else minor += d;
    } }
    const parks = Array.from({ length: 7 }, () => `<rect x="${(r() * 1100).toFixed(0)}" y="${(r() * 1500).toFixed(0)}" width="${(60 + r() * 120).toFixed(0)}" height="${(50 + r() * 100).toFixed(0)}" rx="14" transform="rotate(-17)" fill="${pal.park}"/>`).join('');
    return `<svg viewBox="0 0 1200 1600" width="1200" height="1600" style="position:absolute;left:0;top:0"><rect width="1200" height="1600" fill="${pal.land}"/>${parks}
      <path d="M-50 1060 C 250 980, 380 1180, 620 1120 S 980 1010, 1250 1080" stroke="${pal.water}" stroke-width="90" fill="none"/>
      <path d="${minor}" stroke="${pal.road}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="${major}" stroke="${pal.major}" stroke-width="7" fill="none" stroke-linecap="round"/></svg>`;
  }
  const MAP = mapSvg();
  const header = `<div class="abs" style="left:0;right:0;top:58px;text-align:center;font:600 24px var(--ios);color:#EDEDF4;text-shadow:0 0 4px #212121;z-index:20">ReChord</div>`;
  const field = (inner, extra = '') => `<div class="row" style="height:52px;border-radius:20px;background:#fff;color:#212121;padding:0 16px;gap:8px;font:17px var(--ios);${extra}">${inner}</div>`;
  const toggle = k => `<div data-k="${k}" class="tg-ios"><b></b></div>`;

  function viewRecord() {
    return `<div class="ph-view" data-view="0">
      <div class="abs" style="left:${(SW - 1200) / 2}px;top:${(SH - 1600) / 2 - 120}px">${MAP}
        <div class="abs you-rings" style="left:${600 - 95}px;top:${800 - 95}px;width:190px;height:190px;border-radius:50%;box-shadow:0 0 0 8px rgba(30,136,229,.8),0 0 0 16px rgba(30,136,229,.5),0 0 0 24px rgba(30,136,229,.2)"></div></div>
      ${header}
      <div class="abs" style="left:16px;right:16px;bottom:104px;border-radius:32px;padding:16px;display:flex;flex-direction:column;gap:8px;background:rgba(33,33,33,.3);backdrop-filter:blur(20px) saturate(1.3);-webkit-backdrop-filter:blur(20px) saturate(1.3);box-shadow:inset 0 0 0 1px rgba(255,255,255,.22)">
        ${field(`<span data-k="title" style="color:#9E9E9E">About this record</span><span data-k="caret" style="width:2px;height:22px;background:#1E88E5"></span>`)}
        <div class="row" style="gap:8px">
          <div class="row" style="flex:1;height:52px;border-radius:20px;background:#0A417B;color:#fff;justify-content:center;gap:8px;font:17px var(--ios);overflow:hidden;position:relative">
            <div data-k="coverimg" class="cover" style="background-image:url(${IMG}02_bench.jpg);opacity:0;transition:opacity .4s"></div>
            <div data-k="covertxt" class="row" style="gap:8px;position:relative;transition:opacity .3s"><div style="width:20px;height:20px">${I.camera('#fff')}</div>Add a cover</div></div>
          <div style="flex:1">${field(`<span style="flex:1">Private</span>${toggle('tgPrivate')}`)}</div></div>
        ${field(`<div style="width:20px;height:20px;flex:none">${I.pinEll('#212121')}</div><span data-k="place" style="flex:1;color:#9E9E9E;white-space:nowrap;overflow:hidden">Name this place</span><span style="font-size:15px">Precise</span>${toggle('tgPrecise')}`)}
        ${field(`<div style="width:32px;height:32px;flex:none">${I.circleFill('<circle cx="16" cy="16" r="7.5" fill="#fff"/>', '#E53935')}</div><div class="row" style="flex:1;height:30px;position:relative"><div data-k="capsule" class="abs" style="inset:0;border-radius:15px;background:#EDEDF4;overflow:hidden;transition:opacity .3s"><div data-k="capfill" style="height:100%;width:0;background:#43A047"></div></div><div data-k="recwave" class="row" style="flex:1;height:30px;opacity:0;transition:opacity .3s">${waveBars('#0A417B', 40)}</div><div data-k="count" class="abs" style="inset:0;display:grid;place-items:center;font:600 22px var(--ios);color:#212121;transition:opacity .3s">60</div></div>`, 'padding:0 12px')}
        <div data-k="send" style="height:52px;border-radius:12px;background:#8E8E93;color:#fff;display:grid;place-items:center;font:600 17px var(--ios);margin-top:4px;transition:background .4s">Send</div>
      </div></div>`;
  }

  const PINS = [[500, 610, 'leo', 1.15], [690, 590, 'aiko', 1], [540, 870, 'zara', 1.25], [735, 815, 'sam', 1], [455, 760, 'noor', 1], [690, 925, 'jonas', 1.1], [470, 925, 'theo', 1]];
  function viewMap() {
    const pins = PINS.map(([x, y, k, sc], i) => `<div class="abs mpin" style="left:${x}px;top:${y}px;--i:${i}">${avatar(k, Math.round(52 * sc), 'border:1px solid #EDEDF4;box-shadow:0 1px 3px rgba(0,0,0,.5)')}</div>`).join('');
    const cluster = `<div class="abs mpin" style="left:745px;top:700px;--i:7"><div style="width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.12);backdrop-filter:blur(8px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3);position:relative">
      <div class="abs" style="left:12px;top:12px">${avatar('zara', 36, 'border:1.5px solid #fff')}</div><div class="abs" style="left:32px;top:32px">${avatar('leo', 36, 'border:1.5px solid #fff')}</div>
      <div class="abs" style="left:46px;top:4px;width:28px;height:28px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;font:700 12px var(--ios);display:grid;place-items:center">+3</div></div></div>`;
    const me = `<div class="abs me" style="left:600px;top:735px"><span class="me-ring"></span><span class="me-ring r2"></span>${avatar('maya', 60, 'border:2px solid #5DA8FF;box-shadow:0 0 0 6px rgba(93,168,255,.3),0 0 0 12px rgba(93,168,255,.15);position:relative')}</div>`;
    const glassTop = `<div class="abs row" style="left:50%;top:104px;transform:translateX(-50%);width:140px;height:44px;border-radius:22px;background:rgba(40,42,50,.5);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);padding:3px;z-index:20"><div style="flex:1;height:100%;border-radius:19px;background:rgba(255,255,255,.18);display:grid;place-items:center"><div style="width:22px;height:22px">${I.person2('#EDEDF4')}</div></div><div style="flex:1;display:grid;place-items:center"><div style="width:20px;height:20px;opacity:.7">${I.personOne('#EDEDF4')}</div></div></div>
      <div class="abs" style="right:16px;top:104px;width:44px;height:44px;border-radius:50%;background:rgba(40,42,50,.5);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);display:grid;place-items:center;z-index:20"><div style="width:24px;height:24px">${I.scope('#EDEDF4')}</div></div>`;
    const ucard = `<div class="abs ucard" style="left:16px;right:16px;bottom:104px;border-radius:20px;padding:14px;background:rgba(33,33,33,.35);backdrop-filter:blur(20px) saturate(1.4);-webkit-backdrop-filter:blur(20px) saturate(1.4);box-shadow:inset 0 0 0 1px #EDEDF4;color:#EDEDF4;font-family:var(--ios)">
      <div class="row" style="gap:10px">${avatar('maya', 50, 'border:1px solid #EDEDF4')}<div style="flex:1"><div style="font-weight:700;font-size:17px">Maya <span style="font-weight:400"> - Morning on the bridge</span></div><div class="row" style="gap:6px;font-size:14px;opacity:.85;margin-top:2px"><div style="width:15px;height:15px">${I.pinEll('#EDEDF4')}</div>Right where you stood</div></div><div style="width:24px;height:24px">${I.heart(false, '#EDEDF4')}</div></div>
      <div class="row" style="margin-top:12px;height:52px;background:#fff;border-radius:20px;padding:10px 12px;gap:10px"><div style="width:32px;height:32px">${I.circleFill('<path d="M13 10v12l9.5-6z" fill="#fff"/>', '#0A417B')}</div>${waveBars('rgba(10,65,123,.2)')}</div></div>`;
    return `<div class="ph-view" data-view="1">
      <div class="abs mapwrap" data-k="mapwrap" style="left:${(SW - 1200) / 2}px;top:${(SH - 1600) / 2}px;width:1200px;height:1600px;transform-origin:600px 735px">${MAP}${pins}${cluster}${me}</div>
      ${header}${glassTop}${ucard}</div>`;
  }

  function viewHome() {
    const cw = SW - 64, ch = SH - 120 - 150;
    return `<div class="ph-view" data-view="2">
      <div class="cover" style="background-image:url(${IMG}03_cafe.jpg);filter:blur(6px);transform:scale(1.1)"></div><div class="abs" style="inset:0;background:rgba(0,0,0,.25)"></div>
      ${header}
      <div class="abs fcard-ios" style="left:32px;top:104px;width:${cw}px;height:${ch}px;border-radius:36px;overflow:hidden;border:1px solid #EDEDF4;box-shadow:0 8px 24px rgba(0,0,0,.15);color:#EDEDF4;font-family:var(--ios)">
        <div class="cover" style="background-image:url(${IMG}03_cafe.jpg);background-color:rgba(255,255,255,.5)"></div>
        <div class="abs" style="right:22px;top:22px;width:22px;height:22px;opacity:.6">${I.octagon('#E53935')}</div>
        <div class="abs row" style="left:16px;top:16px;gap:10px;text-shadow:0 0 4px #212121">${avatar('aiko', 50, 'border:1px solid #EDEDF4')}<div><div style="font-weight:700;font-size:17px">Aiko</div><div style="font-size:13px">Rain on the café window</div></div></div>
        <div class="abs row" style="left:32px;right:30px;bottom:96px;align-items:flex-end;filter:drop-shadow(0 0 3px rgba(33,33,33,.9))">
          <div class="row" style="flex:1;gap:8px;font-size:20px"><div style="width:21px;height:21px">${I.pinEll('#EDEDF4')}</div>Le Marais, Paris</div>
          <div style="display:flex;flex-direction:column;align-items:center;gap:10px;font-size:13px">
            <div style="text-align:center"><div data-k="heart" style="width:26px;height:26px;margin:0 auto;transition:transform .5s cubic-bezier(.3,2,.4,1)">${I.heart(false, '#EDEDF4')}</div><div data-k="likes">12K</div></div>
            <div style="text-align:center"><div style="width:21px;height:21px;margin:0 auto">${I.play('#EDEDF4')}</div>86K</div>
            <div style="width:21px;height:21px;margin-top:2px">${I.share('#EDEDF4')}</div></div></div>
        <div class="abs row" style="left:16px;right:16px;bottom:16px;height:58px;background:#fff;border-radius:20px;padding:12px;gap:10px">
          <div data-k="pbtn" style="width:32px;height:32px">${I.circleFill('<rect x="11" y="10" width="3.6" height="12" rx="1" fill="#fff"/><rect x="17.400" y="10" width="3.600" height="12" rx="1" fill="#fff"/>', '#0A417B')}</div>${waveBars('rgba(10,65,123,.2)', 46, 'feedwave')}</div></div>
      <div class="abs row" style="left:0;right:0;top:${104 + ch + 16}px;justify-content:center;gap:6px"><i class="dot on"></i><i class="dot"></i><i class="dot"></i></div>
    </div>`;
  }

  const tabs = ['rechord', 'map', 'mic', 'email', 'profile'];
  const tabBar = `<div class="abs" style="left:20px;right:20px;bottom:22px;height:64px;border-radius:32px;background:rgba(40,42,50,.55);backdrop-filter:blur(18px) saturate(1.4);-webkit-backdrop-filter:blur(18px) saturate(1.4);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18),0 10px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:space-around;padding:0 8px;z-index:30">
    <div class="abs" data-k="tabsel" style="top:6px;height:52px;width:64px;border-radius:26px;background:rgba(255,255,255,.14);transition:left .6s cubic-bezier(.16,1,.3,1)"></div>
    ${tabs.map((n, i) => `<div style="position:relative;width:60px;height:52px;display:grid;place-items:center"><img data-tab="${i}" data-n="${n}" src="${TAB}${n}.png" alt="" style="width:29px;height:29px;transition:opacity .3s"></div>`).join('')}</div>`;

  const TITLE = 'Morning on the bridge', PLACE = 'Old Bridge';
  const TAB_FOR_STEP = [2, 1, 0];

  function mount(phone) {
    phone.innerHTML = `<div class="ph" style="width:${SW}px;height:${SH}px">
      ${viewRecord()}${viewMap()}${viewHome()}${tabBar}
      <div class="ph-status"><span>9:41</span><span class="ico">${statusIcons('#fff')}</span></div>
      <div class="ph-island"></div><div class="ph-home"></div></div>`;
    const K = {}; phone.querySelectorAll('[data-k]').forEach(n => K[n.dataset.k] = n);
    const tabImgs = [...phone.querySelectorAll('[data-tab]')], feedBars = [...K.feedwave.children];
    const fit = () => phone.style.setProperty('--k', (phone.clientWidth / SW).toFixed(4));
    new ResizeObserver(fit).observe(phone); fit();
    let lastStep = -1, liked = false;

    return function update(step, local) {
      if (step !== lastStep) {
        lastStep = step; phone.dataset.step = step;
        const sel = TAB_FOR_STEP[step], slot = (SW - 40 - 16) / 5;
        K.tabsel.style.left = `${8 + slot * sel + (slot - 64) / 2}px`;
        tabImgs.forEach((img, i) => { const want = `${TAB}${img.dataset.n}${i === sel ? '_fill' : ''}.png`; if (!img.src.endsWith(want)) img.src = want; img.style.opacity = i === sel ? 1 : .55; });
      }
      if (step === 0) { // recording: 60-second bar fills, then title, cover, place, Send lights up
        const rec = prog(local, 0, .55), secs = Math.round(rec * 42);
        const done = local > .58;
        K.capsule.style.opacity = done ? 0 : 1; K.count.style.opacity = done ? 0 : 1; K.recwave.style.opacity = done ? 1 : 0;
        K.capfill.style.width = `${(secs / 60 * 100).toFixed(1)}%`; K.count.textContent = String(60 - secs);
        const typed = TITLE.slice(0, Math.round(prog(local, .1, .5) * TITLE.length));
        K.title.textContent = typed || 'About this record'; K.title.style.color = typed ? '#212121' : '#9E9E9E';
        K.caret.style.opacity = typed && typed.length < TITLE.length ? 1 : 0;
        const cover = local > .62; K.coverimg.style.opacity = cover ? 1 : 0; K.covertxt.style.opacity = cover ? 0 : 1;
        const named = local > .7; K.place.textContent = named ? PLACE : 'Name this place'; K.place.style.color = named ? '#212121' : '#9E9E9E';
        K.tgPrecise.classList.toggle('on', local > .3);
        K.send.style.background = local > .78 ? '#0A417B' : '#8E8E93';
      } else if (step === 1) { // the map eases out from your pin
        K.mapwrap.style.transform = `scale(${(1.5 - .5 * prog(local, 0, .7)).toFixed(3)})`;
        phone.classList.toggle('show-ucard', local > .5);
      } else { // feed: the voice plays, someone likes it
        const n = Math.round(prog(local, .05, .95) * feedBars.length);
        feedBars.forEach((b, i) => b.style.background = i < n ? '#0A417B' : 'rgba(10,65,123,.2)');
        const want = local > .5;
        if (want !== liked) { liked = want; K.heart.innerHTML = I.heart(want, want ? '#E53935' : '#EDEDF4'); K.heart.style.transform = want ? 'scale(1.25)' : ''; K.likes.textContent = want ? '12.1K' : '12K'; }
      }
    };
  }
  window.RCApp = { mount };
})();
