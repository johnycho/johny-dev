(function () {
  const $ = (id) => document.getElementById(id);
  const wOf = (t, han, lat) => [...String(t)].reduce((a, ch) => a + (ch.charCodeAt(0) > 0x1100 ? han : lat), 0);

  /* ---------- 배치(viewBox 600 x 380) ---------- */
  const BR = { x: 4, y: 160, w: 64, h: 56 };          // 브라우저
  const ALB = { x: 84, y: 120, w: 96, h: 136 };       // ALB
  const TGX = 206, TGW = 96;                          // 타깃 그룹
  const COLX = [324, 388, 452, 516], TW = 58, TH = 46;
  const CX = COLX.map(x => x + TW / 2);               // 353, 417, 481, 545
  const RY = { A: 100, B: 230 };
  const MIDY = 188, BUSA = 88, BUSB = 290, BUSX = 313;
  const GX = 84, GW = 492, GY = 330;                  // 비율 게이지

  /* ---------- 그리기 ---------- */
  // 컴포넌트는 자기 중심 기준으로 S배 줄여 그린다(배치는 그대로, 상자 사이 여백이 넓어진다).
  const S = 0.85;
  const sc = (cx, cy, inner) => `<g transform="translate(${cx} ${cy}) scale(${S}) translate(${-cx} ${-cy})">${inner}</g>`;
  // 줄인 상자의 가장자리
  const TA_TOP = 103.5, TA_BOT = 142.5, TB_TOP = 233.5, TB_BOT = 272.5;
  const T = (x, y, txt, cls, anchor, extra) => `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor || 'middle'}" ${extra || ''}>${txt}</text>`;
  const halo = (id, x, y, w, h) => `<rect id="${id}-h" class="halo" x="${x - 4}" y="${y - 4}" width="${w + 8}" height="${h + 8}" rx="9" style="opacity:0"/>`;
  // 제목과 보조 문구가 있는 상자. subs가 배열이면 겹쳐 두고 하나만 보인다(id-s0, id-s1 ...).
  function nb(id, x, y, w, h, title, sub, o) {
    o = o || {};
    const cx = x + w / 2, subs = Array.isArray(sub) ? sub : (sub ? [[sub, '']] : []);
    const ty = subs.length ? y + h / 2 - 3 : y + h / 2 + 4.5;
    return `<g ${o.fade ? 'class="fade"' : ''}>${sc(cx, y + h / 2, `${halo(id, x, y, w, h)}
      <rect class="nb-r ${o.cls || ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
      ${o.bad ? `<rect id="${id}-bad" class="nb-r bad" x="${x}" y="${y}" width="${w}" height="${h}" rx="6" style="opacity:0"/>` : ''}
      ${T(cx, ty, title, 'nb-t ' + (o.tcls || ''))}
      ${subs.map((s, i) => T(cx, ty + 16, s[0], 'nb-s ' + (s[1] || ''), 'middle', `id="${id}-s${i}" ${i ? 'style="opacity:0"' : ''}`)).join('')}`)}</g>`;
  }
  function badge(id, cls, x, y, txt, anchor, vis) {
    const w = Math.round(wOf(txt, 12.5, 7.4) + 18);
    const x0 = anchor === 'r' ? x - w : anchor === 'l' ? x : x - w / 2;
    return `<g id="${id}" ${vis ? '' : 'style="opacity:0"'}>${sc(x0 + w / 2, y + 10.5, `<rect class="bd ${cls}" x="${x0}" y="${y}" width="${w}" height="21" rx="10.5"/>
      ${T(x0 + w / 2, y + 14.6, txt, 'bd-t ' + cls)}`)}</g>`;
  }
  function browser(p, page, order) {
    const { x, y, w, h } = BR;
    return `<g>${sc(x + w / 2, y + h / 2, `${halo(p + '-br', x, y, w, h)}
      <rect class="nb-r" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>
      <line class="brw-bar" x1="${x}" y1="${y + 11}" x2="${x + w}" y2="${y + 11}"/>
      <circle class="brw-dot" cx="${x + 7}" cy="${y + 5.5}" r="2"/><circle class="brw-dot" cx="${x + 14}" cy="${y + 5.5}" r="2"/><circle class="brw-dot" cx="${x + 21}" cy="${y + 5.5}" r="2"/>
      <g id="${p}-page" style="opacity:${page ? 1 : 0}"><rect class="pg1" x="${x + 8}" y="${y + 18}" width="${w - 16}" height="8" rx="2"/>
        <rect class="pg2" x="${x + 8}" y="${y + 31}" width="34" height="6" rx="2"/><rect class="pg2" x="${x + 8}" y="${y + 41}" width="44" height="6" rx="2"/></g>
      ${order ? `<g id="${p}-ord" style="opacity:0"><rect class="bd ok" x="${x + 4}" y="${y + 28}" width="${w - 8}" height="20" rx="4"/>${T(x + w / 2, y + 42, '주문 목록', 'bd-t ok')}</g>` : ''}
      ${T(x + w / 2, y + h + 16, '브라우저', 'lbl')}`)}</g>`;
  }
  function tag(id, x, y, w, txt) {
    return `<rect class="tag" x="${x}" y="${y}" width="${w}" height="26" rx="4"/>${T(x + w / 2, y + 17, txt, 'tag-t')}
      <rect id="${id}-f" class="tag-f" x="${x - 2}" y="${y - 2}" width="${w + 4}" height="30" rx="5" style="opacity:0"/>`;
  }
  function alb(p, mode, test, fade) {
    const { x, y, w, h } = ALB;
    let s = `${halo(p + '-alb', x, y, w, h)}<rect class="nb-r" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
      ${T(x + w / 2, y + 22, 'ALB', 'nb-t')}`;
    if (mode === 'bg') {
      s += tag(p + '-Lp', x + 4, 150, w - 8, '운영 리스너');
      if (test) s += tag(p + '-Lt', x + 4, 200, w - 8, '테스트 리스너');
    } else s += tag(p + '-Lp', x + 4, 175, w - 8, '리스너 :443');
    return `<g ${fade ? 'class="fade"' : ''}>${sc(x + w / 2, y + h / 2, s)}</g>`;
  }
  function tgBox(p, mode, fade) {
    if (mode === 'bg') return nb(p + '-tgb', TGX, RY.A, TGW, TH, '블루', '타깃 그룹', { tcls: 'v1', cls: 'v1' }) +
      nb(p + '-tgg', TGX, RY.B, TGW, TH, '그린', '타깃 그룹', { tcls: 'v2', cls: 'v2' });
    return nb(p + '-tg', TGX, 162, TGW, 52, '타깃 그룹', 'order-api', { fade });
  }
  function lines(mode, test) {
    let s = `<path class="ln" d="M63 188H91"/>`;
    if (mode === 'bg') {
      s += `<path class="bus" d="M295 123H${BUSX}V${BUSA}H${CX[3]}"/><path class="bus" d="M295 253H${BUSX}V${BUSB}H${CX[3]}"/>`;
      if (test) s += `<path class="ln dash" d="M169 209H199V253H213"/>`;
    } else s += `<path class="ln" d="M173 188H213"/><path class="bus" d="M295 188H${CX[3]}"/>`;
    return s;
  }
  const stubD = (mode, row, c) => mode === 'bg'
    ? (row === 'A' ? `M${CX[c]} ${BUSA}V${TA_TOP}` : `M${CX[c]} ${BUSB}V${TB_BOT}`)
    : (row === 'A' ? `M${CX[c]} ${MIDY}V${TA_BOT}` : `M${CX[c]} ${MIDY}V${TB_TOP}`);
  const stub = (p, mode, row, c, cls, on, sfx) => `<path id="${p}-s${row}${c}${sfx || ''}" class="stub ${cls}" d="${stubD(mode, row, c)}" style="opacity:${on ? 1 : 0}"/>`;

  const LY = (k, cls, ver, txt) => ({ k, cls, ver, txt });
  function tgt(p, row, c, layers, init, hidden, extra) {
    const id = `${p}-${row}${c}`, x = COLX[c], y = RY[row], cx = CX[c];
    return `<g id="${id}" class="pop" ${hidden ? 'style="opacity:0"' : ''}>${sc(cx, y + TH / 2, `${halo(id, x, y, TW, TH)}
      ${layers.map(l => `<g id="${id}-${l.k}" style="opacity:${l.k === init ? 1 : 0}"><rect class="tb ${l.cls}" x="${x}" y="${y}" width="${TW}" height="${TH}" rx="6"/>
        ${T(cx, y + 20, l.ver, 'tv ' + l.cls)}${T(cx, y + 37, l.txt, 'ts ' + l.cls, 'middle', `id="${id}-${l.k}-s"`)}</g>`).join('')}
      ${extra || ''}`)}</g>`;
  }
  const pool = (p, n) => Array.from({ length: n }, (_, i) => `<circle id="${p}-q${i}" class="q" r="5.5" cx="0" cy="0" style="opacity:0"/>`).join('');
  const dot = (id, cls, r) => `<circle id="${id}" class="${cls}" r="${r || 5.5}" cx="0" cy="0" style="opacity:0"/>`;
  const hcDots = (p, rows) => rows.map(row => [0, 1, 2, 3].map(c => dot(`${p}-pg${row}${c}`, 'hc', 3.8)).join('')).join('');
  function gauge(p, steps) {
    let s = `<rect class="g-green" x="${GX}" y="${GY + 1.5}" width="${GW}" height="17" rx="3"/>
      <rect id="${p}-gb" class="g-blue" x="${GX}" y="${GY + 1.5}" width="${GW}" height="17"/>`;
    for (let i = 1; i < 10; i++) s += `<line class="g-tick" x1="${GX + GW * i / 10}" y1="${GY + 1.5}" x2="${GX + GW * i / 10}" y2="${GY + 18.5}"/>`;
    s += steps.map((v, i) => T(GX, GY - 8, `블루 ${100 - v}%`, 'g-t v1', 'start', `id="${p}-lb${v}" ${i ? 'style="opacity:0"' : ''}`) +
      T(GX + GW, GY - 8, `그린 ${v}%`, 'g-t v2', 'end', `id="${p}-lg${v}" ${i ? 'style="opacity:0"' : ''}`)).join('');
    return s + sc(GX + GW / 2, GY + 38, T(GX + GW / 2, GY + 38, '운영 리스너의 트래픽 비율', 'mut'));
  }
  function svgWrap(aria, body) {
    return `<svg class="sv" viewBox="0 0 600 380" role="img" aria-label="${aria}">${body}</svg>`;
  }

  /* ---------- 경로 ---------- */
  const rOne = (row, c) => [[63, 188], [132, 188], [254, 188], [CX[c], 188], [CX[c], row === 'A' ? TA_BOT : TB_TOP]];
  const rBlue = (c) => [[63, 188], [132, 188], [132, 167], [193, 167], [193, 123], [254, 123], [BUSX, 123], [BUSX, BUSA], [CX[c], BUSA], [CX[c], TA_TOP]];
  const rGreen = (c) => [[63, 188], [132, 188], [132, 167], [193, 167], [193, 253], [254, 253], [BUSX, 253], [BUSX, BUSB], [CX[c], BUSB], [CX[c], TB_BOT]];
  const rTest = (c) => [[132, 209], [199, 209], [199, 253], [254, 253], [BUSX, 253], [BUSX, BUSB], [CX[c], BUSB], [CX[c], TB_BOT]];
  const hcRoute = (mode, row, c) => mode === 'bg'
    ? (row === 'A' ? rBlue(c).slice(5) : rGreen(c).slice(5))
    : rOne(row, c).slice(2);

  /* ---------- 움직임(모든 시각은 타임라인 절대 시각, ms) ---------- */
  const op = (tl, sel, a, b, t, d) => tl.add({ targets: sel, opacity: [a, b], duration: d || 300, easing: 'linear' }, t);
  const show = (tl, sel, t, d) => op(tl, sel, 0, 1, t, d);
  const hide = (tl, sel, t, d) => op(tl, sel, 1, 0, t, d);
  const pop = (tl, sel, t) => tl.add({ targets: sel, opacity: [0, 1], scale: [0.3, 1], duration: 600, easing: 'easeOutBack' }, t);
  const sw = (tl, id, a, b, t, d) => { hide(tl, `#${id}-${a}`, t, d || 350); show(tl, `#${id}-${b}`, t, d || 350); };
  const pulse = (tl, id, t) => tl.add({ targets: `#${id}-h`, opacity: [{ value: [0, 1], duration: 180 }, { value: 0, duration: 520 }], easing: 'easeOutQuad' }, t);
  const flash = (tl, id, t) => tl.add({ targets: `#${id}-f`, opacity: [{ value: [0, 1], duration: 180 }, { value: 1, duration: 500 }, { value: 0, duration: 400 }], easing: 'linear' }, t);
  function segs(pts) {
    const out = []; let L = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (d > 0.1) { out.push([pts[i], d]); L += d; }
    }
    return { out, L };
  }
  // 점(circle)을 꺾은선 경로로 보낸다. 끝 시각을 돌려준다.
  function fly(tl, id, pts, t, speed) {
    const { out, L } = segs(pts);
    const dur = Math.max(450, Math.round(L / (speed || 0.3)));
    const kf = (ax) => out.map(([pt, d], i) => ({ value: i ? pt[ax] : [pts[0][ax], pt[ax]], duration: Math.max(1, Math.round(dur * d / L)) }));
    tl.add({ targets: '#' + id, cx: kf(0), cy: kf(1), easing: out.length > 1 ? 'linear' : 'easeInOutSine',
      opacity: [{ value: [0, 1], duration: 120 }, { value: 1, duration: dur - 240 }, { value: 0, duration: 120 }] }, t);
    return t + dur;
  }
  // 글자 딱지(g, 원점 기준)를 꺾은선 경로로 보낸다.
  function flyG(tl, id, pts, t, speed, keep) {
    const { out, L } = segs(pts);
    const dur = Math.max(450, Math.round(L / (speed || 0.25)));
    const kf = (ax) => out.map(([pt, d], i) => ({ value: i ? pt[ax] : [pts[0][ax], pt[ax]], duration: Math.max(1, Math.round(dur * d / L)) }));
    tl.add({ targets: '#' + id, translateX: kf(0), translateY: kf(1), easing: out.length > 1 ? 'linear' : 'easeInOutSine',
      opacity: keep ? [{ value: [0, 1], duration: 150 }, { value: 1, duration: dur - 150 }]
        : [{ value: [0, 1], duration: 150 }, { value: 1, duration: dur - 300 }, { value: 0, duration: 150 }] }, t);
    return t + dur;
  }
  const rev = (pts) => pts.slice().reverse();
  function ping(tl, p, mode, row, c, t, back) {
    const r = hcRoute(mode, row, c), id = `${p}-pg${row}${c}`;
    const e = fly(tl, id, r, t, 0.22);
    return back ? fly(tl, id, rev(r), e + 60, 0.22) : e;
  }
  // 배경 요청: t0부터 t1까지 every 간격으로 pick(t, i)가 돌려준 경로로 점을 보낸다.
  function traffic(tl, p, t0, t1, every, pick) {
    let i = 0;
    for (let t = t0; t < t1; t += every, i++) {
      const r = pick(t, i);
      if (r && r.blocked) fly(tl, `${p}-x${i % 9}`, r.blocked, t, 0.25);
      else if (r) fly(tl, `${p}-q${i % 9}`, r, t, 0.32);
    }
  }
  // 운영 중 대상 집합에서 차례로 고른다.
  function rotor() { let k = 0; return (list) => list.length ? list[(k++) % list.length] : null; }
  const gaugeTo = (tl, p, a, b, t, d) => {
    tl.add({ targets: `#${p}-gb`, width: [GW * (100 - a) / 100, GW * (100 - b) / 100], duration: d || 600, easing: 'easeInOutSine' }, t);
    hide(tl, [`#${p}-lb${a}`, `#${p}-lg${a}`], t, 250); show(tl, [`#${p}-lb${b}`, `#${p}-lg${b}`], t + 200, 250);
  };

  /* ---------- 요청 흐름 공통 장면(①~④) ---------- */
  const V1 = LY('v1', 'v1', 'v1', '정상');
  function reqBase(p, o, aria, over) {
    const f = o.fade || {};
    let s = `<g ${f.vpc ? 'class="fade"' : ''}>
      <rect class="frame" x="76" y="68" width="518" height="234" rx="8"/>${T(84, 84, 'VPC', 'fr-t', 'start')}
      <rect class="frame sub" x="80" y="92" width="106" height="206" rx="6"/>${T(88, 292, '퍼블릭 서브넷', 'fr-t', 'start')}
      <rect class="frame sub" x="316" y="92" width="274" height="206" rx="6"/>${T(584, 292, '프라이빗 서브넷', 'fr-t', 'end')}</g>`;
    s += `<g ${f.top ? 'class="fade"' : ''}><path class="ln dash" d="M20 164V31H91"/><path class="ln dash" d="M52 164V64H270V50.5"/><path class="ln dash" d="M321 31H370.5"/></g>`;
    s += lines('one');
    for (let c = 0; c < 4; c++) s += stub(p, 'one', 'A', c, 'v1', true) + (o.badStub ? stub(p, 'one', 'A', c, 'bad', false, 'x') : '');
    s += browser(p, o.page, o.order);
    s += nb(p + '-r53', 84, 8, 96, 46, 'Route 53', '', { fade: f.r53 });
    s += nb(p + '-cf', 210, 8, 120, 46, 'CloudFront', '캐시', { fade: f.cf });
    s += nb(p + '-s3', 360, 8, 140, 46, 'S3', '프론트 정적 파일', { fade: f.cf });
    s += alb(p, 'one', false, f.vpc) + tgBox(p, 'one', f.vpc);
    s += `<g ${f.vpc ? 'class="fade"' : ''}>${[0, 1, 2, 3].map(c => tgt(p, 'A', c, o.layers || [V1], 'v1', false, o.kinds ? o.kinds(c) : '')).join('')}</g>`;
    s += `<g ${f.vpc || f.data ? 'class="fade"' : ''}>${nb(p + '-ec', 324, 230, 116, 42, 'ElastiCache', '캐시')}${nb(p + '-rds', 460, 230, 116, 42, 'RDS', '주문 DB')}</g>`;
    s += pool(p, 9) + (over || '');
    return svgWrap(aria, s);
  }

  /* ---------- ① 프론트 받기 ---------- */
  function scene1(p) {
    const file = (id, txt) => `<g id="${id}" class="file" style="opacity:0"><g transform="scale(${S})"><rect x="-19" y="-9" width="38" height="18" rx="3"/>${T(0, 4, txt, '')}</g></g>`;
    const over = `${dot(p + '-d1', 'q')}${dot(p + '-d2', 'q')}${dot(p + '-d3', 'q')}${dot(p + '-d4', 'q')}
      ${badge(p + '-b1', 'k', 196, 100, '도메인 주소 조회', 'l')}
      ${badge(p + '-b2', 'bad', 340, 60, '캐시에 없음', 'l')}
      ${badge(p + '-b3', 'ok', 36, 252, '화면 표시', 'c')}
      ${file(p + '-fh', 'HTML')}${file(p + '-fj', 'JS')}`;
    const svg = reqBase(p, { fade: { vpc: true } }, '브라우저가 Route 53에서 도메인 주소를 조회하고 CloudFront에 요청한 뒤, 캐시에 없으면 CloudFront가 S3에서 HTML과 JS를 가져와 브라우저가 화면을 표시하는 장면', over);
    const toR53 = [[20, 164], [20, 31], [91, 31]], toCF = [[52, 164], [52, 64], [270, 64], [270, 50.5]];
    const build = (tl, m) => {
      m.push(0);
      let e = fly(tl, p + '-d1', toR53, 100, 0.25); pulse(tl, p + '-r53', e - 100); show(tl, `#${p}-b1`, e);
      fly(tl, p + '-d2', rev(toR53), e + 400, 0.25);
      m.push(2600);
      e = fly(tl, p + '-d3', toCF, 2700, 0.3); pulse(tl, p + '-cf', e - 100); show(tl, `#${p}-b2`, e + 100);
      m.push(4300);
      e = fly(tl, p + '-d4', [[321, 31], [370.5, 31]], 4400, 0.12); pulse(tl, p + '-s3', e - 100);
      const back = [[430, 31], [270, 31], [270, 64], [52, 64], [52, 164]];
      flyG(tl, p + '-fh', back, e + 300, 0.3); const e2 = flyG(tl, p + '-fj', back, e + 650, 0.3);
      hide(tl, `#${p}-b2`, e + 300);
      m.push(e2 - 200);
      tl.add({ targets: `#${p}-page`, opacity: [0, 1], duration: 500, easing: 'linear' }, e2 - 100);
      pulse(tl, p + '-br', e2); show(tl, `#${p}-b3`, e2 + 200);
      hide(tl, `#${p}-b1`, e2 + 1400);
    };
    return { svg, build };
  }

  /* ---------- ② API 요청과 ALB ---------- */
  function scene2(p) {
    const over = `${dot(p + '-d1', 'q')}${dot(p + '-d2', 'q')}${dot(p + '-d3', 'q')}
      ${badge(p + '-b1', 'k', 196, 100, 'api 도메인 조회', 'l')}
      ${badge(p + '-b2', 'hot', 132, 96, '인증서로 HTTPS 종료', 'c')}
      ${badge(p + '-b3', 'hot', 254, 226, '/orders → order-api', 'c')}`;
    const svg = reqBase(p, { page: true, fade: { cf: true, data: true } }, '프론트 JS가 api 도메인을 Route 53에서 조회해 ALB로 주문 조회 요청을 보내고, ALB가 인증서로 HTTPS를 종료한 뒤 리스너 규칙이 /orders 요청을 order-api 타깃 그룹으로 보내는 장면', over);
    const toR53 = [[20, 164], [20, 31], [91, 31]];
    const build = (tl, m) => {
      m.push(0);
      let e = fly(tl, p + '-d1', toR53, 100, 0.25); pulse(tl, p + '-r53', e - 100); show(tl, `#${p}-b1`, e);
      fly(tl, p + '-d2', rev(toR53), e + 400, 0.25);
      hide(tl, `#${p}-b1`, 2600);
      m.push(2700);
      tl.add({ targets: `#${p}-d3`, cx: [68, 132], cy: [188, 188], opacity: [0, 1], duration: 900, easing: 'easeInOutSine' }, 2800);
      pulse(tl, p + '-alb', 3600);
      m.push(4300);
      show(tl, `#${p}-b2`, 4300, 400);
      m.push(5600);
      flash(tl, p + '-Lp', 5600); show(tl, `#${p}-b3`, 5800, 400);
      tl.add({ targets: `#${p}-d3`, cx: [{ value: [132, 254], duration: 700 }, { value: CX[1], duration: 650 }, { value: CX[1], duration: 250 }],
        cy: [{ value: [188, 188], duration: 700 }, { value: 188, duration: 650 }, { value: TA_BOT, duration: 250 }], easing: 'linear' }, 6500);
      pulse(tl, p + '-tg', 7100); pulse(tl, p + '-A1', 8000);
      hide(tl, `#${p}-d3`, 8200, 200);
    };
    return { svg, build };
  }

  /* ---------- ③ 타깃 그룹 ---------- */
  function scene3(p) {
    const KINDS = ['EC2 서버', 'ECS 태스크', 'EKS 파드'], SHORT = ['EC2', '태스크', '파드'];
    const kinds = (c) => SHORT.map((k, j) => T(CX[c], RY.A + 37, k, 'ts v1', 'middle', `id="${p}-A${c}-k${j}" style="opacity:0"`)).join('');
    let chips = sc(GX, 344, T(GX, 344, '대상 종류', 'lbl', 'start'));
    KINDS.forEach((k, j) => {
      const x = 160 + j * 128;
      chips += sc(x + 58, 339, `<rect class="cp" x="${x}" y="326" width="116" height="26" rx="13"/>${T(x + 58, 343.5, k, 'cp-t')}`) +
        `<g id="${p}-kc${j}" style="opacity:0">${sc(x + 58, 339, `<rect class="cp hot" x="${x}" y="326" width="116" height="26" rx="13"/>${T(x + 58, 343.5, k, 'cp-t hot')}`)}</g>`;
    });
    const over = hcDots(p, ['A']) + `${badge(p + '-bx', 'bad', CX[3], 156, '제외', 'c')}${chips}`;
    const layers = [V1, LY('bad', 'bad', 'v1', '실패')];
    const svg = reqBase(p, { page: true, fade: { r53: true, cf: true, data: true }, layers, badStub: true, kinds }, '타깃 그룹이 헬스 체크로 대상 4개를 확인해 실패한 1개를 제외하고 통과한 3개에만 요청을 나누는 장면. 대상은 EC2 서버, ECS 태스크, EKS 파드가 될 수 있다', over);
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-tg', 100);
      let e = 0;
      for (let c = 0; c < 4; c++) e = Math.max(e, ping(tl, p, 'one', 'A', c, 300, c < 3));
      sw(tl, `${p}-A3`, 'v1', 'bad', 1500);
      m.push(2700);
      hide(tl, `#${p}-sA3`, 2700, 400); show(tl, `#${p}-sA3x`, 2700, 400); show(tl, `#${p}-bx`, 2900, 400);
      m.push(4000);
      m.push(7600);
      for (let j = 0; j < 3; j++) {
        const t = 7700 + j * 1400;
        show(tl, `#${p}-kc${j}`, t, 300);
        for (let c = 0; c < 3; c++) {
          if (j === 0) hide(tl, `#${p}-A${c}-v1-s`, t, 300); else hide(tl, `#${p}-A${c}-k${j - 1}`, t, 300);
          show(tl, `#${p}-A${c}-k${j}`, t, 300);
        }
        if (j < 2) hide(tl, `#${p}-kc${j}`, t + 1300, 300);
      }
      const nx = rotor();
      traffic(tl, p, 4000, 11600, 420, () => rOne('A', nx([0, 1, 2])));
    };
    return { svg, build };
  }

  /* ---------- ④ 데이터와 응답 ---------- */
  function scene4(p) {
    const over = `${dot(p + '-d1', 'q')}
      ${badge(p + '-b1', 'bad', 382, 310, '캐시에 없음', 'c')}
      ${badge(p + '-b2', 'k', 518, 310, '주문 조회', 'c')}
      ${badge(p + '-b3', 'ok', 382, 310, '캐시에 저장', 'c')}`;
    const svg = reqBase(p, { page: true, order: true, fade: { r53: true, cf: true } }, '요청을 받은 앱이 ElastiCache를 먼저 조회하고, 캐시에 없으면 RDS에서 주문을 조회해 캐시에 저장한 뒤 응답이 ALB를 거쳐 브라우저로 돌아가는 장면', over);
    const toEC = [[CX[1], TA_BOT], [CX[1], 233]];
    const toRDS = [[CX[1], TA_BOT], [CX[1], 206], [518, 206], [518, 233]];
    const build = (tl, m) => {
      const d = p + '-d1';
      m.push(0);
      let e = fly(tl, d, rOne('A', 1), 100, 0.3); pulse(tl, p + '-A1', e);
      m.push(e + 300);
      e = fly(tl, d, toEC, e + 400, 0.12); pulse(tl, p + '-ec', e - 100); show(tl, `#${p}-b1`, e);
      e = fly(tl, d, rev(toEC), e + 500, 0.12);
      hide(tl, `#${p}-b1`, e + 300);
      m.push(e + 300);
      e = fly(tl, d, toRDS, e + 400, 0.18); pulse(tl, p + '-rds', e - 100); show(tl, `#${p}-b2`, e);
      e = fly(tl, d, rev(toRDS), e + 600, 0.18);
      hide(tl, `#${p}-b2`, e + 200);
      m.push(e + 300);
      e = fly(tl, d, toEC, e + 400, 0.12); pulse(tl, p + '-ec', e - 100); show(tl, `#${p}-b3`, e);
      e = fly(tl, d, rev(toEC), e + 400, 0.12);
      e = fly(tl, d, rev(rOne('A', 1)), e + 200, 0.3);
      pulse(tl, p + '-br', e); hide(tl, `#${p}-page`, e, 300); show(tl, `#${p}-ord`, e + 100, 400);
    };
    return { svg, build };
  }

  /* ---------- 배포 공통 장면(⑤~⑪) ---------- */
  function depBase(p, o, aria) {
    const mode = o.mode || 'one';
    let s = (o.under || '') + lines(mode, o.test) + (o.lines || '') + (o.stubs || '');
    s += browser(p, true) + alb(p, mode, o.test) + tgBox(p, mode);
    s += (o.top || '') + (o.targets || '') + pool(p, 9) + (o.dots || '') + (o.over || '');
    return svgWrap(aria, s);
  }
  const L = {
    v1: V1, v2: LY('v2', 'v2', 'v2', '정상'), up: LY('up', 'up', 'v2', '기동 중'), bad: LY('bad', 'bad', 'v2', '실패'),
    dr: LY('dr', 'dr', 'v1', '드레이닝'), stp1: LY('stp', 'stp', 'v1', '중지'), stp2: LY('stp', 'stp', 'v2', '중지'),
  };
  const row4 = (fn) => [0, 1, 2, 3].map(fn).join('');

  /* ---------- ⑤ CodeDeploy 인플레이스(배포 구성 3가지) ---------- */
  const IP = {
    one: { groups: [[0], [1], [2], [3]], note: '한 번에 한 대씩, 3대가 계속 요청 처리',
      aria: 'CodeDeploy가 EC2 서버 4대를 한 대씩 타깃 그룹에서 제외하고, 앱 종료와 번들 설치, 새 앱 기동, 헬스 체크를 거쳐 다시 등록하는 동안 나머지 3대가 요청을 처리하는 장면' },
    half: { groups: [[0, 1], [2, 3]], note: '최대 절반씩, 2대씩 두 번',
      aria: 'CodeDeploy가 EC2 서버 4대를 2대씩 두 번 타깃 그룹에서 제외하고, 앱 종료와 번들 설치, 새 앱 기동, 헬스 체크를 거쳐 다시 등록하는 동안 나머지 2대가 요청을 처리하는 장면' },
    all: { groups: [[0, 1, 2, 3]], note: '가능한 한 많은 서버에 한 번에',
      aria: 'CodeDeploy가 EC2 서버 4대를 한 번에 타깃 그룹에서 제외하고 배포해, 배포하는 동안 요청을 처리할 서버가 없다가 4대가 함께 다시 등록되는 장면' },
  };
  function scene5(p, v) {
    const cfg = IP[v] || IP.one, G = cfg.groups, g0 = G[0];
    const layers = [L.v1, LY('out', 'dr', 'v1', '제외'), LY('inst', 'inst', '', '설치 중'), LY('chk', 'up', 'v2', '헬스 체크'), L.v2];
    const HOOKS = ['BlockTraffic', '앱 종료', '번들 설치', '새 앱 기동', 'ValidateService', 'AllowTraffic'];
    let chips = sc(333, 222, T(333, 222, '서버별 배포 순서', 'mut', 'start'));
    HOOKS.forEach((h, i) => {
      const x = i < 3 ? 324 : 452, y = 230 + (i % 3) * 25, w = 122;
      const lab = (cls) => sc(x + w / 2, y + 10.5, `<rect class="cp ${cls}" x="${x}" y="${y}" width="${w}" height="21" rx="4"/>${T(x + w / 2, y + 14.6, `${i + 1} ${h}`, 'cp-t ' + cls)}`);
      chips += `<g>${lab('')}</g><g id="${p}-c${i}-r" style="opacity:0">${lab('run')}</g><g id="${p}-c${i}-d" style="opacity:0">${lab('done')}</g>`;
    });
    const rw = CX[g0.length - 1] - CX[0] + TW * S + 10, rh = TH * S + 10;
    const o = {
      stubs: row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'A', c, 'v2', false, 'g')),
      top: nb(p + '-cd', 324, 8, 136, 46, 'CodeDeploy', '인플레이스') + chips,
      targets: row4(c => tgt(p, 'A', c, layers, 'v1')) + `<rect id="${p}-ring" class="ring" x="${CX[0] - (TW * S + 10) / 2}" y="${RY.A + TH / 2 - rh / 2}" width="${rw}" height="${rh}" rx="8" style="opacity:0"/>`,
      dots: hcDots(p, ['A']) + Array.from({ length: 9 }, (_, i) => dot(`${p}-x${i}`, 'qx')).join(''),
      over: badge(p + '-bn', 'k', 84, 312, 'EC2 4대: ' + cfg.note, 'l', true) + badge(p + '-nos', 'bad', 254, 222, '처리할 서버 없음', 'c'),
    };
    const svg = depBase(p, o, cfg.aria);
    const out = [];   // 서버별 제외 구간
    const build = (tl, m) => {
      const run = (i, t, d) => { show(tl, `#${p}-c${i}-r`, t, 200); hide(tl, `#${p}-c${i}-r`, t + d, 200); show(tl, `#${p}-c${i}-d`, t + d, 200); };
      const each = (grp, f) => grp.forEach(f);
      m.push(0);
      show(tl, `#${p}-ring`, 0, 300); pulse(tl, p + '-cd', 0);
      run(0, 300, 1000);
      hide(tl, g0.map(c => `#${p}-sA${c}`), 500, 500); each(g0, c => sw(tl, `${p}-A${c}`, 'v1', 'out', 500));
      g0.forEach(c => { out[c] = [500, 4700]; });
      if (v === 'all') { m.push(900); show(tl, `#${p}-nos`, 900, 400); }
      m.push(1500);
      run(1, 1500, 550); each(g0, c => sw(tl, `${p}-A${c}`, 'out', 'inst', 1600));
      run(2, 2100, 550);
      run(3, 2700, 550); each(g0, c => sw(tl, `${p}-A${c}`, 'inst', 'chk', 2800));
      m.push(3500);
      run(4, 3500, 900); each(g0, c => ping(tl, p, 'one', 'A', c, 3550, true));
      each(g0, c => sw(tl, `${p}-A${c}`, 'chk', 'v2', 4300));
      run(5, 4450, 600); show(tl, g0.map(c => `#${p}-sA${c}g`), 4650, 400);
      if (v === 'all') hide(tl, `#${p}-nos`, 4700, 400);
      else m.push(5600);
      let end = 5400;
      for (let k = 1; k < G.length; k++) {
        const b = 5600 + (k - 1) * 2000, grp = G[k];
        hide(tl, [0, 1, 2, 3, 4, 5].map(i => `#${p}-c${i}-d`), b, 300);
        tl.add({ targets: `#${p}-ring`, translateX: [CX[G[k - 1][0]] - CX[0], CX[grp[0]] - CX[0]], duration: 500, easing: 'easeInOutSine' }, b);
        hide(tl, grp.map(c => `#${p}-sA${c}`), b + 300, 400); each(grp, c => sw(tl, `${p}-A${c}`, 'v1', 'out', b + 300));
        for (let i = 0; i < 6; i++) show(tl, `#${p}-c${i}-d`, b + 400 + i * 220, 200);
        each(grp, c => { sw(tl, `${p}-A${c}`, 'out', 'inst', b + 650); sw(tl, `${p}-A${c}`, 'inst', 'chk', b + 1050); sw(tl, `${p}-A${c}`, 'chk', 'v2', b + 1450); });
        show(tl, grp.map(c => `#${p}-sA${c}g`), b + 1600, 300);
        grp.forEach(c => { out[c] = [b + 300, b + 1600]; });
        end = b + 2000;
      }
      hide(tl, `#${p}-ring`, end, 400);
      const nx = rotor();
      const inSvc = (c, t) => !(t + 1500 > out[c][0] && t < out[c][1]);
      traffic(tl, p, 0, end + 200, 400, (t) => {
        const c = nx([0, 1, 2, 3].filter(c => inSvc(c, t)));
        return c === null ? { blocked: [[63, 188], [132, 188], [240, 188]] } : rOne('A', c);
      });
    };
    return { svg, build };
  }

  /* ---------- ⑥ ECS 롤링 업데이트 ---------- */
  function scene6(p) {
    const cnt = [['실행 중 4개', ''], ['실행 중 8개', 'hot'], ['실행 중 4개', 'ok']];
    const o = {
      stubs: row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'B', c, 'v2', false)),
      top: nb(p + '-ecs', 324, 8, 136, 46, 'ECS 서비스', '롤링 업데이트') + nb(p + '-cnt', 476, 8, 100, 46, '태스크', cnt),
      targets: row4(c => tgt(p, 'A', c, [L.v1, L.dr, L.stp1], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.v2], 'up', true)),
      dots: hcDots(p, ['B']) + dot(p + '-resp', 'q'),
      over: badge(p + '-bmin', 'k', 84, 312, '최소 100%: 4개 이상 유지', 'l') + badge(p + '-bmax', 'hot', 576, 312, '최대 200%: 8개까지', 'r') +
        badge(p + '-bdr', 'k', 84, 340, '진행 중인 요청을 마칠 때까지 대기', 'l'),
    };
    const svg = depBase(p, o, 'ECS가 v2 태스크 4개를 추가로 기동해 헬스 체크 통과 후 타깃 그룹에 등록하고, v1 태스크 4개를 드레이닝으로 등록 해제한 뒤 중지하는 롤링 업데이트 장면');
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-ecs', 0);
      for (let c = 0; c < 4; c++) pop(tl, `#${p}-B${c}`, 200 + c * 150);
      hide(tl, `#${p}-cnt-s0`, 700); show(tl, `#${p}-cnt-s1`, 700);
      show(tl, [`#${p}-bmin`, `#${p}-bmax`], 1000, 400);
      m.push(2200);
      for (let c = 0; c < 4; c++) ping(tl, p, 'one', 'B', c, 2200 + c * 80, true);
      for (let c = 0; c < 4; c++) sw(tl, `${p}-B${c}`, 'up', 'v2', 3200 + c * 80);
      show(tl, [0, 1, 2, 3].map(c => `#${p}-sB${c}`), 3500, 400);
      m.push(4600);
      hide(tl, [0, 1, 2, 3].map(c => `#${p}-sA${c}`), 4600, 500);
      for (let c = 0; c < 4; c++) sw(tl, `${p}-A${c}`, 'v1', 'dr', 4600);
      show(tl, `#${p}-bdr`, 4800, 400);
      fly(tl, p + '-resp', rev(rOne('A', 2)), 4900, 0.32);
      m.push(7000);
      for (let c = 0; c < 4; c++) sw(tl, `${p}-A${c}`, 'dr', 'stp', 7000 + c * 100);
      hide(tl, `#${p}-cnt-s1`, 7300); show(tl, `#${p}-cnt-s2`, 7300);
      hide(tl, [`#${p}-bdr`, `#${p}-bmax`], 7300, 400);
      tl.add({ targets: [0, 1, 2, 3].map(c => `#${p}-A${c}`), opacity: [1, 0.45], duration: 600, easing: 'linear' }, 7900);
      const nx = rotor();
      traffic(tl, p, 0, 9200, 380, (t) => {
        if (t < 3500) return rOne('A', nx([0, 1, 2, 3]));
        if (t < 4300) { const c = nx([0, 1, 2, 3, 4, 5, 6, 7]); return c < 4 ? rOne('A', c) : rOne('B', c - 4); }
        return rOne('B', nx([0, 1, 2, 3]));
      });
    };
    return { svg, build };
  }

  /* ---------- ⑦ 서킷 브레이커 롤백 ---------- */
  function scene7(p) {
    const o = {
      stubs: row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'B', c, 'bad', false)),
      top: nb(p + '-ecs', 324, 8, 136, 46, 'ECS 서비스', '롤링 업데이트') +
        nb(p + '-cb', 476, 8, 100, 46, '서킷 브레이커', [['감시 중', ''], ['실패 판단', 'bad']], { bad: true }),
      targets: row4(c => tgt(p, 'A', c, [L.v1], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.bad, L.stp2], 'up', true)),
      dots: hcDots(p, ['B']),
      over: badge(p + '-brep', 'bad', 84, 312, '실패한 태스크 교체 반복', 'l') +
        badge(p + '-brb', 'v1', 84, 340, '마지막 COMPLETED 배포인 v1으로 롤백', 'l') + badge(p + '-bk', 'ok', 576, 340, 'v1 4개 유지', 'r'),
    };
    const svg = depBase(p, o, 'ECS 롤링 업데이트에서 v2 태스크가 헬스 체크에 계속 실패해 교체가 반복되자 서킷 브레이커가 배포 실패로 판단하고, 마지막으로 성공한 배포인 v1으로 롤백해 v1 태스크 4개가 계속 요청을 처리하는 장면');
    const B = [0, 1, 2, 3];
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-ecs', 0);
      for (const c of B) pop(tl, `#${p}-B${c}`, 200 + c * 150);
      for (const c of B) ping(tl, p, 'one', 'B', c, 1100 + c * 80, false);
      for (const c of B) sw(tl, `${p}-B${c}`, 'up', 'bad', 1900 + c * 80);
      m.push(2700);
      show(tl, `#${p}-brep`, 2700, 400);
      for (let r = 0; r < 2; r++) {
        const b = 2900 + r * 2200;
        for (const c of B) sw(tl, `${p}-B${c}`, 'bad', 'stp', b + c * 80);
        hide(tl, B.map(c => `#${p}-B${c}`), b + 500, 300);
        for (const c of B) sw(tl, `${p}-B${c}`, 'stp', 'up', b + 850, 50);
        for (const c of B) pop(tl, `#${p}-B${c}`, b + 950 + c * 100);
        for (const c of B) ping(tl, p, 'one', 'B', c, b + 1450 + c * 60, false);
        for (const c of B) sw(tl, `${p}-B${c}`, 'up', 'bad', b + 1900 + c * 60);
      }
      m.push(7400);
      pulse(tl, p + '-cb', 7400); show(tl, `#${p}-cb-bad`, 7400, 400);
      hide(tl, `#${p}-cb-s0`, 7400); show(tl, `#${p}-cb-s1`, 7400);
      m.push(8800);
      hide(tl, `#${p}-brep`, 8800, 300); show(tl, `#${p}-brb`, 8900, 400);
      for (const c of B) sw(tl, `${p}-B${c}`, 'bad', 'stp', 9100 + c * 80);
      hide(tl, B.map(c => `#${p}-B${c}`), 9800, 500);
      show(tl, `#${p}-bk`, 10000, 400);
      for (const c of B) pulse(tl, `${p}-A${c}`, 10100 + c * 80);
      const nx = rotor();
      traffic(tl, p, 0, 11200, 400, () => rOne('A', nx(B)));
    };
    return { svg, build };
  }

  /* ---------- ⑧ 블루/그린 ---------- */
  function scene8(p) {
    const o = {
      mode: 'bg', test: true,
      lines: `<path id="${p}-pb" class="ln v1" d="M169 167H193V123H213"/><path id="${p}-pg" class="ln v2" d="M169 167H193V253H213" style="opacity:0"/>`,
      stubs: row4(c => stub(p, 'bg', 'A', c, 'v1', true) + stub(p, 'bg', 'B', c, 'v2', false)),
      top: nb(p + '-cd', 324, 8, 136, 46, 'CodeDeploy', '블루/그린'),
      targets: row4(c => tgt(p, 'A', c, [L.v1, L.stp1], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.v2], 'up', true)),
      dots: hcDots(p, ['B']) + [0, 1, 2].map(i => dot(`${p}-t${i}`, 'qt')).join(''),
      over: badge(p + '-bp0', 'v1', 84, 312, '운영 트래픽 100%: 블루', 'l', true) + badge(p + '-bp1', 'ok', 84, 312, '운영 트래픽 100%: 그린', 'l') +
        badge(p + '-bt', 'ok', 576, 312, '테스트 리스너로 검증 통과', 'r') +
        `<g id="${p}-bake" style="opacity:0">${sc(84, 356, T(84, 356, '베이크 시간: 블루 유지(즉시 롤백 가능)', 'lbl', 'start'))}
          <rect class="bake-bg" x="350" y="347.75" width="226" height="8.5" rx="4.25"/><rect id="${p}-bk" class="bake" x="350" y="347.75" width="226" height="8.5" rx="4.25"/></g>`,
    };
    const svg = depBase(p, o, '블루 타깃 그룹의 v1이 요청을 모두 처리하는 동안 그린 타깃 그룹에 v2 태스크를 기동하고, 테스트 리스너로 먼저 검증한 뒤 운영 리스너를 그린으로 한 번에 전환하고, 베이크 시간 동안 블루를 유지했다가 종료하는 장면');
    const B = [0, 1, 2, 3];
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-cd', 0);
      for (const c of B) pop(tl, `#${p}-B${c}`, 700 + c * 150);
      for (const c of B) ping(tl, p, 'bg', 'B', c, 1700 + c * 80, true);
      for (const c of B) sw(tl, `${p}-B${c}`, 'up', 'v2', 2700 + c * 80);
      show(tl, B.map(c => `#${p}-sB${c}`), 2900, 400);
      m.push(3800);
      flash(tl, p + '-Lt', 3800);
      let e = 0;
      for (let i = 0; i < 3; i++) e = fly(tl, `${p}-t${i}`, rTest(i), 4000 + i * 350, 0.28);
      show(tl, `#${p}-bt`, e + 100, 400);
      m.push(6600);
      flash(tl, p + '-Lp', 6600);
      hide(tl, `#${p}-pb`, 6900, 300); show(tl, `#${p}-pg`, 6900, 300);
      hide(tl, [`#${p}-bp0`, `#${p}-bt`], 6900, 300); show(tl, `#${p}-bp1`, 7000, 300);
      m.push(8600);
      show(tl, `#${p}-bake`, 8600, 300);
      tl.add({ targets: `#${p}-bk`, width: [226, 0], duration: 2200, easing: 'linear' }, 8700);
      hide(tl, B.map(c => `#${p}-sA${c}`), 11000, 400);
      for (const c of B) sw(tl, `${p}-A${c}`, 'v1', 'stp', 11000 + c * 100);
      tl.add({ targets: B.map(c => `#${p}-A${c}`), opacity: [1, 0.45], duration: 600, easing: 'linear' }, 11700);
      const nb_ = rotor(), ng = rotor();
      traffic(tl, p, 0, 12600, 400, (t) => t < 6900 ? rBlue(nb_(B)) : rGreen(ng(B)));
    };
    return { svg, build };
  }

  /* ---------- ⑨ 카나리, ⑩ 리니어 공통 ---------- */
  function shiftBase(p, kind, steps, aria) {
    const top = kind === 'canary'
      ? nb(p + '-cd', 84, 8, 156, 46, 'CodeDeploy', '카나리') +
        `<g>${sc(284, 31, `${halo(p + '-tmr', 262, 9, 44, 44)}<circle class="tm-bg" cx="284" cy="31" r="18"/>
          <circle id="${p}-tm" class="tm" cx="284" cy="31" r="18" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 284 31)"/>
          ${T(284, 35.5, '5분', 'tm-t')}`)}</g>` +
        nb(p + '-mt', 324, 8, 136, 46, '지표(오류율)', [['대기', ''], ['관찰 중', 'hot'], ['이상 없음', 'ok']])
      : nb(p + '-cd', 84, 8, 156, 46, 'CodeDeploy', '리니어') +
        nb(p + '-mn', 324, 8, 136, 46, '경과 시간', Array.from({ length: 11 }, (_, i) => [`${i}분`, i ? 'hot' : '']));
    const o = {
      mode: 'bg',
      lines: `<path id="${p}-pb" class="ln v1" d="M169 167H193V123H213"/><path id="${p}-pg" class="ln v2" d="M169 167H193V253H213" style="opacity:0"/>`,
      stubs: row4(c => stub(p, 'bg', 'A', c, 'v1', true) + stub(p, 'bg', 'B', c, 'v2', false)),
      top, targets: row4(c => tgt(p, 'A', c, [L.v1, L.stp1], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.v2], 'up', true)),
      dots: hcDots(p, ['B']),
      over: gauge(p, steps),
    };
    return depBase(p, o, aria);
  }
  // 그린 비율 f(t)를 따라 요청을 블루와 그린에 나눈다(누적값으로 정확한 비율).
  function splitTraffic(tl, p, t1, f) {
    const nb_ = rotor(), ng = rotor(); let acc = 0.5;
    traffic(tl, p, 0, t1, 380, (t) => {
      acc += f(t);
      if (acc >= 1) { acc -= 1; return rGreen(ng([0, 1, 2, 3])); }
      return rBlue(nb_([0, 1, 2, 3]));
    });
  }
  function greenUp(tl, p) {
    pulse(tl, p + '-cd', 0);
    for (let c = 0; c < 4; c++) pop(tl, `#${p}-B${c}`, 300 + c * 150);
    for (let c = 0; c < 4; c++) ping(tl, p, 'bg', 'B', c, 1200 + c * 80, true);
    for (let c = 0; c < 4; c++) sw(tl, `${p}-B${c}`, 'up', 'v2', 2200 + c * 80);
    show(tl, [0, 1, 2, 3].map(c => `#${p}-sB${c}`), 2400, 400);
  }
  function blueDown(tl, p, t) {
    hide(tl, [0, 1, 2, 3].map(c => `#${p}-sA${c}`), t, 400);
    for (let c = 0; c < 4; c++) sw(tl, `${p}-A${c}`, 'v1', 'stp', t + c * 100);
    tl.add({ targets: [0, 1, 2, 3].map(c => `#${p}-A${c}`), opacity: [1, 0.45], duration: 600, easing: 'linear' }, t + 700);
  }

  /* ---------- ⑨ 카나리 ---------- */
  function scene9(p) {
    const svg = shiftBase(p, 'canary', [0, 10, 100], 'CodeDeploy 카나리 배포에서 트래픽 10%만 그린으로 보내 5분 동안 오류율을 관찰하고, 이상이 없으면 나머지 90%를 그린으로 전환한 뒤 블루를 종료하는 장면');
    const build = (tl, m) => {
      m.push(0);
      greenUp(tl, p);
      m.push(3200);
      gaugeTo(tl, p, 0, 10, 3200, 700); show(tl, `#${p}-pg`, 3200, 400);
      m.push(4800);
      pulse(tl, p + '-tmr', 4800); hide(tl, `#${p}-mt-s0`, 4800); show(tl, `#${p}-mt-s1`, 4800);
      tl.add({ targets: `#${p}-tm`, strokeDashoffset: [100, 0], duration: 3000, easing: 'linear' }, 4900);
      hide(tl, `#${p}-mt-s1`, 7900); show(tl, `#${p}-mt-s2`, 7900); pulse(tl, p + '-mt', 7900);
      m.push(8800);
      gaugeTo(tl, p, 10, 100, 8800, 900);
      hide(tl, `#${p}-pb`, 9600, 300);
      blueDown(tl, p, 10400);
      splitTraffic(tl, p, 12000, (t) => t < 3500 ? 0 : t < 8900 ? 0.1 : 1);
    };
    return { svg, build };
  }

  /* ---------- ⑩ 리니어 ---------- */
  function scene10(p) {
    const steps = Array.from({ length: 11 }, (_, i) => i * 10);
    const svg = shiftBase(p, 'linear', steps, 'CodeDeploy 리니어 배포에서 1분마다 트래픽 10%씩 그린으로 전환해 100%가 되면 블루를 종료하는 장면');
    const T0 = 3200, STEP = 760;
    const build = (tl, m) => {
      m.push(0);
      greenUp(tl, p);
      m.push(T0);
      show(tl, `#${p}-pg`, T0, 400);
      for (let k = 1; k <= 10; k++) {
        const t = T0 + (k - 1) * STEP;
        if (k === 5) m.push(t);
        if (k === 10) m.push(t);
        gaugeTo(tl, p, (k - 1) * 10, k * 10, t, 450);
        hide(tl, `#${p}-mn-s${k - 1}`, t, 200); show(tl, `#${p}-mn-s${k}`, t + 150, 200);
      }
      const tEnd = T0 + 9 * STEP + 500;
      hide(tl, `#${p}-pb`, tEnd, 300);
      blueDown(tl, p, tEnd + 700);
      splitTraffic(tl, p, tEnd + 2200, (t) => t < T0 ? 0 : Math.min(1, (Math.floor((t - T0) / STEP) + 1) / 10));
    };
    return { svg, build };
  }

  /* ---------- ⑪ 푸시 방식 배포(ECS / EC2 + CodeDeploy) ---------- */
  function callChip(id, txt) {
    const w = Math.round(wOf(txt, 11, 6.4) + 14);
    return `<g id="${id}" class="call" style="opacity:0"><g transform="scale(${S})"><rect x="${-w / 2}" y="-9" width="${w}" height="18" rx="3"/>${T(0, 4, txt, '')}</g></g>`;
  }
  function scene11(p, v) {
    const ecs = v !== 'ec2';
    const chipG = (id, txt) => `<g id="${id}" class="img" style="opacity:0"><g transform="scale(${S})"><rect x="-20" y="-9" width="40" height="18" rx="3"/>${T(0, 4, txt, '')}</g></g>`;
    const tgtName = ecs ? 'ECS 서비스' : 'CodeDeploy';
    const o = {
      under: `<path class="ln" d="M164 31H204"/><path class="arrh" d="M204 31l-7 -4v8z"/>
        <path class="ln dash" d="M127 50.5V62H392V50.5"/>
        <g id="${p}-pl" style="opacity:0"><path class="pushln" d="M127 50.5V62H392V51"/><path class="pushh" d="M392 51l-4.5 8h9z"/></g>
        <path class="ln dash" d="M450 31H476"/>`,
      stubs: ecs ? row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'B', c, 'v2', false))
        : row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'A', c, 'v2', false, 'g')),
      top: nb(p + '-ci', 84, 8, 86, 46, 'CI', '빌드') +
        (ecs ? nb(p + '-st', 196, 8, 110, 46, 'ECR', [['이미지 v1', ''], ['이미지 v2', 'ok']])
          : nb(p + '-st', 196, 8, 110, 46, 'S3', [['번들 v1', ''], ['번들 v2', 'ok']])) +
        (ecs ? nb(p + '-dp', 324, 8, 136, 46, tgtName, [['태스크 정의 v1', ''], ['태스크 정의 v2', 'ok']])
          : nb(p + '-dp', 324, 8, 136, 46, tgtName, [['대기', ''], ['배포 중', 'hot'], ['완료', 'ok']])) +
        nb(p + '-his', 466, 8, 130, 46, '배포 이력', [[ecs ? 'ECS: v1' : 'CodeDeploy: v1', ''], [ecs ? 'ECS: v2 기록' : 'CodeDeploy: v2 기록', 'ok']]),
      targets: ecs ? row4(c => tgt(p, 'A', c, [L.v1, L.dr, L.stp1], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.v2], 'up', true))
        : row4(c => tgt(p, 'A', c, [L.v1, LY('inst', 'inst', '', '설치 중'), L.v2], 'v1')),
      dots: (ecs ? chipG(p + '-im', 'v2') + hcDots(p, ['B']) : chipG(p + '-im', 'zip') + [0, 1, 2, 3].map(c => dot(`${p}-ag${c}`, 'ag', 4.5)).join('')) +
        (ecs ? callChip(p + '-k1', '새 리비전 등록') + callChip(p + '-k2', 'update-service') : callChip(p + '-k2', 'create-deployment')),
      over: badge(p + '-bp', 'hot', 84, 94, 'AWS 배포 권한으로 CI가 직접 호출', 'l') +
        badge(p + '-bn', 'k', 84, 312, ecs ? 'ECS: 롤링 업데이트로 태스크 교체' : 'EC2 4대: 서버마다 에이전트가 배포', 'l'),
    };
    const svg = depBase(p, o, ecs
      ? 'CI가 이미지를 빌드해 ECR에 푸시하고, AWS 배포 권한으로 새 태스크 정의 리비전을 등록한 뒤 ECS 서비스에 update-service를 직접 호출해 태스크가 롤링 업데이트로 교체되고, 배포 기록이 ECS 배포 이력에 남는 장면'
      : 'CI가 jar와 스크립트를 번들로 만들어 S3에 업로드하고, AWS 배포 권한으로 CodeDeploy에 create-deployment를 직접 호출해 CodeDeploy가 각 서버 에이전트에 배포를 지시하고, 배포 기록이 CodeDeploy 배포 이력에 남는 장면');
    const callPath = [[127, 62], [392, 62]];
    const B = [0, 1, 2, 3];
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-ci', 0);
      let e = flyG(tl, p + '-im', [[150, 31], [251, 31]], 200, 0.12);
      pulse(tl, p + '-st', e - 100); hide(tl, `#${p}-st-s0`, e - 100); show(tl, `#${p}-st-s1`, e - 100);
      m.push(1700);
      show(tl, [`#${p}-bp`, `#${p}-pl`], 1700, 400); pulse(tl, p + '-ci', 1700);
      e = 2100;
      if (ecs) {
        e = flyG(tl, p + '-k1', callPath, 2100, 0.2);
        pulse(tl, p + '-dp', e - 100); hide(tl, `#${p}-dp-s0`, e - 100); show(tl, `#${p}-dp-s1`, e - 100);
        e += 200;
      }
      e = flyG(tl, p + '-k2', callPath, e, 0.2, true);
      pulse(tl, p + '-dp', e - 100);
      if (!ecs) { hide(tl, `#${p}-dp-s0`, e - 100); show(tl, `#${p}-dp-s1`, e - 100); }
      const t2 = e + 300;
      m.push(t2);
      hide(tl, `#${p}-k2`, t2, 300);
      let out = [], upAt = [], t3;
      if (ecs) {
        for (const c of B) pop(tl, `#${p}-B${c}`, t2 + c * 100);
        for (const c of B) ping(tl, p, 'one', 'B', c, t2 + 700 + c * 60, true);
        for (const c of B) sw(tl, `${p}-B${c}`, 'up', 'v2', t2 + 1500 + c * 60);
        show(tl, B.map(c => `#${p}-sB${c}`), t2 + 1700, 300);
        hide(tl, B.map(c => `#${p}-sA${c}`), t2 + 2000, 400);
        for (const c of B) sw(tl, `${p}-A${c}`, 'v1', 'dr', t2 + 2000);
        for (const c of B) sw(tl, `${p}-A${c}`, 'dr', 'stp', t2 + 2800 + c * 80);
        tl.add({ targets: B.map(c => `#${p}-A${c}`), opacity: [1, 0.45], duration: 500, easing: 'linear' }, t2 + 3300);
        t3 = t2 + 3900;
        B.forEach(c => { out[c] = t2 + 2000; upAt[c] = t2 + 1700; });
      } else {
        for (const c of B) {
          const b = t2 + c * 1000;
          fly(tl, `${p}-ag${c}`, [[392, 50.5], [CX[c], TA_TOP]], b, 0.2);
          hide(tl, `#${p}-sA${c}`, b + 450, 300); sw(tl, `${p}-A${c}`, 'v1', 'inst', b + 450);
          sw(tl, `${p}-A${c}`, 'inst', 'v2', b + 850); show(tl, `#${p}-sA${c}g`, b + 950, 300);
          out[c] = [b + 450, b + 950];
        }
        t3 = t2 + 4200;
      }
      m.push(t3);
      if (!ecs) { hide(tl, `#${p}-dp-s1`, t3); show(tl, `#${p}-dp-s2`, t3); }
      pulse(tl, p + '-his', t3 + 100); hide(tl, `#${p}-his-s0`, t3 + 100); show(tl, `#${p}-his-s1`, t3 + 100);
      const nx = rotor();
      traffic(tl, p, 0, t3 + 1000, 400, (t) => {
        if (ecs) {
          const l = [];
          B.forEach(c => { if (t + 1300 < out[c]) l.push(['A', c]); if (t > upAt[c]) l.push(['B', c]); });
          const r = nx(l); return r ? rOne(r[0], r[1]) : null;
        }
        const r = nx(B.filter(c => !(t + 1500 > out[c][0] && t < out[c][1])));
        return r === null ? null : rOne('A', r);
      });
    };
    return { svg, build };
  }

  /* ---------- ⑫ Argo CD 동기화 ---------- */
  function scene12(p) {
    const chipG = (id, txt) => `<g id="${id}" class="img" style="opacity:0"><g transform="scale(${S})"><rect x="-20" y="-9" width="40" height="18" rx="3"/>${T(0, 4, txt, '')}</g></g>`;
    const o = {
      under: `<rect class="frame" x="314" y="66" width="276" height="306" rx="8"/>${T(322, 82, 'EKS 클러스터', 'fr-t', 'start')}${T(584, 82, 'Deployment: 파드 4개', 'fr-t', 'end')}
        <path class="ln" d="M164 31H204"/><path class="arrh" d="M204 31l-7 -4v8z"/>
        <path class="ln dash" d="M127 50.5V61H532V50.5"/>
        <path class="ln dash" d="M576 31H596V335H576"/>
        <path class="nolink" d="M150 50L292 98"/><path class="xm" d="M286 88l12 12M298 88l-12 12"/>`,
      stubs: row4(c => stub(p, 'one', 'A', c, 'v1', true) + stub(p, 'one', 'B', c, 'v2', false)),
      top: nb(p + '-ci', 84, 8, 86, 46, 'CI', '빌드') + nb(p + '-ecr', 196, 8, 110, 46, 'ECR', [['이미지 v1', ''], ['이미지 v2', 'ok']]) +
        nb(p + '-git', 480, 8, 104, 46, 'Git 저장소', [['태그 v1', ''], ['태그 v2', 'ok']]) +
        nb(p + '-argo', 480, 312, 104, 46, 'Argo CD', [['Synced', 'ok'], ['OutOfSync', 'bad'], ['동기화 중', 'hot'], ['Synced', 'ok']]),
      targets: row4(c => tgt(p, 'A', c, [L.v1, LY('dr', 'dr', 'v1', '종료 중')], 'v1')) + row4(c => tgt(p, 'B', c, [L.up, L.v2], 'up', true)),
      dots: chipG(p + '-im', 'v2') + chipG(p + '-cm', '태그') + dot(p + '-mf', 'q'),
      over: badge(p + '-bno', 'bad', 84, 94, '클러스터 직접 배포 없음', 'l', true) + badge(p + '-bcmp', 'k', 470, 325, 'Git과 비교', 'r') +
        badge(p + '-bs', 'k', 84, 312, '파드 4개 기준 1개씩 교체', 'l'),
    };
    const svg = depBase(p, o, 'CI가 이미지를 ECR에 푸시하고 매니페스트 저장소의 이미지 태그를 커밋하면, 클러스터 안의 Argo CD가 Git과 비교해 OutOfSync를 감지하고 동기화해 Deployment가 파드를 1개씩 롤링 교체한 뒤 Synced가 되는 장면. CI는 클러스터에 직접 배포하지 않는다');
    const B = [0, 1, 2, 3];
    const out = B.map(c => [5900 + c * 1400, 5900 + c * 1400 + 300]);   // v1 등록 해제 시각
    const upAt = B.map(c => 5900 + c * 1400 + 1000);                     // v2 등록 시각
    const build = (tl, m) => {
      m.push(0);
      pulse(tl, p + '-ci', 0);
      let e = flyG(tl, p + '-im', [[150, 31], [251, 31]], 200, 0.12);
      pulse(tl, p + '-ecr', e - 100); hide(tl, `#${p}-ecr-s0`, e - 100); show(tl, `#${p}-ecr-s1`, e - 100);
      e = flyG(tl, p + '-cm', [[127, 50.5], [127, 61], [532, 61], [532, 40]], e + 200, 0.3);
      pulse(tl, p + '-git', e - 100); hide(tl, `#${p}-git-s0`, e - 100); show(tl, `#${p}-git-s1`, e - 100);
      m.push(3200);
      e = fly(tl, p + '-mf', [[576, 31], [596, 31], [596, 335], [576, 335]], 3300, 0.25);
      show(tl, `#${p}-bcmp`, 3300, 400);
      pulse(tl, p + '-argo', e - 100); hide(tl, `#${p}-argo-s0`, e); show(tl, `#${p}-argo-s1`, e);
      m.push(5400);
      hide(tl, `#${p}-argo-s1`, 5400); show(tl, `#${p}-argo-s2`, 5400); hide(tl, `#${p}-bcmp`, 5400); show(tl, `#${p}-bs`, 5500, 400);
      for (const c of B) {
        const b = 5900 + c * 1400;
        pop(tl, `#${p}-B${c}`, b);
        hide(tl, `#${p}-sA${c}`, b, 300); sw(tl, `${p}-A${c}`, 'v1', 'dr', b);
        sw(tl, `${p}-B${c}`, 'up', 'v2', b + 800); show(tl, `#${p}-sB${c}`, b + 1000, 300);
        tl.add({ targets: `#${p}-A${c}`, opacity: [1, 0], duration: 400, easing: 'linear' }, b + 900);
      }
      m.push(11600);
      hide(tl, `#${p}-argo-s2`, 11600); show(tl, `#${p}-argo-s3`, 11600); pulse(tl, p + '-argo', 11600);
      hide(tl, `#${p}-bs`, 11700, 400);
      pulse(tl, p + '-bno', 11900);
      const nx = rotor();
      traffic(tl, p, 0, 12800, 400, (t) => {
        const ta = t + 1300;
        const list = [];
        B.forEach(c => { if (ta < out[c][0]) list.push(['A', c]); });
        B.forEach(c => { if (t > upAt[c]) list.push(['B', c]); });
        const r = nx(list); return r ? rOne(r[0], r[1]) : null;
      });
    };
    return { svg, build };
  }

  /* ---------- 단계 정의 ---------- */
  const STEPS = [
    { k: '1', g: '요청 흐름', tab: '①', title: '프론트 받기', pills: [], sc: scene1,
      caps: [['1', 'Route 53에서 도메인 주소 조회'], ['2', 'CloudFront에 요청, 캐시에 없음'], ['3', 'S3에서 HTML, JS를 가져옴'], ['4', '브라우저에 화면 표시']] },
    { k: '2', g: '요청 흐름', tab: '②', title: 'API 요청과 ALB', pills: [], sc: scene2,
      caps: [['1', 'api 도메인을 Route 53에서 조회'], ['2', '프론트 JS가 ALB로 주문 조회 요청'], ['3', 'ALB가 인증서로 HTTPS 종료'], ['4', '리스너 규칙이 /orders 요청을 order-api 타깃 그룹으로 전달']] },
    { k: '3', g: '요청 흐름', tab: '③', title: '타깃 그룹', pills: [], sc: scene3,
      caps: [['1', '타깃 그룹이 대상마다 헬스 체크'], ['2', '실패한 대상 1개는 제외'], ['3', '통과한 대상에만 요청을 나눔'], ['4', '대상은 방식마다 다름: EC2 서버, ECS 태스크, EKS 파드']] },
    { k: '4', g: '요청 흐름', tab: '④', title: '데이터와 응답', pills: [], sc: scene4,
      caps: [['1', '요청이 order-api 대상에 도착'], ['2', 'ElastiCache 먼저 조회, 캐시에 없음'], ['3', 'RDS에서 주문 조회'], ['4', '캐시에 저장하고 ALB를 거쳐 브라우저로 응답']] },
    { k: '5', g: '배포 유형', tab: '⑤', title: 'CodeDeploy 인플레이스', pills: [{ t: 'EC2 4대' }], sc: scene5, v: 'one', vlab: 'CodeDeployDefault.',
      variants: [
        { id: 'one', label: 'OneAtATime', caps: [['1', 'BlockTraffic: 서버 1대를 타깃 그룹에서 제외'], ['2', '앱 종료, 번들 설치, 새 앱 기동'], ['3', 'ValidateService 헬스 체크 후 AllowTraffic으로 다시 등록'], ['4', '다음 서버 반복, 나머지 3대가 요청 처리']] },
        { id: 'half', label: 'HalfAtATime', caps: [['1', 'BlockTraffic: 서버 2대를 타깃 그룹에서 제외'], ['2', '앱 종료, 번들 설치, 새 앱 기동'], ['3', 'ValidateService 헬스 체크 후 AllowTraffic으로 다시 등록'], ['4', '나머지 2대 반복, 그동안 다른 2대가 요청 처리']] },
        { id: 'all', label: 'AllAtOnce', caps: [['1', 'BlockTraffic: 4대를 동시에 타깃 그룹에서 제외'], ['2', '배포하는 동안 처리할 서버 없음'], ['3', '앱 종료, 번들 설치, 새 앱 기동'], ['4', 'ValidateService 후 AllowTraffic으로 4대 함께 다시 등록']] },
      ] },
    { k: '6', g: '배포 유형', tab: '⑥', title: 'ECS 롤링 업데이트', pills: [{ t: '원하는 개수 4' }, { t: '최소 100%' }, { t: '최대 200%' }], sc: scene6,
      caps: [['1', 'v2 태스크 4개 추가 기동'], ['2', '헬스 체크 통과 후 타깃 그룹에 등록'], ['3', 'v1 4개 등록 해제, 진행 중인 요청을 마칠 때까지 대기(드레이닝)'], ['4', 'v1 중지, v2 4개가 요청 처리']] },
    { k: '7', g: '배포 유형', tab: '⑦', title: '서킷 브레이커 롤백', pills: [{ t: 'ECS' }, { t: '배포 서킷 브레이커' }], sc: scene7,
      caps: [['1', 'v2 태스크가 헬스 체크에 계속 실패'], ['2', '실패한 태스크의 교체가 반복됨'], ['3', '서킷 브레이커가 배포 실패로 판단'], ['4', '마지막 성공 배포(COMPLETED)인 v1으로 롤백, 요청은 계속 v1이 처리']] },
    { k: '8', g: '배포 유형', tab: '⑧', title: '블루/그린', pills: [{ t: 'CodeDeployDefault.ECSAllAtOnce', mono: true }, { t: '블루: v1' }, { t: '그린: v2' }], sc: scene8,
      caps: [['1', '블루(v1)가 요청 100% 처리, 그린(v2) 태스크 기동'], ['2', '테스트 리스너로 그린 먼저 검증'], ['3', '운영 리스너를 그린으로 한 번에 전환'], ['4', '베이크 시간 동안 블루 유지(즉시 롤백 가능), 이후 블루 종료']] },
    { k: '9', g: '배포 유형', tab: '⑨', title: '카나리', pills: [{ t: 'CodeDeployDefault.ECSCanary10Percent5Minutes', mono: true }], sc: scene9,
      caps: [['1', '그린(v2) 태스크 기동, 그린 타깃 그룹에 등록'], ['2', '트래픽 10%만 그린으로 전환'], ['3', '5분 동안 지표(오류율) 관찰'], ['4', '이상 없으면 나머지 90% 전환, 블루 종료']] },
    { k: '10', g: '배포 유형', tab: '⑩', title: '리니어', pills: [{ t: 'CodeDeployDefault.ECSLinear10PercentEvery1Minutes', mono: true }], sc: scene10,
      caps: [['1', '그린(v2) 태스크 기동, 그린 타깃 그룹에 등록'], ['2', '1분마다 10%씩 그린으로 전환'], ['3', '50%: 블루와 그린이 절반씩 처리'], ['4', '100% 전환 후 블루 종료']] },
    { k: '11', g: '배포 시작', tab: '⑪', title: '푸시 방식 배포', pills: [], sc: scene11, v: 'ecs',
      variants: [
        { id: 'ecs', label: 'ECS', caps: [['1', 'CI가 이미지를 빌드해 ECR에 푸시'], ['2', 'CI가 AWS 배포 권한으로 새 태스크 정의 리비전 등록, update-service 호출'], ['3', 'ECS 서비스가 롤링 업데이트로 태스크 교체'], ['4', '배포 기록은 ECS 배포 이력에 남음']] },
        { id: 'ec2', label: 'EC2 + CodeDeploy', caps: [['1', 'CI가 jar와 스크립트를 번들(zip)로 만들어 S3에 업로드'], ['2', 'CI가 AWS 배포 권한으로 create-deployment 호출'], ['3', 'CodeDeploy가 각 서버 에이전트에 배포 지시, 서버 교체'], ['4', '배포 기록은 CodeDeploy 배포 이력에 남음']] },
      ] },
    { k: '12', g: '배포 시작', tab: '⑫', title: 'Argo CD 동기화', pills: [{ t: '파드 4개' }, { t: 'maxSurge 25%', mono: true }, { t: 'maxUnavailable 25%', mono: true }], sc: scene12,
      caps: [['1', 'CI가 ECR에 이미지 푸시, 매니페스트 저장소에 이미지 태그 커밋'], ['2', '클러스터 안 Argo CD가 Git과 비교해 OutOfSync 감지'], ['3', '동기화: Deployment가 파드를 1개씩 롤링 교체'], ['4', '교체 완료 후 Synced, CI는 클러스터에 직접 배포하지 않음']] },
  ];

  /* ---------- 범위(?steps=1-4, ?steps=6,7) ---------- */
  function parseRange() {
    let q = '';
    try { q = (new URLSearchParams(location.search).get('steps') || '').trim().toLowerCase(); } catch (e) {}
    if (!q || q === 'all') return STEPS.map(s => s.k);
    const out = [];
    q.split(',').forEach(part => {
      part = part.trim();
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) { for (let i = +m[1]; i <= +m[2]; i++) out.push(String(i)); }
      else if (part) out.push(part);
    });
    const list = STEPS.map(s => s.k).filter(k => out.includes(k));
    return list.length ? list : STEPS.map(s => s.k);
  }
  const RANGE = parseRange();
  const steps = RANGE.map(k => STEPS.find(s => s.k === k));
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- DOM ---------- */
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const tabs = $('tabs'), heads = $('heads'), capstack = $('capstack'), host = $('host'), bar = $('bar');
  const tabBtns = [];
  if (steps.length < 2) tabs.hidden = true;
  let lastG = null;
  steps.forEach((s, i) => {
    if (s.g !== lastG) {
      lastG = s.g;
      const g = document.createElement('span');
      g.className = 'grp'; g.textContent = s.g; g.setAttribute('aria-hidden', 'true');
      tabs.appendChild(g);
    }
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'tab-' + s.k; b.textContent = s.tab;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.tab + ' ' + s.title);
    b.addEventListener('click', () => go(i, true));
    tabs.appendChild(b); tabBtns.push(b);
    const h = document.createElement('div');
    h.className = 'head';
    h.innerHTML = `<h2><span class="n">${s.tab}</span>${esc(s.title)}</h2>
      <div class="state">${s.pills.map(x => `<span class="pill${x.mono ? ' mono' : ''}">${esc(x.t)}</span>`).join('')}${s.variants
        ? `${s.vlab ? `<span class="vlab">${esc(s.vlab)}</span>` : ''}${s.variants.map(x => `<button type="button" class="vbtn" data-v="${x.id}" aria-pressed="${x.id === s.v}">${esc(x.label)}</button>`).join('')}` : ''}</div>`;
    heads.appendChild(h);
    const mkCaps = (caps) => {
      const ol = document.createElement('ol');
      ol.className = 'caps';
      ol.innerHTML = caps.map(c => `<li><button type="button"><b>${esc(c[0])}</b>${esc(c[1])}</button></li>`).join('');
      ol.querySelectorAll('button').forEach((btn, j) => btn.addEventListener('click', () => seekCap(j)));
      return ol;
    };
    if (s.variants) {
      // 구성별 캡션을 겹쳐 두어 어느 구성이든 높이가 같다
      const wrap = document.createElement('div');
      wrap.className = 'vstack';
      s.variants.forEach(x => { const ol = mkCaps(x.caps); ol.dataset.v = x.id; ol.classList.toggle('on', x.id === s.v); wrap.appendChild(ol); });
      capstack.appendChild(wrap);
      h.querySelectorAll('.vbtn').forEach(btn => btn.addEventListener('click', () => {
        s.v = btn.dataset.v;
        h.querySelectorAll('.vbtn').forEach(b2 => b2.setAttribute('aria-pressed', b2.dataset.v === s.v ? 'true' : 'false'));
        [...wrap.children].forEach(ol => ol.classList.toggle('on', ol.dataset.v === s.v));
        load(i); play();
      }));
    } else capstack.appendChild(mkCaps(s.caps));
  });

  let cur = -1, tl = null, marks = [], seen = false;
  function setCaps(t, dur) {
    const box = capstack.children[cur];
    const caps = (box.classList.contains('vstack') ? box.querySelector(':scope > .on') : box).children;
    const done = t >= dur - 1;
    [...caps].forEach((c, i) => {
      const next = i + 1 < marks.length ? marks[i + 1] : Infinity;
      c.classList.toggle('on', !done && t >= marks[i] && t < next);
      c.classList.toggle('done', done || t >= next);
    });
    bar.style.width = (dur ? Math.min(100, t / dur * 100) : 0) + '%';
  }
  function load(i) {
    if (tl) { tl.pause(); tl = null; }
    cur = i;
    const s = steps[i];
    tabBtns.forEach((b, k) => { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
    [...heads.children].forEach((h, k) => h.classList.toggle('on', k === i));
    [...capstack.children].forEach((h, k) => h.classList.toggle('on', k === i));
    $('scene').setAttribute('aria-labelledby', 'tab-' + s.k);
    const sc = s.sc('s' + s.k, s.v);
    host.innerHTML = sc.svg;
    marks = [];
    if (!window.anime) { setCaps(1, 1); return; }
    tl = anime.timeline({ autoplay: false, easing: 'easeInOutSine', update: (a) => setCaps(a.currentTime, a.duration) });
    sc.build(tl, marks);
    tl.add({ targets: {}, duration: 600 });   // 끝난 장면을 잠시 보여 준다
    setCaps(0, tl.duration);
  }
  function play() {
    if (!tl) return;
    if (reduce) { tl.pause(); tl.seek(tl.duration); setCaps(tl.duration, tl.duration); }
    else tl.restart();
  }
  function seekCap(j) {
    if (!tl) return;
    tl.pause(); tl.seek(marks[j]); setCaps(marks[j], tl.duration);
    if (!reduce) tl.play();
  }
  function go(i, focus) {
    i = Math.max(0, Math.min(steps.length - 1, i));
    load(i);
    if (focus && !tabs.hidden) tabBtns[i].focus();
    if (seen || reduce) play();
  }
  $('replay').addEventListener('click', play);
  document.addEventListener('keydown', (e) => {
    if (steps.length < 2) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1 >= steps.length ? 0 : cur + 1, true); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1 < 0 ? steps.length - 1 : cur - 1, true); }
    else if (e.key === 'Home' && e.target.closest && e.target.closest('#tabs')) { e.preventDefault(); go(0, true); }
    else if (e.key === 'End' && e.target.closest && e.target.closest('#tabs')) { e.preventDefault(); go(steps.length - 1, true); }
  });

  load(0);
  if (reduce) play();
  else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((ents) => {
      if (ents.some(en => en.isIntersecting) && !seen) { seen = true; play(); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe($('fig'));
  } else { seen = true; play(); }
})();
