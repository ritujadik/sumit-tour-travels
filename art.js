/* Sumit Tour & Travels: procedural scene illustrations.
   Every itinerary stop gets its own drawn scene. To use a real photo instead,
   drop images/<stop-id>.jpg (or images/pkg-<package-id>.jpg) next to index.html
   and it replaces the drawing automatically. */
(function () {
  const W = 400, H = 260;
  let uid = 0;
  const f = (n) => Math.round(n * 10) / 10;
  const rng = (seed) => {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const hash = (s) => { let h = 7; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return h; };

  const MOODS = {
    dawn: { sky: ['#33407a', '#f7b183'], far: '#8a8fc2', mid: '#5a5f9a', near: '#2d3260', sun: ['#ffe2b0', 300, 150, 22], water: ['#f2b48c', '#5a5f9a'] },
    day: { sky: ['#3c97dc', '#d2edf9'], far: '#a8cbe2', mid: '#6c9dbd', near: '#356a88', sun: ['#fff6c9', 320, 48, 16], water: ['#8ccbea', '#2f7fa8'] },
    dusk: { sky: ['#241a45', '#f08a5a'], far: '#7a5a8f', mid: '#4d3a73', near: '#271d4a', sun: ['#ffd08a', 90, 168, 26], water: ['#e98a5f', '#3a2c63'] },
    night: { sky: ['#050a1e', '#1c2c60'], far: '#2b3a73', mid: '#1b2756', near: '#0d1534', sun: ['#f5f1d8', 320, 48, 12], stars: 1, water: ['#22356e', '#0b1330'] },
    gold: { sky: ['#e8923a', '#fde7ab'], far: '#d9a85a', mid: '#a8743a', near: '#6b4524', sun: ['#fff3c4', 200, 120, 26], water: ['#f6c777', '#b3792f'] },
    mist: { sky: ['#86a9b3', '#e6f0ef'], far: '#b6cdcd', mid: '#7fa5a3', near: '#3f6e6a', sun: ['#ffffff', 300, 60, 14], water: ['#a9cdd0', '#5f8f93'] },
  };
  const col = (v, m) => (m[v] || v);

  const pineShape = (x, y, s, c) =>
    `<path d="M${f(x)} ${f(y - 1.7 * s)}L${f(x + .45 * s)} ${f(y - .85 * s)}L${f(x - .45 * s)} ${f(y - .85 * s)}ZM${f(x)} ${f(y - 1.25 * s)}L${f(x + .62 * s)} ${f(y - .3 * s)}L${f(x - .62 * s)} ${f(y - .3 * s)}ZM${f(x)} ${f(y - .75 * s)}L${f(x + .78 * s)} ${f(y)}L${f(x - .78 * s)} ${f(y)}Z" fill="${c}"/><rect x="${f(x - .06 * s)}" y="${f(y)}" width="${f(.12 * s)}" height="${f(.2 * s)}" fill="${c}"/>`;

  const palmShape = (x, y, s, c) => {
    const tx = x + .15 * s, ty = y - 1.25 * s;
    let g = `<path d="M${f(x)} ${f(y)}Q${f(x + .25 * s)} ${f(y - .6 * s)} ${f(tx)} ${f(ty)}" stroke="${c}" stroke-width="${f(Math.max(2, .09 * s))}" fill="none" stroke-linecap="round"/>`;
    [[-.8, .25], [-.55, -.1], [.0, -.35], [.55, -.1], [.85, .25], [-.3, .4], [.35, .4]].forEach(([dx, dy]) => {
      g += `<path d="M${f(tx)} ${f(ty)}Q${f(tx + dx * s * .5)} ${f(ty + dy * s * .5 - .3 * s)} ${f(tx + dx * s)} ${f(ty + dy * s)}" stroke="${c}" stroke-width="${f(Math.max(2, .08 * s))}" fill="none" stroke-linecap="round"/>`;
    });
    return g;
  };

  const templeShape = (x, y, s, c, dark) =>
    `<rect x="${f(x - 16 * s)}" y="${f(y - 6 * s)}" width="${f(32 * s)}" height="${f(6 * s)}" fill="${c}"/>` +
    `<rect x="${f(x - 12 * s)}" y="${f(y - 24 * s)}" width="${f(24 * s)}" height="${f(18 * s)}" fill="${c}"/>` +
    `<path d="M${f(x - 12 * s)} ${f(y - 24 * s)}Q${f(x - 9 * s)} ${f(y - 42 * s)} ${f(x)} ${f(y - 54 * s)}Q${f(x + 9 * s)} ${f(y - 42 * s)} ${f(x + 12 * s)} ${f(y - 24 * s)}Z" fill="${c}"/>` +
    `<path d="M${f(x - 10 * s)} ${f(y - 32 * s)}H${f(x + 10 * s)}M${f(x - 8 * s)} ${f(y - 40 * s)}H${f(x + 8 * s)}" stroke="${dark}" stroke-opacity=".25" stroke-width="${f(1.2 * s)}"/>` +
    `<circle cx="${f(x)}" cy="${f(y - 56 * s)}" r="${f(2 * s)}" fill="${c}"/><path d="M${f(x)} ${f(y - 58 * s)}V${f(y - 68 * s)}" stroke="${c}" stroke-width="${f(s)}"/><path d="M${f(x)} ${f(y - 68 * s)}l${f(8 * s)} ${f(2.5 * s)}l${f(-8 * s)} ${f(2.5 * s)}Z" fill="#e4572e"/>` +
    `<path d="M${f(x - 3.5 * s)} ${f(y - 6 * s)}V${f(y - 15 * s)}Q${f(x)} ${f(y - 20 * s)} ${f(x + 3.5 * s)} ${f(y - 15 * s)}V${f(y - 6 * s)}Z" fill="#ffcf70"/>`;

  const P = {
    peaks(o, m, r) {
      const n = o.n, base = o.base, c = col(o.c, m), step = W / n; let s = '';
      for (let i = 0; i < n; i++) {
        const x = (i + .5) * step + (r() - .5) * step * .6, h = o.h * (.55 + .45 * r()), w = step * (.75 + .35 * r()), top = base - h;
        s += `<path d="M${f(x - w)} ${base}L${f(x)} ${f(top)}L${f(x + w)} ${base}Z" fill="${c}"/>`;
        s += `<path d="M${f(x)} ${f(top)}L${f(x + w)} ${base}H${f(x + w * .1)}Z" fill="#000" opacity=".12"/>`;
        if (o.snow) {
          const k = .38, yy = top + h * k, dx = w * k;
          s += `<path d="M${f(x - dx)} ${f(yy)}L${f(x - dx * .45)} ${f(yy - h * .07)}L${f(x)} ${f(yy + h * .05)}L${f(x + dx * .4)} ${f(yy - h * .06)}L${f(x + dx)} ${f(yy)}L${f(x)} ${f(top)}Z" fill="#f6fbff" opacity=".96"/>`;
        }
      }
      return s + `<rect x="0" y="${base - 1}" width="${W}" height="${H - base + 1}" fill="${c}"/>`;
    },
    mount(o, m) {
      const c = col(o.c, m), x = o.x, y = o.y, w = o.w;
      return `<path d="M${f(x - w / 2)} ${H}L${f(x - w * .12)} ${f(y + 40)}Q${f(x - w * .05)} ${f(y + 10)} ${f(x)} ${y}Q${f(x + w * .06)} ${f(y + 14)} ${f(x + w * .14)} ${f(y + 46)}L${f(x + w / 2)} ${H}Z" fill="${c}"/><path d="M${x} ${y}L${f(x + w / 2)} ${H}H${x}Z" fill="#000" opacity=".15"/>`;
    },
    hills(o, m) {
      const c = col(o.c, m), fr = o.f || .02, ph = o.ph || 0; let d = `M0 ${H}`;
      for (let x = 0; x <= W; x += 8) d += `L${x} ${f(o.base - o.amp * (Math.sin(x * fr + ph) + .5 * Math.sin(x * fr * 2.3 + ph * 2)))}`;
      d += `L${W} ${H}Z`;
      let s = `<path d="${d}" fill="${c}"/>`;
      if (o.rows) {
        for (let k = 1; k <= o.rows; k++) {
          let l = ''; for (let x = 0; x <= W; x += 8) l += `${x ? 'L' : 'M'}${x} ${f(o.base + k * 9 - o.amp * (Math.sin(x * fr + ph) + .5 * Math.sin(x * fr * 2.3 + ph * 2)))}`;
          s += `<path d="${l}" stroke="${o.row || '#fff'}" stroke-opacity=".25" stroke-width="1.6" fill="none"/>`;
        }
      }
      return s;
    },
    pines(o, m, r) {
      const c = col(o.c, m); let s = '';
      for (let i = 0; i < o.n; i++) {
        const x = o.x0 + (o.x1 - o.x0) * r(), y = o.y0 + (o.y1 - o.y0) * r(), z = o.s * (.7 + .6 * r());
        s += pineShape(x, y, z, c);
      }
      return s;
    },
    palms(o, m, r) {
      const c = col(o.c, m); let s = '';
      (o.at || []).forEach(([x, y, z]) => { s += palmShape(x, y, z, c); });
      return s;
    },
    temple(o, m) { return templeShape(o.x, o.y, o.s, o.col || '#f4dcb0', o.dark || '#000'); },
    dome(o) {
      const x = o.x, y = o.y, s = o.s;
      const g = `<rect x="${f(x - 34 * s)}" y="${f(y - 14 * s)}" width="${f(68 * s)}" height="${f(14 * s)}" fill="#f1e6cf"/>` +
        `<path d="M${f(x - 17 * s)} ${f(y - 14 * s)}C${f(x - 19 * s)} ${f(y - 38 * s)} ${f(x - 5 * s)} ${f(y - 44 * s)} ${f(x)} ${f(y - 54 * s)}C${f(x + 5 * s)} ${f(y - 44 * s)} ${f(x + 19 * s)} ${f(y - 38 * s)} ${f(x + 17 * s)} ${f(y - 14 * s)}Z" fill="#f0b43a"/>` +
        `<path d="M${f(x)} ${f(y - 54 * s)}V${f(y - 62 * s)}" stroke="#f0b43a" stroke-width="${f(1.4 * s)}"/>` +
        [-27, 27].map((d) => `<path d="M${f(x + (d - 6) * s)} ${f(y - 14 * s)}Q${f(x + d * s)} ${f(y - 30 * s)} ${f(x + (d + 6) * s)} ${f(y - 14 * s)}Z" fill="#f0b43a"/>`).join('') +
        `<path d="M${f(x - 34 * s)} ${f(y - 8 * s)}H${f(x + 34 * s)}" stroke="#c99a52" stroke-width="${f(s)}"/>`;
      return g + `<g transform="translate(0 ${f(2 * y)}) scale(1 -1)" opacity=".32">${g}</g>`;
    },
    stupa(o) {
      const x = o.x, y = o.y, s = o.s;
      let g = `<path d="M${f(x - 22 * s)} ${y}A${f(22 * s)} ${f(19 * s)} 0 0 1 ${f(x + 22 * s)} ${y}Z" fill="#f5efe4"/>` +
        `<rect x="${f(x - 6.5 * s)}" y="${f(y - 31 * s)}" width="${f(13 * s)}" height="${f(11 * s)}" fill="#e2a93b"/>` +
        `<circle cx="${f(x - 2.6 * s)}" cy="${f(y - 26 * s)}" r="${f(1.3 * s)}" fill="#fff"/><circle cx="${f(x + 2.6 * s)}" cy="${f(y - 26 * s)}" r="${f(1.3 * s)}" fill="#fff"/>` +
        `<circle cx="${f(x - 2.6 * s)}" cy="${f(y - 26 * s)}" r="${f(.55 * s)}" fill="#222"/><circle cx="${f(x + 2.6 * s)}" cy="${f(y - 26 * s)}" r="${f(.55 * s)}" fill="#222"/>` +
        `<path d="M${f(x)} ${f(y - 24.5 * s)}l${f(-.8 * s)} ${f(2.4 * s)}h${f(1.6 * s)}Z" fill="#c0392b"/>` +
        `<path d="M${f(x - 5 * s)} ${f(y - 31 * s)}L${f(x)} ${f(y - 58 * s)}L${f(x + 5 * s)} ${f(y - 31 * s)}Z" fill="#e2a93b"/>`;
      for (let i = 1; i < 7; i++) g += `<path d="M${f(x - (5 - i * .65) * s)} ${f(y - (31 + i * 3.6) * s)}H${f(x + (5 - i * .65) * s)}" stroke="#a97a1c" stroke-width="${f(.7 * s)}"/>`;
      return g + `<circle cx="${f(x)}" cy="${f(y - 59.5 * s)}" r="${f(1.8 * s)}" fill="#e2a93b"/>`;
    },
    flags(o) {
      const cs = ['#2f6fdb', '#f4f4f4', '#d6382c', '#2e9c58', '#f2c230'];
      let s = `<path d="M${o.x1} ${o.y1}Q${f((o.x1 + o.x2) / 2)} ${f((o.y1 + o.y2) / 2 + 14)} ${o.x2} ${o.y2}" stroke="#222" stroke-opacity=".5" fill="none"/>`;
      for (let i = 0; i < 10; i++) {
        const t = (i + .5) / 10, x = o.x1 + (o.x2 - o.x1) * t, y = o.y1 + (o.y2 - o.y1) * t + 14 * 2 * t * (1 - t) * .98 + 1;
        s += `<rect class="flag" x="${f(x - 3)}" y="${f(y)}" width="6" height="8" fill="${cs[i % 5]}"/>`;
      }
      return s;
    },
    boat(o) {
      const x = o.x, y = o.y, s = o.s, c = o.c || '#2b1d1a';
      return `<path d="M${f(x - 24 * s)} ${f(y - 6 * s)}Q${x} ${f(y + 9 * s)} ${f(x + 24 * s)} ${f(y - 8 * s)}Q${x} ${f(y - 2 * s)} ${f(x - 24 * s)} ${f(y - 6 * s)}Z" fill="${c}"/>` +
        `<path d="M${f(x - 9 * s)} ${f(y - 5 * s)}Q${f(x + 2 * s)} ${f(y - 20 * s)} ${f(x + 12 * s)} ${f(y - 6 * s)}Z" fill="${o.roof || '#e4572e'}"/>` +
        `<path d="M${f(x - 28 * s)} ${f(y + 5 * s)}h${f(18 * s)}M${f(x + 6 * s)} ${f(y + 8 * s)}h${f(22 * s)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>`;
    },
    houseboat(o) {
      const x = o.x, y = o.y, s = o.s;
      return `<path d="M${f(x - 34 * s)} ${f(y - 8 * s)}H${f(x + 34 * s)}L${f(x + 28 * s)} ${y}H${f(x - 28 * s)}Z" fill="#3a2a22"/>` +
        `<path d="M${f(x - 30 * s)} ${f(y - 8 * s)}V${f(y - 16 * s)}H${f(x + 30 * s)}V${f(y - 8 * s)}Z" fill="#f0e2c4"/>` +
        `<path d="M${f(x - 34 * s)} ${f(y - 16 * s)}Q${x} ${f(y - 30 * s)} ${f(x + 34 * s)} ${f(y - 16 * s)}Z" fill="#9c5a2c"/>` +
        [-20, -8, 4, 16].map((d) => `<rect x="${f(x + d * s)}" y="${f(y - 14 * s)}" width="${f(6 * s)}" height="${f(4 * s)}" fill="#ffcf70"/>`).join('') +
        `<path d="M${f(x - 36 * s)} ${f(y + 4 * s)}h${f(24 * s)}M${f(x + 10 * s)} ${f(y + 6 * s)}h${f(28 * s)}" stroke="#fff" stroke-opacity=".35" stroke-width="1.2"/>`;
    },
    lighthouse(o) {
      const x = o.x, y = o.y, s = o.s; let g = '';
      for (let i = 0; i < 4; i++) {
        const y0 = y - i * 9 * s, y1 = y - (i + 1) * 9 * s, w0 = (7 - i * .9) * s, w1 = (7 - (i + 1) * .9) * s;
        g += `<path d="M${f(x - w0)} ${f(y0)}L${f(x - w1)} ${f(y1)}H${f(x + w1)}L${f(x + w0)} ${f(y0)}Z" fill="${i % 2 ? '#c8372d' : '#f4f1ea'}"/>`;
      }
      const t = y - 36 * s;
      return g + `<rect x="${f(x - 4.5 * s)}" y="${f(t - 6 * s)}" width="${f(9 * s)}" height="${f(6 * s)}" fill="#ffe9a0"/><path d="M${f(x - 6 * s)} ${f(t - 6 * s)}L${x} ${f(t - 12 * s)}L${f(x + 6 * s)} ${f(t - 6 * s)}Z" fill="#c8372d"/>` +
        `<path d="M${x} ${f(t - 3 * s)}L${f(x + 90 * s)} ${f(t - 14 * s)}V${f(t + 8 * s)}Z" fill="#ffe9a0" opacity=".28"/>`;
    },
    water(o, m, r) {
      const id = 'w' + (++uid), c = m.water; let s = '';
      s += `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect x="0" y="${o.y}" width="${W}" height="${H - o.y}" fill="url(#${id})"/>`;
      const sx = m.sun[1];
      for (let i = 0; i < 6; i++) s += `<rect x="${f(sx - 14 + i * 3)}" y="${f(o.y + 4 + i * 9)}" width="${f(26 - i * 3.5)}" height="1.8" fill="#fff" opacity=".4"/>`;
      for (let i = 0; i < 18; i++) { const x = r() * W, y = o.y + 6 + r() * (H - o.y - 10); s += `<rect x="${f(x)}" y="${f(y)}" width="${f(10 + r() * 22)}" height="1.4" fill="#fff" opacity="${f(.12 + r() * .18)}"/>`; }
      return s;
    },
    steps(o, m) {
      let s = '';
      for (let i = 0; i < o.k; i++) s += `<rect x="${o.x0}" y="${f(o.y0 + i * o.dy)}" width="${f(o.x1 - o.x0 - i * (o.shrink || 0))}" height="${f(o.dy + .5)}" fill="${i % 2 ? o.c1 : o.c2}"/>`;
      return s;
    },
    houses(o, m, r) {
      let s = '';
      for (let i = 0; i < o.n; i++) {
        const t = i / (o.n - 1), x = o.x0 + (o.x1 - o.x0) * t, y = o.y0 + (o.y1 - o.y0) * t, z = 11 + r() * 8;
        s += `<rect x="${f(x)}" y="${f(y - z)}" width="${f(z * 1.3)}" height="${f(z)}" fill="#f1dcc0"/><path d="M${f(x - 2)} ${f(y - z)}L${f(x + z * .65)} ${f(y - z * 1.6)}L${f(x + z * 1.3 + 2)} ${f(y - z)}Z" fill="#b8412e"/><rect x="${f(x + z * .3)}" y="${f(y - z * .7)}" width="${f(z * .28)}" height="${f(z * .3)}" fill="#ffcf70"/>`;
      }
      return s;
    },
    cable(o) {
      let s = `<path d="M0 ${o.y0}L${W} ${o.y1}" stroke="#2a2f3a" stroke-width="1.5"/>`;
      [.28, .62].forEach((t) => { const x = W * t, y = o.y0 + (o.y1 - o.y0) * t; s += `<path d="M${f(x)} ${f(y)}v12" stroke="#2a2f3a"/><rect x="${f(x - 7)}" y="${f(y + 12)}" width="14" height="11" rx="2" fill="#d6382c"/><rect x="${f(x - 5)}" y="${f(y + 14)}" width="10" height="4" fill="#cfe9ff"/>`; });
      return s + [[70, 95], [330, 70]].map(([x, y]) => `<path d="M${x} ${H}V${y}" stroke="#2a2f3a" stroke-width="2.5"/>`).join('');
    },
    bridge(o) {
      const y = o.y, x0 = o.x0, x1 = o.x1;
      return `<path d="M${x0} ${y}H${x1}" stroke="#2c2a26" stroke-width="3"/><path d="M${x0 + 10} ${y}V${y - 34}M${x1 - 10} ${y}V${y - 34}" stroke="#2c2a26" stroke-width="3"/>` +
        `<path d="M${x0} ${y - 6}Q${f((x0 + x1) / 2)} ${y + 6} ${x1} ${y - 6}" stroke="#2c2a26" fill="none"/><path d="M${x0 + 10} ${y - 34}Q${f((x0 + x1) / 2)} ${y - 4} ${x1 - 10} ${y - 34}" stroke="#2c2a26" fill="none"/>`;
    },
    nets(o) {
      let s = '';
      o.at.forEach(([x, y, z]) => {
        s += `<path d="M${x} ${y}L${f(x + 34 * z)} ${f(y - 46 * z)}" stroke="#241b18" stroke-width="2.2"/><path d="M${x + 6 * z} ${y}L${f(x + 34 * z)} ${f(y - 46 * z)}" stroke="#241b18"/>` +
          `<path d="M${f(x + 34 * z)} ${f(y - 46 * z)}L${f(x + 6 * z)} ${f(y - 18 * z)}L${f(x + 56 * z)} ${f(y - 20 * z)}Z" fill="#241b18" fill-opacity=".25" stroke="#241b18"/>` +
          `<path d="M${f(x + 20 * z)} ${f(y - 30 * z)}L${f(x + 31 * z)} ${f(y - 19 * z)}M${f(x + 42 * z)} ${f(y - 32 * z)}L${f(x + 38 * z)} ${f(y - 19 * z)}" stroke="#241b18" stroke-opacity=".6"/>`;
      });
      return s;
    },
    arch(o) {
      const id = 'a' + (++uid), x = o.x, y = o.y, s = o.s;
      return `<defs><radialGradient id="${id}"><stop offset="0" stop-color="#ffd27a"/><stop offset="1" stop-color="#7a2f1c"/></radialGradient></defs>` +
        `<path d="M${f(x - 18 * s)} ${y}V${f(y - 22 * s)}Q${x} ${f(y - 46 * s)} ${f(x + 18 * s)} ${f(y - 22 * s)}V${y}Z" fill="url(#${id})"/><path d="M${f(x - 18 * s)} ${y}V${f(y - 22 * s)}Q${x} ${f(y - 46 * s)} ${f(x + 18 * s)} ${f(y - 22 * s)}V${y}" fill="none" stroke="#1a0f12" stroke-width="${f(3 * s)}"/>`;
    },
    lights(o, m, r) {
      let s = '';
      const pts = o.path;
      for (let i = 0; i < o.n; i++) {
        let x, y;
        if (pts) { const t = i / (o.n - 1) * (pts.length - 1), k = Math.min(Math.floor(t), pts.length - 2), u = t - k; x = pts[k][0] + (pts[k + 1][0] - pts[k][0]) * u; y = pts[k][1] + (pts[k + 1][1] - pts[k][1]) * u; }
        else { x = o.box[0] + (o.box[1] - o.box[0]) * r(); y = o.box[2] + (o.box[3] - o.box[2]) * r(); }
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="3.6" fill="${o.c}" opacity=".25"/><circle cx="${f(x)}" cy="${f(y)}" r="1.4" fill="${o.c}"/>`;
      }
      return s;
    },
    mist(o) {
      const id = 'm' + (++uid);
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="${o.a || .5}"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><rect x="0" y="${o.y}" width="${W}" height="${o.h}" fill="url(#${id})"/>`;
    },
    meadow(o, m, r) {
      let s = '';
      for (let i = 0; i < o.n; i++) s += `<circle cx="${f(r() * W)}" cy="${f(o.y0 + (o.y1 - o.y0) * r())}" r="1.6" fill="${o.c}"/>`;
      return s;
    },
  };

  /* shorthand layer helpers */
  const pk = (n, base, h, c, snow) => ['peaks', { n, base, h, c, snow }];
  const hl = (base, amp, c, f2, ph, extra) => ['hills', Object.assign({ base, amp, c, f: f2, ph }, extra || {})];
  const pn = (n, x0, x1, y0, y1, s, c) => ['pines', { n, x0, x1, y0, y1, s, c }];

  const SCENES = {
    hero: { mood: 'dawn', layers: [pk(4, 150, 120, 'far', 1), pk(3, 175, 90, 'mid', 1), hl(190, 10, 'near', .018, 1), ['water', { y: 188 }], ['boat', { x: 250, y: 218, s: 1.3 }], pn(14, 0, 130, 205, 255, 26, '#14213f'), ['palms', { c: '#0f1a33', at: [[345, 250, 70], [378, 255, 58]] }]] },
    katra: { mood: 'dusk', layers: [pk(5, 190, 110, 'far'), pk(4, 215, 100, 'mid'), ['mount', { x: 255, y: 90, w: 270, c: 'near' }], ['temple', { x: 255, y: 98, s: .55, col: '#ffd9a0', dark: '#241a45' }], ['lights', { n: 18, path: [[255, 104], [232, 140], [276, 172], [226, 212], [262, 246]], c: '#ffd27a' }], hl(240, 8, 'near', .02, 2), ['lights', { n: 16, box: [10, 190, 232, 256], c: '#ffd27a' }]] },
    shivkhori: { mood: 'mist', layers: [pk(4, 160, 100, 'far'), hl(185, 14, 'mid', .014, 1), ['mount', { x: 215, y: 110, w: 330, c: 'near' }], ['arch', { x: 215, y: 232, s: 1.35 }], pn(16, 0, 400, 215, 256, 24, '#1f4744'), ['mist', { y: 150, h: 60, a: .55 }]] },
    patnitop: { mood: 'day', layers: [pk(4, 140, 90, 'far', 1), hl(172, 16, '#5f9a73', .016, 2), pn(20, 0, 400, 196, 230, 22, '#2c6b50'), hl(232, 10, '#3f8a5f', .02, 4), pn(10, 0, 400, 240, 258, 30, '#1f5a42')] },
    pahalgam: { mood: 'day', layers: [pk(5, 150, 110, 'far', 1), hl(178, 12, '#6aa57a', .015, 1), pn(18, 0, 400, 195, 225, 24, '#2c6b50'), ['water', { y: 222 }], pn(8, 250, 400, 238, 258, 34, '#1f5a42'), hl(250, 6, '#3f8a5f', .03, 5)] },
    srinagar: { mood: 'dawn', layers: [pk(5, 140, 100, 'far', 1), hl(165, 14, 'mid', .016, 3), ['water', { y: 168 }], ['houseboat', { x: 118, y: 205, s: 1.15 }], ['boat', { x: 275, y: 222, s: 1.4, c: '#241a1c', roof: '#f2b84a' }], pn(10, 330, 400, 168, 200, 28, '#14213f'), hl(255, 6, 'near', .02, 1)] },
    gulmarg: { mood: 'day', layers: [pk(4, 125, 85, 'far', 1), ['hills', { base: 160, amp: 22, c: '#f1f7ff', f: .013, ph: 1 }], ['hills', { base: 205, amp: 18, c: '#dcebfa', f: .017, ph: 3 }], ['cable', { y0: 40, y1: 118 }], pn(22, 0, 400, 200, 250, 22, '#27604b'), ['hills', { base: 250, amp: 6, c: '#fff', f: .02, ph: 2 }]] },
    sonmarg: { mood: 'day', layers: [pk(4, 150, 120, 'far', 1), pk(3, 175, 80, 'mid', 1), hl(195, 14, '#bdb64a', .016, 1), ['meadow', { n: 60, y0: 200, y1: 250, c: '#f3e27a' }], ['water', { y: 228 }], hl(256, 5, '#9a9f3a', .02, 3)] },
    shimla: { mood: 'dusk', layers: [pk(4, 150, 80, 'far'), hl(150, 20, 'mid', .014, 1), ['houses', { n: 9, x0: 30, x1: 330, y0: 190, y1: 140 }], pn(16, 0, 400, 205, 250, 24, '#1a1534'), hl(255, 8, 'near', .02, 1), ['lights', { n: 10, box: [30, 340, 130, 200], c: '#ffd27a' }]] },
    manali: { mood: 'day', layers: [pk(4, 175, 150, 'far', 1), pk(3, 195, 105, 'mid', 1), pn(26, 0, 400, 205, 250, 24, '#2b6a52'), hl(240, 9, '#3f8a5f', .02, 2), pn(8, 0, 400, 245, 258, 34, '#1d5240')] },
    dalhousie: { mood: 'mist', layers: [hl(120, 26, 'far', .012, 1), ['mist', { y: 110, h: 50, a: .5 }], hl(165, 22, 'mid', .014, 2), pn(16, 0, 400, 175, 215, 24, '#386a63'), ['mist', { y: 185, h: 40, a: .45 }], hl(240, 10, 'near', .02, 3), pn(10, 0, 400, 235, 258, 36, '#27504b')] },
    dharamshala: { mood: 'day', layers: [pk(4, 165, 140, 'far', 1), hl(182, 14, '#6e9fb8', .016, 1), ['stupa', { x: 135, y: 218, s: .75 }], ['flags', { x1: 60, y1: 170, x2: 135, y2: 168 }], pn(18, 0, 400, 215, 250, 24, '#2c6b50'), hl(250, 7, '#3f8a5f', .02, 1)] },
    amritsar: { mood: 'dusk', layers: [hl(170, 4, 'far', .02, 0), ['water', { y: 188 }], ['dome', { x: 200, y: 188, s: 2 }], hl(256, 5, 'near', .03, 1)] },
    cochin: { mood: 'dusk', layers: [['water', { y: 150 }], ['nets', { at: [[40, 175, 1.1], [190, 180, 1.2], [300, 170, .95]] }], ['boat', { x: 120, y: 218, s: 1.1, c: '#18102e', roof: '#f08a5a' }], ['palms', { c: '#120c26', at: [[370, 256, 64]] }], hl(256, 6, 'near', .03, 1)] },
    munnar: { mood: 'mist', layers: [hl(110, 26, 'far', .012, 1), ['hills', { base: 150, amp: 22, c: '#4f9a62', f: .015, ph: 2, rows: 4, row: '#e5ffe0' }], ['hills', { base: 195, amp: 20, c: '#3b8650', f: .018, ph: 4, rows: 5, row: '#e5ffe0' }], ['hills', { base: 240, amp: 14, c: '#2b6e41', f: .02, ph: 1, rows: 2, row: '#e5ffe0' }], ['mist', { y: 130, h: 50, a: .45 }]] },
    thekkady: { mood: 'mist', layers: [hl(130, 24, 'far', .013, 2), ['mist', { y: 120, h: 50, a: .5 }], pn(20, 0, 400, 190, 230, 26, '#2f6a56'), ['palms', { c: '#1b4a3b', at: [[60, 250, 80], [190, 255, 90], [330, 252, 78]] }], pn(10, 0, 400, 240, 258, 30, '#17402f')] },
    alleppey: { mood: 'gold', layers: [hl(150, 6, '#7d8f3d', .02, 1), ['water', { y: 158 }], ['houseboat', { x: 215, y: 214, s: 1.5 }], ['palms', { c: '#2b3a15', at: [[40, 190, 84], [90, 196, 70], [360, 192, 90]] }], hl(258, 4, '#4f6a22', .03, 1)] },
    kovalam: { mood: 'dusk', layers: [['water', { y: 135 }], ['hills', { base: 190, amp: 10, c: '#d9a066', f: .014, ph: 1 }], ['lighthouse', { x: 105, y: 190, s: 1.5 }], ['palms', { c: '#120c26', at: [[320, 240, 90], [352, 246, 70]] }], hl(250, 8, '#e3b27a', .02, 3)] },
    varanasi: { mood: 'dawn', layers: [hl(140, 3, 'far', .02, 0), ['temple', { x: 90, y: 150, s: 1.1, col: '#e9c79a', dark: '#33407a' }], ['temple', { x: 170, y: 156, s: .8, col: '#d9a878', dark: '#33407a' }], ['steps', { x0: 0, x1: 330, y0: 150, k: 7, dy: 6, shrink: 6, c1: '#c89a72', c2: '#b88862' }], ['water', { y: 192 }], ['boat', { x: 270, y: 224, s: 1.4, c: '#2a1a20', roof: '#f2b84a' }], ['lights', { n: 10, box: [60, 330, 200, 250], c: '#ffb44a' }]] },
    jomsom: { mood: 'gold', layers: [pk(4, 130, 110, 'far', 1), pk(4, 185, 100, '#9a6a3c'), hl(200, 16, '#7a5230', .016, 2), ['flags', { x1: 50, y1: 160, x2: 180, y2: 150 }], ['water', { y: 236 }], hl(256, 4, '#5a3a22', .03, 3)] },
    ayodhya: { mood: 'dusk', layers: [hl(150, 4, 'far', .02, 0), ['temple', { x: 200, y: 168, s: 2.1, col: '#f6d9a8', dark: '#241a45' }], ['steps', { x0: 40, x1: 360, y0: 168, k: 4, dy: 5, shrink: 0, c1: '#c9a47a', c2: '#b8926a' }], ['water', { y: 192 }], ['lights', { n: 16, box: [30, 370, 200, 252], c: '#ffb44a' }]] },
    kathmandu: { mood: 'night', layers: [pk(4, 150, 100, 'far', 1), hl(172, 8, 'mid', .02, 1), ['stupa', { x: 200, y: 215, s: 2.2 }], ['flags', { x1: 20, y1: 90, x2: 200, y2: 86 }], ['flags', { x1: 200, y1: 86, x2: 380, y2: 100 }], hl(250, 7, 'near', .02, 2), ['lights', { n: 14, box: [10, 390, 220, 256], c: '#ffd27a' }]] },
    janakpur: { mood: 'day', layers: [hl(160, 3, '#7aa86a', .02, 0), ['temple', { x: 200, y: 170, s: 2, col: '#fbf1e0', dark: '#3c97dc' }], ['steps', { x0: 40, x1: 360, y0: 170, k: 4, dy: 5, c1: '#e8d9bf', c2: '#d9c7a6' }], ['water', { y: 192 }], ['palms', { c: '#2b5a2b', at: [[40, 200, 70], [368, 200, 76]] }]] },
    pokhara: { mood: 'dawn', layers: [pk(5, 150, 120, 'far', 1), hl(166, 12, 'mid', .017, 1), ['water', { y: 170 }], ['boat', { x: 160, y: 214, s: 1.5, c: '#2b1d3a', roof: '#f2b84a' }], pn(12, 300, 400, 170, 206, 26, '#14213f'), hl(256, 6, 'near', .02, 4)] },
    haridwar: { mood: 'night', layers: [hl(140, 6, 'far', .02, 0), ['temple', { x: 300, y: 158, s: 1.3, col: '#c9a56d', dark: '#050a1e' }], ['steps', { x0: 0, x1: 400, y0: 158, k: 6, dy: 5, shrink: 14, c1: '#2b3a73', c2: '#243263' }], ['water', { y: 192 }], ['lights', { n: 34, box: [10, 390, 196, 254], c: '#ffb44a' }]] },
    guptkashi: { mood: 'day', layers: [pk(4, 160, 130, 'far', 1), hl(184, 14, '#6aa57a', .016, 2), ['temple', { x: 215, y: 214, s: 1.4, col: '#ead7b4', dark: '#3c97dc' }], pn(18, 0, 400, 222, 254, 22, '#2c6b50'), hl(255, 6, '#3f8a5f', .02, 1)] },
    kedarnath: { mood: 'mist', layers: [pk(3, 175, 150, '#b9c9d6', 1), ['mount', { x: 250, y: 60, w: 330, c: '#8da3b5' }], ['hills', { base: 210, amp: 8, c: '#a9a396', f: .02, ph: 2 }], ['temple', { x: 190, y: 220, s: .95, col: '#cfc6b8', dark: '#222' }], ['flags', { x1: 60, y1: 214, x2: 160, y2: 206 }], hl(252, 5, '#8c8578', .03, 1)] },
    badrinath: { mood: 'dusk', layers: [pk(4, 175, 150, 'far', 1), pk(3, 205, 90, 'mid'), ['temple', { x: 200, y: 218, s: 1.6, col: '#f08a5a', dark: '#241a45' }], ['water', { y: 232 }], hl(256, 5, 'near', .03, 1)] },
    rishikesh: { mood: 'day', layers: [hl(120, 26, 'far', .012, 1), hl(165, 20, '#5f9a73', .014, 2), pn(16, 0, 400, 180, 215, 24, '#2c6b50'), ['bridge', { y: 188, x0: 40, x1: 360 }], ['water', { y: 214 }], hl(256, 6, '#3f8a5f', .03, 2)] },
  };

  function art(kind) {
    const spec = SCENES[kind] || SCENES.hero, m = MOODS[spec.mood], r = rng(hash(kind)), id = 's' + (++uid);
    let s = `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${m.sky[0]}"/><stop offset="1" stop-color="${m.sky[1]}"/></linearGradient><radialGradient id="${id}g"><stop offset="0" stop-color="${m.sun[0]}" stop-opacity=".9"/><stop offset="1" stop-color="${m.sun[0]}" stop-opacity="0"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
    if (m.stars) for (let i = 0; i < 46; i++) s += `<circle cx="${f(r() * W)}" cy="${f(r() * 120)}" r="${f(.5 + r() * 1.1)}" fill="#fff" opacity="${f(.4 + r() * .6)}"/>`;
    s += `<circle cx="${m.sun[1]}" cy="${m.sun[2]}" r="${m.sun[3] * 2.6}" fill="url(#${id}g)"/><circle cx="${m.sun[1]}" cy="${m.sun[2]}" r="${m.sun[3]}" fill="${m.sun[0]}"/>`;
    spec.layers.forEach(([k, o]) => { s += P[k](o, m, r); });
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true" focusable="false">${s}</svg>`;
  }

  window.WL_ART = art;
  window.WL_ART_KINDS = Object.keys(SCENES);
})();
