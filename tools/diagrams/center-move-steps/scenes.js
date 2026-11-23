(function () {
  const $ = (id) => document.getElementById(id);
  const FROM_X = 24, TO_X = 400;
  const BTN = [227, 271];          // 출발센터 모니터 버튼 중심
  const MON = [227, 250];          // 모니터 위쪽
  const PBTN = [217, 271];         // PDA 화면 버튼 중심
  const PTOP = [217, 206];         // PDA 위쪽
  const APBTN = [PBTN[0] + 376, PBTN[1]], APTOP = [PTOP[0] + 376, PTOP[1]];   // 도착센터 PDA
  const SRV = [
    { k: 'ctl', x: 110, l: '입고 관제' },
    { k: 'fld',  x: 250, l: '현장 처리' },
    { k: 'xl',  x: 400, l: '엑셀 처리' },
    { k: 'inv', x: 560, l: '재고 관리' },
  ];
  const SX = Object.fromEntries(SRV.map(s => [s.k, s.x]));

  /* ---------- 글자 폭 추정 ---------- */
  const wOf = (t, han, lat) => [...t].reduce((a, ch) => a + (ch.charCodeAt(0) > 0x1100 ? han : lat), 0);

  /* ---------- drawing ---------- */
  function servers(p, act, list) {
    return (list || SRV).map(s => `<g class="srv ${s.k}${act.includes(s.k) ? '' : ' dim'}">
      <rect id="${p}-h-${s.k}" class="halo" x="${s.x - 45}" y="7" width="90" height="50" rx="10" style="opacity:0"/>
      <rect class="srv-body" x="${s.x - 40}" y="12" width="80" height="40" rx="6"/>
      <line class="slot" x1="${s.x - 30}" y1="24" x2="${s.x + 14}" y2="24"/>
      <line class="slot" x1="${s.x - 30}" y1="32" x2="${s.x + 14}" y2="32"/>
      <line class="slot" x1="${s.x - 30}" y1="40" x2="${s.x + 14}" y2="40"/>
      <circle class="led" cx="${s.x + 26}" cy="24" r="3"/>
      <text class="srv-t" x="${s.x}" y="68">${s.l}</text></g>`).join('');
  }
  function boxes(x0, shelfY, n, idp, hl, hlOn, skip) {
    let s = '';
    for (let i = skip || 0; i < n; i++) {
      const x = x0 + i * 25, y = shelfY - 20;
      s += `<g id="${idp}${i}" class="pop"><rect class="box" x="${x}" y="${y}" width="21" height="20" rx="1.5"/>
        <line class="tape" x1="${x + 10.5}" y1="${y}" x2="${x + 10.5}" y2="${y + 8}"/>
        ${hl ? `<rect class="hl" x="${x - 1.5}" y="${y - 1.5}" width="24" height="23" rx="2.5" style="opacity:${hlOn && i < 3 ? 1 : 0}"/>` : ''}</g>`;
    }
    return s;
  }
  function btnG(p, cx, t, t2) {
    return `<g id="${p}-btn"><rect class="btn" x="${cx - 31}" y="262" width="62" height="18" rx="3"/>
      <text id="${p}-bt" class="btn-t" x="${cx}" y="274.5" text-anchor="middle">${t}</text>
      ${t2 ? `<text id="${p}-bt2" class="btn-t" x="${cx}" y="274.5" text-anchor="middle" style="opacity:0">${t2}</text>` : ''}</g>`;
  }
  function worker(id, x) {
    return `<g id="${id}">
      <line class="leg" x1="${x - 3}" y1="366" x2="${x - 4}" y2="379"/><line class="leg" x1="${x + 3}" y1="366" x2="${x + 4}" y2="379"/>
      <rect class="vest" x="${x - 7}" y="343" width="14" height="24" rx="4"/>
      <circle class="hd" cx="${x}" cy="335" r="6.5"/>
      <rect id="${id}-scr" class="pda-glow" x="${x + 3}" y="343" width="14" height="18" rx="3" style="opacity:0"/>
      <rect class="pda" x="${x + 6}" y="347" width="8" height="11" rx="1.5"/></g>`;
  }
  function building(p, side, x, label, faded, o) {
    o = o || {};
    let s = `<g class="${faded ? 'faded' : ''}">`;
    s += `<polygon class="roof" points="${x},192 ${x + 134},146 ${x + 268},192"/>`;
    s += `<rect class="wall" x="${x + 10}" y="192" width="248" height="188"/>`;
    s += `<text class="bl" x="${x + 134}" y="182" text-anchor="middle">${label}</text>`;
    s += `<line class="rack" x1="${x + 24}" y1="206" x2="${x + 24}" y2="380"/><line class="rack" x1="${x + 134}" y1="206" x2="${x + 134}" y2="380"/>`;
    for (const y of [236, 292, 348]) s += `<line class="rack" x1="${x + 24}" y1="${y}" x2="${x + 134}" y2="${y}"/>`;
    s += boxes(x + 28, 236, 3, p + side + 't') + boxes(x + 28, 292, 4, p + side + 'm', side === 'f', o.hlOn, side === 'f' ? o.taken : 0) + boxes(x + 28, 348, 2, p + side + 'b');
    if (o.mode === 'pda') {
      const wx = o.wx || 196;
      s += `<line id="${p}-tail" class="tail" x1="${x + 193}" y1="302" x2="${x + wx + 9}" y2="345"/>
        <rect class="pda-frame" x="${x + 152}" y="204" width="82" height="98" rx="10"/>
        <rect class="pda-scr" x="${x + 157}" y="214" width="72" height="80" rx="3"/>
        <text class="pda-t" x="${x + 193}" y="234" text-anchor="middle">${o.title}</text>
        <text class="pda-s" x="${x + 193}" y="249" text-anchor="middle">${o.sub || ''}</text>`;
      s += btnG(p, x + 193, o.btn, o.btn2) + worker(p + '-wk', x + wx);
    } else {
      s += `<line class="desk" x1="${x + 156}" y1="306" x2="${x + 252}" y2="306"/>
        <line class="desk" x1="${x + 162}" y1="306" x2="${x + 162}" y2="380"/><line class="desk" x1="${x + 246}" y1="306" x2="${x + 246}" y2="380"/>
        <rect class="stand" x="${x + 199}" y="294" width="8" height="12"/>
        <rect class="mon" x="${x + 168}" y="248" width="70" height="46" rx="3"/>`;
      if (o.btn) s += btnG(p, x + 203, o.btn, o.btn2);
    }
    return s + '</g>';
  }
  function chip(id, y, txt, cls, hidden, right) {
    right = right || 184;
    const w = Math.round(wOf(txt, 9, 5.4) + 12), x = right - w;
    return `<g ${id ? `id="${id}"` : ''} ${hidden ? 'style="opacity:0"' : ''}><rect class="chip ${cls}" x="${x}" y="${y + 3}" width="${w}" height="14" rx="7"/>
      <text class="chip-t ${cls}" x="${x + w / 2}" y="${y + 12.8}" text-anchor="middle">${txt}</text></g>`;
  }
  function row(p, i, r) {
    const y = 112 + i * 24;
    return `<g id="${p}-r${i}" class="pop" ${r.hidden ? 'style="opacity:0"' : ''}>
      <rect class="row-bg" x="8" y="${y}" width="180" height="20" rx="3"/>
      ${r.flash ? `<rect id="${p}-fl${i}" class="flash" x="7" y="${y - 1}" width="182" height="22" rx="4" style="opacity:0"/>` : ''}
      <text class="ink" x="14" y="${y + 13.5}" font-size="10">${r.name}</text>
      <text class="mono mut" x="${r.qx || 52}" y="${y + 13.5}" font-size="9.5">${r.qty}</text>
      ${r.chips.map(c => chip(c.id, y, c.t, c.cls, c.hidden)).join('')}</g>`;
  }
  function doc(p, o) {
    const rows = o.rows || [];
    const pills = o.pills || [{ t: '작성중' }];
    return `<g transform="translate(${o.x ?? 262},${o.y ?? 80})"><g id="${p}-doc" class="pop" ${o.hidden ? 'style="opacity:0"' : ''}>
      <rect class="doc-bg" width="196" height="190" rx="6"/>
      <path class="doc-head" d="M6 0h184a6 6 0 0 1 6 6v20H0V6a6 6 0 0 1 6-6z"/>
      <text class="doc-h" x="12" y="17">${o.title || '이동지시서'}</text>
      <text class="mono ink" x="12" y="44" font-size="11" font-weight="600">${o.code || 'MV20261120_00012'}</text>
      <text class="mut" x="12" y="60" font-size="9.5">${o.sub || '출발센터 → 도착센터'}</text>
      <text id="${p}-ref" class="mut" x="12" y="75" font-size="9" ${o.refHidden ? 'style="opacity:0"' : ''}>${o.ref || '이동 참조키 ✓'}</text>
      ${pills.map((pl, i) => `<g id="${p}-pl${i}" ${pl.hidden ? 'style="opacity:0"' : ''}><rect class="pill-r" x="12" y="82" width="${Math.round(wOf(pl.t, 9.4, 5.6) + 18)}" height="16" rx="8"/>
        <text class="pill-t" x="21" y="93.6">${pl.t}</text></g>`).join('')}
      <line class="sep" x1="8" y1="106" x2="188" y2="106"/>
      ${rows.length ? rows.map((r, i) => row(p, i, r)).join('') : '<text class="mut" x="98" y="146" font-size="10" text-anchor="middle">상품 없음</text>'}
    </g></g>`;
  }
  function card(id, x, y, w, h, title, body, hidden) {
    return `<g transform="translate(${x},${y})"><g id="${id}" class="pop" ${hidden ? 'style="opacity:0"' : ''}>
      <rect class="doc-bg" width="${w}" height="${h}" rx="5"/>
      <path class="slip-head" d="M5 0h${w - 10}a5 5 0 0 1 5 5v13H0V5a5 5 0 0 1 5-5z"/>
      <text class="doc-h" x="9" y="13">${title}</text>${body}</g></g>`;
  }
  // w를 비우면 글자 폭으로 계산한다. anchor 'r'이면 x가 오른쪽 끝, 'c'이면 가운데.
  function badgeG(id, cls, x, y, txt, anchor, hidden) {
    const w = Math.round(wOf(txt, 9.4, 5.6) + 16);
    const x0 = anchor === 'r' ? x - w : anchor === 'c' ? x - w / 2 : x;
    return `<g ${id ? `id="${id}"` : ''} ${hidden === false ? '' : 'style="opacity:0"'}><rect class="badge ${cls}" x="${x0}" y="${y}" width="${w}" height="17" rx="8.5"/>
      <text class="badge-t ${cls}" x="${x0 + w / 2}" y="${y + 11.8}" text-anchor="middle">${txt}</text></g>`;
  }
  const badge = (id, cls, x, y, txt, anchor) => badgeG(id, cls, x, y, txt, anchor, true);
  const pkt = (id, cls) => `<circle id="${id}" class="pkt ${cls}" r="5" cx="0" cy="0" style="opacity:0"/>`;
  const cursor = (p, at) => `<circle id="${p}-rip" class="rip" cx="${at[0]}" cy="${at[1]}" r="2" style="opacity:0"/>
    <g id="${p}-cur" class="cur" style="opacity:0"><path d="M0 0 L0 15 L4 11 L7 18 L9.5 17 L6.5 10 L12 10 Z"/></g>`;

  function base(p, act, o, aria, overlay) {
    return `<svg class="sv" viewBox="0 0 680 410" role="img" aria-label="${aria}">
      <rect class="roadbg" x="292" y="381" width="108" height="16"/><line class="road" x1="298" y1="389" x2="396" y2="389"/>
      ${building(p, 'f', FROM_X, '출발센터', !!o.arrive, o.arrive ? {} : o)}
      ${building(p, 't', TO_X, '도착센터', !o.arrive, o.arrive ? o : {})}
      <line class="ground" x1="8" y1="380" x2="672" y2="380"/>
      ${servers(p, act, o.srv)}
      ${overlay}
      ${cursor(p, o.mode === 'pda' ? (o.arrive ? APBTN : PBTN) : BTN)}
    </svg>`;
  }

  /* ---------- motion helpers ---------- */
  function click(tl, p, at) {
    at = at || BTN;
    tl.add({ targets: `#${p}-cur`, opacity: [0, 1], translateX: [330, at[0]], translateY: [372, at[1]], duration: 750, easing: 'easeOutCubic' })
      .add({ targets: `#${p}-rip`, r: [2, 18], opacity: [1, 0], duration: 450, easing: 'easeOutQuad' })
      .add({ targets: `#${p}-cur`, opacity: [1, 0], duration: 250 }, '-=250');
  }
  function fly(tl, id, a, b, dur, off) {
    dur = dur || 650;
    tl.add({ targets: '#' + id, cx: [a[0], b[0]], cy: [a[1], b[1]], duration: dur, easing: 'easeInOutQuad',
      opacity: [{ value: [0, 1], duration: 100 }, { value: 1, duration: dur - 200 }, { value: 0, duration: 100 }] }, off);
  }
  function pulse(tl, p, k) {
    tl.add({ targets: `#${p}-h-${k}`, opacity: [{ value: [0, 1], duration: 180 }, { value: 0, duration: 420 }], easing: 'easeOutQuad' }, '-=120');
  }
  function flash(tl, sels, off) {
    tl.add({ targets: sels, opacity: [{ value: [0, 1], duration: 150 }, { value: 0, duration: 600 }], easing: 'easeOutQuad' }, off);
  }
  const show = (tl, sel, dur, off) => tl.add({ targets: sel, opacity: [0, 1], duration: dur || 250, easing: 'linear' }, off);
  const hide = (tl, sel, dur, off) => tl.add({ targets: sel, opacity: [1, 0], duration: dur || 250, easing: 'linear' }, off);
  const popIn = (tl, sel, off) => tl.add({ targets: sel, opacity: [0, 1], scale: [0.2, 1], duration: 650, easing: 'easeOutBack' }, off);

  /* ---------- ① 이동지시 생성 ---------- */
  function scene1(p) {
    const overlay = doc(p, { hidden: true, refHidden: true }) + `
      ${badge(p + '-key', 'key', 560, 78, '참조키 발급', 'c')}
      <g id="${p}-cnt" style="opacity:0"><rect class="cnt-b" x="44" y="78" width="132" height="17" rx="8.5"/>
        <text id="${p}-cnt-t" class="cnt-t" x="110" y="89.8" text-anchor="middle">MV20261120_00001</text></g>
      <path id="${p}-to" class="toarr" d="M458 120 Q 506 92 532 136" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>
      <polygon id="${p}-toh" class="tohead" points="533,142 525,131 538,130" style="opacity:0"/>
      <text id="${p}-tol" class="tolbl" x="486" y="94" style="opacity:0">도착센터</text>
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}`;
    const svg = base(p, ['ctl', 'inv'], { btn: '이동 생성' }, '출발센터 관리 화면에서 이동 생성을 누르면 입고 관제 서버가 재고 관리 시스템에서 이동 참조키를 받고, 이동 번호를 매겨 작성중 상태의 이동지시서를 만드는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p);
      fly(tl, p + '-k1', MON, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration); fly(tl, p + '-k2', [SX.ctl, 6], [SX.inv, 6], 800); pulse(tl, p, 'inv');
      tl.add({ targets: `#${p}-key`, translateX: [0, SX.ctl - SX.inv], duration: 1000, easing: 'easeInOutQuad',
        opacity: [{ value: [0, 1], duration: 150 }, { value: 1, duration: 700 }, { value: 0, duration: 150 }] });
      m.push(tl.duration); show(tl, `#${p}-cnt`, 200);
      const o = { n: 1 };
      tl.add({ targets: o, n: [1, 12], round: 1, duration: 800, easing: 'easeOutQuad',
        update: () => { const el = $(p + '-cnt-t'); if (el) el.textContent = 'MV20261120_' + String(o.n).padStart(5, '0'); } });
      m.push(tl.duration + 300); hide(tl, `#${p}-cnt`, 250, '+=300');
      tl.add({ targets: `#${p}-doc`, opacity: [0, 1], translateX: [BTN[0] - 360, 0], translateY: [BTN[1] - 175, 0], scale: [0.08, 1], duration: 900, easing: 'easeOutBack' }, '-=150');
      show(tl, `#${p}-ref`, 300);
      tl.add({ targets: `#${p}-to`, strokeDashoffset: [100, 0], duration: 650, easing: 'easeInOutSine' });
      show(tl, [`#${p}-toh`, `#${p}-tol`], 200);
    };
    return { svg, build };
  }

  /* ---------- ② 상품 등록 ---------- */
  function scene2(p) {
    const rows = [
      { name: '상품 A', qty: '40', hidden: true, chips: [{ t: '초기', cls: 'init' }] },
      { name: '상품 B', qty: '25', hidden: true, chips: [{ t: '초기', cls: 'init' }] },
      { name: '상품 C', qty: '90', hidden: true, chips: [{ t: '업로드 실패', cls: 'bad' }] },
    ];
    const overlay = doc(p, { rows }) + `
      ${badge(p + '-stk', 'ok', 560, 78, '가용 120 ≥ 요청 40 ✓', 'c')}
      <g id="${p}-xls" style="opacity:0"><rect class="xls" x="-13" y="-16" width="26" height="32" rx="2"/>
        <path class="xls-l" d="M-8 -7h16M-8 0h16M-8 7h16M-1 -12v24"/></g>
      ${pkt(p + '-k1', 'c-fld')}${pkt(p + '-k2', 'c-fld')}`;
    const svg = base(p, ['fld', 'xl', 'inv'], { btn: '+ 개별 추가' }, '개별 추가는 현장 처리 서버가 재고 관리 시스템의 가용 재고를 확인하고 상품 행을 초기 상태로 만들고, 엑셀은 엑셀 처리 서버가 받아 실패한 행을 업로드 실패로 남기는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p);
      fly(tl, p + '-k1', MON, [SX.fld, 52], 650); pulse(tl, p, 'fld');
      m.push(tl.duration); fly(tl, p + '-k2', [SX.fld, 6], [SX.inv, 6], 700); pulse(tl, p, 'inv');
      show(tl, `#${p}-stk`, 250);
      m.push(tl.duration + 500);
      tl.add({ targets: `#${p}-r0`, opacity: [0, 1], translateY: [-12, 0], duration: 450, easing: 'easeOutBack' }, '+=500');
      hide(tl, `#${p}-stk`, 250, '-=200');
      m.push(tl.duration + 300);
      tl.add({ targets: `#${p}-xls`, translateX: [MON[0], SX.xl], translateY: [MON[1], 44], duration: 800, easing: 'easeInOutQuad',
        opacity: [{ value: [0, 1], duration: 150 }, { value: 1, duration: 650 }] }, '+=300');
      pulse(tl, p, 'xl');
      tl.add({ targets: `#${p}-xls`, translateX: [SX.xl, 360], translateY: [44, 180], scale: [1, 0.4], opacity: [1, 0], duration: 550, easing: 'easeInQuad' });
      tl.add({ targets: [`#${p}-r1`, `#${p}-r2`], opacity: [0, 1], translateY: [-12, 0], delay: anime.stagger(180), duration: 450, easing: 'easeOutBack' });
      tl.add({ targets: `#${p}-r2`, translateX: [{ value: -5, duration: 60 }, { value: 5, duration: 60 }, { value: -3, duration: 60 }, { value: 0, duration: 60 }], easing: 'linear' }, '+=120');
    };
    return { svg, build };
  }

  /* ---------- ③ 재고 할당(피킹지시 생성) ---------- */
  function scene3(p) {
    const rows = [
      { name: '상품 A', qty: '40', flash: true, chips: [{ id: p + '-c0a', t: '초기', cls: 'init' }, { id: p + '-c0b', t: '피킹지시 생성', cls: 'ok', hidden: true }] },
      { name: '상품 B', qty: '25', chips: [{ t: '초기', cls: 'init' }] },
      { name: '상품 C', qty: '90', chips: [{ t: '업로드 실패', cls: 'bad' }] },
    ];
    const overlay = doc(p, { rows }) + `
      <rect id="${p}-br" class="bracket" x="49" y="268" width="77" height="27" rx="3" style="opacity:0"/>
      <text id="${p}-s1" class="s-lbl s1" x="88" y="262" text-anchor="middle" style="opacity:0">S1 할당 40EA</text>
      <text id="${p}-s0" class="s-lbl s0" x="137" y="262" text-anchor="middle" style="opacity:0">S0</text>
      ${card(p + '-slip', 476, 98, 112, 70, '피킹지시', `
        <text class="ink" x="9" y="33" font-size="9.5">상품 A, 40EA</text>
        <text class="mut" x="9" y="47" font-size="9">재고 키 S1</text>
        ${chip('', 49, '초기', 'init', false, 44)}`, true)}
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-inv')}`;
    const svg = base(p, ['ctl', 'inv'], { btn: '피킹지시 생성' }, '피킹지시 생성을 누르면 재고 관리 시스템이 출발센터 선반의 원재고 S0에서 이동분 S1을 떼어 할당하고, 입고 관제 서버가 피킹지시를 초기 상태로 저장하는 장면', overlay);
    const boxSel = [0, 1, 2].map(i => `#${p}fm${i}`);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p);
      fly(tl, p + '-k1', MON, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration); fly(tl, p + '-k2', [SX.ctl, 6], [SX.inv, 6], 800); pulse(tl, p, 'inv');
      fly(tl, p + '-k3', [SX.inv, 52], [88, 262], 850);
      tl.add({ targets: boxSel, translateY: [{ value: -6, duration: 180 }, { value: 0, duration: 260 }], delay: anime.stagger(90), easing: 'easeOutQuad' });
      tl.add({ targets: boxSel.map(s => s + ' .hl'), opacity: [0, 1], delay: anime.stagger(90), duration: 200, easing: 'linear' }, '-=520');
      show(tl, [`#${p}-br`, `#${p}-s1`, `#${p}-s0`], 300);
      m.push(tl.duration + 200);
      tl.add({ targets: `#${p}-slip`, opacity: [0, 1], scale: [0.2, 1], duration: 700, easing: 'easeOutBack' }, '+=200');
      m.push(tl.duration + 300);
      flash(tl, `#${p}-fl0`, '+=300');
      hide(tl, `#${p}-c0a`, 250, '-=700');
      show(tl, `#${p}-c0b`, 300, '-=500');
    };
    return { svg, build };
  }

  /* ---------- ④ 지시 발송 ---------- */
  function scene4(p) {
    const rows = [
      { name: '상품 A', qty: '40', chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
      { name: '상품 B', qty: '25', chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
    ];
    const pills = [{ t: '작성중' }, { t: '이동요청', hidden: true }];
    const overlay = doc(p, { rows, pills }) + `
      ${badge(p + '-chk', 'ok', 110, 78, '작성중 ✓', 'c')}
      <text id="${p}-none" class="none-t" x="${SX.inv}" y="84" text-anchor="middle" style="opacity:0">호출 없음</text>
      <g transform="translate(318,364)"><g id="${p}-plt" class="pop" style="opacity:0">
        <rect class="plt" x="0" y="0" width="56" height="5" rx="1"/>
        <rect class="plt" x="3" y="5" width="8" height="6"/><rect class="plt" x="24" y="5" width="8" height="6"/><rect class="plt" x="45" y="5" width="8" height="6"/>
        <rect class="plt" x="0" y="11" width="56" height="4" rx="1"/>
        <text class="plt-t" x="28" y="-5" text-anchor="middle">PLT01</text></g></g>
      ${worker(p + '-man', 170)}
      <g id="${p}-bub" class="pop" style="opacity:0">
        <polygon class="bub" points="150,314 158,314 166,327"/>
        <rect class="bub" x="112" y="298" width="52" height="18" rx="9"/>
        <text class="bub-t" x="138" y="310.5" text-anchor="middle">새 지시</text></g>
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}`;
    const svg = base(p, ['ctl'], { btn: '이동 지시 발송' }, '이동 지시 발송을 누르면 입고 관제 서버가 작성중인지 확인하고 기본 파렛트 PLT01을 만든 뒤 지시를 이동요청으로 변경해 출발센터 작업자의 PDA에 새 지시가 보이는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p);
      fly(tl, p + '-k1', MON, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration); show(tl, `#${p}-chk`, 250); show(tl, `#${p}-none`, 250, '-=100');
      m.push(tl.duration + 400);
      hide(tl, `#${p}-chk`, 200, '+=400');
      fly(tl, p + '-k2', [SX.ctl, 52], [346, 352], 900);
      popIn(tl, `#${p}-plt`, '-=120');
      m.push(tl.duration + 300);
      hide(tl, `#${p}-pl0`, 250, '+=300'); show(tl, `#${p}-pl1`, 300, '-=100');
      tl.add({ targets: `#${p}-man-scr`, opacity: [{ value: [0, 1], duration: 160 }, { value: 0.25, duration: 160 }, { value: 1, duration: 160 }, { value: 0.6, duration: 300 }], easing: 'linear' });
      popIn(tl, `#${p}-bub`, '-=600');
    };
    return { svg, build };
  }

  /* ---------- ⑤ 피킹 배치 생성 ---------- */
  function scene5(p) {
    const rows = [
      { name: '상품 A', qty: '40', flash: true, chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
      { name: '상품 B', qty: '25', flash: true, chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
    ];
    const pills = [{ t: '이동요청' }, { t: '피킹', hidden: true }];
    const bcard = (i, y, name) => card(`${p}-b${i}`, 474, y, 176, 62, `피킹 배치 _0${i + 1}`, `
      <text class="ink" x="9" y="34" font-size="9.5">${name}</text>
      ${chip('', 38, '할당 대기', 'init', false, 168)}`, true);
    const overlay = doc(p, { rows, pills }) + `
      ${badge(p + '-chk', 'ok', 132, 78, '이동요청 ✓, 배치 없음 ✓', 'c')}
      ${bcard(0, 96, '상품 A, 40EA')}${bcard(1, 172, '상품 B, 25EA')}
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-ctl')}`;
    const svg = base(p, ['ctl'], { mode: 'pda', title: '피킹 배치', sub: '상품 1개씩', btn: '확정' }, '출발센터 작업자가 PDA에서 확정을 누르면 입고 관제 서버가 지시 상태와 기존 배치를 확인하고 피킹 배치 두 개를 만든 뒤 지시를 피킹으로 변경하는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, PBTN);
      fly(tl, p + '-k1', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration); show(tl, `#${p}-chk`, 250);
      flash(tl, [`#${p}-fl0`, `#${p}-fl1`]);
      m.push(tl.duration + 200);
      hide(tl, `#${p}-chk`, 200, '+=200');
      fly(tl, p + '-k2', [SX.ctl + 40, 32], [562, 127], 800);
      popIn(tl, `#${p}-b0`, '-=150');
      fly(tl, p + '-k3', [SX.ctl + 40, 32], [562, 203], 800, '-=450');
      popIn(tl, `#${p}-b1`, '-=150');
      m.push(tl.duration + 300);
      hide(tl, `#${p}-pl0`, 250, '+=300'); show(tl, `#${p}-pl1`, 300, '-=100');
    };
    return { svg, build };
  }

  /* ---------- ⑥ 피킹 ---------- */
  function scene6(p) {
    const body = `
      <text class="mut" x="9" y="36" font-size="9">배치</text>
      ${chip(p + '-ba0', 24, '할당 대기', 'init', false, 188)}${chip(p + '-ba1', 24, '피킹 중', 'run', true, 188)}
      <text class="ink" x="9" y="58" font-size="9.5">상품 A, 40</text>
      ${chip(p + '-it0', 46, '초기', 'init', false, 188)}${chip(p + '-it1', 46, '피킹 완료', 'ok', true, 188)}
      <text id="${p}-who" class="mut" x="9" y="78" font-size="9" style="opacity:0">작업자 지정 ✓</text>`;
    const overlay = `
      <rect class="bracket" x="49" y="268" width="77" height="27" rx="3"/>
      <text class="s-lbl s1" x="88" y="262" text-anchor="middle">S1 할당 40EA</text>
      <text class="s-lbl s0" x="137" y="262" text-anchor="middle">S0</text>
      ${card(p + '-card', 262, 92, 196, 86, '피킹 배치 MV…_01', body, false)}
      <g><path class="cart" d="M176 344 h36 l-3 22 h-30 z"/><line class="cart" x1="212" y1="344" x2="218" y2="338"/>
        <line class="cart" x1="182" y1="366" x2="183" y2="371"/><line class="cart" x1="206" y1="366" x2="205" y2="371"/>
        <circle class="wheel" cx="183" cy="375" r="4"/><circle class="wheel" cx="205" cy="375" r="4"/></g>
      <line id="${p}-beam" class="beam" x1="170" y1="352" x2="90" y2="284" style="opacity:0"/>
      ${badge(p + '-q', 'key', 30, 298, 'S1 이동 중 40, 원래 로케이션')}
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-ctl')}${pkt(p + '-k4', 'c-inv')}`;
    const svg = base(p, ['ctl', 'inv'], { mode: 'pda', title: '피킹', sub: '_01, 상품 A 40', btn: '작업 시작', btn2: '수량 확정 40', hlOn: true }, '작업자가 PDA에서 작업 시작을 누르면 배치가 피킹 중이 되고, 선반에서 상품을 스캔해 카트에 담고 수량을 확정하면 재고 관리 시스템이 원래 로케이션의 S1에 이동 중 수량을 기록하는 장면', overlay);
    const boxSel = [0, 1, 2].map(i => `#${p}fm${i}`);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, PBTN);
      fly(tl, p + '-k1', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      hide(tl, `#${p}-ba0`, 250); show(tl, [`#${p}-ba1`, `#${p}-who`], 300, '-=150');
      m.push(tl.duration + 200);
      hide(tl, `#${p}-tail`, 200, '+=200');
      tl.add({ targets: `#${p}-wk`, translateX: [0, -60], duration: 900, easing: 'easeInOutSine' }, '-=100');
      tl.add({ targets: `#${p}-beam`, opacity: [{ value: [0, 1], duration: 120 }, { value: 0.2, duration: 120 }, { value: 1, duration: 120 }, { value: 0, duration: 300 }], easing: 'linear' });
      m.push(tl.duration + 100);
      tl.add({ targets: boxSel.map(s => s + ' .hl'), opacity: [1, 0], duration: 200, easing: 'linear' }, '+=100');
      tl.add({ targets: boxSel, translateX: (el, i) => [0, 121.5 - 14 * i], translateY: [0, 75], scale: [1, 0.5], delay: anime.stagger(160), duration: 700, easing: 'easeInOutQuad' });
      hide(tl, `#${p}-bt`, 200); show(tl, `#${p}-bt2`, 200, '-=200');
      click(tl, p, PBTN);
      fly(tl, p + '-k2', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration);
      fly(tl, p + '-k3', [SX.ctl, 6], [SX.inv, 6], 800); pulse(tl, p, 'inv');
      fly(tl, p + '-k4', [SX.inv, 52], [88, 262], 850);
      show(tl, `#${p}-q`, 300);
      hide(tl, `#${p}-it0`, 250, '-=100'); show(tl, `#${p}-it1`, 300, '-=150');
    };
    return { svg, build };
  }

  /* ---------- shared: 출고 대기 구역, 파렛트, 트럭 ---------- */
  const zone = (x = 291, l = '출고 대기', w = 62) => `<rect class="zone" x="${x}" y="330" width="${w}" height="50" rx="4"/>
    <text class="zone-t" x="${x + w / 2}" y="325" text-anchor="middle">${l}</text>`;
  function pallet(id, n, bid, x = 297, hidden = false) {
    let b = '';
    for (let i = 0; i < n; i++) b += `<g id="${bid}${i}"><rect class="box" x="${8 + 12 * i}" y="-10" width="10.5" height="10" rx="1"/>
      <line class="tape" x1="${13.25 + 12 * i}" y1="-10" x2="${13.25 + 12 * i}" y2="-6"/></g>`;
    return `<g transform="translate(${x},364)"><g id="${id}" ${hidden ? 'style="opacity:0"' : ''}>
      <rect class="plt" x="0" y="0" width="50" height="5" rx="1"/>
      <rect class="plt" x="3" y="5" width="8" height="6"/><rect class="plt" x="21" y="5" width="8" height="6"/><rect class="plt" x="39" y="5" width="8" height="6"/>
      <rect class="plt" x="0" y="11" width="50" height="4" rx="1"/>${b}
      <text class="plt-t" x="25" y="${n ? -14 : -4}" text-anchor="middle">PLT01</text></g></g>`;
  }
  function truck(id, hidden, x = 356) {
    return `<g transform="translate(${x},380)"><g id="${id}" ${hidden ? 'style="opacity:0"' : ''}>
      <rect class="truck" x="0" y="-42" width="52" height="32" rx="2"/>
      <path class="cab" d="M52 -30 h10 l6 10 v10 h-16 z"/>
      <rect class="win" x="55" y="-27" width="7" height="7" rx="1"/>
      <g id="${id}-pl"><rect class="plate" x="5" y="-33" width="42" height="12" rx="2"/>
        <text class="plate-t" x="26" y="-24.3" text-anchor="middle">12가3456</text></g>
      <circle class="wheel" cx="12" cy="-5" r="5"/><circle class="wheel" cx="56" cy="-5" r="5"/></g></g>`;
  }
  const ITEMS = [
    { name: '상품 A', qty: '40', chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
    { name: '상품 B', qty: '25', chips: [{ t: '피킹지시 생성', cls: 'ok' }] },
  ];

  /* ---------- ⑦ 피킹 완료 ---------- */
  function scene7(p) {
    const pills = [{ t: '피킹' }, { t: '패킹', hidden: true }];
    const body = `
      <text class="mut" x="9" y="36" font-size="9">배치</text>
      ${chip(p + '-ba0', 24, '피킹 중', 'run', false, 168)}${chip(p + '-ba1', 24, '피킹 완료', 'ok', true, 168)}
      <text class="ink" x="9" y="58" font-size="9.5">상품 A, 40</text>
      ${chip(p + '-it0', 46, '피킹 완료', 'init', false, 168)}${chip(p + '-it1', 46, '패킹 완료', 'ok', true, 168)}
      <text id="${p}-map" class="mut" x="9" y="78" font-size="9" style="opacity:0">PLT01에 적재 ✓</text>`;
    let cb = '';
    for (let i = 0; i < 3; i++) cb += `<g id="${p}-cb${i}"><rect class="box" x="${179 + 11 * i}" y="352" width="10.5" height="10" rx="1"/>
      <line class="tape" x1="${184.25 + 11 * i}" y1="352" x2="${184.25 + 11 * i}" y2="356"/></g>`;
    const overlay = doc(p, { rows: ITEMS, pills }) + zone() + pallet(p + '-plt', 0, '') + `
      <rect class="bracket" x="49" y="268" width="77" height="27" rx="3"/>
      <text id="${p}-s1a" class="s-lbl s1" x="88" y="262" text-anchor="middle">S1 할당 40EA</text>
      <text id="${p}-s1b" class="s-lbl s1" x="88" y="262" text-anchor="middle" style="opacity:0">S1 0</text>
      <text class="s-lbl s0" x="137" y="262" text-anchor="middle">S0</text>
      ${card(p + '-card', 474, 96, 176, 86, '피킹 배치 MV…_01', body, false)}
      <g id="${p}-cart"><path class="cart" d="M176 344 h36 l-3 22 h-30 z"/><line class="cart" x1="212" y1="344" x2="218" y2="338"/>
        <line class="cart" x1="182" y1="366" x2="183" y2="371"/><line class="cart" x1="206" y1="366" x2="205" y2="371"/>
        <circle class="wheel" cx="183" cy="375" r="4"/><circle class="wheel" cx="205" cy="375" r="4"/>${cb}</g>
      ${badge(p + '-s2', 'key', 262, 300, 'S2 출고 대기 40')}
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-inv')}`;
    const svg = base(p, ['ctl', 'inv'], { mode: 'pda', title: '피킹', sub: '_01, 상품 A 40', btn: '작업완료', taken: 3 }, '작업자가 PDA에서 작업완료를 누르면 입고 관제 서버가 배치를 끝내고 상품을 파렛트 PLT01에 올린 것으로 기록하고, 재고 관리 시스템은 출고 대기 로케이션에 S2를 만들고 지시는 패킹이 되는 장면', overlay);
    const cbs = [0, 1, 2].map(i => `#${p}-cb${i}`);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, PBTN);
      fly(tl, p + '-k1', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      m.push(tl.duration + 100);
      hide(tl, `#${p}-tail`, 200, '+=100');
      tl.add({ targets: [`#${p}-cart`, `#${p}-wk`], translateX: [0, 40], duration: 800, easing: 'easeInOutSine' }, '-=100');
      tl.add({ targets: cbs, translateX: (el, i) => [0, 86 + i], translateY: [{ value: -38, duration: 320, easing: 'easeOutQuad' }, { value: 2, duration: 380, easing: 'easeInQuad' }],
        delay: anime.stagger(150), duration: 700, easing: 'linear' });
      hide(tl, [`#${p}-ba0`, `#${p}-it0`], 250); show(tl, [`#${p}-ba1`, `#${p}-it1`, `#${p}-map`], 300, '-=150');
      m.push(tl.duration);
      fly(tl, p + '-k2', [SX.ctl, 6], [SX.inv, 6], 800); pulse(tl, p, 'inv');
      fly(tl, p + '-k3', [SX.inv, 52], [322, 348], 850);
      show(tl, `#${p}-s2`, 300);
      hide(tl, `#${p}-s1a`, 250, '-=200'); show(tl, `#${p}-s1b`, 300, '-=100');
      m.push(tl.duration + 300);
      hide(tl, `#${p}-pl0`, 250, '+=300'); show(tl, `#${p}-pl1`, 300, '-=100');
    };
    return { svg, build };
  }

  /* ---------- ⑧ 입고지와 배차 ---------- */
  function scene8(p) {
    const pills = [{ t: '패킹' }, { t: '배차 중', hidden: true }];
    const rows = [
      { name: '입고지', qty: '', flash: true, chips: [{ id: p + '-a0', t: '미지정', cls: 'init' }, { id: p + '-a1', t: '도착센터', cls: 'ok', hidden: true }] },
      { name: 'PLT01', qty: '상품 2', qx: 56, flash: true, chips: [{ id: p + '-c0', t: '미배차', cls: 'init' }, { id: p + '-c1', t: '12가3456', cls: 'ok', hidden: true }] },
    ];
    const overlay = doc(p, { rows, pills }) + zone() + pallet(p + '-plt', 3, p + '-pb') + `
      <rect id="${p}-phl" class="hl" x="293" y="344" width="58" height="38" rx="3" style="opacity:0"/>
      ${truck(p + '-tr', true)}
      ${badge(p + '-adr', 'ok', 534, 196, '입고지 ✓', 'c')}
      ${badge(p + '-chk', 'ok', 110, 78, '미배차 파렛트 0 ✓', 'c')}
      <text id="${p}-none" class="none-t" x="${SX.inv}" y="84" text-anchor="middle" style="opacity:0">호출 없음</text>
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-ctl')}`;
    const svg = base(p, ['ctl'], { mode: 'pda', title: '이동출고', sub: 'MV…_00012', btn: '입고지 저장', btn2: '배차', taken: 3 }, '작업자가 PDA에서 도착센터 입고지를 저장하고 파렛트 PLT01에 차량번호를 넣으면 트럭이 배정되고, 미배차 파렛트가 없으므로 입고 관제 서버가 지시를 배차 중으로 변경하는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, PBTN);
      fly(tl, p + '-k1', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      flash(tl, `#${p}-fl0`);
      hide(tl, `#${p}-a0`, 250, '-=600'); show(tl, `#${p}-a1`, 300, '-=400');
      popIn(tl, `#${p}-adr`, '-=200');
      m.push(tl.duration + 200);
      flash(tl, [`#${p}-fl1`, `#${p}-phl`], '+=200');
      tl.add({ targets: [0, 1, 2].map(i => `#${p}-pb${i}`), translateY: [{ value: -4, duration: 160 }, { value: 0, duration: 220 }], delay: anime.stagger(90), easing: 'easeOutQuad' }, '-=500');
      m.push(tl.duration + 200);
      hide(tl, `#${p}-bt`, 200, '+=200'); show(tl, `#${p}-bt2`, 200, '-=200');
      click(tl, p, PBTN);
      fly(tl, p + '-k2', PTOP, [SX.ctl, 52], 650); pulse(tl, p, 'ctl');
      tl.add({ targets: `#${p}-tr`, translateX: [230, 0], opacity: [{ value: [0, 1], duration: 200 }], duration: 1200, easing: 'easeOutCubic' });
      hide(tl, `#${p}-c0`, 250, '-=300'); show(tl, `#${p}-c1`, 300, '-=150');
      m.push(tl.duration + 200);
      show(tl, `#${p}-chk`, 250, '+=200'); show(tl, `#${p}-none`, 250, '-=150');
      hide(tl, `#${p}-pl0`, 250, '+=200'); show(tl, `#${p}-pl1`, 300, '-=100');
    };
    return { svg, build };
  }

  /* ---------- ⑨ 이동출고 ---------- */
  function scene9(p) {
    const srv = SRV.map(s => s.k === 'xl' ? { ...s, l: '메시지 처리' } : s);
    const pills = [{ t: '배차 중' }, { t: '출고', hidden: true }];
    const overlay = doc(p, { rows: ITEMS, pills }) + zone() + pallet(p + '-plt', 3, p + '-pb') + `
      ${truck(p + '-tr', false)}
      <line class="zone" x1="292" y1="32" x2="358" y2="32"/>
      <text class="kafka-t" x="325" y="47" text-anchor="middle">Kafka</text>
      ${badge(p + '-chk', 'ok', 198, 78, '조건 검증 ✓', 'c')}
      ${badge(p + '-mvo', 'key', 560, 78, 'S2 → 0, 출고 이력 −40', 'c')}
      ${card(p + '-po', 474, 200, 156, 62, '이동 발주', `
        <text class="mono ink" x="9" y="33" font-size="9">MV20261120_00012</text>
        <text class="mut" x="9" y="50" font-size="9">검수 합격 40</text>`, true)}
      ${pkt(p + '-k1', 'c-fld')}${pkt(p + '-k2', 'c-fld')}${pkt(p + '-k3', 'c-xl')}${pkt(p + '-k4', 'c-xl')}`;
    const svg = base(p, ['fld', 'xl', 'inv'], { mode: 'pda', title: '이동출고', sub: '배차 12가3456', btn: '이동출고', taken: 3, srv }, '작업자가 PDA에서 이동출고 버튼을 누르면 현장 처리 서버가 조건을 확인하고 지시를 출고로 저장하고, 재고 관리 시스템이 S2를 비우면 트럭이 도착센터로 떠나고, Kafka 이동 발주 메시지로 도착센터에 이동 발주가 생기는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, PBTN);
      fly(tl, p + '-k1', PTOP, [SX.fld, 52], 700); pulse(tl, p, 'fld');
      show(tl, `#${p}-chk`, 250);
      m.push(tl.duration + 300);
      hide(tl, `#${p}-chk`, 200, '+=300');
      hide(tl, `#${p}-pl0`, 250); show(tl, `#${p}-pl1`, 300, '-=100');
      m.push(tl.duration + 200);
      fly(tl, p + '-k2', [SX.fld, 6], [SX.inv, 6], 800, '+=200'); pulse(tl, p, 'inv');
      show(tl, `#${p}-mvo`, 250);
      tl.add({ targets: `#${p}-plt`, translateX: [0, 52], opacity: [1, 0], duration: 650, easing: 'easeInQuad' });
      tl.add({ targets: `#${p}-tr`, translateX: [0, 170], duration: 1300, easing: 'easeInOutCubic' });
      m.push(tl.duration);
      fly(tl, p + '-k3', [292, 32], [358, 32], 600); pulse(tl, p, 'xl');
      fly(tl, p + '-k4', [SX.xl, 52], [552, 228], 750);
      popIn(tl, `#${p}-po`, '-=150');
    };
    return { svg, build };
  }

  /* ---------- shared: 도착센터 ---------- */
  const AZ = 538;                                   // 도착센터 입고 대기 구역 x
  const ADOC = { x: 44, y: 100, title: '이동 발주', sub: '출발센터 → 도착센터', ref: '이동 참조키로 출고 이력과 연결' };
  const arrive = (o) => ({ mode: 'pda', arrive: true, wx: 218, ...o });

  /* ---------- ⑩ 입하 확정 ---------- */
  function scene10(p) {
    const rows = [
      { name: '상품 A', qty: '40', flash: true, chips: [{ id: p + '-a0', t: '입하 전', cls: 'init' }, { id: p + '-a1', t: '입하완료', cls: 'ok', hidden: true }] },
      { name: '상품 B', qty: '25', flash: true, chips: [{ id: p + '-b0', t: '입하 전', cls: 'init' }, { id: p + '-b1', t: '입하완료', cls: 'ok', hidden: true }] },
    ];
    const pills = [{ t: '도착 지시 없음' }, { t: '대기', hidden: true }];
    const overlay = doc(p, { ...ADOC, rows, pills }) + zone(AZ, '입고 대기', 60) + pallet(p + '-plt', 3, p + '-pb', AZ + 5, true) + `
      ${truck(p + '-tr', false, 330)}
      ${badge(p + '-chk', 'ok', 142, 78, '이동 발주 ✓, 입하 이력 없음 ✓', 'c')}
      ${badge(p + '-c1', 'key', 548, 300, 'C1 입고 대기 40', 'r')}
      ${badge(p + '-mvi', 'key', 560, 78, '입고 이력 +40, 이동 참조키', 'c')}
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-fld')}${pkt(p + '-k3', 'c-fld')}${pkt(p + '-k4', 'c-inv')}`;
    const svg = base(p, ['ctl', 'fld', 'inv'], arrive({ title: '입하 확정', sub: 'MV…_00012', btn: '입하확정' }), '트럭이 도착센터에 도착하면 작업자가 PDA에서 입하확정을 누르면 물건은 입고 대기 로케이션으로 들어가고, 도착 지시가 대기 상태로 생기며, 재고 관리 시스템은 입고 이력을 남기고 입고 대기 로케이션에 C1 재고를 만드는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration);
      tl.add({ targets: `#${p}-tr`, translateX: [-150, 0], opacity: [{ value: [0, 1], duration: 200 }], duration: 1100, easing: 'easeOutCubic' });
      click(tl, p, APBTN);
      fly(tl, p + '-k1', APTOP, [SX.ctl, 52], 800); pulse(tl, p, 'ctl');
      show(tl, `#${p}-chk`, 250);
      m.push(tl.duration + 300);
      hide(tl, `#${p}-chk`, 200, '+=300');
      fly(tl, p + '-k2', APTOP, [SX.fld, 52], 750); pulse(tl, p, 'fld');
      tl.add({ targets: `#${p}-plt`, translateX: [-205, 0], opacity: [{ value: [0, 1], duration: 150 }], duration: 1100, easing: 'easeInOutQuad' });
      flash(tl, [`#${p}-fl0`, `#${p}-fl1`], '-=200');
      hide(tl, [`#${p}-a0`, `#${p}-b0`], 250, '-=600'); show(tl, [`#${p}-a1`, `#${p}-b1`], 300, '-=400');
      m.push(tl.duration + 300);
      hide(tl, `#${p}-pl0`, 250, '+=300'); show(tl, `#${p}-pl1`, 300, '-=100');
      m.push(tl.duration + 200);
      fly(tl, p + '-k3', [SX.fld, 6], [SX.inv, 6], 800, '+=200'); pulse(tl, p, 'inv');
      show(tl, `#${p}-mvi`, 250);
      fly(tl, p + '-k4', [SX.inv, 52], [AZ + 30, 350], 850);
      popIn(tl, `#${p}-c1`, '-=150');
    };
    return { svg, build };
  }

  /* ---------- ⑪ 적치 할당 ---------- */
  function scene11(p) {
    const rows = [
      { name: '상품 A', qty: '40', chips: [{ t: '대기', cls: 'init' }] },
      { name: '상품 B', qty: '25', chips: [{ t: '대기', cls: 'init' }] },
    ];
    const pills = [{ t: '대기' }, { t: '진행', hidden: true }];
    const overlay = doc(p, { ...ADOC, rows, pills }) + zone(AZ, '입고 대기', 60) + pallet(p + '-plt', 3, p + '-pb', AZ + 5) + `
      <rect id="${p}-phl" class="hl" x="${AZ - 2}" y="344" width="64" height="38" rx="3" style="opacity:0"/>
      ${badge(p + '-chk', 'ok', 142, 78, '이동 발주 ✓, 대기 ✓', 'c')}
      ${badgeG(p + '-c1a', 'key', 542, 300, 'C1 입고 대기 40', 'r', false)}
      ${badge(p + '-c1b', 'key', 542, 300, 'C1 할당 40/40', 'r')}
      <text id="${p}-none" class="none-t" x="${SX.fld}" y="84" text-anchor="middle" style="opacity:0">호출 없음</text>
      ${card(p + '-st', 44, 300, 196, 54, '할당 재고 기록', `
        <text class="ink" x="9" y="34" font-size="9.5">상품 A, 재고 키 C1</text>
        <text class="ink" x="9" y="47" font-size="9.5">상품 B, 재고 키 C1</text>`, true)}
      <g id="${p}-bub" class="pop" style="opacity:0">
        <polygon class="bub" points="598,314 606,314 616,327"/>
        <rect class="bub" x="548" y="298" width="68" height="18" rx="9"/>
        <text class="bub-t" x="582" y="310.5" text-anchor="middle">목록 표시</text></g>
      ${pkt(p + '-k1', 'c-ctl')}${pkt(p + '-k2', 'c-ctl')}${pkt(p + '-k3', 'c-inv')}${pkt(p + '-k4', 'c-ctl')}`;
    const svg = base(p, ['ctl', 'inv'], arrive({ title: '적치 할당', sub: 'MV…_00012', btn: '이동지시' }), '작업자가 PDA에서 이동지시를 누르면 입고 관제 서버가 이동 발주인지 확인하고 도착 지시를 진행으로 변경하고, 재고 관리 시스템이 입고 대기 로케이션의 C1을 전량 할당하면 이동 확정 목록에 나타나는 장면', overlay);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, APBTN);
      fly(tl, p + '-k1', APTOP, [SX.ctl, 52], 850); pulse(tl, p, 'ctl');
      show(tl, `#${p}-chk`, 250); show(tl, `#${p}-none`, 250, '-=150');
      m.push(tl.duration + 300);
      hide(tl, [`#${p}-chk`, `#${p}-none`], 200, '+=300');
      hide(tl, `#${p}-pl0`, 250); show(tl, `#${p}-pl1`, 300, '-=100');
      m.push(tl.duration + 200);
      fly(tl, p + '-k2', [SX.ctl, 6], [SX.inv, 6], 900, '+=200'); pulse(tl, p, 'inv');
      fly(tl, p + '-k3', [SX.inv, 52], [AZ + 30, 350], 850);
      flash(tl, `#${p}-phl`);
      hide(tl, `#${p}-c1a`, 200, '-=500'); show(tl, `#${p}-c1b`, 300, '-=300');
      m.push(tl.duration + 200);
      fly(tl, p + '-k4', [SX.ctl, 52], [142, 300], 800, '+=200');
      popIn(tl, `#${p}-st`, '-=150');
      tl.add({ targets: `#${p}-wk-scr`, opacity: [{ value: [0, 1], duration: 160 }, { value: 0.25, duration: 160 }, { value: 1, duration: 160 }, { value: 0.6, duration: 300 }], easing: 'linear' });
      popIn(tl, `#${p}-bub`, '-=600');
    };
    return { svg, build };
  }

  /* ---------- ⑫ 이동 확정 ---------- */
  function scene12(p) {
    const rows = [
      { name: '상품 A', qty: '40', flash: true, chips: [{ id: p + '-a0', t: '대기', cls: 'init' }, { id: p + '-a1', t: '완료', cls: 'ok', hidden: true }] },
      { name: '상품 B', qty: '25', flash: true, chips: [{ id: p + '-b0', t: '대기', cls: 'init' }, { id: p + '-b1', t: '완료', cls: 'ok', hidden: true }] },
    ];
    const pills = [{ t: '진행' }, { t: '완료', hidden: true }];
    const overlay = doc(p, { ...ADOC, rows, pills }) + zone(AZ, '입고 대기', 60) + pallet(p + '-plt', 3, p + '-pb', AZ + 5) + `
      <rect id="${p}-dst" class="bracket" x="476" y="324" width="56" height="26" rx="3" style="opacity:0"/>
      ${badgeG(p + '-c1a', 'key', 548, 300, 'C1 할당 40/40', 'r', false)}
      ${badge(p + '-c1b', 'key', 548, 300, 'C1 0', 'r')}
      ${badge(p + '-c2', 'ok', 498, 387, 'C2 목적 로케이션 40', 'c')}
      ${badge(p + '-mv', 'key', 560, 78, '이동 이력 −40/+40', 'c')}
      ${badge(p + '-lst', 'ok', 256, 78, '진행 목록 1건', 'c')}
      ${pkt(p + '-k1', 'c-fld')}${pkt(p + '-k2', 'c-fld')}${pkt(p + '-k3', 'c-fld')}${pkt(p + '-k4', 'c-inv')}`;
    const svg = base(p, ['fld', 'inv'], arrive({ title: '이동 확정', sub: '상품 A 40', btn: '상품 스캔', btn2: '확정 40' }), '작업자가 상품을 스캔해 대기 목록을 보고, 입고 대기 파렛트의 상품을 목적 로케이션에 적치한 뒤 확정하면 현장 처리 서버가 상품과 지시를 완료로 변경하고, 재고 관리 시스템은 C1을 비우고 목적 로케이션에 C2를 만드는 장면', overlay);
    const pb = [0, 1, 2].map(i => `#${p}-pb${i}`);
    const build = (tl, m) => {
      m.push(tl.duration); click(tl, p, APBTN);
      fly(tl, p + '-k1', APTOP, [SX.fld, 52], 800); pulse(tl, p, 'fld');
      show(tl, `#${p}-lst`, 250);
      m.push(tl.duration + 300);
      hide(tl, `#${p}-lst`, 200, '+=300');
      show(tl, `#${p}-dst`, 250);
      tl.add({ targets: pb, translateX: (el, i) => [0, -71 + 3 * i], translateY: [{ value: -40, duration: 350, easing: 'easeOutQuad' }, { value: -16, duration: 400, easing: 'easeInQuad' }],
        delay: anime.stagger(160), duration: 750, easing: 'linear' });
      hide(tl, `#${p}-bt`, 200); show(tl, `#${p}-bt2`, 200, '-=200');
      click(tl, p, APBTN);
      fly(tl, p + '-k2', APTOP, [SX.fld, 52], 800); pulse(tl, p, 'fld');
      m.push(tl.duration);
      flash(tl, `#${p}-fl0`);
      hide(tl, `#${p}-a0`, 250, '-=600'); show(tl, `#${p}-a1`, 300, '-=400');
      flash(tl, `#${p}-fl1`, '+=150');
      hide(tl, `#${p}-b0`, 250, '-=600'); show(tl, `#${p}-b1`, 300, '-=400');
      hide(tl, `#${p}-pl0`, 250, '+=150'); show(tl, `#${p}-pl1`, 300, '-=100');
      m.push(tl.duration + 200);
      fly(tl, p + '-k3', [SX.fld, 6], [SX.inv, 6], 800, '+=200'); pulse(tl, p, 'inv');
      show(tl, `#${p}-mv`, 250);
      hide(tl, `#${p}-c1a`, 200); show(tl, `#${p}-c1b`, 300, '-=100');
      fly(tl, p + '-k4', [SX.inv, 52], [504, 352], 900);
      hide(tl, `#${p}-dst`, 200, '-=200');
      popIn(tl, `#${p}-c2`, '-=100');
    };
    return { svg, build };
  }

  /* ---------- 전체 흐름 (680x410) ---------- */
  const OVX = [44, 94, 144, 194, 258, 308, 358, 422, 472, 536, 586, 636];
  const OVS = [
    { n: ['이동지시', '생성'], s: ['ctl', 'inv'] }, { n: ['상품', '등록'], s: ['fld', 'xl', 'inv'] },
    { n: ['재고', '할당'], s: ['ctl', 'inv'] }, { n: ['지시', '발송'], s: ['ctl'] },
    { n: ['피킹', '배치'], s: ['ctl'] }, { n: ['피킹'], s: ['ctl', 'inv'] },
    { n: ['피킹', '완료'], s: ['ctl', 'inv'] }, { n: ['입고지', '배차'], s: ['ctl'] },
    { n: ['이동', '출고'], s: ['fld', 'inv'] }, { n: ['입하', '확정'], s: ['fld', 'inv'] },
    { n: ['적치', '할당'], s: ['ctl', 'inv'] }, { n: ['이동', '확정'], s: ['fld', 'inv'] },
  ];
  const OVST = [[0, 2, '작성중'], [3, 3, '이동요청'], [4, 5, '피킹'], [6, 6, '패킹'],
    [7, 7, '배차 중'], [8, 8, '출고'], [9, 9, '대기', 1], [10, 10, '진행', 1], [11, 11, '완료', 1]];
  const OVPH = [[0, 3, '출발센터 관리 화면'], [4, 6, '출발센터 PDA'], [7, 8, '배차, 출고'], [9, 11, '도착센터 PDA']];
  const CIRC = '①②③④⑤⑥⑦⑧⑨⑩⑪⑫';
  function mbox(id, x, y, hl) {
    return `<g id="${id}" class="pop"><rect class="box" x="${x}" y="${y}" width="24" height="22" rx="1.5"/>
      <line class="tape" x1="${x + 12}" y1="${y}" x2="${x + 12}" y2="${y + 9}"/>
      ${hl ? `<rect class="hl ${hl}" x="${x - 2}" y="${y - 2}" width="28" height="26" rx="3" style="opacity:0"/>` : ''}</g>`;
  }
  function sceneOv(p, ctx) {
    const Y = 62;
    const can = (ctx && ctx.canGo) || (() => false);
    let s = `<svg id="${p}" class="sv" viewBox="0 0 680 410" role="img" aria-label="센터 간 재고이동 12단계 전체 흐름. 출발센터 관리 화면에서 이동지시를 만들고 재고를 할당해 발송하고, 출발센터 PDA로 피킹해 출고 대기 파렛트에 싣고, 배차 뒤 이동출고하면 트럭이 도착센터로 가고, 도착센터는 입고 대기 로케이션에 입하한 뒤 목적 로케이션에 적치하는 장면">`;
    for (const [a, b, t] of OVPH) {
      const x1 = OVX[a] - 22, x2 = OVX[b] + 22;
      s += `<path class="ph" d="M${x1} 34 V27 H${x2} V34"/><text class="ph-t" x="${(x1 + x2) / 2}" y="19" text-anchor="middle">${t}</text>`;
    }
    s += `<line class="trk" x1="${OVX[0]}" y1="${Y}" x2="${OVX[11]}" y2="${Y}"/>
      <line id="${p}-prog" class="trk-on" x1="${OVX[0]}" y1="${Y}" x2="${OVX[0]}" y2="${Y}"/>`;
    OVS.forEach((st, i) => {
      const x = OVX[i], go = can(String(i + 1));
      s += `<g class="nd${go ? ' go' : ''}" ${go ? `data-go="${i + 1}" tabindex="0" role="button" aria-label="${CIRC[i]} ${st.n.join(' ')} 단계 보기"` : ''}>
        <rect class="nd-hit" x="${x - 25}" y="${Y - 14}" width="50" height="80"/>
        <circle class="nd-c" cx="${x}" cy="${Y}" r="12"/>
        <text class="nd-n" x="${x}" y="${Y + 4}" text-anchor="middle">${i + 1}</text>
        ${st.n.map((l, k) => `<text class="nd-l" x="${x}" y="${Y + 30 + k * 13}" text-anchor="middle">${l}</text>`).join('')}
        ${st.s.map((k, j) => `<circle class="c-${k} sd" cx="${x + (j - (st.s.length - 1) / 2) * 10}" cy="${Y + 60}" r="3.6"/>`).join('')}</g>`;
    });
    s += '<g pointer-events="none">';
    OVX.forEach((x, i) => {
      s += `<g id="${p}-on${i}" class="pop" style="opacity:0"><circle class="nd-on" cx="${x}" cy="${Y}" r="12"/>
        <text class="nd-on-t" x="${x}" y="${Y + 4}" text-anchor="middle">${i + 1}</text></g>`;
    });
    s += '</g>';
    s += `<text class="st-cap" x="${OVX[0] - 22}" y="150">출발 지시</text><text class="st-cap" x="${OVX[9] - 22}" y="150">도착 지시</text>`;
    for (const [a, b, t, arr] of OVST) {
      const x1 = OVX[a] - 24, x2 = OVX[b] + 24, c = arr ? ' arr' : '';
      s += `<rect class="st${c}" x="${x1}" y="157" width="${x2 - x1}" height="24" rx="4"/>`;
      s += `<text class="st-t${c}" x="${(x1 + x2) / 2}" y="173" text-anchor="middle">${t}</text>`;
    }
    // 아래: 두 센터 장면(원래 1200 폭 좌표를 축소)
    s += `<g transform="translate(4,${236 - 184 * 0.56}) scale(0.56)">`;
    s += `<polygon class="roof" points="30,222 355,184 680,222"/><rect class="wall" x="40" y="222" width="630" height="178"/>
      <text class="bl" x="355" y="214" text-anchor="middle" font-size="20">출발센터</text>
      <line class="desk" x1="64" y1="364" x2="188" y2="364"/><line class="desk" x1="70" y1="364" x2="70" y2="400"/><line class="desk" x1="182" y1="364" x2="182" y2="400"/>
      <rect class="stand" x="122" y="352" width="8" height="12"/><rect class="mon" x="80" y="296" width="92" height="56" rx="3"/>
      <g id="${p}-doc" class="pop" style="opacity:0"><rect class="doc-bg" x="112" y="304" width="28" height="38" rx="2"/>
        <rect class="slip-head" x="112" y="304" width="28" height="8" rx="2"/>
        <line class="sep" x1="117" y1="320" x2="135" y2="320"/><line class="sep" x1="117" y1="327" x2="135" y2="327"/><line class="sep" x1="117" y1="334" x2="130" y2="334"/></g>
      <text class="mut" x="126" y="286" font-size="16" font-weight="600" text-anchor="middle">관리 화면</text>
      <line class="rack" x1="230" y1="240" x2="230" y2="400"/><line class="rack" x1="420" y1="240" x2="420" y2="400"/>
      <line class="rack" x1="230" y1="290" x2="420" y2="290"/><line class="rack" x1="230" y1="345" x2="420" y2="345"/>
      ${[240, 268, 296, 324, 352, 380].map((x, i) => mbox(`${p}-t${i}`, x, 268)).join('')}
      ${[240, 268].map((x, i) => mbox(`${p}-m${i}`, x, 323)).join('')}
      ${[0, 1, 2].map(i => mbox(`${p}-pk${i}`, 296 + 28 * i, 323, 'ovh')).join('')}
      ${[240, 268, 380].map((x, i) => mbox(`${p}-b${i}`, x, 378)).join('')}
      <rect class="zone" x="470" y="340" width="96" height="60" rx="4"/><text class="zone-t" x="518" y="332" font-size="16" text-anchor="middle">출고 대기</text>
      <rect class="plt" x="478" y="388" width="82" height="6" rx="1"/><rect class="plt" x="482" y="394" width="10" height="6"/><rect class="plt" x="514" y="394" width="10" height="6"/><rect class="plt" x="546" y="394" width="10" height="6"/>
      <g transform="translate(0,20)">${worker(p + '-wk', 616)}</g>`;
    s += `<rect class="roadbg" x="680" y="401" width="224" height="16"/><line class="road" x1="686" y1="409" x2="898" y2="409"/>
      <g transform="translate(0,20)">${truck(p + '-trk', true, 694)}</g>`;
    s += `<polygon class="roof" points="900,222 1040,186 1180,222"/><rect class="wall" x="910" y="222" width="260" height="178"/>
      <text class="bl" x="1040" y="214" text-anchor="middle" font-size="20">도착센터</text>
      <rect class="zone" x="926" y="340" width="96" height="60" rx="4"/><text class="zone-t" x="974" y="332" font-size="16" text-anchor="middle">입고 대기</text>
      <rect class="plt" x="932" y="388" width="82" height="6" rx="1"/><rect class="plt" x="936" y="394" width="10" height="6"/><rect class="plt" x="968" y="394" width="10" height="6"/><rect class="plt" x="1000" y="394" width="10" height="6"/>
      ${[0, 1, 2].map(i => `<g id="${p}-ab${i}" style="opacity:0">${mbox(`${p}-abx${i}`, 936 + 26 * i, 366, 'ovh2')}</g>`).join('')}
      <line class="rack" x1="1066" y1="240" x2="1066" y2="400"/><line class="rack" x1="1162" y1="240" x2="1162" y2="400"/>
      <line class="rack" x1="1066" y1="290" x2="1162" y2="290"/><line class="rack" x1="1066" y1="345" x2="1162" y2="345"/>
      ${[1072, 1100].map((x, i) => mbox(`${p}-at${i}`, x, 268)).join('')}
      <g transform="translate(0,20)">${worker(p + '-wk2', 1040)}</g>
      <line class="ground" x1="16" y1="400" x2="1184" y2="400"/>`;
    s += '</g>';
    const svg = s + '</svg>';
    const build = (tl, m) => {
      let px = OVX[0];
      const lit = (i, off) => {
        if (i > 0) tl.add({ targets: `#${p}-prog`, x2: [px, OVX[i]], duration: 380, easing: 'easeInOutQuad' }, off);
        px = OVX[i];
        tl.add({ targets: `#${p}-on${i}`, opacity: [0, 1], scale: [0.4, 1], duration: 380, easing: 'easeOutBack' }, i > 0 ? '-=80' : off);
      };
      const pk = [0, 1, 2].map(i => `#${p}-pk${i}`), ab = [0, 1, 2].map(i => `#${p}-ab${i}`);
      m.push(tl.duration);
      lit(0); popIn(tl, `#${p}-doc`, '-=150');
      lit(1, '+=200');
      lit(2, '+=200'); show(tl, `#${p} .ovh`, 300, '-=100');
      lit(3, '+=200');
      m.push(tl.duration + 400);
      lit(4, '+=400'); tl.add({ targets: `#${p}-wk-scr`, opacity: [0, 1], duration: 300, easing: 'linear' });
      lit(5, '+=200');
      lit(6, '+=200');
      tl.add({ targets: pk, translateX: (el, i) => [0, 186 - 2 * i], translateY: [{ value: -30, duration: 350, easing: 'easeOutQuad' }, { value: 43, duration: 450, easing: 'easeInQuad' }],
        delay: anime.stagger(150), duration: 800, easing: 'linear' });
      hide(tl, `#${p} .ovh`, 250, '-=300');
      m.push(tl.duration + 400);
      hide(tl, `#${p}-wk-scr`, 200, '+=400');
      lit(7);
      show(tl, `#${p}-trk`, 350, '-=100');
      lit(8, '+=300');
      hide(tl, pk, 300, '-=100');
      tl.add({ targets: `#${p}-trk`, translateX: [0, 136], duration: 1300, easing: 'easeInOutQuad' });
      m.push(tl.duration + 300);
      lit(9, '+=300');
      tl.add({ targets: ab, opacity: [0, 1], translateY: [-12, 0], delay: anime.stagger(140), duration: 450, easing: 'easeOutQuad' }, '-=100');
      lit(10, '+=300'); show(tl, `#${p} .ovh2`, 300, '-=100');
      tl.add({ targets: `#${p}-wk2-scr`, opacity: [0, 1], duration: 300, easing: 'linear' }, '-=300');
      lit(11, '+=300');
      tl.add({ targets: ab, translateX: (el, i) => [0, 136 + 2 * i], translateY: [{ value: -66, duration: 380, easing: 'easeOutQuad' }, { value: -43, duration: 380, easing: 'easeInQuad' }],
        delay: anime.stagger(150), duration: 760, easing: 'linear' });
      hide(tl, `#${p} .ovh2`, 250, '-=200');
    };
    return { svg, build };
  }

  /* ---------- 재고 키 변화 ---------- */
  function kcard(p, k, x, y, loc, states, hidden) {
    let s = `<g transform="translate(${x},${y})"><g id="${p}-${k}" class="pop" ${hidden ? 'style="opacity:0"' : ''}>
      <rect id="${p}-${k}-fl" class="flash" x="-3" y="-3" width="126" height="84" rx="7" style="opacity:0"/>
      <rect class="doc-bg" width="120" height="78" rx="5"/>
      <path class="khead" d="M5 0h110a5 5 0 0 1 5 5v13H0V5a5 5 0 0 1 5-5z"/>
      <text class="doc-h" x="8" y="13">${k}</text><text class="doc-h" x="112" y="13" text-anchor="end" font-size="9" font-weight="600">${loc}</text>`;
    ['재고', '할당', '이동 중'].forEach((r, i) => { s += `<text class="k-l" x="8" y="${33 + i * 13}">${r}</text>`; });
    states.forEach((st, j) => {
      s += `<g id="${p}-${k}-g${j}" ${j ? 'style="opacity:0"' : ''}>${st.v.map((v, i) => `<text class="k-v" x="112" y="${33 + i * 13}" text-anchor="end">${v}</text>`).join('')}
        <text class="k-f" x="8" y="71">${st.f}</text></g>`;
    });
    return s + '</g></g>';
  }
  const WR = [
    { s: '⑦', t: '이동 이력', q: 'S1 −40' }, { s: '⑦', t: '이동 이력', q: 'S2 +40' },
    { s: '⑨', t: '출고 이력', q: 'S2 −40', r: 1 }, { s: '⑩', t: '입고 이력', q: 'C1 +40', r: 1 },
    { s: '⑫', t: '이동 이력', q: 'C1 −40' }, { s: '⑫', t: '이동 이력', q: 'C2 +40' },
  ];
  const KSTEP = ['③ 재고 할당', '⑥ 피킹', '⑦ 피킹 완료', '⑨ 이동출고', '⑩ 입하 확정', '⑪ 적치 할당', '⑫ 이동 확정'];
  function sceneKeys(p) {
    const C = { S0: [94, 101], S1: [94, 199], S2: [254, 151], C1: [434, 151], C2: [594, 151] };
    const s = `<svg class="sv" viewBox="0 0 680 410" role="img" aria-label="이동 1건에 재고 키가 다섯 개 생기는 과정. 출발센터 원래 로케이션의 S0에서 S1을 떼어 할당하고, 피킹 완료 때 출고 대기 로케이션에 S2를 만들며, 도착센터는 입고 대기 로케이션에 C1을 만들고 이동 확정 때 목적 로케이션에 C2를 만드는 과정. S2와 C1은 재고 키로 연결되지 않고, 출고 이력과 입고 이력의 이동 참조키로만 연결되는 장면">
      <defs><marker id="${p}-ah" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto"><path class="khd" d="M0 0L8 4L0 8z"/></marker></defs>
      <text id="${p}-st" class="mut" x="340" y="26" font-size="12" text-anchor="middle">이동 1건, 할당 40, 피킹 40 기준</text>
      ${KSTEP.map((t, j) => `<text id="${p}-st${j}" class="kn" x="340" y="26" font-size="13" text-anchor="middle" style="opacity:0">${t}</text>`).join('')}
      <rect class="frame" x="20" y="40" width="316" height="208" rx="6"/><text class="fr-t" x="30" y="56">출발센터 재고 관리</text>
      <rect class="frame" x="350" y="40" width="316" height="208" rx="6"/><text class="fr-t" x="360" y="56">도착센터 재고 관리</text>
      <g id="${p}-a1" style="opacity:0"><line class="karr" x1="94" y1="142" x2="94" y2="158" marker-end="url(#${p}-ah)"/>
        <text class="k-f" x="100" y="154">원재고 키</text></g>
      <g id="${p}-a2" style="opacity:0"><line class="karr" x1="156" y1="196" x2="191" y2="163" marker-end="url(#${p}-ah)"/>
        <text class="k-f" x="176" y="198">원재고 키</text></g>
      <g id="${p}-nl" style="opacity:0"><line class="nolink" x1="316" y1="151" x2="372" y2="151"/>
        <path class="xmark" d="M337 144l14 14M351 144l-14 14"/>
        <rect class="row-bg" x="306" y="166" width="76" height="30" rx="4" style="fill:var(--scene)"/>
        <text class="kn" x="344" y="178" text-anchor="middle" style="fill:var(--bad)">재고 키</text>
        <text class="kn" x="344" y="191" text-anchor="middle" style="fill:var(--bad)">연결 없음</text></g>
      <g id="${p}-a4" style="opacity:0"><line class="karr" x1="496" y1="151" x2="531" y2="151" marker-end="url(#${p}-ah)"/>
        <text class="k-f" x="514" y="207" text-anchor="middle">원재고 키</text>
        <line class="karr" x1="514" y1="198" x2="514" y2="156" style="stroke-dasharray:2 2;stroke-width:1"/></g>
      ${kcard(p, 'S0', 34, 62, '원래 로케이션', [{ v: ['100', '0', '0'], f: '원재고' }, { v: ['60', '0', '0'], f: '원재고, 재고 −40' }])}
      ${kcard(p, 'S1', 34, 160, '원래 로케이션', [{ v: ['40', '40', '0'], f: '참조키 = 이동 번호' }, { v: ['40', '40', '40'], f: '참조키 = 이동 번호' }, { v: ['0', '0', '0'], f: '참조키 = 이동 번호' }], true)}
      ${kcard(p, 'S2', 194, 112, '출고 대기', [{ v: ['40', '0', '0'], f: '피킹 수량' }, { v: ['0', '0', '0'], f: '출고로 비움' }], true)}
      ${kcard(p, 'C1', 374, 112, '입고 대기', [{ v: ['40', '0', '0'], f: '원재고 키 없음' }, { v: ['40', '40', '40'], f: '원재고 키 없음' }, { v: ['0', '0', '0'], f: '이동 확정으로 비움' }], true)}
      ${kcard(p, 'C2', 534, 112, '목적 로케이션', [{ v: ['40', '0', '0'], f: '적치 완료' }], true)}
      <text class="fr-t" x="20" y="272">재고 이력, 이동 1건에 6행</text>
      ${WR.map((w, i) => {
        const x = 20 + i * 108;
        return `<rect class="wr-slot" x="${x}" y="280" width="100" height="50" rx="4"/>
          <g id="${p}-w${i}" class="pop" style="opacity:0"><rect class="wr${w.r ? ' ref' : ''}" x="${x}" y="280" width="100" height="50" rx="4"/>
          <text class="wr-t" x="${x + 8}" y="297"><tspan font-weight="700">${w.t}</tspan><tspan class="wr-n" dx="5">${w.s}</tspan></text>
          <text class="wr-n mono" x="${x + 8}" y="311">${w.q}</text>
          ${w.r ? `<text class="wr-r" x="${x + 8}" y="324">이동 참조키</text>` : ''}</g>`;
      }).join('')}
      <g id="${p}-lk" style="opacity:0"><path class="reflink" d="M286 332 Q340 366 394 332"/>
        <text class="lnk-t" x="340" y="378" text-anchor="middle">같은 이동 참조키가 출발과 도착을 연결하는 유일한 값</text></g>
      <g id="${p}-tok" style="opacity:0"><circle class="tok" r="11"/><text class="tok-t" y="3.6" text-anchor="middle">40</text></g>
    </svg>`;
    let si = -1;
    const build = (tl, m) => {
      const step = (j, off) => {
        hide(tl, si < 0 ? `#${p}-st` : `#${p}-st${si}`, 200, off);
        show(tl, `#${p}-st${j}`, 250, '-=50'); si = j;
      };
      const sw = (k, a, b, off) => {
        flash(tl, `#${p}-${k}-fl`, off);
        hide(tl, `#${p}-${k}-g${a}`, 200, '-=650'); show(tl, `#${p}-${k}-g${b}`, 250, '-=50');
      };
      const tok = (a, b, dur, off) => {
        tl.add({ targets: `#${p}-tok`, translateX: [C[a][0], C[b][0]], translateY: [C[a][1], C[b][1]],
          opacity: [{ value: [0, 1], duration: 120 }, { value: 1, duration: dur - 240 }, { value: 0, duration: 120 }],
          duration: dur, easing: 'easeInOutQuad' }, off);
      };
      m.push(tl.duration);
      step(0);
      sw('S0', 0, 1, '+=150');
      tok('S0', 'S1', 800, '+=100');
      show(tl, `#${p}-a1`, 250, '-=200'); popIn(tl, `#${p}-S1`, '-=200');
      m.push(tl.duration + 400);
      step(1, '+=400'); sw('S1', 0, 1, '+=100');
      step(2, '+=400');
      tok('S1', 'S2', 800, '+=100');
      show(tl, `#${p}-a2`, 250, '-=200'); popIn(tl, `#${p}-S2`, '-=200');
      sw('S1', 1, 2, '+=100');
      popIn(tl, `#${p}-w0`, '+=100'); popIn(tl, `#${p}-w1`, '-=450');
      m.push(tl.duration + 400);
      step(3, '+=400');
      tok('S2', 'C1', 1100, '+=100');
      show(tl, `#${p}-nl`, 300, '-=650');
      sw('S2', 0, 1, '-=500');
      popIn(tl, `#${p}-w2`, '-=300');
      step(4, '+=200'); popIn(tl, `#${p}-C1`, '-=100');
      popIn(tl, `#${p}-w3`, '+=100');
      show(tl, `#${p}-lk`, 350);
      m.push(tl.duration + 400);
      step(5, '+=400'); sw('C1', 0, 1, '+=100');
      step(6, '+=400');
      tok('C1', 'C2', 800, '+=100');
      show(tl, `#${p}-a4`, 250, '-=200'); popIn(tl, `#${p}-C2`, '-=200');
      sw('C1', 1, 2, '+=100');
      popIn(tl, `#${p}-w4`, '+=100'); popIn(tl, `#${p}-w5`, '-=450');
    };
    return { svg: s, build };
  }

  /* ---------- 단계 정의 ---------- */
  const ST = (l, a, b) => ({ l, a, b });
  const STEPS = [
    { k: '1', tab: '①', title: '이동지시 생성', st: [ST('출발 지시', '없음', '작성중')], sc: scene1,
      caps: [['1', '"이동 생성" 클릭'], ['2', '재고 관리가 이동 참조키 발급'], ['3', '이동 번호 채번'], ['4', '이동지시서 생성(작성중)']] },
    { k: '2', tab: '②', title: '상품 등록', st: [ST('상품', '없음', '초기')], sc: scene2,
      caps: [['1', '"개별 추가"를 현장 처리 서버로'], ['2', '재고 관리에서 가용 재고 확인'], ['3', '상품 행 생성(초기)'], ['4', '엑셀 업로드, 실패 행은 업로드 실패']] },
    { k: '3', tab: '③', title: '재고 할당(피킹지시 생성)', st: [ST('상품', '초기', '피킹지시 생성')], sc: scene3,
      caps: [['1', '"피킹지시 생성" 클릭'], ['2', '재고 관리가 S0에서 S1 분리'], ['3', '피킹지시 저장(초기)'], ['4', '상품 상태 피킹지시 생성']] },
    { k: '4', tab: '④', title: '지시 발송', st: [ST('출발 지시', '작성중', '이동요청')], sc: scene4,
      caps: [['1', '"이동 지시 발송" 클릭'], ['2', '작성중인지 확인'], ['3', '기본 파렛트 PLT01 생성'], ['4', '이동요청, PDA에 지시 표시']] },
    { k: '5', tab: '⑤', title: '피킹 배치 생성', st: [ST('출발 지시', '이동요청', '피킹')], sc: scene5,
      caps: [['1', 'PDA에서 "확정" 탭'], ['2', '지시 상태와 중복 배치 확인'], ['3', '피킹 배치 _01, _02 생성'], ['4', '지시 상태 피킹']] },
    { k: '6', tab: '⑥', title: '피킹', st: [ST('피킹 아이템', '초기', '피킹 완료')], sc: scene6,
      caps: [['1', '"작업 시작"으로 배치 지정'], ['2', '로케이션과 상품 스캔'], ['3', '카트에 담고 수량 확정'], ['4', '재고 관리가 S1에 이동 중 수량 기록']] },
    { k: '7', tab: '⑦', title: '피킹 완료', st: [ST('출발 지시', '피킹', '패킹')], sc: scene7,
      caps: [['1', 'PDA에서 "작업완료" 탭'], ['2', '배치 완료, 상품을 PLT01에 적재'], ['3', '재고 관리가 출고 대기에 S2 생성'], ['4', '지시 상태 패킹']] },
    { k: '8', tab: '⑧', title: '입고지와 배차', st: [ST('출발 지시', '패킹', '배차 중')], sc: scene8,
      caps: [['1', '도착센터 입고지 지정'], ['2', '파렛트에 실린 상품 확인'], ['3', '파렛트에 차량번호 입력'], ['4', '미배차 0이면 배차 중']] },
    { k: '9', tab: '⑨', title: '이동출고', st: [ST('출발 지시', '배차 중', '출고')], sc: scene9,
      caps: [['1', '"이동출고" 탭, 조건 검증'], ['2', '지시를 먼저 출고로 저장'], ['3', '재고 관리가 S2를 비우고 출고 이력 기록'], ['4', 'Kafka 메시지로 도착센터 이동 발주 생성']] },
    { k: '10', tab: '⑩', title: '입하 확정', st: [ST('도착 지시', '없음', '대기')], sc: scene10,
      caps: [['1', '트럭 도착, "입하확정" 탭'], ['2', '입고 대기 로케이션으로 전량 입하'], ['3', '도착 지시 생성(대기)'], ['4', '재고 관리가 입고 이력을 남기고 C1 생성']] },
    { k: '11', tab: '⑪', title: '적치 할당', st: [ST('도착 지시', '대기', '진행')], sc: scene11,
      caps: [['1', '"이동지시" 탭, 발주 검증'], ['2', '도착 지시 상태 진행'], ['3', '재고 관리가 C1 전량 할당'], ['4', '할당 재고 저장, 이동 확정 목록에 표시']] },
    { k: '12', tab: '⑫', title: '이동 확정', st: [ST('도착 지시', '진행', '완료')], sc: scene12,
      caps: [['1', '상품 스캔, 진행 목록 조회'], ['2', '목적 로케이션에 적치하고 수량 확정'], ['3', '상품과 지시 상태 완료'], ['4', '재고 관리가 C1을 비우고 C2 생성']] },
    { k: 'keys', tab: '재고 키', title: '재고 키 변화', st: [ST('출발', 'S0', 'S1 → S2'), ST('도착', 'C1', 'C2')], sc: sceneKeys,
      caps: [['③', 'S0에서 할당분을 떼어 S1 생성'], ['⑥ ⑦', 'S1 이동 중 표시, 출고 대기에 S2 생성'], ['⑨ ⑩', 'S2 출고(출고 이력), 입고 대기에 C1 입하(입고 이력)'], ['⑪ ⑫', 'C1 할당, 목적 로케이션에 C2 생성']] },
    { k: 'overview', tab: '전체', title: '센터 간 재고이동 12단계', st: [ST('출발 지시', '작성중', '출고'), ST('도착 지시', '대기', '완료')], sc: sceneOv,
      caps: [['①~④ 출발센터 관리 화면', '지시를 만들고 상품을 등록한 뒤 재고를 할당해 발송'], ['⑤~⑦ 출발센터 PDA', '원래 로케이션에서 피킹해 출고 대기 파렛트에 적재'], ['⑧~⑨ 배차, 출고', '입고지와 파렛트를 배차하고 트럭으로 출고'], ['⑩~⑫ 도착센터 PDA', '입고 대기에 입하하고 목적 로케이션에 적치해 확정']] },
  ];

  /* ---------- 범위(?steps=) ---------- */
  function parseRange() {
    let q = '';
    try { q = (new URLSearchParams(location.search).get('steps') || '').trim().toLowerCase(); } catch (e) {}
    if (!q || q === 'all') return STEPS.map(s => s.k);
    const out = [];
    q.split(',').forEach(part => {
      part = part.trim();
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) { for (let i = +m[1]; i <= +m[2]; i++) out.push(String(i)); }
      else if (part === 'key') out.push('keys');
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
  if (steps.length < 2) tabs.hidden = true;
  steps.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'tab-' + s.k; b.textContent = s.tab;
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-label', s.tab === '전체' || s.tab === '재고 키' ? s.title : s.tab + ' ' + s.title);
    b.addEventListener('click', () => go(i, true));
    tabs.appendChild(b);
    const h = document.createElement('div');
    h.className = 'head';
    h.innerHTML = `<h2>${/^\d+$/.test(s.k) ? `<span class="n">${s.tab}</span>` : ''}${esc(s.title)}</h2>
      <div class="state">${s.st.map((x, j) => `${j ? '<span class="sp"></span>' : ''}<span>${esc(x.l)}</span><span class="pill">${esc(x.a)}</span>→<span class="pill new">${esc(x.b)}</span>`).join('')}</div>`;
    heads.appendChild(h);
    const ol = document.createElement('ol');
    ol.className = 'caps';
    ol.innerHTML = s.caps.map(c => `<li><button type="button"><b>${esc(c[0])}</b>${esc(c[1])}</button></li>`).join('');
    capstack.appendChild(ol);
    ol.querySelectorAll('button').forEach((btn, j) => btn.addEventListener('click', () => seekCap(j)));
  });

  let cur = -1, tl = null, marks = [], seen = false;
  function setCaps(t, dur) {
    const caps = capstack.children[cur].children;
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
    [...tabs.children].forEach((b, k) => { b.setAttribute('aria-selected', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
    [...heads.children].forEach((h, k) => h.classList.toggle('on', k === i));
    [...capstack.children].forEach((h, k) => h.classList.toggle('on', k === i));
    $('scene').setAttribute('aria-labelledby', 'tab-' + s.k);
    const sc = s.sc('s' + s.k, { canGo: (k) => RANGE.includes(k) });
    host.innerHTML = sc.svg;
    marks = [];
    if (!window.anime) { setCaps(1, 1); return; }
    tl = anime.timeline({ autoplay: false, easing: 'easeInOutSine', update: (a) => setCaps(a.currentTime, a.duration) });
    sc.build(tl, marks);
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
    if (focus && !tabs.hidden) tabs.children[i].focus();
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
  const goNode = (el) => { const k = steps.findIndex(s => s.k === el.dataset.go); if (k >= 0) go(k, true); };
  host.addEventListener('click', (e) => { const el = e.target.closest && e.target.closest('[data-go]'); if (el) goNode(el); });
  host.addEventListener('keydown', (e) => {
    const el = e.target.closest && e.target.closest('[data-go]');
    if (el && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); goNode(el); }
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
