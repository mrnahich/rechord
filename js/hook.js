// ReChord website — the hook: a themed sketch map of the visitor's own city (found by IP),
// demo voices pinned on real nearby places, and one voice the visitor records themself.
// Nothing recorded here is uploaded: the visitor's voice lives in this browser's IndexedDB.
(() => {
  'use strict';
  const { $, $$, clamp, fakePeaks, waveHTML, fmtTime, rng, logoSVG, APP_STORE, reduced } = RC;
  const hero = $('#hero');
  if (!hero) return;

  $('.intro-logo').innerHTML = logoSVG();
  $$('[data-store]').forEach(a => a.href = APP_STORE);

  const MAX_REC = 15;            // seconds a visitor may record on the site (the app allows 60)
  const TILES = 'https://tiles.openfreemap.org/planet';
  const isSmall = () => innerWidth < 720;

  // ------------------------------------------------------------------ demo voices (mock data)
  // Audio is cut from AI-generated selfie videos (Google Flow); peaks are measured from that audio.
  // `want` lists OpenStreetMap POI classes this voice prefers to sit on; {p} is the real place name.
  const DEMO = [
    { id: 'maya',  name: 'Maya',  ago: '2 h ago',     likes: 48,  plays: 312,  dur: 11.4, title: 'Mornings at {p}',      plain: 'Same bench, every morning',  want: ['park', 'garden', 'cafe'], peaks: [0.39,0.78,1.0,0.61,0.56,0.76,0.67,0.54,0.45,0.49,0.49,0.42,0.48,0.44,0.44,0.73,0.79,0.72,0.67,0.63,0.79,0.65,0.65,0.56,0.46,0.45,0.44,0.46,0.46,0.44,0.41,0.43,0.74,0.94,0.62,0.41,0.41,0.41,0.43,0.82,0.7,0.61,0.57,0.27], cover: null },
    // no real recording yet: { id: 'leo',   name: 'Leo',   ago: 'Yesterday',   likes: 131, plays: 1204, dur: 4.5, title: 'Eat here: {p}',        plain: 'Get the spicy one',          want: ['restaurant', 'fast_food', 'cafe', 'bar', 'bakery'], cover: 'cover_market.jpg' },
    { id: 'noor',  name: 'Noor',  ago: '3 days ago',  likes: 276, plays: 2048, dur: 8.9, title: 'First date, {p}',      plain: 'Three years ago today',      want: ['cafe', 'restaurant', 'cinema', 'park'], peaks: [0.12,0.12,0.88,0.92,0.57,0.59,0.56,0.51,0.35,0.12,0.12,0.95,0.84,0.88,0.71,0.49,0.46,0.61,0.5,0.43,0.36,0.12,0.43,0.48,0.81,0.2,0.12,0.24,0.2,0.12,0.51,1.0,0.76,0.83,0.67,0.55,0.54,0.45,0.31,0.12,0.12,0.12,0.12,0.12], cover: null },
    // no real recording yet: { id: 'jonas', name: 'Jonas', ago: '5 h ago',     likes: 64,  plays: 540,  dur: 5.2, title: 'Look up at {p}',       plain: 'Best view in the city',      want: ['attraction', 'castle', 'monument', 'place_of_worship', 'museum', 'town_hall'], cover: 'cover_rooftop.jpg' },
    { id: 'theo',  name: 'Theo',  ago: 'Last week',   likes: 92,  plays: 733,  dur: 9.8, title: 'Sundays at {p}',       plain: 'Sundays with Grandpa',       want: ['park', 'playground', 'garden', 'stadium'], peaks: [0.13,0.16,0.78,0.73,0.79,0.51,0.54,0.55,0.6,0.49,0.17,0.15,0.13,0.15,0.14,0.38,1.0,0.61,0.79,0.45,0.62,0.21,0.53,0.63,0.67,0.18,0.18,0.2,0.17,0.13,0.27,0.33,0.46,0.26,0.42,0.5,0.9,0.72,0.76,0.57,0.55,0.36,0.19,0.12], cover: null },
    { id: 'aiko',  name: 'Aiko',  ago: 'Just now',    likes: 7,   plays: 23,   dur: 10.6, title: 'Day one, near {p}',    plain: 'Day one in a new city',      want: ['railway', 'bus', 'lodging', 'college', 'library'], peaks: [0.14,0.22,1.0,0.68,0.27,0.18,0.2,0.2,0.22,0.79,0.81,0.87,0.81,0.73,0.68,0.82,0.56,0.77,0.69,0.7,0.64,0.56,0.49,0.52,0.5,0.48,0.52,0.45,0.39,0.34,0.26,0.27,0.87,0.62,0.75,0.21,0.34,0.66,0.67,0.65,0.36,0.2,0.17,0.12], cover: null },
    { id: 'sam',   name: 'Sam',   ago: 'Last night',  likes: 158, plays: 987,  dur: 10.0, title: 'Rain outside {p}',     plain: 'Rain, and a piano upstairs', want: ['music', 'theatre', 'art_gallery', 'library', 'shop'], peaks: [0.26,0.35,0.45,0.36,0.32,0.28,0.43,0.9,0.81,0.3,0.44,0.82,0.83,1.0,0.67,0.56,0.67,0.65,0.59,0.67,0.59,0.6,0.39,0.19,0.2,0.72,0.69,0.65,0.59,0.38,0.22,0.19,0.2,0.9,0.76,0.88,0.52,0.65,0.46,0.36,0.34,0.74,0.42,0.16], cover: 'cover_concert.jpg' },
    { id: 'zara',  name: 'Zara',  ago: '2 weeks ago', likes: 203, plays: 1650, dur: 11.6, title: 'Note to self, {p}',    plain: 'Note to future me',          want: ['beach', 'park', 'attraction', 'garden'], peaks: [0.13,0.48,0.98,0.66,0.62,0.42,0.16,0.17,0.62,0.75,1.0,0.6,0.62,0.55,0.24,0.16,0.16,0.18,0.66,0.62,0.39,0.16,0.16,0.45,0.7,0.4,0.17,0.34,0.37,0.17,0.17,0.2,0.39,0.24,0.18,0.17,0.46,0.78,0.16,0.8,0.67,0.32,0.14,0.12], cover: 'cover_beach.jpg' }
  ].map((v, i) => ({ ...v, i, avatar: `assets/img/avatar_${v.id}.png`, audio: `assets/audio/${v.id}.m4a`, peaks: v.peaks || fakePeaks(i + 3, 44) }));

  // ------------------------------------------------------------------ where is the visitor?
  const TZ = { // last-resort guess from the browser's time zone when every IP lookup fails
    'Asia/Tehran': [35.7, 51.39, 'Tehran', 'Iran'], 'Europe/London': [51.507, -0.128, 'London', 'United Kingdom'], 'Europe/Istanbul': [41.01, 28.98, 'Istanbul', 'Türkiye'],
    'Europe/Berlin': [52.52, 13.405, 'Berlin', 'Germany'], 'Europe/Paris': [48.857, 2.352, 'Paris', 'France'], 'Europe/Amsterdam': [52.37, 4.9, 'Amsterdam', 'Netherlands'],
    'Europe/Helsinki': [60.17, 24.94, 'Helsinki', 'Finland'], 'Europe/Madrid': [40.417, -3.703, 'Madrid', 'Spain'], 'Europe/Rome': [41.9, 12.5, 'Rome', 'Italy'],
    'America/New_York': [40.73, -73.99, 'New York', 'United States'], 'America/Los_Angeles': [37.775, -122.42, 'San Francisco', 'United States'], 'America/Chicago': [41.88, -87.63, 'Chicago', 'United States'],
    'America/Toronto': [43.65, -79.38, 'Toronto', 'Canada'], 'Asia/Dubai': [25.2, 55.27, 'Dubai', 'UAE'], 'Asia/Tokyo': [35.68, 139.76, 'Tokyo', 'Japan'], 'Asia/Kolkata': [19.07, 72.88, 'Mumbai', 'India'],
    'Asia/Singapore': [1.29, 103.85, 'Singapore', 'Singapore'], 'Australia/Sydney': [-33.87, 151.21, 'Sydney', 'Australia']
  };
  async function getJSON(url, ms = 3500) {
    const ac = new AbortController(); const t = setTimeout(() => ac.abort(), ms);
    try { const r = await fetch(url, { signal: ac.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); } finally { clearTimeout(t); }
  }
  async function locate() {
    const tries = [
      async () => { const r = await getJSON('https://get.geojs.io/v1/ip/geo.json'); if (!r.latitude) throw 0; return { lat: +r.latitude, lng: +r.longitude, city: r.city, country: r.country, by: 'ip' }; },
      async () => { const r = await getJSON('https://ipwho.is/?fields=success,city,country,latitude,longitude'); if (!r.success) throw 0; return { lat: r.latitude, lng: r.longitude, city: r.city, country: r.country, by: 'ip' }; }
    ];
    for (const t of tries) { try { const p = await t(); if (isFinite(p.lat) && isFinite(p.lng) && p.city) return p; } catch { /* next */ } }
    const z = TZ[Intl.DateTimeFormat().resolvedOptions().timeZone];
    if (z) return { lat: z[0], lng: z[1], city: z[2], country: z[3], by: 'tz' };
    return { lat: 51.507, lng: -0.128, city: 'London', country: 'United Kingdom', by: 'default' };
  }

  // ------------------------------------------------------------------ map style (ReChord theme)
  const road = (id, classes, color, w14, w17, minzoom = 5) => ({
    id, type: 'line', source: 'ofm', 'source-layer': 'transportation', minzoom,
    filter: ['all', ['in', ['get', 'class'], ['literal', classes]], ['!=', ['get', 'brunnel'], 'tunnel']],
    layout: { 'line-cap': 'round', 'line-join': 'round' },
    paint: { 'line-color': color, 'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 6, w14 * .12, 10, w14 * .3, 14, w14, 17, w17] }
  });
  const STYLE = {
    version: 8, glyphs: 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf',
    sources: { ofm: { type: 'vector', url: TILES, attribution: '© <a href="https://openfreemap.org" target="_blank">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>' } },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': '#0a1526' } },
      { id: 'green', type: 'fill', source: 'ofm', 'source-layer': 'landcover', filter: ['in', ['get', 'class'], ['literal', ['grass', 'wood', 'farmland']]], paint: { 'fill-color': '#0d2a3a', 'fill-opacity': ['interpolate', ['linear'], ['zoom'], 5, .25, 12, .7] } },
      { id: 'park', type: 'fill', source: 'ofm', 'source-layer': 'park', paint: { 'fill-color': '#0f3340', 'fill-opacity': .75 } },
      { id: 'water', type: 'fill', source: 'ofm', 'source-layer': 'water', paint: { 'fill-color': '#040a16' } },
      { id: 'water-glow', type: 'line', source: 'ofm', 'source-layer': 'water', paint: { 'line-color': '#2f6fd0', 'line-opacity': .5, 'line-width': ['interpolate', ['linear'], ['zoom'], 2, .4, 14, 1.4] } },
      { id: 'waterway', type: 'line', source: 'ofm', 'source-layer': 'waterway', paint: { 'line-color': '#143a70', 'line-width': 1.2 } },
      { id: 'border', type: 'line', source: 'ofm', 'source-layer': 'boundary', maxzoom: 9, filter: ['all', ['==', ['get', 'admin_level'], 2], ['!=', ['get', 'maritime'], 1]], paint: { 'line-color': '#3f74c8', 'line-opacity': .55, 'line-width': .8, 'line-dasharray': [3, 2] } },
      road('path', ['path', 'track'], 'rgba(124,224,244,.18)', .8, 2.5, 13),
      road('minor', ['minor', 'service'], 'rgba(93,168,255,.22)', 1.4, 9, 11),
      road('mid', ['tertiary', 'secondary'], 'rgba(113,180,255,.42)', 2.6, 13, 8),
      road('major', ['primary', 'trunk', 'motorway'], 'rgba(150,204,255,.7)', 3.6, 18, 5),
      { id: 'rail', type: 'line', source: 'ofm', 'source-layer': 'transportation', minzoom: 10, filter: ['==', ['get', 'class'], 'rail'], paint: { 'line-color': 'rgba(255,84,73,.35)', 'line-width': 1.1, 'line-dasharray': [4, 3] } },
      { id: 'bld', type: 'fill-extrusion', source: 'ofm', 'source-layer': 'building', minzoom: 13.5,
        paint: { 'fill-extrusion-color': ['interpolate', ['linear'], ['coalesce', ['get', 'render_height'], 8], 0, '#12284c', 40, '#1c4486', 120, '#2f6fd0'],
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13.5, 0, 14.6, ['coalesce', ['get', 'render_height'], 8]],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0], 'fill-extrusion-opacity': .62 } },
      { id: 'poi-probe', type: 'circle', source: 'ofm', 'source-layer': 'poi', minzoom: 12, paint: { 'circle-radius': 1, 'circle-opacity': 0 } },
      { id: 'road-name', type: 'symbol', source: 'ofm', 'source-layer': 'transportation_name', minzoom: 14.5,
        layout: { 'symbol-placement': 'line', 'text-field': ['coalesce', ['get', 'name:latin'], ['get', 'name']], 'text-font': ['Noto Sans Regular'], 'text-size': 10.5, 'text-letter-spacing': .08 },
        paint: { 'text-color': 'rgba(184,208,240,.55)', 'text-halo-color': '#0a1526', 'text-halo-width': 1.2 } },
      { id: 'place', type: 'symbol', source: 'ofm', 'source-layer': 'place', filter: ['in', ['get', 'class'], ['literal', ['country', 'city', 'town', 'suburb', 'neighbourhood', 'quarter']]],
        layout: { 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name:latin'], ['get', 'name']], 'text-font': ['Noto Sans Bold'], 'text-transform': 'uppercase', 'text-letter-spacing': .18,
          'text-size': ['match', ['get', 'class'], 'country', 12, 'city', 13, 11], 'symbol-sort-key': ['coalesce', ['get', 'rank'], 20] },
        paint: { 'text-color': 'rgba(206,224,250,.6)', 'text-halo-color': '#06101f', 'text-halo-width': 1.4 } }
    ]
  };

  // ------------------------------------------------------------------ state
  let map = null, here = null, me = null, youMarker = null, youEl = null;
  let voices = [], current = null, flown = false;
  const audio = new Audio(); audio.preload = 'auto';
  const els = {
    sub: $('#hero-sub'), loc: $('#loc-text'), card: $('#vcard'), cover: $('#vc-cover'), avatar: $('#vc-avatar'), name: $('#vc-name'), ago: $('#vc-ago'), tag: $('#vc-tag'),
    title: $('#vc-title'), place: $('#vc-place'), wave: $('#vc-wave'), time: $('#vc-time'), like: $('#vc-like'), likes: $('#vc-likes'), plays: $('#vc-plays'),
    rec: $('#rec'), prog: $('#rec-prog'), dockTitle: $('#dock-title'), dockSub: $('#dock-sub'), cta: $('#hero-cta'), live: $('#live-wave')
  };
  const setSub = html => { els.sub.style.opacity = 0; setTimeout(() => { els.sub.innerHTML = html; els.sub.style.opacity = 1; }, 250); };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const padding = () => {
    if (isSmall()) return { top: 250, bottom: els.card.hidden ? 150 : 330, left: 20, right: 20 };
    const wide = innerWidth > 980;
    return { top: 90, bottom: 130, left: Math.min(innerWidth * (innerWidth < 1200 ? .3 : .36), 560), right: wide && !els.card.hidden ? 400 : 40 };
  };

  function haversine(a, b) { // metres
    const R = 6371000, r = Math.PI / 180, dLat = (b[1] - a[1]) * r, dLng = (b[0] - a[0]) * r;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * r) * Math.cos(b[1] * r) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  const fmtDist = m => m < 950 ? `${Math.max(10, Math.round(m / 10) * 10)} m away` : `${(m / 1000).toFixed(1)} km away`;

  // ------------------------------------------------------------------ IndexedDB (the visitor's one voice)
  const idb = {
    open: () => new Promise((res, rej) => { const r = indexedDB.open('rechord-site', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }),
    async get(k) { try { const db = await this.open(); return await new Promise(res => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => res(null); }); } catch { return null; } },
    async set(k, v) { try { const db = await this.open(); await new Promise(res => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').put(v, k); tx.oncomplete = res; tx.onerror = res; }); } catch { /* private mode: keep it in memory only */ } },
    async del(k) { try { const db = await this.open(); await new Promise(res => { const tx = db.transaction('kv', 'readwrite'); tx.objectStore('kv').delete(k); tx.oncomplete = res; tx.onerror = res; }); } catch { /* ignore */ } }
  };

  // ------------------------------------------------------------------ boot
  boot();
  async function boot() {
    const [pos, saved] = await Promise.all([locate(), idb.get('mine')]);
    here = pos; me = saved || null;
    els.loc.textContent = `${pos.city}${pos.country ? ', ' + pos.country : ''}${pos.by === 'ip' ? ' · by IP' : ''}`;
    if (!window.maplibregl) return fallback();
    try {
      map = new maplibregl.Map({
        container: 'map', style: STYLE, center: [pos.lng, pos.lat], zoom: 1.7, pitch: 0, bearing: 0,
        attributionControl: { compact: true }, scrollZoom: false, dragRotate: false, pitchWithRotate: false, touchPitch: false,
        dragPan: !matchMedia('(pointer: coarse)').matches, keyboard: false, doubleClickZoom: false, fadeDuration: 300, maxPitch: 60
      });
    } catch { return fallback(); }
    map.touchZoomRotate.disable();
    let started = false;
    const start = () => { if (started) return; started = true; hero.dataset.state = 'flying'; setTimeout(() => flyHome(false), 500); };
    map.once('load', start);
    setTimeout(start, 6000);            // never leave the visitor on the loader
    map.on('error', () => {});
  }

  function fallback() {
    $('#map').classList.add('fallback'); hero.dataset.state = 'ready';
    setSub(`ReChord pins voice notes to real places. The map couldn't load here, but you can still hold the red button and hear how it feels.`);
    wireRecorder();
  }

  function flyHome(changedCity) {
    const target = { center: [here.lng, here.lat], zoom: isSmall() ? 14.4 : 15, pitch: 52, bearing: -18, padding: padding() };
    const done = () => {
      if (flown && !changedCity) return; flown = true;
      hero.dataset.state = 'ready';
      const go = () => { seed(); wireRecorder(); };
      if (map.loaded() && map.areTilesLoaded()) go(); else { let ran = false; const once = () => { if (!ran) { ran = true; go(); } }; map.once('idle', once); setTimeout(once, 3500); }
    };
    if (reduced) { map.jumpTo(target); done(); }
    else { map.flyTo({ ...target, duration: changedCity ? 4200 : 5600, curve: 1.42, essential: true }); map.once('moveend', done); }
    setSub(`This is a sketch of <b>${esc(here.city)}</b>. A few demo voices already live here. Hold the red button and leave yours.`);
  }

  // ------------------------------------------------------------------ demo pins on real places
  const cleanName = p => { let n = p['name:en'] || p['name:latin'] || p.name || ''; n = n.split(/[;(/]/)[0].trim(); return n.length > 26 ? n.slice(0, 24).trim() + '…' : n; };
  function seed() {
    voices.forEach(v => v.marker?.remove()); voices = [];
    const W = map.getContainer().clientWidth, H = map.getContainer().clientHeight, pad = padding();
    const safe = { x0: pad.left * .55 + 30, x1: W - 70, y0: pad.top - 10, y1: H - pad.bottom - 20 };
    if (isSmall()) { safe.x0 = 40; safe.x1 = W - 40; }
    const centre = map.project([here.lng, here.lat]);
    const hb = hero.getBoundingClientRect(), cb = $('.hero-copy').getBoundingClientRect();
    const copy = { x0: cb.left - hb.left - 30, x1: cb.left - hb.left + Math.min(cb.width, isSmall() ? cb.width : 470) + 30, y0: cb.top - hb.top - 30, y1: cb.bottom - hb.top + 30 };
    const inSafe = pt => pt.x > safe.x0 && pt.x < safe.x1 && pt.y > safe.y0 && pt.y < safe.y1 && !(pt.x > copy.x0 && pt.x < copy.x1 && pt.y > copy.y0 && pt.y < copy.y1);

    let feats = [];
    try { feats = map.querySourceFeatures('ofm', { sourceLayer: 'poi' }); } catch { /* tiles not ready */ }
    const seen = new Set(), cands = [];
    for (const f of feats) {
      const name = cleanName(f.properties); if (!name || name.length < 3 || seen.has(name) || f.geometry.type !== 'Point') continue;
      const pt = map.project(f.geometry.coordinates); if (!inSafe(pt) || Math.hypot(pt.x - centre.x, pt.y - centre.y) < 80) continue;
      seen.add(name); cands.push({ name, cls: f.properties.class, sub: f.properties.subclass, rank: f.properties.rank || 99, ll: f.geometry.coordinates, pt });
    }
    cands.sort((a, b) => a.rank - b.rank);

    const minGap = isSmall() ? 74 : 104, taken = [];
    const free = pt => taken.every(t => Math.hypot(t.x - pt.x, t.y - pt.y) > minGap);
    const count = isSmall() ? 6 : DEMO.length;
    const r = rng(Math.round(here.lat * 1000) ^ Math.round(here.lng * 1000));
    DEMO.slice(0, count).forEach(v => {
      let c = cands.find(c => !c.used && free(c.pt) && (v.want.includes(c.cls) || v.want.includes(c.sub))) || cands.find(c => !c.used && free(c.pt));
      let ll, title, place;
      if (c) { c.used = true; taken.push(c.pt); ll = c.ll; title = v.title.replace('{p}', c.name); place = c.name; }
      else { // nothing named nearby: sit on the map anyway with a place-less title
        let pt, n = 0; do { pt = { x: safe.x0 + r() * (safe.x1 - safe.x0), y: safe.y0 + r() * (safe.y1 - safe.y0) }; } while ((!inSafe(pt) || !free(pt) || Math.hypot(pt.x - centre.x, pt.y - centre.y) < 80) && ++n < 60);
        taken.push(pt); const l = map.unproject([pt.x, pt.y]); ll = [l.lng, l.lat]; title = v.plain; place = here.city;
      }
      const dist = haversine([here.lng, here.lat], ll);
      const voice = { ...v, ll, title, place: `${place} · ${fmtDist(dist)}`, liked: false };
      const el = document.createElement('div'); el.className = 'pin'; el.style.setProperty('--rd', `${(v.i * .45) % 3}s`);
      el.innerHTML = `<div class="pin-in"><div class="rings"><i></i><i></i></div><img src="${v.avatar}" alt="${v.name}" draggable="false"><span class="pin-label">${esc(v.name)}</span></div>`;
      el.addEventListener('click', e => { e.stopPropagation(); select(voice, true); });
      voice.el = el; voice.marker = new maplibregl.Marker({ element: el, anchor: 'center' }).setLngLat(ll).addTo(map);
      voices.push(voice);
      setTimeout(() => el.classList.add('in'), 250 + voices.length * 170);
    });
    placeYou();
    nameNeighbourhood();
  }

  function nameNeighbourhood() {
    try {
      const c = [here.lng, here.lat]; let best = null, bd = 2500;
      for (const f of map.querySourceFeatures('ofm', { sourceLayer: 'place' })) {
        if (!['suburb', 'neighbourhood', 'quarter'].includes(f.properties.class) || f.geometry.type !== 'Point') continue;
        const d = haversine(c, f.geometry.coordinates); if (d < bd) { bd = d; best = f; }
      }
      if (best) { here.hood = cleanName(best.properties); if (here.hood && here.hood !== here.city) els.loc.textContent = `${here.hood}, ${here.city}${here.by === 'ip' ? ' · by IP' : ''}`; }
    } catch { /* optional nicety */ }
  }

  // ------------------------------------------------------------------ the visitor's own spot
  function placeYou() {
    youMarker?.remove();
    youEl = document.createElement('div'); youEl.className = 'pin you';
    youEl.innerHTML = `<div class="pin-in"><div class="rings"><i></i><i></i><i></i></div><div class="you-face"><span>You</span></div><span class="pin-label">Your spot</span></div>`;
    youEl.addEventListener('click', e => { e.stopPropagation(); if (me) select(mine(), true); });
    youMarker = new maplibregl.Marker({ element: youEl, anchor: 'center' }).setLngLat([here.lng, here.lat]).addTo(map);
    setTimeout(() => youEl.classList.add('in'), 120);
    if (me) showMine(false);
  }
  const mine = () => ({ id: 'me', me: true, name: 'You', ago: timeAgo(me.ts), title: 'Your voice', place: `${here.hood || here.city} · right here`, dur: me.dur, peaks: me.peaks, url: me.url || (me.url = URL.createObjectURL(me.blob)), el: youEl, ll: [here.lng, here.lat] });
  const timeAgo = ts => { const m = (Date.now() - ts) / 60000; return m < 2 ? 'Just now' : m < 60 ? `${Math.round(m)} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago`; };

  function showMine(fresh) {
    hero.dataset.rec = 'done';
    youEl?.classList.add('mine'); youEl?.classList.remove('live');
    const label = youEl && $('.pin-label', youEl); if (label) label.textContent = 'Your voice';
    els.dockTitle.textContent = 'Play your voice'; els.dockSub.textContent = 'On the map · stored only in this browser';
    els.cta.hidden = false;
    if (fresh) {
      if (youEl) { youEl.classList.add('landing'); const s = document.createElement('span'); s.className = 'shock'; youEl.append(s); setTimeout(() => { s.remove(); youEl.classList.remove('landing'); }, 1900); }
      setSub(`<b>It's on the map.</b> In ReChord it stays there for real, for everyone who walks by.`);
      setTimeout(() => select(mine(), false), 900);
    } else setSub(`Welcome back to <b>${esc(here.city)}</b>. Your voice is still here. In ReChord, everyone who walks by could hear it.`);
  }

  // ------------------------------------------------------------------ voice card + playback
  function select(v, autoplay) {
    current?.el?.classList.remove('active', 'playing');
    current = v; v.el?.classList.add('active');
    hero.classList.add('has-card');
    const c = els.card; c.hidden = false; c.classList.toggle('me', !!v.me); c.classList.remove('playing');
    c.style.animation = 'none'; void c.offsetWidth; c.style.animation = '';
    els.cover.hidden = !v.cover; if (v.cover) els.cover.style.backgroundImage = `url(assets/img/${v.cover})`;
    els.avatar.className = 'vc-avatar' + (v.me ? ' me' : ''); els.avatar.style.backgroundImage = v.me ? '' : `url(${v.avatar})`; els.avatar.textContent = v.me ? 'You' : '';
    els.name.textContent = v.name; els.ago.textContent = v.ago;
    els.tag.textContent = v.me ? 'Your voice' : 'Demo voice'; els.tag.className = 'vc-tag' + (v.me ? ' me' : '');
    els.title.textContent = v.title; els.place.textContent = v.place;
    els.wave.innerHTML = waveHTML(v.peaks); els.time.textContent = fmtTime(v.dur);
    if (!v.me) { els.likes.textContent = v.likes + (v.liked ? 1 : 0); els.like.setAttribute('aria-pressed', v.liked); els.plays.textContent = v.plays.toLocaleString('en'); }
    audio.pause(); audio.src = v.me ? v.url : v.audio; audio.currentTime = 0;
    if (map && v.ll) map.easeTo({ center: v.ll, duration: 1100, padding: padding(), essential: true });
    if (autoplay) play();
  }
  function play() { audio.play().then(() => { els.card.classList.add('playing'); current?.el?.classList.add('playing'); tick(); }).catch(() => {}); }
  function pause() { audio.pause(); els.card.classList.remove('playing'); current?.el?.classList.remove('playing'); }
  function tick() {
    if (audio.paused) return;
    const d = isFinite(audio.duration) && audio.duration > 0 ? audio.duration : (current?.dur || 1), p = clamp(audio.currentTime / d);
    const bars = els.wave.children, n = Math.round(p * bars.length);
    for (let i = 0; i < bars.length; i++) bars[i].classList.toggle('on', i < n);
    els.time.textContent = fmtTime(audio.currentTime);
    requestAnimationFrame(tick);
  }
  audio.addEventListener('ended', () => { pause(); [...els.wave.children].forEach(b => b.classList.remove('on')); if (current) els.time.textContent = fmtTime(current.dur); });
  $('#vc-play').addEventListener('click', () => audio.paused ? play() : pause());
  $('#vc-close').addEventListener('click', () => { pause(); els.card.hidden = true; hero.classList.remove('has-card'); current?.el?.classList.remove('active'); current = null; });
  $('#vc-like').addEventListener('click', () => { if (!current || current.me) return; current.liked = !current.liked; els.like.setAttribute('aria-pressed', current.liked); els.likes.textContent = current.likes + (current.liked ? 1 : 0); });
  const hop = d => { if (!voices.length) return; const i = current && !current.me ? voices.findIndex(v => v.id === current.id) : -1; select(voices[(i + d + voices.length) % voices.length], true); };
  $('#vc-prev').addEventListener('click', () => hop(-1)); $('#vc-next').addEventListener('click', () => hop(1));
  els.wave.addEventListener('click', e => { const r = els.wave.getBoundingClientRect(), d = isFinite(audio.duration) ? audio.duration : 0; if (d) { audio.currentTime = clamp((e.clientX - r.left) / r.width) * d; if (audio.paused) play(); } });

  // ------------------------------------------------------------------ recorder
  let wired = false;
  function wireRecorder() {
    if (wired) return; wired = true;
    if (me && !map) showMine(false);
    let stream, rec, chunks = [], ctx, analyser, buf, levels = [], t0 = 0, raf = 0, state = 'idle', holdPress = false, pressed = false;
    const lc = els.live.getContext('2d');

    const supported = !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
    els.rec.addEventListener('contextmenu', e => e.preventDefault());
    els.rec.addEventListener('pointerdown', e => {
      e.preventDefault(); pressed = true;
      if (hero.dataset.rec === 'done') { if (me) { const v = mine(); current?.me && !audio.paused ? pause() : select(v, true); } return; }
      if (state === 'recording') { stop(); return; }
      if (state === 'idle') { holdPress = true; begin(); }
    });
    const release = () => {
      if (!pressed) return; pressed = false;
      if (state === 'recording' && holdPress && performance.now() - t0 > 700) stop();   // a real hold: let go to finish
      holdPress = false;                                                                  // a tap: tap again to finish
    };
    addEventListener('pointerup', release); addEventListener('pointercancel', release);
    els.rec.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (state === 'recording') stop(); else if (state === 'idle' && hero.dataset.rec !== 'done') begin(); else if (me) select(mine(), true); } });

    async function begin() {
      if (!supported) { els.dockTitle.textContent = 'Recording not supported here'; els.dockSub.textContent = 'Try a recent Chrome, Safari or Firefox'; return; }
      state = 'asking'; pause();
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }); }
      catch { state = 'idle'; els.dockTitle.textContent = 'Microphone is blocked'; els.dockSub.textContent = 'Allow it in the address bar, then try again'; return; }
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); await ctx.resume();
      analyser = ctx.createAnalyser(); analyser.fftSize = 1024; buf = new Uint8Array(analyser.fftSize);
      ctx.createMediaStreamSource(stream).connect(analyser);
      chunks = []; levels = [];
      rec = new MediaRecorder(stream); rec.ondataavailable = e => e.data.size && chunks.push(e.data); rec.onstop = finish; rec.start();
      t0 = performance.now(); state = 'recording'; hero.dataset.rec = 'recording';
      if (!pressed) holdPress = false;      // the permission prompt ate the hold: fall back to tap-to-stop
      els.card.hidden = true; hero.classList.remove('has-card'); current?.el?.classList.remove('active'); current = null;
      youEl?.classList.add('live');
      els.dockTitle.textContent = holdPress ? 'Recording… let go to pin it' : 'Recording… tap to pin it';
      setSub('Listening. Say anything: a thought, a hello, a little “I was here.”');
      if (map) map.easeTo({ center: [here.lng, here.lat], zoom: map.getZoom() + .5, duration: 1400, padding: padding() });
      loop();
    }
    function loop() {
      if (state !== 'recording') return;
      const t = (performance.now() - t0) / 1000;
      analyser.getByteTimeDomainData(buf);
      let sum = 0; for (let i = 0; i < buf.length; i++) { const x = (buf[i] - 128) / 128; sum += x * x; }
      const amp = clamp(Math.sqrt(sum / buf.length) * 4.2); levels.push(amp);
      youEl?.style.setProperty('--amp', amp.toFixed(3));
      els.prog.style.strokeDashoffset = 100 - clamp(t / MAX_REC) * 100;
      els.dockSub.textContent = `${fmtTime(t)} / ${fmtTime(MAX_REC)}`;
      drawLive(amp);
      if (t >= MAX_REC) return stop();
      raf = requestAnimationFrame(loop);
    }
    function drawLive() {
      const w = els.live.width, h = els.live.height, n = 64, bw = w / n; lc.clearRect(0, 0, w, h);
      const tail = levels.slice(-n * 2);
      for (let i = 0; i < n; i++) {
        const v = tail[tail.length - 1 - (n - 1 - i) * 2] || 0, bh = Math.max(3, v * h * .95), edge = Math.sin(i / (n - 1) * Math.PI);
        lc.fillStyle = `rgba(255,${110 + v * 60 | 0},${100 + v * 40 | 0},${.25 + edge * .75})`;
        lc.beginPath(); lc.roundRect(i * bw + bw * .2, (h - bh) / 2, bw * .6, bh, 3); lc.fill();
      }
    }
    function stop() {
      if (state !== 'recording') return; state = 'saving'; cancelAnimationFrame(raf);
      try { rec.stop(); } catch { finish(); }
      stream?.getTracks().forEach(t => t.stop());
    }
    async function finish() {
      const dur = Math.min(MAX_REC, (performance.now() - t0) / 1000);
      els.prog.style.strokeDashoffset = 100; youEl?.style.setProperty('--amp', 0);
      if (dur < .8 || !chunks.length) { // too short to be a voice: reset quietly
        state = 'idle'; hero.dataset.rec = 'idle'; youEl?.classList.remove('live');
        els.dockTitle.textContent = 'Hold a little longer'; els.dockSub.textContent = `Up to ${MAX_REC} seconds · never leaves this device`; return;
      }
      const blob = new Blob(chunks, { type: rec.mimeType || chunks[0].type });
      const n = 44, peaks = []; const mx = Math.max(.08, ...levels);
      for (let i = 0; i < n; i++) { const a = Math.floor(i / n * levels.length), b = Math.max(a + 1, Math.floor((i + 1) / n * levels.length)); let m = 0; for (let j = a; j < b; j++) m = Math.max(m, levels[j] || 0); peaks.push(clamp(m / mx, .12, 1)); }
      me = { blob, dur, peaks, ts: Date.now(), lat: here?.lat, lng: here?.lng, city: here?.city };
      idb.set('mine', { ...me });
      state = 'idle';
      if (map) map.easeTo({ zoom: map.getZoom() - .5, duration: 1200, padding: padding() });
      showMine(true);
    }

    $('#remove-voice').addEventListener('click', async () => {
      pause(); await idb.del('mine'); if (me?.url) URL.revokeObjectURL(me.url); me = null;
      els.card.hidden = true; hero.classList.remove('has-card'); current = null; els.cta.hidden = true; hero.dataset.rec = 'idle';
      youEl?.classList.remove('mine', 'active', 'playing'); const label = youEl && $('.pin-label', youEl); if (label) label.textContent = 'Your spot';
      els.dockTitle.textContent = 'Hold to record'; els.dockSub.textContent = `Up to ${MAX_REC} seconds · never leaves this device`;
      setSub(`Removed. This is still a sketch of <b>${esc(here.city)}</b>, and the red button is still yours.`);
    });
  }

  // ------------------------------------------------------------------ "wrong city?"
  const cityBtn = $('#city-btn'), cityForm = $('#city-form'), cityInput = $('#city-input');
  cityBtn.addEventListener('click', () => { cityBtn.hidden = true; cityForm.hidden = false; cityInput.focus(); });
  cityInput.addEventListener('keydown', e => { if (e.key === 'Escape') { cityForm.hidden = true; cityBtn.hidden = false; } });
  cityForm.addEventListener('submit', async e => {
    e.preventDefault(); const q = cityInput.value.trim(); if (!q || !map) return;
    cityInput.disabled = true;
    try {
      const r = await getJSON(`https://photon.komoot.io/api/?limit=1&lang=en&q=${encodeURIComponent(q)}`, 6000);
      const f = r.features?.[0]; if (!f) throw 0;
      const [lng, lat] = f.geometry.coordinates, p = f.properties;
      here = { lat, lng, city: p.name || q, country: p.country || '', by: 'search' };
      els.loc.textContent = `${here.city}${here.country ? ', ' + here.country : ''}`;
      pause(); els.card.hidden = true; hero.classList.remove('has-card'); current = null;
      voices.forEach(v => v.el.classList.remove('in')); youEl?.classList.remove('in');
      flyHome(true);
      cityForm.hidden = true; cityBtn.hidden = false; cityInput.value = '';
    } catch { cityInput.value = ''; cityInput.placeholder = 'Not found, try again'; }
    cityInput.disabled = false;
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
})();
