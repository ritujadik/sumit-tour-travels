/* Sumit Tour & Travels: vanilla JS, no dependencies. One script for every page; each block runs only when its elements exist.
   Content: data.js. Photos: photos.js (files in images/). Drawn fallback scenes: art.js. */
(function () {
  'use strict';
  const { BRAND, STOPS, REGIONS, PACKAGES, REVIEWS } = window.WL;
  const PH = window.WL_PHOTOS;
  const art = window.WL_ART;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
  const icon = (id, size = 18) => `<svg width="${size}" height="${size}" aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const nightsOf = (p) => p.route.reduce((a, r) => a + r[1], 0);
  const stopsOf = (p) => p.route.map((r) => r[0]).concat(p.visits || []);
  const byId = (id) => PACKAGES.find((p) => p.id === id);
  const COVER = { vaishno: 'katra', 'vaishno-kashmir': 'srinagar', 'special-kashmir': 'gulmarg', 'shimla-manali': 'shimla', himachal: 'dharamshala', kerala: 'alleppey', nepal: 'kathmandu', 'do-dham': 'kedarnath' };
  const SEG = ['#f4a30a', '#0fa59b', '#4a7bd8', '#e0507e', '#7a62d6', '#5aa33f'];
  const telDigits = '+' + BRAND.whatsapp;
  const waLink = (text) => 'https://wa.me/' + BRAND.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
  const clampPax = (v) => Math.min(60, Math.max(1, parseInt(v, 10) || 1));
  const tourHref = (id) => 'tour-' + id + '.html';

  /* ---------- photo layers: drawn scene underneath, real photo fades in on top ---------- */
  function artHTML(kind, label, w) {
    return `<div class="art" data-ph="${esc(kind)}" data-w="${w || 960}" data-label="${esc(label || '')}">${art(kind)}</div>`;
  }
  function hydrate(root) {
    $$('.art[data-ph]:not([data-done])', root).forEach((el) => {
      el.setAttribute('data-done', '1');
      const src = PH.url(el.dataset.ph, Number(el.dataset.w));
      if (!src) return;
      const im = new Image();
      im.className = 'ph'; im.alt = el.dataset.label || ''; im.decoding = 'async';
      if (!el.closest('.hero-bg') && !el.closest('.phead-bg')) im.loading = 'lazy';
      im.onload = () => im.classList.add('ok');
      im.onerror = () => im.remove();
      im.src = src;
      el.appendChild(im);
    });
  }

  /* ---------- theme, header, menu, progress ---------- */
  const root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const paintThemeBtn = () => { $('#themeBtn').innerHTML = icon(isDark() ? 'sun' : 'moon', 20); };
  try { const t = localStorage.getItem('wl-theme'); if (t) root.dataset.theme = t; } catch (e) { /* storage unavailable */ }
  $('#themeBtn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('wl-theme', next); } catch (e) { /* ignore */ }
    paintThemeBtn();
  });
  paintThemeBtn();
  const header = $('#top'), prog = $('#progress'), menuBtn = $('#menuBtn');
  menuBtn.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    prog.style.setProperty('--p', h > 0 ? Math.min(1, scrollY / h).toFixed(4) : 0);
    header.classList.toggle('solid', scrollY > 40);
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- shared contact bits ---------- */
  $$('[data-phone]').forEach((e) => { e.textContent = BRAND.phoneDisplay; });
  $$('[data-tel]').forEach((e) => { e.href = 'tel:' + telDigits; });
  $$('[data-wa]').forEach((e) => { e.href = waLink('Hello ' + BRAND.name + ', I would like to know about your group tours.'); });
  const contactRows = () => [
    ['phone', BRAND.phoneDisplay, 'tel:' + telDigits],
    ['wa', 'WhatsApp ' + BRAND.phoneDisplay, waLink('Hello ' + BRAND.name + ', I would like to know about your group tours.')],
    BRAND.email ? ['mail', BRAND.email, 'mailto:' + BRAND.email] : null,
    ['pin', BRAND.address || BRAND.city, null],
  ].filter(Boolean);
  const rowHTML0 = ([i, t, href]) => `<li>${icon(i, 20)}${href ? `<a href="${esc(href)}"${href.startsWith('http') ? ' target="_blank" rel="noopener"' : ''}>${esc(t)}</a>` : `<span>${esc(t)}</span>`}</li>`;
  if ($('#contactList')) $('#contactList').innerHTML = contactRows().map(rowHTML0).join('');
  $('#footContact').innerHTML = contactRows().concat([['star', '@' + BRAND.instagram + ' on Instagram', 'https://www.instagram.com/' + BRAND.instagram]]).map(rowHTML0).join('');

  const fab = document.createElement('a');
  fab.className = 'fab'; fab.target = '_blank'; fab.rel = 'noopener';
  fab.href = waLink('Hello ' + BRAND.name + ', I would like to know about your group tours.');
  fab.setAttribute('aria-label', 'Chat on WhatsApp');
  fab.innerHTML = icon('wa', 22) + '<span>Chat on WhatsApp</span>';
  document.body.appendChild(fab);

  const earliestDate = new Date(); earliestDate.setDate(earliestDate.getDate() + 60);
  const fmtDate = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const prices = PACKAGES.map((p) => p.price);
  const maxPrice = Math.max(...prices);

  /* page header photos */
  $$('.phead-bg[data-bg]').forEach((el) => { el.innerHTML = artHTML(el.dataset.bg, '', 1280); hydrate(el); });

  /* ---------- creative icons (two-tone, drawn for this site) ---------- */
  const SV = (body) => `<svg viewBox="0 0 64 64" aria-hidden="true">${body}</svg>`;
  const D = 'rgba(0,0,0,.28)', Y = '#ffc94d';
  const ICO = {
    hotel: SV(`<rect x="12" y="20" width="32" height="38" rx="5" fill="#fff"/><rect x="18" y="27" width="7" height="7" rx="1.5" fill="${Y}"/><rect x="31" y="27" width="7" height="7" rx="1.5" fill="${Y}"/><rect x="18" y="39" width="7" height="7" rx="1.5" fill="${Y}"/><rect x="31" y="39" width="7" height="7" rx="1.5" fill="${Y}"/><rect x="24.5" y="49" width="7" height="9" rx="2" fill="${D}"/><path d="M50 7a8.5 8.5 0 1 0 7 14 7.500 7.500 0 0 1-7-14z" fill="#ffd166"/><circle cx="47" cy="32" r="1.800" fill="#fff"/><circle cx="55" cy="38" r="1.300" fill="#fff"/>`),
    train: SV(`<rect x="14" y="8" width="36" height="42" rx="10" fill="#fff"/><rect x="19" y="14" width="26" height="15" rx="4" fill="${D}"/><path d="M32 14v15" stroke="#fff" stroke-width="2"/><rect x="14" y="33" width="36" height="5" fill="${Y}"/><circle cx="23" cy="43.500" r="3" fill="${Y}"/><circle cx="41" cy="43.500" r="3" fill="${Y}"/><path d="M20 50l-8 10M44 50l8 10" stroke="#fff" stroke-width="3.500" stroke-linecap="round"/><path d="M10 58h44" stroke="rgba(255,255,255,.55)" stroke-width="2.500" stroke-dasharray="4 4"/>`),
    meal: SV(`<path d="M22 14c-3 3 3 5 0 9M32 8c-3 4 3 6 0 11M42 14c-3 3 3 5 0 9" fill="none" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="42" r="19" fill="#fff"/><circle cx="32" cy="42" r="13" fill="rgba(0,0,0,.14)"/><circle cx="27" cy="39" r="4.500" fill="${Y}"/><circle cx="37" cy="40" r="4.500" fill="#ff8a4c"/><circle cx="32" cy="48" r="4.500" fill="#7bd88f"/>`),
    rooms: SV(`<rect x="8" y="30" width="5" height="26" rx="2.500" fill="#fff"/><rect x="8" y="38" width="48" height="13" rx="5" fill="#fff"/><rect x="13" y="31" width="15" height="9" rx="4" fill="${Y}"/><rect x="30" y="35" width="26" height="6" rx="3" fill="rgba(0,0,0,.18)"/><rect x="50" y="48" width="6" height="8" rx="3" fill="#fff"/><path d="M44 25c-6-4-9-9-6-13 2-2 5-1 6 1 1-2 4-3 6-1 3 4 0 9-6 13z" fill="#ff7aa8"/>`),
    van: SV(`<rect x="5" y="20" width="54" height="26" rx="9" fill="#fff"/><rect x="11" y="25" width="10" height="9" rx="2" fill="${D}"/><rect x="24" y="25" width="10" height="9" rx="2" fill="${D}"/><rect x="37" y="25" width="10" height="9" rx="2" fill="${D}"/><path d="M50 25h4l3 9h-7z" fill="${D}"/><rect x="9" y="13" width="32" height="5" rx="2.500" fill="#ffd166"/><rect x="5" y="38" width="54" height="3" fill="${Y}"/><circle cx="19" cy="48" r="7" fill="#1b2a44" stroke="#fff" stroke-width="3"/><circle cx="46" cy="48" r="7" fill="#1b2a44" stroke="#fff" stroke-width="3"/><circle cx="19" cy="48" r="2" fill="#fff"/><circle cx="46" cy="48" r="2" fill="#fff"/>`),
    heat: SV(`<path d="M32 3c5 10 15 14 11 26-2 5-6 7-11 7s-9-3-11-8c-2-7 4-9 5-14 3 3 4 5 6-1 0-4 0-6 0-10z" fill="#ffd166"/><path d="M32 17c3 6 8 8 6 14-1 3-3 4-6 4s-5-2-6-5c-1-4 4-6 6-13z" fill="#ff7a3c"/><rect x="10" y="40" width="44" height="18" rx="5" fill="#fff"/><path d="M18 44v10M26 44v10M34 44v10M42 44v10" stroke="rgba(0,0,0,.25)" stroke-width="3" stroke-linecap="round"/>`),
    route: SV(`<path d="M6 20l16-8 20 8 16-8v36l-16 8-20-8-16 8z" fill="#fff"/><path d="M22 12v36M42 20v36" stroke="rgba(0,0,0,.14)" stroke-width="2"/><path d="M12 44c6-8 12 2 18-6s10-8 14-12" fill="none" stroke="#ff9f1c" stroke-width="3.500" stroke-linecap="round" stroke-dasharray="1 6"/><path d="M46 3c-6 0-10 4-10 9 0 7 10 15 10 15s10-8 10-15c0-5-4-9-10-9z" fill="#ff4f6d"/><circle cx="46" cy="12" r="3.600" fill="#fff"/>`),
    cal: SV(`<rect x="8" y="12" width="48" height="44" rx="9" fill="#fff"/><path d="M8 21a9 9 0 0 1 9-9h30a9 9 0 0 1 9 9v6H8z" fill="${Y}"/><rect x="19" y="6" width="5" height="12" rx="2.500" fill="#fff"/><rect x="40" y="6" width="5" height="12" rx="2.500" fill="#fff"/><text x="32" y="49" text-anchor="middle" font-family="Bricolage Grotesque,Arial,sans-serif" font-weight="800" font-size="22" fill="#a9154a">60</text>`),
    bag: SV(`<path d="M24 17v-4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v4" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/><rect x="8" y="17" width="48" height="38" rx="9" fill="#fff"/><rect x="20" y="17" width="6" height="38" fill="rgba(0,0,0,.1)"/><rect x="38" y="17" width="6" height="38" fill="rgba(0,0,0,.1)"/><circle cx="48" cy="27" r="5" fill="${Y}"/><path d="M27 48l7-11 5 7 3-4 6 8z" fill="#2fb36a"/><circle cx="15" cy="27" r="2" fill="#ff4f6d"/>`),
  };
  const ROPE = '<svg viewBox="0 0 72 44" aria-hidden="true"><path class="line" d="M2 37C20 37 24 10 42 10L57 10"/><path class="head" d="M52 3l9 7-9 7"/></svg>';
  $$('[data-ico]').forEach((el) => { el.innerHTML = ICO[el.dataset.ico]; });
  $$('.rope').forEach((el) => { el.innerHTML = ROPE; });


  /* ---------- included tiles (simple) ---------- */
  if ($('#incGrid')) $('#incGrid').innerHTML = [
    ['bed', '3-star hotels', 'A hotel stay at every overnight stop. Do Dham uses hotels along the route.'],
    ['train', 'Surat to Surat by train', 'Non-A.C. train travel both ways. Nepal combines rail with a 2x2 AC bus.'],
    ['meal', 'Breakfast and dinner', 'Served daily at the hotel on every package.'],
    ['users', 'Couple and family rooms', 'Comfortable rooms sized for couples and families.'],
    ['van', 'Tempo Traveller', '14-seater or 17-seater on the ground, depending on the package.'],
    ['heat', 'Centrally heated hotels', 'On both Kashmir routes, for cold Srinagar and Pahalgam nights.'],
  ].map(([i, t, d]) => `<li><span class="ico">${icon(i, 24)}</span><div><b>${t}</b><span class="d">${d}</span></div></li>`).join('');

  /* ---------- ticket cards (home + packages) ---------- */
  function cardHTML(p) {
    return `<article class="card" data-id="${p.id}">
      <a class="cover" href="${tourHref(p.id)}" aria-label="View route for ${esc(p.title)}">
        ${artHTML(COVER[p.id], p.title)}
        <span class="badge region">${esc(REGIONS[p.region])}</span>
        <span class="badge days">${p.days} DAYS</span>
        <h3>${esc(p.title)}</h3>
      </a>
      <div class="card-body">
        <p class="tagline">${esc(p.tagline)}</p>
        <ul class="route" aria-label="Overnight stops">${p.route.map(([s, n]) => `<li>${esc(STOPS[s][0])}<i>${n}N</i></li>`).join('')}</ul>
        <div class="card-foot">
          <div class="price"><small>Per person</small><b>${inr(p.price)}</b></div>
          <a class="btn btn-accent btn-sm" href="${tourHref(p.id)}">View route ${icon('arrow', 16)}</a>
        </div>
      </div></article>`;
  }
  function tilt(grid) {
    if (!(fine && !reduced)) return;
    grid.addEventListener('pointermove', (e) => {
      const c = e.target.closest('.card'); if (!c) return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
      c.style.setProperty('--ry', ((x - .5) * 7).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
    });
    grid.addEventListener('pointerout', (e) => { const c = e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
  }

  /* ======================= HOME ======================= */
  if ($('#hero')) {
    const HERO = [
      { word: 'Kashmir', photo: 'hero', pkg: 'vaishno-kashmir' },
      { word: 'Kerala', photo: 'alleppey', pkg: 'kerala' },
      { word: 'Kedarnath', photo: 'kedarnath', pkg: 'do-dham' },
      { word: 'Kathmandu', photo: 'kathmandu', pkg: 'nepal' },
      { word: 'Himachal', photo: 'dharamshala', pkg: 'himachal' },
      { word: 'Vaishno Devi', photo: 'katra', pkg: 'vaishno' },
    ];
    const bg = $('#heroBg'), stack = $('#heroStack'), dots = $('#heroDots'), word = $('#rotWord');
    bg.innerHTML = HERO.map((h) => `<div class="slide">${artHTML(h.photo, h.word, 1280)}</div>`).join('');
    stack.innerHTML = HERO.map((h, i) => `<figure class="sc" data-i="${i}">${artHTML(h.photo, h.word, 960)}<figcaption><b>${esc(h.word)}</b><span>${esc(byId(h.pkg).days)} days · from ${inr(byId(h.pkg).price)}</span></figcaption></figure>`).join('');
    dots.innerHTML = HERO.map((h, i) => `<button type="button" role="tab" data-i="${i}" aria-selected="false" aria-label="${esc(h.word)}"><i></i><span>${esc(h.word)}</span></button>`).join('');
    hydrate(bg); hydrate(stack);
    let cur = -1, timer;
    const show = (i) => {
      if (i === cur) return;
      cur = i;
      const h = HERO[i], p = byId(h.pkg), n = HERO.length;
      $$('.slide', bg).forEach((s, k) => s.classList.toggle('on', k === i));
      $$('button', dots).forEach((d, k) => d.setAttribute('aria-selected', String(k === i)));
      $$('.sc', stack).forEach((c, k) => { const d = (k - i + n) % n; c.dataset.pos = d < 3 ? d : 'x'; c.style.zIndex = 10 - d; });
      word.textContent = h.word;
      word.classList.remove('swap'); void word.offsetWidth; if (!reduced) word.classList.add('swap');
      $('#featTitle').textContent = p.title;
      $('#featMeta').textContent = p.days + ' days · from ' + inr(p.price) + ' per person';
      $('#featBtn').href = tourHref(p.id);
    };
    const play = () => { clearInterval(timer); if (!reduced) timer = setInterval(() => show((cur + 1) % HERO.length), 5600); };
    dots.addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (b) { show(Number(b.dataset.i)); play(); } });
    stack.addEventListener('click', (e) => { const c = e.target.closest('.sc'); if (!c) return; if (c.dataset.pos === '0') location.href = tourHref(byId(HERO[cur].pkg).id); else { show(Number(c.dataset.i)); play(); } });
    show(0); play();
    document.addEventListener('visibilitychange', () => { document.hidden ? clearInterval(timer) : play(); });

    /* finder + region circles go to the packages page; the choice travels in the #hash */
    $('#finderDest').innerHTML = '<option value="all">Anywhere on our routes</option>' + Object.entries(REGIONS).map(([k, v]) => `<option value="${k}">${esc(v)}</option>`).join('');
    $('#finder').addEventListener('submit', (e) => {
      e.preventDefault();
      location.href = 'packages.html#' + [$('#finderDest').value, $('#finderLen').value, $('#finderBud').value].join('-');
    });
    const CAT = [['jk', 'srinagar'], ['hp', 'manali'], ['kl', 'alleppey'], ['np', 'kathmandu'], ['uk', 'kedarnath']];
    $('#cats').innerHTML = CAT.map(([k, ph]) => {
      const n = PACKAGES.filter((p) => p.region === k).length;
      return `<a class="rtile" href="packages.html#${k}">${artHTML(ph, REGIONS[k], 960)}<span class="rt-txt"><b>${esc(REGIONS[k])}</b><small>${n} tour${n > 1 ? 's' : ''} ${icon('arrow', 14)}</small></span></a>`;
    }).join('');
    hydrate($('#cats'));

    const FEATURED = ['vaishno-kashmir', 'kerala', 'do-dham'];
    $('#grid').innerHTML = FEATURED.map((id) => cardHTML(byId(id))).join('');
    hydrate($('#grid')); tilt($('#grid'));

    $('#earliest').textContent = fmtDate(earliestDate);
  }

  /* ======================= REVIEWS (home) ======================= */
  if ($('#revForm')) {
    const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    if (REVIEWS.length) {
      $('#revTrack').hidden = false; $('#revBtns').hidden = false;
      $('#reviews').classList.add('has-rev');
      $('#revTrack').innerHTML = REVIEWS.map((r, i) => `
        <article class="rev">
          <div class="stars" role="img" aria-label="${r.stars} out of 5 stars">${[1, 2, 3, 4, 5].map((n) => `<span class="${n > r.stars ? 'off' : ''}">${icon('star', 18)}</span>`).join('')}</div>
          <blockquote>${esc(r.text)}</blockquote>
          <footer><div class="avatar" style="background:linear-gradient(145deg,hsl(${(i * 57 + 20) % 360} 60% 44%),hsl(${(i * 57 + 60) % 360} 55% 26%))">${esc(initials(r.name))}</div>
            <div><b>${esc(r.name)}</b><span>${esc([r.city, r.trip].filter(Boolean).join(' · '))}</span></div></footer>
        </article>`).join('');
      const track = $('#revTrack');
      $('#revPrev').addEventListener('click', () => track.scrollBy({ left: -track.clientWidth * .8, behavior: 'smooth' }));
      $('#revNext').addEventListener('click', () => track.scrollBy({ left: track.clientWidth * .8, behavior: 'smooth' }));
    }
    $('#rTrip').innerHTML = PACKAGES.map((p) => `<option value="${p.id}">${esc(p.title)}</option>`).join('');
    $('#rRate').innerHTML = [5, 4, 3, 2, 1].map((n) => `<input type="radio" name="rate" id="rate${n}" value="${n}"${n === 5 ? ' checked' : ''}><label for="rate${n}" title="${n} star${n > 1 ? 's' : ''}">${icon('star', 28)}</label>`).join('');
    $('#revForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#rName').value.trim(), text = $('#rText').value.trim(), err = $('#rErr');
      const msg = !name ? 'Enter your name.' : text.length < 15 ? 'Write a few words about your trip (at least 15 characters).' : '';
      err.hidden = !msg; err.textContent = msg;
      if (msg) return;
      const stars = ($('#revForm').querySelector('input[name="rate"]:checked') || { value: 5 }).value;
      const body = [
        `New review for ${BRAND.name} website`,
        `Name: ${name}${$('#rCity').value.trim() ? ', ' + $('#rCity').value.trim() : ''}`,
        `Tour: ${byId($('#rTrip').value).title}`,
        `Rating: ${stars}/5`,
        `Review: ${text}`,
      ].join('\n');
      const url = waLink(body);
      $('#rLink').href = url; $('#rDone').hidden = false;
      window.open(url, '_blank', 'noopener');
    });
  }

  /* ======================= PACKAGES ======================= */
  if ($('#filters')) {
    const state = { region: 'all', q: '', dur: 'any', budget: maxPrice, sort: 'default', stop: null };
    const regionKeys = ['all'].concat(Object.keys(REGIONS));
    const paintChips = () => {
      $('#regionChips').innerHTML = regionKeys.map((k) => {
        const n = k === 'all' ? PACKAGES.length : PACKAGES.filter((p) => p.region === k).length;
        return `<button class="chip-btn" type="button" data-region="${k}" aria-pressed="${state.region === k}">${k === 'all' ? 'All routes' : REGIONS[k]}<small>${n}</small></button>`;
      }).join('');
    };
    const matches = (p) => {
      if (state.region !== 'all' && p.region !== state.region) return false;
      if (p.price > state.budget) return false;
      if (state.dur === 'short' && p.days > 8) return false;
      if (state.dur === 'mid' && (p.days < 9 || p.days > 11)) return false;
      if (state.dur === 'long' && p.days < 12) return false;
      if (state.stop && !stopsOf(p).includes(state.stop)) return false;
      if (state.q) {
        const hay = (p.title + ' ' + p.tagline + ' ' + REGIONS[p.region] + ' ' + stopsOf(p).map((s) => STOPS[s][0]).join(' ') + ' ' + (p.places || []).join(' ')).toLowerCase();
        if (!state.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
      }
      return true;
    };
    const sorted = (list) => {
      const l = list.slice();
      if (state.sort === 'price-asc') l.sort((a, b) => a.price - b.price);
      if (state.sort === 'price-desc') l.sort((a, b) => b.price - a.price);
      if (state.sort === 'days-asc') l.sort((a, b) => a.days - b.days);
      if (state.sort === 'days-desc') l.sort((a, b) => b.days - a.days);
      return l;
    };
    const filtersActive = () => state.region !== 'all' || state.q || state.dur !== 'any' || state.budget < maxPrice || state.stop;
    const syncControls = () => { $('#q').value = state.q; $('#dur').value = state.dur; $('#budget').value = state.budget; $('#sort').value = state.sort; };
    const render = () => {
      const list = sorted(PACKAGES.filter(matches));
      $('#grid').innerHTML = list.map(cardHTML).join('');
      hydrate($('#grid'));
      $('#empty').hidden = list.length > 0;
      $('#grid').hidden = list.length === 0;
      $('#resultCount').textContent = `Showing ${list.length} of ${PACKAGES.length} packages` + (state.stop ? ' via ' + STOPS[state.stop][0] : '');
      $('#resetFilters').hidden = !filtersActive();
      $('#budgetOut').textContent = 'up to ' + inr(state.budget);
      paintChips();
    };
    const reset = () => { Object.assign(state, { region: 'all', q: '', dur: 'any', budget: maxPrice, sort: 'default', stop: null }); syncControls(); render(); };
    /* hash: "jk" (region) | "jk-short-15000" (finder) | "via-katra" (destination) */
    const fromHash = () => {
      const h = decodeURIComponent(location.hash.slice(1));
      if (!h) return;
      const parts = h.split('-');
      if (parts[0] === 'via' && STOPS[parts[1]]) { state.stop = parts[1]; }
      else if (parts[0] === 'all' || REGIONS[parts[0]]) {
        state.region = parts[0];
        if (['any', 'short', 'mid', 'long'].includes(parts[1])) state.dur = parts[1];
        if (Number(parts[2])) state.budget = Math.min(maxPrice, Number(parts[2]));
      }
    };
    $('#regionChips').addEventListener('click', (e) => { const b = e.target.closest('[data-region]'); if (b) { state.region = b.dataset.region; render(); } });
    $('#q').addEventListener('input', (e) => { state.q = e.target.value.trim(); render(); });
    $('#dur').addEventListener('change', (e) => { state.dur = e.target.value; render(); });
    $('#budget').addEventListener('input', (e) => { state.budget = Number(e.target.value); render(); });
    $('#sort').addEventListener('change', (e) => { state.sort = e.target.value; render(); });
    $('#resetFilters').addEventListener('click', reset);
    $('#emptyReset').addEventListener('click', reset);
    addEventListener('hashchange', () => { reset(); fromHash(); syncControls(); render(); });
    tilt($('#grid'));
    fromHash(); syncControls(); render();
  }

  /* ======================= DESTINATIONS ======================= */
  if ($('#reel')) {
    const stopCount = {};
    PACKAGES.forEach((p) => new Set(stopsOf(p)).forEach((s) => { stopCount[s] = (stopCount[s] || 0) + 1; }));
    const ids = Object.keys(STOPS);
    const tourWord = (id) => (stopCount[id] > 1 ? 'In ' + stopCount[id] + ' tours' : 'In 1 tour');
    const destBtn = (id) => `<a class="dest" href="packages.html#via-${id}" aria-label="${esc(STOPS[id][0])}: ${tourWord(id)}">${artHTML(id, STOPS[id][0])}<span><b>${esc(STOPS[id][0])}</b><small>${tourWord(id)}</small></span></a>`;
    const half = Math.ceil(ids.length / 2);
    const row = (list, cls) => { const h = list.map(destBtn).join(''); return `<div class="reel-row ${cls}"><div class="reel-track">${h}${h}</div></div>`; };
    $('#reel').innerHTML = row(ids.slice(0, half), '') + row(ids.slice(half).reverse(), 'rev');
    hydrate($('#reel'));
    $('#destGrid').innerHTML = ids.map((id) => `<a class="dcard" href="packages.html#via-${id}">
      <span class="dc-ph">${artHTML(id, STOPS[id][0])}</span>
      <span class="dc-body"><b>${esc(STOPS[id][0])}</b><span>${esc(STOPS[id][1])}</span><i>${tourWord(id)} ${icon('arrow', 14)}</i></span></a>`).join('');
    hydrate($('#destGrid'));
  }

  /* ======================= TOUR PAGE ======================= */
  if ($('#tour')) {
    const p = byId(document.body.dataset.pkg);
    const incl = [];
    if (p.hotel) incl.push(['bed', p.hotel]);
    incl.push(['train', p.train], ['meal', 'Daily breakfast and dinner at the hotel'], ['users', 'Comfortable couple and family rooms'], ['van', p.vehicle]);
    if (p.heated) incl.push(['heat', 'Centrally heated hotels']);
    const bar = p.route.map(([s, n], i) => `<i style="flex:${n};background:${SEG[i % SEG.length]};animation-delay:${i * .12}s" title="${esc(STOPS[s][0])}: ${n} night${n > 1 ? 's' : ''}"></i>`).join('');
    const panel = (s, tag, i, on) => `<article class="panel${on ? ' on' : ''}" tabindex="0" aria-label="${esc(STOPS[s][0])}">${artHTML(s, STOPS[s][0], 960)}
      <span class="nt" style="--c:${i === null ? '#0fa59b' : SEG[i % SEG.length]}">${tag}</span>
      <div class="pn-txt"><b>${esc(STOPS[s][0])}</b><p>${esc(STOPS[s][1])}</p></div></article>`;
    const trip = (items) => `<div class="fan">${items.join('')}</div>`;
    const leg = panel;
    const others = PACKAGES.filter((x) => x.id !== p.id && x.region !== p.region).slice(0, 3);
    $('#tour').innerHTML = `
      <section class="phead tour-head">
        <div class="phead-bg" aria-hidden="true">${artHTML(COVER[p.id], '', 1280)}</div>
        <div class="wrap phead-in">
          <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span>/</span><a href="packages.html">Packages</a><span>/</span><b>${esc(p.title)}</b></nav>
          <h1>${esc(p.title)}</h1>
          <p class="sec-sub">${esc(p.tagline)}</p>
          <div class="m-meta"><span>${p.days} days</span><span>${nightsOf(p)} nights at stops</span><span>${esc(REGIONS[p.region])}</span><span>Departs Surat</span><span class="m-price-chip">From ${inr(p.price)} per person</span></div>
        </div>
      </section>
      <section class="section"><div class="wrap">
        <div class="sec-head"><p class="eyebrow">Route</p><h2>Where you <em>stay</em>, stop by stop</h2></div>
        <div class="nights-bar" aria-hidden="true">${bar}</div>
        <p class="nights-key">${p.route.map(([s, n]) => `${esc(STOPS[s][0])} ${n}N`).join(' · ')}. Remaining days are train travel from Surat and back.</p>
        ${trip(p.route.map(([s, n], i) => leg(s, n + ' night' + (n > 1 ? 's' : ''), i, i === 0)))}
        ${(p.visits || []).length ? `<h3 class="sub-h">Day trips from your hotel</h3>${trip(p.visits.map((s, i) => leg(s, 'Day trip', null, i === 0)))}` : ''}
        ${p.places ? `<h3 class="sub-h">Places on this route</h3><p class="tagline">${p.places.map(esc).join(', ')}.</p>` : ''}
      </div></section>
      <section class="section tint"><div class="wrap tour-cols">
        <div>
          <div class="sec-head" style="margin-bottom:22px"><p class="eyebrow">Included</p><h2>What the price <em>covers</em></h2></div>
          <ul class="incl big">${incl.map(([i, t]) => `<li>${icon(i, 22)}<span>${esc(t)}</span></li>`).join('')}</ul>
          ${p.note ? `<p class="m-note">${esc(p.note)}</p>` : ''}
          <p class="m-note"><b>Book train tickets 60 days in advance.</b> This is mandatory for every package. Earliest start we can confirm today: <b>${fmtDate(earliestDate)}</b>.</p>
        </div>
        <aside class="m-price sticky">
          <div class="p"><span class="tagline">Per person</span><b>${inr(p.price)}</b></div>
          <label class="fld" for="mPax"><span>Travellers</span>
            <div class="stepper"><button type="button" id="mMinus" aria-label="Fewer travellers">−</button><input id="mPax" type="number" min="1" max="60" value="4" inputmode="numeric"><button type="button" id="mPlus" aria-label="More travellers">+</button></div>
          </label>
          <div class="tot"><span>Estimated total</span><span id="mTotal"></span></div>
          <a class="btn btn-accent wide" id="mWa" href="#" target="_blank" rel="noopener">${icon('wa', 20)} Enquire on WhatsApp</a>
          <a class="btn btn-ghost wide" href="tel:${telDigits}">${icon('phone', 20)} Call ${esc(BRAND.phoneDisplay)}</a>
          <a class="link-btn" href="contact.html#${p.id}">Use the full enquiry form</a>
        </aside>
      </div></section>
      <section class="section"><div class="wrap">
        <div class="sec-head row"><div><p class="eyebrow">More tours</p><h2>Other routes <em>you may like</em></h2></div><a class="btn btn-ghost" href="packages.html">All packages ${icon('arrow', 18)}</a></div>
        <div class="grid" id="grid">${others.map(cardHTML).join('')}</div>
      </div></section>`;
    hydrate($('#tour')); tilt($('#grid'));
    $$('.fan').forEach((fan) => {
      const act = (pn) => { $$('.panel', fan).forEach((x) => x.classList.toggle('on', x === pn)); };
      fan.addEventListener('click', (e) => { const pn = e.target.closest('.panel'); if (pn) act(pn); });
      fan.addEventListener('focusin', (e) => { const pn = e.target.closest('.panel'); if (pn) act(pn); });
      if (fine) fan.addEventListener('pointerover', (e) => { const pn = e.target.closest('.panel'); if (pn) act(pn); });
    });
    const pax = $('#mPax');
    const upd = () => {
      const n = clampPax(pax.value);
      $('#mTotal').textContent = inr(n * p.price);
      $('#mWa').href = waLink(`Hello ${BRAND.name}, I would like a quote.\nPackage: ${p.title} (${p.days} days)\nTravellers: ${n}\nEstimated total: ${inr(n * p.price)}`);
    };
    pax.addEventListener('input', upd);
    $('#mMinus').addEventListener('click', () => { pax.value = clampPax(pax.value) - 1 || 1; upd(); });
    $('#mPlus').addEventListener('click', () => { pax.value = Math.min(60, clampPax(pax.value) + 1); upd(); });
    upd();
  }

  /* ======================= CONTACT ======================= */
  if ($('#enqForm')) {
    $('#ccards').innerHTML = [
      ['phone', 'Call us', BRAND.phoneDisplay, 'tel:' + telDigits, 'g-indigo'],
      ['wa', 'WhatsApp', 'Message ' + BRAND.phoneDisplay, waLink('Hello ' + BRAND.name + ', I would like to know about your group tours.'), 'g-green'],
      ['star', 'Instagram', '@' + BRAND.instagram, 'https://www.instagram.com/' + BRAND.instagram, 'g-rose'],
      BRAND.email ? ['mail', 'Email', BRAND.email, 'mailto:' + BRAND.email, 'g-teal'] : ['pin', 'Based in', BRAND.address || BRAND.city, null, 'g-amber'],
    ].map(([i, t, v, href, g]) => `<${href ? 'a href="' + esc(href) + '"' + (href.startsWith('http') ? ' target="_blank" rel="noopener"' : '') : 'div'} class="ccard ${g}">${icon(i, 28)}<small>${t}</small><b>${esc(v)}</b></${href ? 'a' : 'div'}>`).join('');
    $('#enqBg').innerHTML = artHTML('kovalam', '', 1280); hydrate($('#enqBg'));
    $('#fDate').min = iso(earliestDate);
    $('#fPkg').innerHTML = PACKAGES.map((p) => `<option value="${p.id}">${esc(p.title)} · ${p.days} days · ${inr(p.price)}</option>`).join('');
    const hp = decodeURIComponent(location.hash.slice(1));
    if (byId(hp)) $('#fPkg').value = hp;
    const updateEstimate = () => {
      const p = byId($('#fPkg').value), n = clampPax($('#fPax').value);
      $('#estTotal').textContent = inr(p.price * n);
      $('#estLine').textContent = `${n} traveller${n > 1 ? 's' : ''} × ${inr(p.price)} · ${p.title}`;
    };
    $('#fPkg').addEventListener('change', updateEstimate);
    $('#fPax').addEventListener('input', updateEstimate);
    $('#paxMinus').addEventListener('click', () => { $('#fPax').value = clampPax($('#fPax').value) - 1 || 1; updateEstimate(); });
    $('#paxPlus').addEventListener('click', () => { $('#fPax').value = Math.min(60, clampPax($('#fPax').value) + 1); updateEstimate(); });
    updateEstimate();
    const err = $('#formErr');
    $('#enqForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#fName').value.trim(), phone = $('#fPhone').value.trim(), date = $('#fDate').value;
      let msg = '';
      if (!name) msg = 'Enter your name so we know who to reply to.';
      else if (phone.replace(/\D/g, '').length < 10) msg = 'Enter a phone number with at least 10 digits.';
      else if (date && date < $('#fDate').min) msg = 'Choose a start date on or after ' + fmtDate(earliestDate) + '. Train tickets need 60 days.';
      err.hidden = !msg; err.textContent = msg;
      if (msg) return;
      const p = byId($('#fPkg').value), n = clampPax($('#fPax').value), note = $('#fNote').value.trim();
      const text = [
        `Hello ${BRAND.name}, I would like a quote.`,
        `Package: ${p.title} (${p.days} days)`,
        `Travellers: ${n}`,
        date ? `Start date: ${fmtDate(new Date(date + 'T00:00:00'))}` : null,
        `Estimated total: ${inr(p.price * n)}`,
        `Name: ${name}`,
        `Phone: ${phone}`,
        note ? `Notes: ${note}` : null,
      ].filter(Boolean).join('\n');
      const url = waLink(text);
      $('#readyMsg').textContent = text;
      $('#waLink').href = url;
      $('#ready').hidden = false;
      $('#ready').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      window.open(url, '_blank', 'noopener');   /* opens WhatsApp chat with the number; the button below is the fallback */
    });
    $('#copyMsg').addEventListener('click', async () => {
      const label = $('#copyMsg span'), pre = $('#readyMsg');
      try { await navigator.clipboard.writeText(pre.textContent); label.textContent = 'Copied'; }
      catch (e) { const r = document.createRange(); r.selectNodeContents(pre); const s = getSelection(); s.removeAllRanges(); s.addRange(r); label.textContent = 'Selected, press Ctrl+C'; }
      setTimeout(() => { label.textContent = 'Copy message'; }, 2200);
    });
  }

  hydrate(document);
})();
