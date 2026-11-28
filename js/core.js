// ReChord website — shared chrome (nav, footer), reveal-on-scroll, cursor, small helpers.
(() => {
  'use strict';
  const APP_STORE = 'https://apps.apple.com/app/id6758585486';
  // Privacy and Terms pages exist (privacy.html, terms.html) but stay out of the footer until the company details are filled in.
  const LEGAL_READY = false;
  const LOGO_PATHS = [
    'M3.841,1.0556C2.6347,1.7483 1.6819,2.7101 1.0188,3.8507C0.3558,5 0,6.309 0,7.7014L0,21.0104C0,22.3941 0.3558,23.7014 1.0188,24.8507C1.6819,25.9913 2.6347,26.9548 3.841,27.6545L10.8392,31.7013C11.8859,32.3089 13.2119,31.9548 13.8193,30.908C14.4269,29.861 14.0711,28.5329 13.0244,27.9253L6.0262,23.8785L6.0176,23.8785C5.4847,23.5711 5.0647,23.1597 4.7939,22.6823C4.5232,22.2065 4.3721,21.6354 4.3721,21.0104L4.3721,7.7014C4.3721,7.0746 4.5232,6.5052 4.7939,6.0382L4.7939,6.0278C5.0647,5.5521 5.4847,5.1406 6.0262,4.8316C6.5591,4.5243 7.1197,4.3733 7.6803,4.3733C8.241,4.3733 8.812,4.5243 9.3344,4.8316L22.1454,12.2343L22.1541,12.2343L34.9737,19.6267C35.5066,19.9357 35.918,20.3472 36.1974,20.8315C36.4682,21.309 36.6174,21.8698 36.6174,22.5052C36.6174,23.0937 36.4872,23.6354 36.253,24.085C36.2356,24.1128 36.2165,24.1406 36.2061,24.1683C35.9266,24.6544 35.5066,25.0764 34.9824,25.375C33.9358,25.9722 33.5817,27.309 34.1788,28.3472C34.7776,29.3941 36.114,29.7482 37.1502,29.151C38.3652,28.4496 39.3267,27.4861 39.9812,26.3559C40.0089,26.309 40.0384,26.2621 40.0558,26.2065C40.6737,25.0937 41,23.8332 41,22.4965C41,21.1128 40.6458,19.8038 39.9812,18.6545L39.9812,18.6458C39.3267,17.5139 38.3652,16.552 37.1502,15.8507L24.3497,8.4583L11.5214,1.0556C10.3064,0.3559 8.9977,0 7.6803,0C6.3734,0 5.0647,0.3559 3.841,1.0556Z',
    'M0,34.0574L0,37.3004C0,38.6841 0.3558,39.9914 1.0188,41.1407C1.6819,42.2917 2.6347,43.2535 3.841,43.9445C3.8879,43.974 3.933,44.0017 3.9799,44.0209C5.1584,44.6736 6.4185,45.0018 7.6803,45.0018C8.989,45.0018 10.2977,44.6459 11.5109,43.9445L25.8823,35.6545C27.0973,34.9548 28.0589,33.9913 28.7132,32.8612L28.7132,32.8507C29.3762,31.7014 29.732,30.3941 29.732,29.0104C29.732,27.6267 29.3762,26.3178 28.7132,25.1685C28.0502,24.0296 27.0973,23.066 25.8823,22.3647L13.2206,15.0573C12.8752,14.8612 12.5107,14.7674 12.1375,14.7674C11.3808,14.7674 10.6518,15.1598 10.2509,15.8611C9.6521,16.9063 10.0079,18.2344 11.0544,18.8317L23.7144,26.1407C24.2473,26.4497 24.6674,26.8611 24.9381,27.3369C25.2089,27.8143 25.3581,28.3837 25.3581,29.0104C25.3581,29.6372 25.2089,30.2066 24.9381,30.6737C24.6587,31.1598 24.2369,31.5798 23.7144,31.8802L9.3431,40.1701C8.812,40.4775 8.2514,40.6267 7.6803,40.6267C7.1475,40.6267 6.6146,40.4965 6.1113,40.2257C6.0835,40.2067 6.054,40.1875 6.0262,40.1701C5.4847,39.8524 5.0647,39.441 4.7939,38.974C4.5232,38.4965 4.3721,37.9271 4.3721,37.3004L4.3721,34.0574C4.3721,32.8507 3.3915,31.8698 2.1869,31.8698C0.9807,31.8698 0,32.842 0,34.0574Z'
  ];
  const logoSVG = (cls = '') => `<svg class="${cls}" viewBox="0 0 41 45" aria-hidden="true">${LOGO_PATHS.map(d => `<path d="${d}"/>`).join('')}</svg>`;
  const ARROW = '<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12 12 4M5.5 4H12v6.5"/></svg>';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** Deterministic pseudo-random generator, so demo waveforms look the same on every visit. */
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = Math.imul(s ^ (s >>> 15), 2246822507) ^ Math.imul(s ^ (s >>> 13), 3266489909), (s ^= s >>> 16) >>> 0) / 4294967296); }
  /** Speech-like bar heights (0.12–1) for a fake waveform. */
  function fakePeaks(seed, n = 48) {
    const r = rng(seed * 7919 + 13); const out = []; let env = .5;
    for (let i = 0; i < n; i++) { if (r() < .16) env = .15 + r() * .25; else env = clamp(env + (r() - .42) * .5, .2, 1); out.push(clamp(env * (.55 + r() * .45), .12, 1)); }
    return out;
  }
  function waveHTML(peaks) { return peaks.map(h => `<i style="--h:${h.toFixed(2)}"></i>`).join(''); }
  const fmtTime = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  // ---------- chrome ----------
  const page = document.body.dataset.page || 'home';
  const links = [['index.html', 'Product', 'home'], ['about.html', 'Team', 'about'], ['updates.html', 'Updates', 'updates'], ['blog.html', 'Blog', 'blog'], ['investors.html', 'Investors', 'investors']];
  const nav = document.createElement('header');
  nav.className = 'nav';
  nav.innerHTML = `
    <a class="brand" href="index.html" aria-label="ReChord home">${logoSVG()}<span>ReChord</span></a>
    <nav class="nav-links" aria-label="Main">
      ${links.map(([href, label, id]) => `<a href="${href}"${id === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
      <a class="btn" href="${APP_STORE}" target="_blank" rel="noopener" data-magnetic>Get the app ${ARROW}</a>
    </nav>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>`;
  document.body.prepend(nav);
  const menuBtn = $('.menu-btn', nav);
  menuBtn.addEventListener('click', () => { const open = document.documentElement.classList.toggle('menu-open'); menuBtn.setAttribute('aria-expanded', open); });
  $$('.nav-links a', nav).forEach(a => a.addEventListener('click', () => document.documentElement.classList.remove('menu-open')));

  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 24);
    nav.classList.toggle('hide', y > lastY && y > 400);
    lastY = y;
  }, { passive: true });

  const foot = $('#footer');
  if (foot) foot.innerHTML = `
    <div class="wrap">
      <div class="footer-top">
        <div><a class="brand" href="index.html">${logoSVG()}<span>ReChord</span></a><p class="tag">Say it. Pin it. <span class="serif" style="color:var(--blue-2)">It stays.</span></p></div>
        <div><h4>Explore</h4><ul>${links.map(([h, l]) => `<li><a href="${h}">${l}</a></li>`).join('')}</ul></div>
        <div><h4>Get ReChord</h4><ul><li><a href="${APP_STORE}" target="_blank" rel="noopener">App Store ↗</a></li><li><a href="https://rechord.life/" target="_blank" rel="noopener">rechord.life ↗</a></li></ul></div>
        <div><h4>Company</h4><ul><li><a href="about.html">The people</a></li><li><a href="investors.html">For investors</a></li><li><a href="investors.html#contact">Contact</a></li></ul></div>
        ${LEGAL_READY ? '<div><h4>Legal</h4><ul><li><a href="privacy.html">Privacy Policy</a></li><li><a href="terms.html">Terms of Use</a></li></ul></div>' : ''}
      </div>
      <div class="footer-word" aria-hidden="true">ReChord</div>
      <div class="footer-bottom"><span>© ${new Date().getFullYear()} ReChord. Voices placed, not posted.</span><span>Map data © OpenStreetMap contributors · OpenFreeMap</span></div>
    </div>`;

  // ---------- split headings into words ----------
  $$('.split').forEach(el => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(tok => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = tok; inner.style.setProperty('--i', i++);
            w.append(inner); frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    };
    walk(el);
  });

  // ---------- reveal ----------
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .14, rootMargin: '0px 0px -6% 0px' });
  const observe = root => $$('[data-reveal], .split', root).forEach(el => io.observe(el));
  observe(document);

  // ---------- cursor + magnetic ----------
  if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
    const c = document.createElement('div'); c.className = 'cursor'; document.body.append(c);
    let x = 0, y = 0, tx = 0, ty = 0;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; c.classList.add('on'); c.classList.toggle('hot', !!e.target.closest?.('a, button, [data-hot]')); }, { passive: true });
    addEventListener('pointerdown', () => c.classList.add('down')); addEventListener('pointerup', () => c.classList.remove('down'));
    document.addEventListener('pointerleave', () => c.classList.remove('on'));
    (function loop() { x += (tx - x) * .22; y += (ty - y) * .22; c.style.transform = `translate(${x}px,${y}px)`; requestAnimationFrame(loop); })();

    document.addEventListener('pointermove', e => {
      $$('[data-magnetic]').forEach(el => {
        const r = el.getBoundingClientRect(); const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
        const near = Math.abs(dx) < r.width / 2 + 40 && Math.abs(dy) < r.height / 2 + 40;
        el.style.transform = near ? `translate(${dx * .22}px, ${dy * .3}px)` : '';
      });
    }, { passive: true });

    // 3D tilt for cards
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.setProperty('--rx', `${(-py * 7).toFixed(2)}deg`); el.style.setProperty('--ry', `${(px * 9).toFixed(2)}deg`);
        el.style.setProperty('--mx', `${((px + .5) * 100).toFixed(1)}%`); el.style.setProperty('--my', `${((py + .5) * 100).toFixed(1)}%`);
      });
      el.addEventListener('pointerleave', () => { el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg'); });
    });
  }

  window.RC = { $, $$, clamp, rng, fakePeaks, waveHTML, fmtTime, logoSVG, ARROW, APP_STORE, reduced, observe };
})();
