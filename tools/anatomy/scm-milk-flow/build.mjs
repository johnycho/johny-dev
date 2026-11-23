// 물류센터 입고 흐름: 우유 100박스, 층별 분해 단면 (anatomy Hero)
// node tools/anatomy/scm-milk-flow/build.mjs [--light] [--warehouse]
// --warehouse: 같은 센터 모형으로 그림 2(창고 > 존 > 로케이션 > 로트, 유통기한이 이른 로트부터 출고)를 만든다 → static/diagrams/scm-warehouse(-light).html
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ANATOMY = process.env.ANATOMY_HOME || join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(ANATOMY, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(ANATOMY, "kit/lathe.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(ANATOMY, "scripts/inline-kit.mjs")).href);
// 빌드와 페이지가 같은 함수를 쓰도록 kit 함수를 전역 이름으로 둔다 (페이지에서는 kitScript가 같은 이름을 만든다)
Object.assign(globalThis, k);


// ---- 사람이 읽는 문구 (한 곳에 모음) ----
const WAREHOUSE = process.argv.includes("--warehouse");
const TEXT_FLOW = {
  fig: "그림 1",
  title: "물류센터 입고와 출고 흐름",
  hint: "클릭하면 정지, → 다음 단계",
  aria: "물류센터 입고와 출고 흐름. 클릭하거나 스페이스를 누르면 멈추고, 오른쪽 화살표로 다음 단계로 넘어갑니다.",
  svgLabel:
    "4층 물류센터 모형입니다. 1층에서 입차, 하차, 검수를 거쳐 정상 박스는 2층 냉장존에 적치하고 불량 박스는 반품 구역으로 보냅니다. 4층 사무실에서 받은 수량으로 정산하고, 주문이 들어오면 2층에서 피킹해 1층에서 포장한 뒤 출고 트럭에 실어 내보냅니다.",
  page: "물류센터 입고와 출고 흐름",
  display: { freezer: "-18°C", rack: "A-01" },
  readout: {
    entry: "1층 정문, 우유 {total}박스 트럭 입차",
    assign: "1층 도크, 1번 도크 배정",
    dock: "1층 1번 도크, 트럭 접안",
    unload: "1층 입고 대기, 팔레트 하차 {n}/{pallets}",
    inspect: "1층 검수대, 검수 {n}/{total} (정상 {ok}, 불량 {bad})",
    store: "2층 냉장존 A-01, {rack}박스 적치, 불량 {bin}박스 반품",
    settle: "4층 사무실, 받은 {rack}박스로 정산",
    order: "4층 사무실, 출고 주문 {order}박스",
    pick: "2층 A-01, 10/22 로트부터 피킹 (재고 {from} → {stock})",
    down: "반송기, {order}박스를 1층으로",
    pack: "1층 포장대, 포장 {n}/{order}",
    load: "1층 2번 도크, 출고 트럭 상차 {n}/{order}",
    exit: "1층 정문, 출고 트럭 출차",
  },
  keys: [
    ["blue", "공정과 설비(파랑): 정문, 도크, 검수대, 반송기 (입고 관제)"],
    ["green", "정상(초록): 통과한 박스와 2층 A-01 랙 (재고 관리)"],
    ["pink", "불량(분홍): 불량 박스와 반품 구역 (입고 관제의 반품 모듈)"],
    ["orange", "정산(주황): 4층 정산 계기 (정산)"],
    ["brown", "출고(갈색): 피킹부터 상차까지의 경로"],
    ["indigo", "냉장존(남색): 2층"],
    ["teal", "냉동존(청록): 3층, 영하 보관"],
    ["kurly", "작업자(보라): 단계마다 일하는 사람"],
    ["safety", "지게차와 안전선(노랑): 팔레트를 나르는 장비와 보행 구역 구분선"],
    ["wrap", "랩 팔레트(흰색): 랩으로 감싼 짐, 핸드자키로 옮김"],
    ["truck", "트럭: 흰색은 입고(공급사), 보라는 출고"],
    ["lit", "흰 테두리 막대: 불량만 반품 구역으로 보내는 분기 게이트"],
    ["glow", "빛나는 테두리: 지금 단계의 구역"],
  ],
  caption:
    "정산은 주문 수량(100)이 아니라 검수에서 받은 수량(95)을 기준으로 합니다. 출고는 유통기한이 이른 10/22 로트부터 피킹합니다. 층 배치와 수량은 예시입니다.",
};
// 그림 2: 그림 1과 같은 센터에서 위치 계층과 먼저 나갈 로트의 출고만 따라간다
const TEXT_W = {
  fig: "그림 2",
  title: "창고 위치 계층",
  hint: TEXT_FLOW.hint,
  aria: "창고 위치 계층. 클릭하거나 스페이스를 누르면 멈추고, 오른쪽 화살표로 다음 단계로 넘어갑니다.",
  svgLabel: "그림 1과 같은 4층 물류센터 모형입니다. 2층은 냉장존, 3층은 냉동존, 4층은 상온존으로 사용하고, 냉장존의 로케이션 A-01에 로트별로 보관합니다. 유통기한이 이른 10/22 로트를 먼저 출고해 1층에서 포장하고 출고 트럭에 실어 내보냅니다.",
  page: "창고 위치 계층",
  display: TEXT_FLOW.display,
  readout: {
    v_house: "창고 전체, 2층 냉장, 3층 냉동, 4층 상온",
    v_chill: "2층 냉장존",
    v_freeze: "3층 냉동존, 영하 보관",
    v_ambient: "4층 상온존",
    v_cell: "2층 냉장존, 로케이션 A-01",
    v_lot: "2층 A-01, 10/22 로트 유통기한 임박",
    pick: "2층 A-01, 10/22 로트 먼저 출고 (재고 {from} → {stock})",
    down: "반송기, {order}박스를 1층으로",
    pack: "1층 포장대, 포장 {n}/{order}",
    load: "1층 2번 도크, 출고 트럭 상차 {n}/{order}",
    exit: "1층 정문, 출고 트럭 출차",
  },
  keys: [
    ["indigo", "냉장존(남색): 2층"],
    ["teal", "냉동존(청록): 3층, 영하 보관"],
    ["orange", "상온존(주황): 4층"],
    ["green", "로케이션과 로트(초록): A-01 같은 랙의 칸, 칸 안의 상자가 로트"],
    ["pink", "먼저 나갈 로트(분홍): 유통기한이 이른 10/22 로트"],
    ["brown", "출고(갈색): 피킹부터 상차까지의 경로"],
    ["kurly", "작업자(보라): 운반, 피킹, 포장, 상차"],
    ["safety", "지게차와 안전선(노랑): 팔레트를 나르는 장비와 보행 구역 구분선"],
    ["wrap", "랩 팔레트(흰색): 랩으로 감싼 짐, 핸드자키로 옮김"],
    ["kurlytruck", "출고 트럭(보라): 포장한 상품을 싣고 나감"],
    ["glow", "빛나는 테두리: 지금 단계의 구역"],
  ],
  caption: "로트를 나눠 두어야 유통기한이 이른 상품부터 출고할 수 있습니다. 층 배치와 수량은 예시입니다.",
  // 계층 표시줄: 꺼진 칸은 일반 이름, 켜진 칸은 지금 가리키는 대상
  crumbs: {
    generic: ["창고", "존", "로케이션", "로트"],
    house: "창고",
    zone: { chill: "냉장존", freeze: "냉동존", ambient: "상온존" },
    cell: "로케이션 A-01",
    lot: "로트 10/22",
  },
};
const TEXT = WAREHOUSE ? TEXT_W : TEXT_FLOW;

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
// 컬리 워드마크 (사이트에서 쓰는 static/img/kurly-logo.svg, 배경 사각형만 빼고 그대로)
const LOGO_D = [...readFileSync(join(ROOT, "static", "img", "kurly-logo.svg"), "utf8").matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).filter((d) => d !== "M0 0h82v42H0z").join("");
globalThis.LOGO_D = LOGO_D;
const OUT = join(ROOT, "static", "diagrams");
const theme = process.argv.includes("--light") ? "light" : "dark";

// ---- 모델: 글과 같은 수치 ----
const ORDERED = 100; // 발주 수량
const DEFECTS = [7, 31, 48, 66, 89]; // 불량 순번 (5박스)
const PER_SLOT = 19; // 랙 칸 하나 = 19박스, 5칸 = 95박스
const PALLETS = 4; // 팔레트 4개 x 25박스
const PER_PALLET = ORDERED / PALLETS;

const WIDTH = 600;
const HEIGHT = 720;

// ---- 층 (z) ----
const F = 6; // 1층 바닥 윗면 (도크 높이)
const FLOOR1 = F;
const SLAB = 5;
const GAP = 96;
const FL2 = F + GAP; // 2층 바닥 윗면
const FL3 = FL2 + GAP; // 3층 바닥 윗면
const FL4 = FL3 + GAP; // 4층 바닥 윗면
const BUILD = { x: 0, y: 0, w: 170, d: 110, r: 1.5 };

// ---- 1층과 야드 (x: 흐름 방향, y: 앞쪽이 +) ----
const PLATE = { x: -138, y: -20, w: 342, d: 150, r: 8 };
const ORDER_N = 20; // 출고 주문 (예시)
const STOCK_AFTER = 95 - ORDER_N;
const DOCK2_AT = [-28, 48];
const LANE = { x: 24, y: 6, w: 144, d: 12, r: 0.6 };
const LANE_Z = F + 10;
const TABLE = { x: 4, y: 26, w: 16, d: 12, r: 0.6 };
const TABLE_Z = F + 5;
const YARD = { x: -132, y: -14, w: 129, d: 138, r: 3 };
const LANE_X = -90;
const GATE_Y = 100;
const BOOTH = { x: -122, y: 92, w: 14, d: 16, r: 1 };
const PIVOT = [-105, GATE_Y, 11];
const ARM_LEN = 30;
const WAIT = [-90, 34];
const DOCK_AT = [-28, 80];
const DOOR1 = [70, 90];
const DOOR2 = [40, 56];
const LEVELER = { x: 3, y: 72, w: 10, d: 16, r: 0.6 };
const FROM_DOCK = [22, 80];
const SPOTS = [
  [46, 96],
  [46, 76],
  [28, 96],
  [28, 76],
];
const FORK = 12.6; // 지게차 중심에서 포크 위 팔레트 중심까지

const BOX = { w: 10, d: 9, h: 7 };
const CY = 40;
const CONV = F + 16;
const X0 = 52;
const XS = 62;
const GX = 100;
const XE = 164;
const U_STATION = XS - X0;
const U_GATE = GX - X0;
const U_END = XE - X0;
const SPACING = 16;
const DWELL = 1;
const PUSH = 2.2;
const DROP = 2.5;
const FADE = 6;
const HINGE = [GX - 10, CY - 10.5];
const PADDLE_LEN = 20;
const BIN = { x: GX - 10, y: CY + 16, w: 20, d: 24, r: 0.8 };
const BIN_SLOTS = [
  [GX, 61, F + 1],
  [GX, 74, F + 1],
  [GX, 61, F + 8],
  [GX, 74, F + 8],
  [GX, 67.5, F + 15],
];
// 수직 반송기 (1층 컨베이어 끝 → 2층)
const LIFT = { x: 174, y: 31, w: 22, d: 18, r: 0.6 };
const LIFT_TRAVEL = FL2 - CONV;

// ---- 2층: 냉동존 | 단열 벽 | 냉장존 ----
const RACK_A = { x: 128, y: 26, w: 38, d: 28, r: 0.6 };
const SHELF_Z = [FL2 + 3, FL2 + 14, FL2 + 25];
const RACK_TOP = FL2 + 36;
const RACK_SLOTS = [
  [139, CY, 0],
  [155, CY, 0],
  [139, CY, 1],
  [155, CY, 1],
  [139, CY, 2],
];

// ---- 3층: 사무실, 상온존 ----
const GAUGE = [64, 22];
const GAUGE_R = 10;
const GAUGE_TOP = FL4 + 12 + 4;
const SPAN = Math.PI * 1.5;
const FROM = -SPAN / 2;

// 단계, 시간(초), 층, 구역
const PHASES = [
  ["entry", 4.5, [1], ["gate"]],
  ["assign", 2.5, [1], ["assign"]],
  ["dock", 4, [1], ["dock"]],
  ["unload", 5, [1], ["unload"]],
  ["inspect", 0, [1], ["inspect", "lift"]],
  ["store", 3, [1, 2], ["chill", "return", "lift"]],
  ["settle", 3.5, [4], ["settle"]],
  ["order", 2.5, [4], ["order"]],
  // 그림 2에서만 쓰는 단계: 창고 → 존 → 로케이션 → 로트 (그림 1에서는 건너뜀)
  ["v_house", 3, [1, 2, 3, 4], []],
  ["v_chill", 2.5, [2], ["chill"]],
  ["v_freeze", 2.5, [3], ["freeze"]],
  ["v_ambient", 2.5, [4], ["ambient"]],
  ["v_cell", 2.8, [2], ["cell"]],
  ["v_lot", 3, [2], ["cell", "lot"]],
  ["pick", 4, [2], WAREHOUSE ? ["pick", "lot"] : ["pick"]],
  ["down", 3, [1, 2], ["lift"]],
  ["pack", 6.8, [1], ["pack"]],
  ["load", 7, [1], ["outdock"]],
  ["exit", 5, [1], ["gate", "outdock"]],
];

// 그림마다 건너뛰는 단계: 그림 1은 위치 계층 단계, 그림 2는 입고부터 주문까지
const SKIP = PHASES.map((p) => p[0]).filter((n) => (WAREHOUSE ? !n.startsWith("v_") && !["pick", "down", "pack", "load", "exit"].includes(n) : n.startsWith("v_")));

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [-90, 34, 30], [-28, 80, 30], [0, 0, FL4 + 26], [170, 110, FL4 + 20], [196, 31, FL4 + 30], [170, 0, FL4 + 20]],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: 40, elevation: 22 },
);
globalThis.P = P;

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const C = (color, html) => `<g class="c-${color}">${html}</g>`;
const Z = (zone, html) => `<g data-zone="${zone}">${html}</g>`;
// 그림 2에서는 입고 설비(입고 트럭, 하차, 검수, 반품, 정산 계기)를 숨겨 보관 위치와 출고만 남긴다
const HIDE = (html) => (WAREHOUSE ? `<g data-whide>${html}</g>` : html);
const FLR = (floors, html) => `<g class="mf-floor" data-floor="${floors}">${html}</g>`;
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const byDepth = (list, f) => [...list].sort((a, b) => f(a) - f(b));
const planAt = (cx, cy, w, d, r = 0.6) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const slab = (plan, z, h, style = {}, bevel = 0.4, steps = 3) => S(k.slabOf(plan, z, h, P, steps, bevel), style);
const tint = (plan, z, color) => C(color, S(k.slabOf(plan, z, 0.3, P, 3), { tone: "mid", flat: true, crease: "none" }) + L(k.planOutline(k.insetPlan(plan, 1.5), z + 0.3, P, 3), { tone: "lo" }));
// 현재 구역 바닥 강조: 색 띠 + 발광 + 굵은 테두리
const hl = (zone, color, plans, z) => {
  const d = plans.map((p) => k.planOutline(p, z + 0.4, P, 3)).join("");
  return `<g class="mf-hl hl-${color}" data-zone="${zone}"><path class="hl-band" d="${d}"/><path class="hl-glow" d="${d}"/><path class="hl-core" d="${d}"/></g>`;
};
const floorEdge = (z) => `<path class="mf-edge" d="${k.planOutline(BUILD, z, P, 3)}"/>`;

// ---- 박스 ----
function boxSvg(cx, cy, z, kind = "plain") {
  const plan = planAt(cx, cy, BOX.w, BOX.d, 0.5);
  const out = [];
  out.push(S(k.slabOf(plan, z, BOX.h, P, 3, 0.3), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, z + 2.2, P, 3), { tone: "faint" }) }));
  out.push(S(k.slabOf({ x: cx - BOX.w / 2, y: cy - 1, w: BOX.w, d: 2, r: 0 }, z + BOX.h, 0.2, P, 2), { tone: "mid", flat: true, crease: "none" }));
  if (kind === "bad") {
    const strip = ([ax, ay], [bx, by]) => {
      const len = Math.hypot(bx - ax, by - ay), nx = (-(by - ay) / len) * 0.8, ny = ((bx - ax) / len) * 0.8;
      return [[ax + nx, ay + ny], [bx + nx, by + ny], [bx - nx, by - ny], [ax - nx, ay - ny]];
    };
    const hx = BOX.w / 2 - 1.2, hy = BOX.d / 2 - 1.2;
    for (const ring of [strip([cx - hx, cy - hy], [cx + hx, cy + hy]), strip([cx - hx, cy + hy], [cx + hx, cy - hy])]) {
      out.push(S(k.extrude(ring, z + BOX.h + 0.2, 0.2, P), { tone: "hi", flat: true, crease: "none" }));
    }
  }
  const m = k.sideMatrix([cx - 2.2, cy + BOX.d / 2], z + 5, P, "left");
  out.push(`<g transform="${m}"><rect class="mf-slot" x="0" y="0" width="4.4" height="1.5" rx=".75"/></g>`);
  const html = out.join("");
  return kind === "ok" ? C("green", html) : kind === "bad" ? C("pink", html) : kind === "plain" ? html : C(kind, html);
}

// ---- 작업자 (작은 등각 인물) ----
const WORKERS = [
  { id: 0, x: -113, y: 84, z: 0.6, face: 0, hat: "cap", zone: "gate" },
  { id: 1, x: 67, y: 56, z: F, face: -0.7, hat: "hard", zone: "inspect" },
  { id: 2, x: 124, y: 60, z: F, face: 2.4, hat: "cap", zone: "return" },
  { id: 3, x: 147, y: 66, z: FL2, face: -0.75, hat: "hard", zone: "chill" },
  { id: 4, x: 40, y: 25, z: FL4, face: -Math.PI / 2, hat: "none", sit: true, zone: "settle" },
  { id: 5, x: 130, y: 64, z: FL2, face: -0.75, hat: "hard", zone: "pick" },
  { id: 6, x: 12, y: 23.6, z: F, face: Math.PI / 2, hat: "cap", zone: "pack outdock" },
  { id: 7, x: 20, y: 104, z: F, face: 0, hat: "hard", zone: "unload" },
  { id: 8, x: 80, y: 53, z: F, face: -Math.PI / 2, hat: "cap", zone: "inspect" },
  { id: 9, x: 40, y: 90, z: FL2, face: 0, hat: "hard", zone: "chill" },
  { id: 10, x: 40, y: 94, z: FL3, face: 0, hat: "hard", zone: "freeze" },
  { id: 11, x: 150, y: 71, z: FL3, face: -Math.PI / 2, hat: "cap", zone: "freeze" },
  { id: 12, x: 100, y: 92, z: FL4, face: 0, hat: "cap", zone: "ambient" },
  { id: 13, x: 58, y: 50, z: FL4, face: Math.PI, hat: "none", zone: "settle" },
  { id: 14, x: 64, y: 98, z: F, face: 0, hat: "hard", zone: "unload", jack: true },
];
const REST_POSE = { r: [0.12, 0.15], l: [0.12, 0.15], lean: 0 };
// 층마다 돌아다니는 지게차: 통로를 따라 돌며 한 지점에서 팔레트를 들어 올리고 다른 지점에 내려놓는다
// (carry[i]가 있는 구간 = 팔레트를 실은 구간)
const FLOOR_FORKS = [
  { part: "fork2", base: FL2, load: "c-indigo", phase: 0, speed: 9, pts: [[34, 60], [98, 60], [90, 71], [42, 73]], pause: [1.8, 1.8, 0, 0], carry: ["indigo", "", "", ""] },
  { part: "fork3", base: FL3, load: "c-teal", phase: 4.1, speed: 9, pts: [[34, 74], [116, 74], [108, 85], [44, 86]], pause: [1.8, 1.8, 0, 0], carry: ["teal", "", "", ""] },
];
// 걸어 다니는 작업자: 여러 지점을 도는 경로 (pause[i]: 그 지점에서 일하는 시간, 0이면 돌아서 지나감 / face[i]: 일할 때 보는 방향 / carry[i]: i 다음 구간에 든 물건)
const PI = Math.PI;
const WALKS = {
  0: { pts: [[-113, 84], [-108, 78], [-116, 74], [-119, 80]], speed: 4, pause: [3.2, 0, 1.2, 0], face: [0, null, 0, null], carry: [] },
  2: { pts: [[120, 52], [111, 60], [116, 70], [125, 62]], speed: 8, pause: [1.0, 0, 1.0, 0], face: [-1.6, null, PI, null], carry: ["pink", "pink", "", ""] },
  3: { pts: [[162, 60], [149, 57], [136, 60], [149, 63]], speed: 8, pause: [1.0, 0, 1.3, 0], face: [-0.3, null, -1.3, null], carry: ["green", "green", "", ""] },
  5: { pts: [[160, 68], [146, 74], [132, 68], [146, 66]], speed: 7, pause: [1.0, 0, 1.4, 0], carry: ["", "", "brown", "brown"], cart: true },
  6: { pts: [[12, 23.6], [22, 27.5], [30, 23.6], [21, 20.5]], speed: 7, pause: [1.4, 0, 1.0, 0], face: [PI / 2, null, -1.1, null], carry: ["", "", "brown", "brown"] },
  7: { pts: [[18, 106], [36, 108], [56, 106], [38, 104]], speed: 7, pause: [1.2, 0, 1.0, 0], face: [PI, null, -PI / 2, null], carry: ["plain", "plain", "", ""] },
  9: { pts: [[36, 90], [74, 98], [112, 90], [74, 86]], speed: 8, pause: [1.4, 0, 1.2, 0], carry: [], cart: true },
  10: { pts: [[36, 96], [92, 103], [150, 96], [92, 93]], speed: 8, pause: [1.2, 0, 1.6, 0], carry: [], cart: true },
  12: { pts: [[100, 92], [128, 99], [158, 92], [128, 87]], speed: 7, pause: [1.3, 0, 1.3, 0], face: [-PI / 2, null, -PI / 2, null], carry: ["orange", "orange", "", ""] },
  13: { pts: [[58, 50], [74, 44], [68, 38], [52, 42]], speed: 5, pause: [2.6, 0, 2.0, 0], face: [PI, null, -PI / 2, null], carry: ["clip", "clip", "", ""] },
  14: { pts: [[64, 98], [78, 104], [80, 74], [66, 68]], speed: 6, pause: [1.6, 0, 1.6, 0], carry: ["wrap", "wrap", "", ""], cart: true },
};
// 작업자 한 명: 귀여운 2.5~3등신 캐릭터 (큰 둥근 머리, 짧고 둥근 몸통과 팔다리)
function personSvg(w, pose) {
  const fx = Math.cos(w.face), fy = Math.sin(w.face), lx = -fy, ly = fx;
  const sc = P.scale;
  const bob = pose.bob || 0;
  const A = (f, l, z) => [w.x + fx * f + lx * l, w.y + fy * f + ly * l, w.z + z];
  const pr = (q) => iso(q, P);
  const add3 = (q, d, len) => [q[0] + d[0] * len, q[1] + d[1] * len, q[2] + d[2] * len];
  const dirOf = (a, spread, side) => [fx * Math.sin(a) + lx * side * spread, fy * Math.sin(a) + ly * side * spread, -Math.cos(a)];
  const [tvx, tvy] = towardViewer(P);
  const facing = fx * tvx + fy * tvy;
  const near = lx * tvx + ly * tvy >= 0 ? 1 : -1;
  const lean = pose.lean || 0;
  const hipZ = (w.sit ? 4.8 : 2.1) + bob, shZ = hipZ + 3.6, R = 2.15, headZ = shZ + R * 0.85;
  const f2 = (v) => v.toFixed(2);
  const path = (pts) => "M" + pts.map((q) => { const v = pr(q); return f2(v[0]) + " " + f2(v[1]); }).join("L");
  const limb = (pts, width, cls) => '<g class="' + cls + '"><path class="mf-limb-edge" style="stroke-width:' + f2((width + 0.3) * sc) + '" d="' + path(pts) + '"/><path class="mf-limb-fill" style="stroke-width:' + f2(width * sc) + '" d="' + path(pts) + '"/></g>';
  const dot = (q, r, cls) => { const v = pr(q); return '<circle class="' + cls + '" cx="' + f2(v[0]) + '" cy="' + f2(v[1]) + '" r="' + f2(r * sc) + '"/>'; };
  // 다리와 신발
  const legs = [-1, 1].map((side) => {
    const hip = A(lean * 0.2, side * 0.75, hipZ + 0.3);
    let foot;
    if (w.sit) { const knee = add3(hip, [fx, fy, 0], 1.9); foot = add3(knee, [0, 0, -1], w.shin ? 1.6 : 2.6); return { d: depthOf(hip, P), svg: limb([hip, knee, foot], 1.25, "c-pants") + '<g class="c-hair">' + dot([foot[0] + fx * 0.3, foot[1] + fy * 0.3, foot[2]], 0.62, "mf-shoe") + "</g>" }; }
    const wk = (pose.walk || 0) * side;
    foot = A(lean * 0.1 + wk * 0.9, side * 0.8, 0.55 + bob * 0.2 + Math.max(0, wk) * 0.3);
    return { d: depthOf(hip, P), svg: limb([hip, foot], 1.3, "c-pants") + '<g class="c-hair">' + dot([foot[0] + fx * 0.3, foot[1] + fy * 0.3, foot[2]], 0.66, "mf-shoe") + "</g>" };
  }).sort((a, b) => a.d - b.d);
  // 몸통: 짧고 둥근 원통 + 흰 반사띠
  const bc = A(lean * 0.35, 0, 0);
  const torso = '<g class="c-kurly">' + solidSvg(cylinder(bc[0], bc[1], 1.65, w.z + hipZ, shZ - hipZ + 0.4, P, 20, 0.2), { tone: "hi", crease: "lo" }) + '<path class="mf-band" style="stroke-width:' + f2(0.45 * sc) + '" d="' + sideArc(bc[0], bc[1], 1.66, w.z + hipZ + 1.5, P, 16) + '"/></g>';
  // 팔과 손
  const arms = [["r", 1], ["l", -1]].map(([key, side]) => {
    const [a1, a2] = pose[key] || [0.12, 0.15];
    const sh = A(lean * 0.5, side * 1.7, shZ - 0.5);
    let el = add3(sh, dirOf(a1, 0.3, side), 1.5);
    let hand = add3(el, dirOf(a1 + a2, 0.1, side), 1.4);
    if ((pose.cart || pose.hold) && pose.grip) {
      // 두 손을 카트 손잡이에 고정 (팔꿈치는 어깨와 손잡이 사이에서 살짝 아래, 바깥)
      hand = [w.x + fx * 1.75 + lx * side * 1.05, w.y + fy * 1.75 + ly * side * 1.05, w.z + 3.9];
      el = [(sh[0] + hand[0]) / 2 + lx * side * 0.35, (sh[1] + hand[1]) / 2 + ly * side * 0.35, (sh[2] + hand[2]) / 2 - 0.35];
    }
    const svg = limb([sh, el, hand], 1.05, "c-kurly") + '<g class="c-skin">' + dot(hand, 0.6, "mf-skin") + "</g>";
    return { side, hand, front: a1 > 0.5 && facing > 0.1, svg };
  });
  const armFar = arms.filter((x) => x.side !== near && !x.front), armNear = arms.filter((x) => x.side === near || x.front);
  // 손에 든 물건 (작은 상자나 클립보드)
  let carry = "";
  if (pose.carry) {
    const hs = arms.map((x) => x.hand), both = pose.carry !== "clip";
    const c = both ? [(hs[0][0] + hs[1][0]) / 2, (hs[0][1] + hs[1][1]) / 2, (hs[0][2] + hs[1][2]) / 2] : hs[1];
    const size = pose.carry === "clip" ? 1.5 : 1.9, h = pose.carry === "clip" ? 0.25 : 1.5;
    const cls = pose.carry === "clip" ? "c-truckwhite" : pose.carry === "plain" ? "c-gray" : "c-" + pose.carry;
    carry = '<g class="' + cls + '">' + solidSvg(slabOf({ x: c[0] - size / 2, y: c[1] - size / 2, w: size, d: size, r: 0.2 }, c[2] - h / 2, h, P, 2), { tone: "hi", crease: "lo" }) + "</g>";
  }
  // 머리와 얼굴 (look: 고개 돌림, nod: 끄덕임)
  const lk = pose.look || 0, hfx = Math.cos(w.face + lk), hfy = Math.sin(w.face + lk), hlx = -hfy, hly = hfx;
  const hfacing = hfx * tvx + hfy * tvy;
  const hc = [w.x + fx * lean, w.y + fy * lean, w.z + headZ - (pose.nod || 0) * 0.35];
  const hv = pr(hc), r = R * sc;
  let head = '<g class="c-skin"><circle class="mf-skin" cx="' + f2(hv[0]) + '" cy="' + f2(hv[1]) + '" r="' + f2(r) + '"/></g>';
  const capPath = (k, lift) => "M" + f2(hv[0] - r * k) + " " + f2(hv[1] - r * lift) + "A" + f2(r * k) + " " + f2(r * k * 0.95) + " 0 0 1 " + f2(hv[0] + r * k) + " " + f2(hv[1] - r * lift) + "Q" + f2(hv[0]) + " " + f2(hv[1] - r * (lift + 0.3)) + " " + f2(hv[0] - r * k) + " " + f2(hv[1] - r * lift) + "Z";
  if (hfacing < -0.3) head += '<g class="c-hair"><circle class="mf-hair" cx="' + f2(hv[0]) + '" cy="' + f2(hv[1] - r * 0.04) + '" r="' + f2(r * 0.97) + '"/></g>';
  else {
    head += '<g class="c-hair"><path class="mf-hair" d="' + capPath(1.0, 0.1) + '"/></g>';
    const face = (fw, lw, uz) => [hc[0] + hfx * R * fw + hlx * R * lw, hc[1] + hfy * R * fw + hly * R * lw, hc[2] + R * uz - (pose.nod || 0) * 0.25 * R];
    const seen = (lw) => (hfx * 0.9 + hlx * lw) * tvx + (hfy * 0.9 + hly * lw) * tvy > 0.05;
    for (const lw of [-0.36, 0.36]) if (seen(lw)) head += dot(face(0.9, lw, -0.02), 0.26, "mf-eye");
    for (const lw of [-0.62, 0.62]) if (seen(lw)) head += dot(face(0.75, lw, -0.3), 0.36, "mf-cheek");
    if (hfacing > -0.05) {
      const m0 = pr(face(0.95, -0.17, -0.3)), m1 = pr(face(0.95, 0.17, -0.3)), mc = pr(face(0.97, 0, -0.42));
      head += '<path class="mf-smile" style="stroke-width:' + f2(0.16 * sc) + '" d="M' + f2(m0[0]) + " " + f2(m0[1]) + "Q" + f2(mc[0]) + " " + f2(mc[1] + 0.2 * sc) + " " + f2(m1[0]) + " " + f2(m1[1]) + '"/>';
    }
  }
  let hat = "";
  if (w.hat === "hard") hat = '<g class="c-hat"><ellipse class="mf-hat" cx="' + f2(hv[0]) + '" cy="' + f2(hv[1] - r * 0.32) + '" rx="' + f2(r * 1.16) + '" ry="' + f2(r * 0.42) + '"/><path class="mf-hat" d="M' + f2(hv[0] - r * 0.98) + " " + f2(hv[1] - r * 0.36) + "A" + f2(r * 0.98) + " " + f2(r * 0.86) + " 0 0 1 " + f2(hv[0] + r * 0.98) + " " + f2(hv[1] - r * 0.36) + 'Z"/></g>';
  else if (w.hat === "cap") {
    const vz = hc[2] + R * 0.42;
    const vis = (k) => [hc[0] + hfx * R * k, hc[1] + hfy * R * k, vz - (k > 1 ? 0.15 : 0)];
    hat = '<g class="c-kurly"><path class="mf-cap" d="' + capPath(1.02, 0.28) + '"/>' + limb([vis(0.6), vis(1.25)], 0.7, "c-kurly") + "</g>";
  }
  const legsSvg = legs.map((x) => x.svg).join("");
  const body = w.sit && facing > 0 ? torso + legsSvg : legsSvg + torso;
  const front = facing > -0.2;
  let cartSvg = "";
  if (pose.cart) {
    const cc = A(3.4, 0, 0);
    const R2 = (f, l) => [cc[0] + fx * f + lx * l, cc[1] + fy * f + ly * l];
    const ring = [R2(-1.7, -1.4), R2(1.7, -1.4), R2(1.7, 1.4), R2(-1.7, 1.4)];
    const wheels = [[-1.1, -1.1], [1.1, -1.1], [1.1, 1.1], [-1.1, 1.1]].map(([f, l]) => { const q = R2(f, l); return { d: depthOf([q[0], q[1], 0], P), svg: wheelSvg(q[0], q[1], w.z + 0.6, fx, fy, lx, ly, 0.6, 0.4) }; }).sort((a, b) => a.d - b.d);
    const hb = [A(1.75, -1.05, 3.9), A(1.75, 1.05, 3.9)], hp = [A(1.75, -1.05, 1.7), A(1.75, 1.05, 1.7)];
    if (w.jack) {
      // 핸드자키: 손잡이(티러) → 낮은 포크 두 갈래 → 그 위 팔레트와 랩 감은 짐
      const J = (f, l, z) => [w.x + fx * f + lx * l, w.y + fy * f + ly * l, w.z + z];
      const JR = (f0, f1, l0, l1) => [J(f0, l0, 0).slice(0, 2), J(f1, l0, 0).slice(0, 2), J(f1, l1, 0).slice(0, 2), J(f0, l1, 0).slice(0, 2)];
      let js = limb([J(1.75, 0, 3.9), J(2.9, 0, 1.2)], 0.4, "c-steel") + limb([J(1.75, -0.7, 3.9), J(1.75, 0.7, 3.9)], 0.35, "c-steel");
      js += '<g class="c-steel">' + solidSvg(extrude(JR(2.6, 3.8, -2.2, 2.2), w.z + 0.2, 1.8, P), { tone: "mid", crease: "lo" }) + "</g>";
      for (const l of [-2.6, 2.6]) js += '<g class="c-steel">' + solidSvg(extrude(JR(3.8, 15, l - 0.8, l + 0.8), w.z + 0.2, 0.7, P), { tone: "mid", crease: "lo" }) + "</g>";
      if (pose.cartLoad) {
        js += '<g class="c-gray">' + solidSvg(extrude(JR(3.6, 15.4, -5.6, 5.6), w.z + 0.9, 1.3, P, { bevel: 0.1 }), { tone: "lo", crease: "lo" }) + "</g>";
        js += '<g class="c-wrap">' + solidSvg(extrude(JR(4, 15, -5.2, 5.2), w.z + 2.2, 7, P, { bevel: 0.4 }), { tone: "hi", crease: "lo" }) + "</g>";
      }
      cartSvg = js;
    } else cartSvg = '<g class="c-steel">' + wheels.map((x) => x.svg).join("") + solidSvg(extrude(ring, w.z + 1.2, 0.5, P), { tone: "hi", crease: "lo" }) + limb([hp[0], hb[0], hb[1], hp[1]], 0.35, "c-steel") + "</g>";
    const nLoad = w.jack ? 0 : pose.cartLoad === true ? 1 : pose.cartLoad || 0;
    for (let i = 0; i < Math.min(2, nLoad); i++) cartSvg += '<g class="c-brown">' + solidSvg(slabOf({ x: cc[0] - 1, y: cc[1] - 1, w: 2, d: 2, r: 0.2 }, w.z + 1.7 + i * 1.6, 1.5, P, 2), { tone: "hi", crease: "lo" }) + "</g>";
  }
  const cartFront = fx * tvx + fy * tvy > 0;
  return (cartFront ? "" : cartSvg) + armFar.map((x) => x.svg).join("") + (front ? "" : carry) + body + armNear.map((x) => x.svg).join("") + (front ? carry : "") + head + hat + (cartFront ? cartSvg : "");
}
const worker = (id) => workerSvg(WORKERS[id]);
function workerSvg(w) {
  const halo = WALKS[w.id] ? "" : `<path class="iso-halo" d="${k.haloOf(planAt(w.x, w.y, 5, 5, 2), w.z, 1, P)}"/>`;
  return Z(w.zone, C("gray", `${halo}<g data-worker="${w.id}">${personSvg(w, REST_POSE)}</g>`));
}

// ---- 바닥판, 야드, 1층 바닥 ----
function ground() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -15, 15, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 24), (p) => depth(...p))) {
    out.push(S(k.cylinder(x, y, 7, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -13.4, 3.4, P, 28), { tone: "mid" }));
  }
  out.push(slab(PLATE, -10, 10, { tone: "mid" }, 1.6, 8));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  out.push(S(k.slabOf(YARD, 0, 0.6, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(YARD, 3), 0.6, P, 4), { tone: "faint" }));
  for (let y = 120; y > -4; y -= 14) out.push(S(k.slabOf({ x: LANE_X - 14.6, y: y - 6, w: 1.2, d: 6, r: 0.3 }, 0.6, 0.15, P, 2), { tone: "hi", flat: true, crease: "none" }));
  out.push(L(k.planOutline(planAt(WAIT[0], WAIT[1], 22, 54, 1), 0.6, P, 2), { tone: "mid" }));
  // 반송기 기초
  out.push(slab({ x: 172, y: 24, w: 26, d: 32, r: 1 }, 0, 2, { tone: "lo" }, 0.3, 2));
  // 1층 바닥 (도크 높이)
  out.push(slab(BUILD, 0, F, { tone: "mid" }, 0.8, 3));
  out.push(L(k.sideSeam(BUILD, F / 2, P, 3), { tone: "faint" }));
  return out.join("");
}
function floor1Zones() {
  return [
    HIDE(Z("return", tint({ x: 84, y: 52, w: 44, d: 56, r: 1 }, F, "pink"))),
    HIDE(L(k.planOutline({ x: 16, y: 64, w: 42, d: 44, r: 1 }, F, P, 2), { tone: "mid" })),
    HIDE(L(SPOTS.map(([x, y]) => k.planOutline(planAt(x, y, 18, 18, 0.6), F, P, 2)).join(""), { tone: "faint" })),
    hl("gate", "blue", [{ x: -130, y: 56, w: 62, d: 66, r: 3 }], 0.6),
    hl("assign", "blue", [{ x: -128, y: -16, w: 58, d: 12, r: 2 }], 0.6),
    hl("dock", "blue", [{ x: -56, y: 68, w: 54, d: 24, r: 2 }], 0.6),
    hl("dock", "blue", [{ x: 2, y: 70, w: 14, d: 20, r: 1 }], F),
    hl("unload", "blue", [{ x: 15, y: 63, w: 44, d: 46, r: 2 }], F),
    hl("inspect", "blue", [{ x: 44, y: 22, w: 126, d: 36, r: 2 }], F),
    hl("return", "pink", [{ x: 84, y: 52, w: 44, d: 56, r: 1 }], F),
    hl("lift", "blue", [{ x: 172, y: 24, w: 26, d: 32, r: 1 }], 2),
    hl("pack", "brown", [{ x: 22, y: 4, w: 148, d: 16, r: 1 }, { x: 2, y: 21, w: 28, d: 18, r: 1 }], F),
    hl("outdock", "brown", [{ x: -56, y: 37, w: 54, d: 22, r: 2 }], 0.6),
    hl("outdock", "brown", [{ x: 2, y: 38, w: 18, d: 20, r: 1 }], F),
    floorEdge(F),
  ].join("");
}

// ---- 현장 소품: 노란 안전선, 도크 범퍼, 랩 감은 팔레트 ----
// 안전선은 단계와 상관없이 늘 노랗게 보인다(z-on 고정)
const safetyLine = (x0, y0, x1, y1, z) => {
  const plan = { x: Math.min(x0, x1) - 0.5, y: Math.min(y0, y1) - 0.5, w: Math.abs(x1 - x0) + 1, d: Math.abs(y1 - y0) + 1, r: 0.2 };
  return S(k.slabOf(plan, z, 0.12, P, 2), { tone: "hi", flat: true, crease: "none" });
};
// 1층: 하차장과 핸드자키 통로, 반품 구역을 가르는 선
const safetyLines = () => `<g class="z-on"><g class="c-safety">${[
  safetyLine(4, 61, 58, 61, F),
  safetyLine(60, 62, 60, 108, F),
  safetyLine(83, 62, 83, 108, F),
  safetyLine(60, 61, 83, 61, F),
].join("")}</g></g>`;
// 도크 문 양옆 고무 범퍼 (트럭이 닿는 자리)
const bumpers = () => C("rubber", [DOOR1, DOOR2].flatMap(([y0, y1]) => [y0 + 1, y1 - 3]).map((y) => slab({ x: -1.6, y, w: 1.8, d: 2, r: 0.3 }, F - 4.5, 4, { tone: "hi", crease: "lo" }, 0.2, 2)).join(""));
// 랩 감은 팔레트: 나무 팔레트 위 상자 묶음을 랩으로 감싼 모양
function wrappedPallet(cx, cy, z, h = 9) {
  const deck = planAt(cx, cy, 15, 15, 0.4), load = planAt(cx, cy, 14, 14, 0.8);
  return C("gray", slab(deck, z, 1.6, { tone: "lo" }, 0.2, 2)) + C("wrap", slab(load, z + 1.6, h, { tone: "hi", crease: "lo", inner: L(k.sideSeam(load, z + 1.6 + h * 0.35, P, 3) + k.sideSeam(load, z + 1.6 + h * 0.7, P, 3), { tone: "faint" }) }, 0.6, 3));
}

// ---- 벽, 기둥, 코어 ----
const WALL_H = 14;
const backWallAt = (z) => {
  const w = { x: BUILD.x, y: BUILD.y, w: BUILD.w, d: 3, r: 0.3 };
  return slab(w, z, WALL_H, { tone: "mid", inner: L(k.sideSeam(w, z + WALL_H - 3, P, 2), { tone: "faint" }) }, 0.4, 2);
};
const LEFT_SEGS = [
  [3, DOOR2[0]],
  [DOOR2[1], DOOR1[0]],
  [DOOR1[1], BUILD.d],
];
const leftSeg = ([y0, y1]) => slab({ x: 0, y: y0, w: 3, d: y1 - y0, r: 0.3 }, F, WALL_H, { tone: "mid" }, 0.4, 2);
const lintel = ([y0, y1]) => slab({ x: 0, y: y0, w: 3, d: y1 - y0, r: 0.3 }, F + WALL_H - 4, 4, { tone: "lo" }, 0.3, 2);
function dockLight(y, on) {
  const x = 1.5;
  const house = S(k.cylinder(x, y, 2, F + WALL_H, 2, P, 16), { tone: "mid" });
  const lamp = (color) => C(color, S(k.cylinder(x, y, 1.4, F + WALL_H + 2, 1.6, P, 16, 0.3), { tone: "hi" }));
  return Z("assign", house + (on ? `<g data-light="off">${lamp("pink")}</g><g data-light="on" style="display:none">${lamp("green")}</g>` : lamp("pink")));
}
const leftWall = () => [bumpers(), leftSeg(LEFT_SEGS[0]), lintel(DOOR2), leftSeg(LEFT_SEGS[1]), lintel(DOOR1), dockLight(DOOR2[1] + 3, false), dockLight(DOOR1[0] - 3, true), leftSeg(LEFT_SEGS[2])].join("");
const column = (x, y, z0, z1) => slab(planAt(x, y, 3, 3, 0.4), z0, z1 - z0, { tone: "mid" }, 0.2, 2);
function core(z0, z1, roof = false) {
  const plan = { x: 0, y: 0, w: 20, d: 20, r: 0.6 };
  const out = [slab(plan, z0, z1 - z0, { tone: "mid", crease: "lo", inner: L(k.sideSeam(plan, z0 + 12, P, 2), { tone: "faint" }) }, 0.4, 2)];
  const door = k.sideMatrix([6, 20], z0 + 11, P, "left");
  out.push(`<g transform="${door}"><rect class="mf-win" x="0" y="0" width="8" height="11" rx=".4"/></g>`);
  const win = k.sideMatrix([20, 20], z1 - 2, P, "right");
  out.push(`<g transform="${win}"><rect class="mf-win" x="4" y="2" width="12" height="3" rx=".4"/></g>`);
  if (roof) out.push(slab({ x: -1, y: -1, w: 22, d: 22, r: 0.8 }, z1, 2, { tone: "lo" }, 0.4, 2));
  return out.join("");
}
const slabFloor = (z) => slab(BUILD, z - SLAB, SLAB, { tone: "mid", inner: L(k.sideSeam(BUILD, z - SLAB / 2, P, 3), { tone: "faint" }) }, 0.8, 3);

// ---- 정문: 경비 부스, 차단기 ----
function booth() {
  const out = [];
  out.push(slab(BOOTH, 0, 18, { tone: "hi", crease: "lo" }, 0.4, 2));
  const side = k.sideMatrix([BOOTH.x + BOOTH.w, BOOTH.y + BOOTH.d], 15, P, "right");
  out.push(`<g transform="${side}"><rect class="mf-win" x="3" y="1.5" width="10" height="6" rx=".5"/></g>`);
  const front = k.sideMatrix([BOOTH.x, BOOTH.y + BOOTH.d], 14, P, "left");
  out.push(`<g transform="${front}"><rect class="mf-win" x="4" y="0" width="5" height="14" rx=".4"/></g>`);
  out.push(slab({ x: BOOTH.x - 2, y: BOOTH.y - 2, w: BOOTH.w + 4, d: BOOTH.d + 4, r: 1 }, 18, 2.5, { tone: "mid" }, 0.5, 2));
  return Z("gate", C("blue", out.join("")));
}
function gateHousing() {
  const [x, y] = PIVOT;
  return Z("gate", C("orange", slab({ x: x - 3.5, y: y - 3, w: 5, d: 6, r: 0.6 }, 0, 13, { tone: "hi", crease: "lo" }, 0.4, 2) + S(k.cylinder(x - 1, y, 1, 13, 1, P, 12), { tone: "mid" })));
}
function armSvg() {
  const m = k.sideMatrix([PIVOT[0], PIVOT[1] + 3.2], PIVOT[2], P, "left");
  const stripes = [6, 14, 22].map((x) => `<rect class="mf-stripe" x="${x}" y="-.9" width="3.5" height="1.8"/>`).join("");
  return `<g data-zone="gate" data-part="armg">${C("orange", `<g transform="${m}"><g data-part="arm"><rect class="mf-arm" x="0" y="-.9" width="${ARM_LEN}" height="1.8" rx=".9"/>${stripes}<circle class="mf-arm" cx="0" cy="0" r="1.3"/></g></g>`)}</g>`;
}
const armRest = () => Z("gate", slab({ x: PIVOT[0] + ARM_LEN + 0.5, y: PIVOT[1] + 2, w: 3, d: 3, r: 0.6 }, 0, PIVOT[2] - 1, { tone: "mid" }, 0.3, 2));

// ---- 입고 예약(Capacity) 보드 ----
const CAP_CELL = [3, 1];
function capBoard() {
  const out = [];
  for (const x of [-120, -82]) out.push(slab({ x: x - 1, y: -11, w: 2, d: 2, r: 0.4 }, 0, 9, { tone: "mid" }, 0, 2));
  const body = { x: -124, y: -12, w: 46, d: 3, r: 0.6 };
  out.push(slab(body, 9, 20, { tone: "hi", crease: "lo" }, 0.4, 2));
  const m = k.sideMatrix([body.x, body.y + body.d], 29, P, "left");
  const cells = [];
  for (let row = 0; row < 2; row++)
    for (let col = 0; col < 6; col++) {
      const busy = (row === 0 && col !== 2) || (row === 1 && col < 3 && col !== 1) || (row === 1 && col === 5);
      const mine = col === CAP_CELL[0] && row === CAP_CELL[1];
      cells.push(`<rect class="mf-cell" ${busy ? 'data-busy=""' : ""}${mine ? ' data-part="mycell"' : ""} x="${4 + col * 6.5}" y="${4 + row * 7}" width="5" height="5" rx=".5"/>`);
    }
  out.push(`<g transform="${m}">${cells.join("")}</g>`);
  return Z("assign", C("blue", out.join("")));
}

// 바퀴: 축이 차체 옆면에 수직인 원통 (타이어, 바깥 면, 허브, 볼트)
function wheelSvg(cx, cy, cz, hx, hy, ax, ay, r, w) {
  const [tx, ty] = towardViewer(P);
  const s = ax * tx + ay * ty >= 0 ? 1 : -1;
  const ring = (off, rr, n) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return iso([cx + hx * rr * Math.cos(t) + ax * off, cy + hy * rr * Math.cos(t) + ay * off, cz + rr * Math.sin(t)], P); });
  const outer = ring((s * w) / 2, r, 32), inner = ring((-s * w) / 2, r, 32);
  const pts = outer.concat(inner).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of pts) { while (lo.length >= 2 && cross(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
  for (let i = pts.length - 1; i >= 0; i--) { const q = pts[i]; while (up.length >= 2 && cross(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
  const hull = lo.slice(0, -1).concat(up.slice(0, -1));
  const d = (list) => "M" + list.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L") + "Z";
  const face = (s * w) / 2 + 0.05;
  const hub = ring(face, r * 0.52, 20);
  const bolts = [0, 1, 2, 3, 4].map((i) => { const t = (i / 5) * Math.PI * 2 + 0.3; return iso([cx + hx * r * 0.3 * Math.cos(t) + ax * face, cy + hy * r * 0.3 * Math.cos(t) + ay * face, cz + r * 0.3 * Math.sin(t)], P); });
  return '<g class="mf-wheel"><path class="mf-tire" d="' + d(hull) + '"/><path class="mf-tire-face" d="' + d(outer) + '"/><path class="mf-hub" d="' + d(hub) + '"/>' + bolts.map((b) => '<circle class="mf-bolt" cx="' + b[0].toFixed(1) + '" cy="' + b[1].toFixed(1) + '" r="' + Math.max(0.35, 0.16 * P.scale).toFixed(2) + '"/>').join("") + "</g>";
}
// ---- 트럭과 지게차 (회전하므로 매 프레임 다시 그린다) ----
// 냉장 탑차: 흰 캡 + 탑차(입고 = 흰 공급사 탑차, 출고 = 보라 냉장 탑차와 흰 로고) + 냉동기, 뒷문, 미러, 헤드라이트, 범퍼, 둥근 바퀴
function truckSvg(cx, cy, hx, hy, kind, open) {
  const vx = -hy, vy = hx;
  const W = (u, v) => [cx + u * hx + v * vx, cy + u * hy + v * vy];
  const pt = (u, v, z) => iso([...W(u, v), z], P);
  const rect = (u0, u1, v0, v1) => [W(u0, v0), W(u1, v0), W(u1, v1), W(u0, v1)];
  const [tx, ty] = towardViewer(P);
  const front = hx * tx + hy * ty > 0, side = vx * tx + vy * ty >= 0 ? 1 : -1;
  const poly = (list, cls) => '<path class="' + cls + '" d="M' + list.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L") + 'Z"/>';
  const onU = (u, v0, v1, z0, z1) => [pt(u, v0, z0), pt(u, v1, z0), pt(u, v1, z1), pt(u, v0, z1)];
  const onV = (v, u0, u1, z0, z1) => [pt(u0, v, z0), pt(u1, v, z0), pt(u1, v, z1), pt(u0, v, z1)];
  const parts = [];
  const add = (u0, u1, v0, v1, z, h, cls, extra) => parts.push({ ring: rect(u0, u1, v0, v1), z, h, cls, extra: extra || "", c: W((u0 + u1) / 2, (v0 + v1) / 2) });
  for (const u of [-19, -11.5, 16]) for (const sd of [1, -1]) parts.push({ kind: "wheel", c: W(u, sd * 7.2) });
  let boxExtra = "";
  if (kind === "out") {
    // 로고: 보이는 긴 옆면 평면에 붙인다 (왼쪽 위, 오른쪽 위, 왼쪽 아래 세 점으로 행렬 계산)
    const nx = side * vx, ny = side * vy, rx = ny, ry = -nx;
    const lh = 22.5 * 0.55, lw = (lh * 82) / 42, su = lh / 42;
    const c0 = W(-8, side * 8.54);
    const tl = [c0[0] - rx * (lw / 2), c0[1] - ry * (lw / 2), 6.5 + 22.5 / 2 + lh / 2];
    const O = iso(tl, P), X = iso([tl[0] + rx * su, tl[1] + ry * su, tl[2]], P), Y = iso([tl[0], tl[1], tl[2] - su], P);
    boxExtra += '<g transform="matrix(' + [X[0] - O[0], X[1] - O[1], Y[0] - O[0], Y[1] - O[1], O[0], O[1]].map((v) => v.toFixed(4)).join(" ") + ')"><path class="mf-logo" d="' + LOGO_D + '"/></g>';
  }
  if (!front && open) {
    // 뒷문 열림: 안쪽이 어둡게 보이고, 문짝 두 장이 옆으로 젖혀짐
    boxExtra += poly(onU(-24.03, -7.6, 7.6, 7.2, 28.4), "mf-hold");
    for (const sd of [1, -1]) boxExtra += poly([pt(-24.05, sd * 8.5, 7.2), pt(-24.05 - 0.6, sd * 8.5 + sd * 7.6, 7.2), pt(-24.05 - 0.6, sd * 8.5 + sd * 7.6, 28.4), pt(-24.05, sd * 8.5, 28.4)], "mf-door-open");
  } else if (!front) {
    boxExtra += poly(onU(-24.03, -8, -0.15, 7.2, 28.4), "mf-door") + poly(onU(-24.03, 0.15, 8, 7.2, 28.4), "mf-door");
    boxExtra += poly(onU(-24.06, -1.3, -0.6, 15.5, 19), "mf-handle") + poly(onU(-24.06, 0.6, 1.3, 15.5, 19), "mf-handle");
  }
  add(-24, 8, -8.5, 8.5, 6.5, 22.5, kind === "out" ? "c-kurlytruck" : "c-truckwhite", boxExtra);
  let unitExtra = "";
  if (front) unitExtra = [22.2, 23.8, 25.4].map((z) => poly(onU(10.53, -4.4, 4.4, z, z + 0.9), "mf-grill")).join("");
  add(8, 10.5, -5.5, 5.5, 21, 7, "c-steel", unitExtra);
  let cabExtra = "";
  if (front) cabExtra += poly(onU(24.03, -6.8, 6.8, 13, 18), "mf-glass") + poly(onU(24.04, 4.8, 7.2, 7, 8.8), "mf-lamp") + poly(onU(24.04, -7.2, -4.8, 7, 8.8), "mf-lamp");
  cabExtra += poly(onV(side * 8.03, 16, 22.5, 12.8, 18), "mf-glass");
  add(11, 24, -8, 8, 4.5, 14.5, "c-truckwhite", cabExtra);
  add(11.5, 18, -7.4, 7.4, 19, 3, "c-truckwhite");
  add(23.6, 25.3, -8.4, 8.4, 3.3, 2.4, "c-steel");
  for (const sd of [1, -1]) add(20.5, 21.6, sd > 0 ? 8 : -9.9, sd > 0 ? 9.9 : -8, 14.2, 3.4, "c-steel");
  const chassis = '<g class="c-steel">' + solidSvg(extrude(rect(-23, 23, -6, 6), 3, 3.6, P), { tone: "hi", crease: "lo" }) + "</g>";
  parts.sort((a, b) => depthOf([a.c[0], a.c[1], 0], P) - depthOf([b.c[0], b.c[1], 0], P));
  return chassis + parts.map((p) => {
    if (p.kind === "wheel") return wheelSvg(p.c[0], p.c[1], 3.5, hx, hy, vx, vy, 3.5, 2.4);
    return '<g class="' + p.cls + '">' + solidSvg(extrude(p.ring, p.z, p.h, P, { bevel: 0.4 }), { tone: "hi", crease: "lo" }) + p.extra + "</g>";
  }).join("");
}
function forkliftSvg(cx, cy, hx, hy, dpose, fz, base, loadCls) {
  fz = fz || 0;
  const F = base === undefined ? FLOOR1 : base;
  const vx = -hy, vy = hx;
  const W = (u, v) => [cx + u * hx + v * vx, cy + u * hy + v * vy];
  const rect = (u0, u1, v0, v1) => [W(u0, v0), W(u1, v0), W(u1, v1), W(u0, v1)];
  const parts = [];
  const add = (u0, u1, v0, v1, z, h, tone, cls) => parts.push({ kind: "box", ring: rect(u0, u1, v0, v1), z, h, tone, cls, c: W((u0 + u1) / 2, (v0 + v1) / 2), lift: z });
  for (const u of [-4.5, 4]) for (const s of [1, -1]) parts.push({ kind: "wheel", c: W(u, s * 5.2), lift: F });
  add(7.2, 18, 1.2, 2.6, F + 0.5 + fz, 0.6, "mid");
  add(7.2, 18, -2.6, -1.2, F + 0.5 + fz, 0.6, "mid");
  add(-6, 6, -4.5, 4.5, F + 1.5, 5, "hi", "c-safety");
  add(-8.5, -5.5, -4.5, 4.5, F + 1.5, 6.5, "mid", "c-safety");
  add(6, 7.2, 2.4, 3.6, F, 18, "mid");
  add(6, 7.2, -3.6, -2.4, F, 18, "mid");
  add(-4, -3, 3, 4, F + 6.5, 8.5, "mid");
  add(-4, -3, -4, -3, F + 6.5, 8.5, "mid");
  // 포크 위 팔레트 (층 지게차가 나르는 짐)
  if (loadCls) {
    add(5, 20, -7.5, 7.5, F + 1.1 + fz, 1.2, "mid");
    add(5.5, 19.5, -7, 7, F + 2.3 + fz, 5, "hi", loadCls);
    add(6.5, 18.5, -6, 6, F + 7.3 + fz, 5, "hi", loadCls);
  }
  const [dx, dy] = W(-1, 0);
  parts.push({ kind: "driver", c: [dx, dy], lift: F + 6.5 });
  add(-4, 4, -4, 4, F + 15, 0.8, "mid", "c-safety");
  parts.sort((a, b) => (a.c && b.c ? depthOf([a.c[0], a.c[1], 0], P) - depthOf([b.c[0], b.c[1], 0], P) : 0) || a.lift - b.lift);
  const roof = parts.pop();
  const draw = (p) => {
    if (p.kind === "wheel") return wheelSvg(p.c[0], p.c[1], F + 1.9, hx, hy, vx, vy, 1.9, 1.4);
    if (p.kind === "driver") {
      const face = Math.atan2(hy, hx);
      return personSvg({ x: p.c[0], y: p.c[1], z: F + 1.9, face, hat: "hard", sit: true, shin: 0.9 }, dpose || { r: [1.25, 0.45], l: [1.25, 0.45], lean: 0.2 });
      const [x, y] = p.c;
      return `<g class="c-kurly">${solidSvg(cylinder(x, y, 1.5, F + 6.5, 4.5, P, 16), { tone: "hi", crease: "lo" })}</g>` + solidSvg(cylinder(x, y, 1.1, F + 11, 2, P, 14), { tone: "hi" }) + `<g class="c-hat">${solidSvg(cylinder(x, y, 1.5, F + 13, 0.8, P, 14), { tone: "hi", crease: "lo" })}</g>`;
    }
    const svg = solidSvg(extrude(p.ring, p.z, p.h, P, { bevel: 0.3 }), { tone: p.tone, crease: "lo" });
    return p.cls ? `<g class="${p.cls}">${svg}</g>` : svg;
  };
  return parts.map(draw).join("") + draw(roof);
}

// ---- 도크 레벨러, 팔레트 ----
const leveler = () => Z("dock", C("blue", slab(LEVELER, F, 0.8, { tone: "hi", crease: "lo" }, 0.3, 2) + L(k.lineOnTop([LEVELER.x + 2, LEVELER.y], [LEVELER.x + 2, LEVELER.y + LEVELER.d], F + 0.8, P), { tone: "mid" })));
function palletSvg(cx, cy, index) {
  const out = [];
  for (const dy of [-7, -1, 5]) out.push(slab({ x: cx - 8, y: cy + dy, w: 16, d: 2, r: 0.3 }, F, 1.6, { tone: "lo" }, 0, 2));
  out.push(slab(planAt(cx, cy, 16, 16, 0.4), F + 1.6, 1, { tone: "mid" }, 0.3, 2));
  for (let layer = 0; layer < 4; layer++) {
    const z = F + 2.6 + layer * 6;
    const plan = planAt(cx, cy, 15, 15, 0.5);
    const cross = k.lineOnTop([cx - 7.5, cy], [cx + 7.5, cy], z + 6, P) + k.lineOnTop([cx, cy - 7.5], [cx, cy + 7.5], z + 6, P);
    out.push(`<g data-layer="${index}-${layer}">${S(k.slabOf(plan, z, 6, P, 3, 0.3), { tone: "hi", crease: "lo", inner: L(k.sideSeam(plan, z + 3, P, 3), { tone: "faint" }) })}${L(cross, { tone: "lo" })}</g>`);
  }
  return out.join("");
}

// ---- 컨베이어 ----
const RAIL_B = { x: 46, y: CY - 8.5, w: 124, d: 1.5, r: 0.4 };
const RAIL_F = { x: 46, y: CY + 7, w: 124, d: 1.5, r: 0.4 };
const ROLLERS = Array.from({ length: 21 }, (_, i) => 49 + i * 6);
const LEGS = [50, 130, 166];
const leg = (x, y0) => slab({ x: x - 1, y: y0, w: 2, d: 1.5, r: 0.3 }, F, CONV - F - 4, { tone: "mid" }, 0, 2);
function conveyorBack() {
  const out = [];
  for (const x of LEGS) out.push(leg(x, CY - 8.5));
  out.push(slab(RAIL_B, CONV - 4, 4, { tone: "mid", inner: L(k.sideSeam(RAIL_B, CONV - 2, P, 3), { tone: "faint" }) }, 0.3));
  for (const x of ROLLERS) out.push(slab({ x: x - 1, y: CY - 7, w: 2, d: 14, r: 0.9 }, CONV - 1.8, 1.8, { tone: "hi", crease: "lo" }, 0, 4));
  return out.join("");
}
function conveyorFront() {
  const out = [];
  for (const x of LEGS) out.push(leg(x, CY + 7));
  for (const x of LEGS) out.push(slab({ x: x - 0.8, y: CY - 7, w: 1.6, d: 14, r: 0.3 }, F + 3, 1.5, { tone: "lo" }, 0, 2));
  out.push(slab(RAIL_F, CONV - 4, 4, { tone: "mid", inner: L(k.sideSeam(RAIL_F, CONV - 2, P, 3), { tone: "faint" }) }, 0.3));
  out.push(D(ROLLERS.map((x) => at([x, CY + 8.5, CONV - 1])), { size: 0.35, tone: "lo" }));
  return out.join("");
}

// ---- 검수대 (CI 계수기, QI 램프) ----
const POST_B = planAt(XS, CY - 13, 3, 3, 0.5);
const POST_F = planAt(XS, CY + 13, 3, 3, 0.5);
const CROSS = { x: XS - 4, y: CY - 15, w: 8, d: 30, r: 0.8 };
const COUNTER = { x: XS - 7, y: CY - 5, w: 14, d: 10, r: 1 };
const TOP = F + 36;
const post = (p) => slab(k.insetPlan(p, -1.5), F, 0.8, { tone: "lo", crease: "none" }, 0, 2) + slab(p, F + 0.8, TOP - F - 0.8, { tone: "mid" }, 0.3, 2);
const stationBack = () => C("blue", post(POST_B));
function stationFront() {
  const out = [post(POST_F)];
  out.push(slab(CROSS, TOP, 4, { tone: "hi", crease: "lo", inner: L(k.sideSeam(CROSS, TOP + 2, P, 3), { tone: "faint" }) }, 0.4));
  const [lx, ly] = [XS + 7.5, CY];
  out.push(slab({ x: XS + 4, y: CY - 2, w: 5, d: 4, r: 0.5 }, TOP + 0.5, 3, { tone: "mid" }, 0.3, 2));
  out.push(S(k.cylinder(lx, ly, 3, TOP - 9, 1.2, P, 28), { tone: "lo" }));
  out.push(S(k.cylinder(lx, ly, 2.6, TOP - 7.8, 11.3, P, 28, 0.3), { tone: "mid", inner: L(k.sideArc(lx, ly, 2.6, TOP - 4, P, 20), { tone: "faint" }) }));
  out.push(slab(COUNTER, TOP + 4, 10, { tone: "hi", crease: "lo" }, 0.5));
  const m = k.sideMatrix([COUNTER.x, COUNTER.y + COUNTER.d], TOP + 14, P, "left");
  out.push(`<g transform="${m}"><rect class="mf-win" x="2" y="2" width="10" height="6" rx=".5"/><text class="iso-face-text mf-digits" data-tone="hi" x="7" y="6.6" font-size="4.4" text-anchor="middle" data-part="digits">000</text></g>`);
  out.push(S(k.cylinder(XS + 4, CY, 2, TOP + 14, 2.4, P, 18), { tone: "mid" }));
  out.push(L(k.knurl(XS + 4, CY, 2, TOP + 14.3, TOP + 16.1, 14, P, 0.3), { tone: "lo" }));
  return C("blue", out.join(""));
}

// ---- 분기 게이트 ----
function paddleRing(theta) {
  const c = Math.cos(theta), s = Math.sin(theta);
  return [[0, -0.6], [PADDLE_LEN, -0.6], [PADDLE_LEN, 0.6], [0, 0.6]].map(([x, y]) => [HINGE[0] + x * c - y * s, HINGE[1] + x * s + y * c]);
}
const paddleSvg = (theta) => solidSvg(extrude(paddleRing(theta), CONV + 1, 4, P, { bevel: 0.3 }), { tone: "hi", lit: true });
const gatePost = () => C("blue", S(k.cylinder(HINGE[0], HINGE[1], 2.6, F, 1, P, 20), { tone: "lo" }) + S(k.cylinder(HINGE[0], HINGE[1], 1.5, F + 1, CONV - F, P, 16), { tone: "mid", crease: "none" }));
const gateCap = () => C("blue", S(k.cylinder(HINGE[0], HINGE[1], 2, CONV + 1, 4.6, P, 18, 0.3), { tone: "mid" }) + D([at([HINGE[0], HINGE[1], CONV + 5.6])], { size: 0.5 }));

// ---- 반품 구역 ----
function binBack() {
  const out = [];
  out.push(slab(BIN, F, 0.8, { tone: "lo", crease: "none" }, 0, 2));
  out.push(slab({ x: BIN.x, y: BIN.y, w: BIN.w, d: 1, r: 0.2 }, F + 0.8, 9, { tone: "mid" }, 0, 2));
  out.push(slab({ x: BIN.x, y: BIN.y, w: 1, d: BIN.d, r: 0.2 }, F + 0.8, 9, { tone: "mid" }, 0, 2));
  return Z("return", C("pink", out.join("")) + `<g data-part="bin">${BIN_SLOTS.map(([x, y, z], i) => `<g data-binslot="${i}" style="display:none">${boxSvg(x, y, z, "bad")}</g>`).join("")}</g>`);
}
function binFront() {
  const right = { x: BIN.x + BIN.w - 1, y: BIN.y, w: 1, d: BIN.d, r: 0.2 };
  const front = { x: BIN.x, y: BIN.y + BIN.d - 1, w: BIN.w, d: 1, r: 0.2 };
  const out = [slab(right, F + 0.8, 9, { tone: "mid" }, 0, 2), slab(front, F + 0.8, 9, { tone: "mid", inner: L(k.sideSeam(front, F + 5, P, 2), { tone: "faint" }) }, 0.2, 2)];
  const cart = { x: 114, y: 88, w: 12, d: 16, r: 0.6 };
  for (const [x, y] of byDepth(k.corners(cart, 1.6), (q) => depth(...q))) out.push(wheelSvg(x, y, F + 1.1, 0, 1, 1, 0, 1.1, 0.8));
  out.push(slab(cart, F + 2.2, 1.2, { tone: "lo" }, 0, 2), slab({ x: cart.x + cart.w - 1.2, y: cart.y, w: 1.2, d: cart.d, r: 0.3 }, F + 3.4, 12, { tone: "mid" }, 0.2, 2));
  out.push(boxSvg(119.5, 93, F + 3.4, "bad"), boxSvg(119.5, 100, F + 3.4, "bad"));
  out.push(S(k.cylinder(96, 98, 6, F, 9, P, 32, 0.4), { tone: "mid", inner: L(k.sideArc(96, 98, 6, F + 6, P, 24), { tone: "faint" }) }));
  out.push(L(k.ring(96, 98, 4.8, F + 9, P, 28), { tone: "lo" }));
  return Z("return", C("pink", out.join("")));
}

// ---- 수직 반송기 ----
const MASTS = [
  { x: 176, y: 26, w: 3, d: 3, r: 0.4 },
  { x: 191, y: 26, w: 3, d: 3, r: 0.4 },
];
const mastPart = (z0, z1) => Z("lift", C("blue", MASTS.map((m) => slab(m, z0, z1 - z0, { tone: "mid" }, 0.2, 2)).join("") + (z1 > FL4 ? slab({ x: 175, y: 25, w: 20, d: 5, r: 0.5 }, z1, 3, { tone: "hi", crease: "lo" }, 0.3, 2) : "")));
function cageSvg() {
  const out = [];
  out.push(slab({ x: LIFT.x, y: LIFT.y - 2, w: LIFT.w, d: 2, r: 0.3 }, CONV - 1.5, 14, { tone: "mid" }, 0.2, 2));
  out.push(slab(LIFT, CONV - 1.5, 1.5, { tone: "hi", crease: "lo" }, 0.3, 2));
  const load = boxSvg(180, CY, CONV, "ok") + boxSvg(190, CY, CONV, "ok");
  out.push(`<g data-part="load">${load}</g>`);
  out.push(`<g data-part="outload" style="display:none">${boxSvg(180, CY, CONV, "brown") + boxSvg(190, CY, CONV, "brown")}</g>`);
  out.push(slab({ x: LIFT.x + LIFT.w - 1, y: LIFT.y, w: 1, d: LIFT.d, r: 0.3 }, CONV, 4, { tone: "mid" }, 0, 2));
  return Z("lift pick", C("blue", `<g data-part="cage">${out.join("")}</g>`));
}

// ---- 랙 ----
function rackSvg(plan, levels, top, stock) {
  const ups = [
    [plan.x, plan.y],
    [plan.x + plan.w - 2.5, plan.y],
    [plan.x, plan.y + plan.d - 2.5],
    [plan.x + plan.w - 2.5, plan.y + plan.d - 2.5],
  ].map(([x, y]) => ({ x, y, w: 2.5, d: 2.5, r: 0.3 }));
  const order = byDepth(ups, (p) => depth(p.x + 1.2, p.y + 1.2));
  const z0 = levels[0] - 3;
  const up = (p) => slab(p, z0, top - z0, { tone: "mid" }, 0.2, 2);
  const out = [up(order[0])];
  const shelf = { x: plan.x + 2.5, y: plan.y, w: plan.w - 5, d: plan.d, r: 0.3 };
  levels.forEach((z, level) => {
    out.push(slab(shelf, z, 1.5, { tone: "lo", crease: "faint" }, 0.3, 2));
    out.push(stock(level, z + 1.5));
  });
  for (const p of order.slice(1)) out.push(up(p));
  out.push(slab(plan, top, 1.5, { tone: "mid" }, 0.3, 2));
  return out.join("");
}
const stockOf = (plan, color) => (level, z) =>
  [plan.x + 9, plan.x + 21, plan.x + 33]
    .filter((x, i) => x + 5 < plan.x + plan.w - 2.5 && (i + level + Math.round(plan.y)) % 3 !== 1)
    .map((x) => C(color, slab(planAt(x, plan.y + plan.d / 2, 10, Math.min(14, plan.d - 4), 0.4), z, 8, { tone: "hi", crease: "lo" }, 0.3, 2)))
    .join("");

// 여러 칸짜리 랙 줄: 먼 쪽 기둥 → 단마다 선반과 상자 → 가까운 쪽 기둥 → 위 틀
function rackRow(row, base, levels, top, color, stockFn) {
  const ups = [];
  for (let i = 0; i <= row.bays; i++) {
    const x = Math.min(row.x0 + ((row.x1 - row.x0) / row.bays) * i, row.x1 - 2.5);
    ups.push({ far: { x, y: row.y0, w: 2.5, d: 2.5, r: 0.3 }, near: { x, y: row.y1 - 2.5, w: 2.5, d: 2.5, r: 0.3 } });
  }
  const up = (q) => slab(q, base, top - base, { tone: "mid" }, 0.2, 2);
  const out = [ups.map((u) => up(u.far)).join("")];
  const shelf = { x: row.x0, y: row.y0, w: row.x1 - row.x0, d: row.y1 - row.y0, r: 0.3 };
  levels.forEach((z, lvl) => {
    out.push(slab(shelf, z, 1.5, { tone: "lo", crease: "faint" }, 0.3, 2));
    for (let bay = 0; bay < row.bays; bay++) {
      const bx0 = row.x0 + ((row.x1 - row.x0) / row.bays) * bay + 2.5, bx1 = row.x0 + ((row.x1 - row.x0) / row.bays) * (bay + 1);
      out.push(stockFn(bay, lvl, bx0, bx1, z + 1.5));
    }
  });
  out.push(ups.map((u) => up(u.near)).join("") + slab(shelf, top, 1.5, { tone: "mid" }, 0.3, 2));
  return C(color, out.join(""));
}
// 일반 칸 재고: 칸마다 상자 한두 개 (규칙적으로 빈 칸)
const bayStock = (color, row, seed) => (bay, lvl, bx0, bx1, z) => {
  const k2 = (bay * 7 + lvl * 3 + seed) % 5;
  if (k2 === 4) return "";
  const w = bx1 - bx0, cy = (row.y0 + row.y1) / 2, d = Math.min(12, row.y1 - row.y0 - 3);
  const spans = k2 % 2 ? [[0.1, 0.46], [0.54, 0.9]] : [[0.2, 0.8]];
  return spans.map(([a, b]) => C(color, slab({ x: bx0 + w * a, y: cy - d / 2, w: w * (b - a), d, r: 0.4 }, z, 8, { tone: "hi", crease: "lo" }, 0.3, 2))).join("");
};
// 통로 바닥 표시 (닫힌 사각형)
const aisle = (plan, z) => L(k.planOutline(plan, z + 0.35, P, 2), { tone: "lo" });

// ---- 2층: 냉장존 ----
const CHILL_ROWS = [
  { x0: 26, x1: 164, y0: 6, y1: 20, bays: 5 },
  { x0: 26, x1: 118, y0: 34, y1: 48, bays: 4 },
];
function floor2() {
  const out = [];
  out.push(slabFloor(FL2));
  out.push(Z("chill", tint({ x: 3, y: 3, w: 164, d: 104, r: 1 }, FL2, "indigo") + aisle({ x: 24, y: 23, w: 142, d: 8, r: 1 }, FL2) + aisle({ x: 24, y: 56, w: 142, d: 14, r: 1 }, FL2)));
  out.push(hl("chill", "indigo", [{ x: 3, y: 3, w: 164, d: 104, r: 1 }], FL2), hl("pick", "brown", [{ x: 124, y: 22, w: 45, d: 52, r: 1 }], FL2), floorEdge(FL2));
  out.push(core(FL2, FL3 - SLAB));
  out.push(backWallAt(FL2));
  out.push(column(168.5, 1.5, FL2, FL3 - SLAB));
  const chillRow = (i) => Z("chill", rackRow(CHILL_ROWS[i], FL2, [FL2 + 3, FL2 + 14], FL2 + 25, "indigo", bayStock("indigo", CHILL_ROWS[i], i * 2)));
  out.push(chillRow(0), chillRow(1));
  // 그림 2: 0번 칸(먼저 피킹되는 칸)이 유통기한이 이른 10/22 로트
  const stock = (level, z) => RACK_SLOTS.map(([x, y, l], i) => (l === level ? `<g data-rackslot="${i}" style="display:none">${boxSvg(x, y, z, WAREHOUSE && i === 0 ? "pink" : "ok")}</g>` : "")).join("");
  const a = [rackSvg(RACK_A, SHELF_Z, RACK_TOP, stock)];
  const tag = { x: 132, y: 46, w: 14, d: 6, r: 0.5 };
  a.push(slab(tag, RACK_TOP + 1.5, 0.5, { tone: "hi", crease: "none" }, 0, 2));
  a.push(k.faceTextSvg(k.topMatrix([tag.x + 7, tag.y + 4.4], RACK_TOP + 2, P, "x"), TEXT.display.rack, { size: 3.6, tone: "mid", anchor: "middle" }));
  // 그림 2: 로케이션(랙 바닥)과 로트(0번 칸) 강조는 랙보다 먼저 그려 상자를 덮지 않게 한다
  if (WAREHOUSE) {
    const [lx, ly, ll] = RACK_SLOTS[0];
    out.push(hl("cell", "green", [k.insetPlan(RACK_A, -2)], FL2), hl("lot", "pink", [planAt(lx, ly, BOX.w + 4, BOX.d + 4, 1)], SHELF_Z[ll] + 1.5));
  }
  out.push(Z(WAREHOUSE ? "chill cell lot" : "chill", C("green", a.join(""))));
  out.push(Z("chill", '<g class="c-gray" data-part="fork2"></g>'));
  out.push(Z("chill", wrappedPallet(142, 96, FL2) + wrappedPallet(159, 96, FL2)));
  out.push(worker(3), worker(5), worker(9));
  return out.join("");
}

// ---- 3층: 냉동존 ----
const FREEZE_ROWS = [
  { x0: 26, x1: 164, y0: 22, y1: 36, bays: 5 },
  { x0: 26, x1: 164, y0: 52, y1: 66, bays: 5 },
];
function floor3() {
  const out = [];
  out.push(slabFloor(FL3));
  out.push(Z("freeze", tint({ x: 6, y: 6, w: 161, d: 101, r: 1 }, FL3, "teal") + aisle({ x: 24, y: 39, w: 142, d: 10, r: 1 }, FL3) + aisle({ x: 24, y: 69, w: 142, d: 14, r: 1 }, FL3)));
  out.push(hl("freeze", "teal", [{ x: 6, y: 6, w: 161, d: 101, r: 1 }], FL3), floorEdge(FL3));
  out.push(core(FL3, FL4 - SLAB));
  out.push(column(168.5, 1.5, FL3, FL4 - SLAB));
  const fz = [];
  // 두꺼운 단열 벽 (뒤, 왼쪽)
  const back = { x: 20, y: 0, w: 150, d: 6, r: 0.5 }, left = { x: 0, y: 20, w: 6, d: 90, r: 0.5 };
  fz.push(slab(back, FL3, 13, { tone: "hi", crease: "lo", inner: L(k.sideSeam(back, FL3 + 7, P, 2), { tone: "faint" }) }, 0.6, 2));
  fz.push(slab(left, FL3, 13, { tone: "hi", crease: "lo", inner: L(k.sideSeam(left, FL3 + 7, P, 2), { tone: "faint" }) }, 0.6, 2));
  // 냉동기 유닛과 온도 표시 (-18°C)
  const unit = { x: 30, y: 6, w: 28, d: 9, r: 0.8 };
  fz.push(slab(unit, FL3, 11, { tone: "hi", crease: "lo" }, 0.5, 2));
  fz.push(L([37, 51].map((x) => k.ring(x, 10.5, 3.2, FL3 + 11, P, 28) + k.ring(x, 10.5, 1, FL3 + 11, P, 12)).join(""), { tone: "mid" }));
  const m = k.sideMatrix([unit.x, unit.y + unit.d], FL3 + 10, P, "left");
  fz.push(`<g transform="${m}"><rect class="mf-win" x="4" y="2" width="15" height="6" rx=".5"/><text class="iso-face-text mf-digits" data-tone="hi" x="11.5" y="6.6" font-size="4.2" text-anchor="middle">${TEXT.display.freezer}</text></g>`);
  out.push(Z("freeze", C("teal", fz.join(""))));
  const freezeRow = (i) => Z("freeze", rackRow(FREEZE_ROWS[i], FL3, [FL3 + 3, FL3 + 14], FL3 + 25, "teal", bayStock("teal", FREEZE_ROWS[i], i * 3 + 1)));
  out.push(Z("freeze", wrappedPallet(15, 34, FL3) + wrappedPallet(15, 52, FL3)));
  out.push(freezeRow(0), freezeRow(1), Z("freeze", '<g class="c-gray" data-part="fork3"></g>'), worker(11), worker(10));
  return out.join("");
}

// ---- 4층: 사무실, 상온존 ----
const needleAt = (value) => {
  const angle = FROM + (value / 100) * SPAN;
  const sx = Math.sin(angle), sy = -Math.cos(angle);
  return lineOnTop([GAUGE[0] - sx * 1, GAUGE[1] - sy * 1], [GAUGE[0] + sx * (GAUGE_R - 3.4), GAUGE[1] + sy * (GAUGE_R - 3.4)], GAUGE_TOP + 0.2, P);
};
const AMB_ROWS = [
  { x0: 96, x1: 164, y0: 6, y1: 20, bays: 3 },
  { x0: 96, x1: 164, y0: 36, y1: 50, bays: 3 },
  { x0: 96, x1: 164, y0: 66, y1: 80, bays: 3 },
];
function floor4() {
  const Z4 = FL4;
  const out = [];
  out.push(slabFloor(Z4));
  out.push(Z("settle", tint({ x: 24, y: 3, w: 60, d: 57, r: 1 }, Z4, "orange")));
  out.push(Z("ambient", aisle({ x: 94, y: 23, w: 72, d: 10, r: 1 }, Z4) + aisle({ x: 94, y: 53, w: 72, d: 10, r: 1 }, Z4)));
  if (WAREHOUSE) out.push(hl("ambient", "orange", [{ x: 92, y: 3, w: 75, d: 80, r: 1 }], Z4));
  out.push(hl("settle", "orange", [{ x: 24, y: 3, w: 60, d: 57, r: 1 }], Z4), hl("order", "brown", [{ x: 26, y: 4, w: 28, d: 30, r: 1 }], Z4), floorEdge(Z4));
  out.push(core(Z4, Z4 + 24, true));
  out.push(backWallAt(Z4));
  const o = [];
  const desk = { x: 30, y: 6, w: 20, d: 12, r: 0.6 };
  o.push(slab(desk, Z4, 7, { tone: "mid" }, 0.3, 2));
  o.push(C("blue", slab({ x: 34, y: 8, w: 12, d: 2, r: 0.3 }, Z4 + 7, 8, { tone: "hi", crease: "lo" }, 0.2, 2)));
  // 출고 주문 표시등
  o.push(Z("order", C("brown", S(k.cylinder(46, 14, 1, Z4 + 7, 6, P, 12), { tone: "hi", crease: "none" }) + S(k.cylinder(46, 14, 2.4, Z4 + 13, 2.6, P, 20, 0.3), { tone: "hi", crease: "lo" }))));
  o.push(slab({ x: 38, y: 23, w: 4.4, d: 4.4, r: 0.6 }, Z4 + 0.6, 3.4, { tone: "mid" }, 0, 2));
  o.push(C("pants", slab({ x: 37.6, y: 22.6, w: 5.2, d: 5, r: 1 }, Z4 + 4, 0.8, { tone: "hi", crease: "lo" }, 0.2, 2)));
  o.push(worker(4));
  o.push(C("pants", slab({ x: 37.6, y: 27.4, w: 5.2, d: 1, r: 0.4 }, Z4 + 4.8, 5.4, { tone: "hi", crease: "lo" }, 0.2, 2)));
  const [x, y] = GAUGE;
  const base = planAt(x, y, 24, 24, 1.5);
  const g = [];
  g.push(slab(base, Z4, 12, { tone: "hi", crease: "lo", inner: L(k.sideSeam(base, Z4 + 6, P, 3), { tone: "faint" }) }, 0.5));
  g.push(S(k.cylinder(x, y, GAUGE_R, Z4 + 12, 4, P, 56, 0.6), { tone: "hi", crease: "lo" }));
  g.push(L(k.knurl(x, y, GAUGE_R, GAUGE_TOP - 2, GAUGE_TOP, 56, P, 0.3), { tone: "lo" }));
  g.push(L(k.ring(x, y, GAUGE_R - 1.5, GAUGE_TOP, P, 48), { tone: "lo" }));
  const t = k.radialTicks(x, y, GAUGE_R - 1.5, 20, 5, GAUGE_TOP, [1, 2], P, FROM, SPAN);
  g.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  const pinA = FROM + SPAN;
  g.push(S(k.cylinder(x + Math.sin(pinA) * (GAUGE_R - 0.9), y - Math.cos(pinA) * (GAUGE_R - 0.9), 0.8, GAUGE_TOP, 1.6, P, 12), { tone: "hi", crease: "none" }));
  g.push(`<path data-part="needle" class="iso-line" data-tone="hi" data-free="end" d="${needleAt(0)}" style="stroke-width:1.4"/>`);
  g.push(S(k.cylinder(x, y, 1.4, GAUGE_TOP, 0.7, P, 14), { tone: "mid" }));
  o.push(HIDE(C("orange", g.join(""))));
  o.push(worker(13));
  const right = { x: 84, y: 3, w: 2, d: 57, r: 0.3 };
  const front = { x: 24, y: 58, w: 60, d: 2, r: 0.3 };
  o.push(slab(right, Z4, 8, { tone: "mid" }, 0.2, 2));
  o.push(slab(front, Z4, 8, { tone: "mid", inner: L(k.sideSeam(front, Z4 + 5, P, 2), { tone: "faint" }) }, 0.2, 2));
  out.push(Z("settle", o.join("")));
  const ambRow = (i) => Z("ambient", rackRow(AMB_ROWS[i], Z4, [Z4 + 3, Z4 + 14], Z4 + 25, "orange", bayStock("orange", AMB_ROWS[i], i * 2 + 1)));
  out.push(ambRow(0), ambRow(1), ambRow(2), Z("ambient", wrappedPallet(40, 96, Z4) + wrappedPallet(58, 96, Z4)), worker(12));
  return out.join("");
}

// ---- 출고: 레인, 포장대, 상차 ----
function outLane() {
  const out = [];
  for (const x of [28, 96, 164]) for (const y of [LANE.y + 0.5, LANE.y + LANE.d - 2]) out.push(slab({ x: x - 1, y, w: 2, d: 1.5, r: 0.3 }, F, LANE_Z - F - 2, { tone: "mid" }, 0, 2));
  out.push(slab(LANE, LANE_Z - 2, 2, { tone: "mid", inner: L(k.sideSeam(LANE, LANE_Z - 1, P, 2), { tone: "faint" }) }, 0.3, 2));
  out.push(C("brown", S(k.slabOf(k.insetPlan(LANE, 1.5), LANE_Z, 0.2, P, 2), { tone: "hi", flat: true, crease: "none" })));
  const pool = Array.from({ length: 12 }, (_, i) => `<g data-lanebox="${i}" style="display:none">${boxSvg(166, LANE.y + LANE.d / 2, LANE_Z, "brown")}</g>`).join("");
  return Z("pack", C("gray", out.join("") + `<g data-part="lanepool">${pool}</g>`));
}
function packTable() {
  const out = [];
  for (const [x, y] of k.corners(TABLE, 1.5)) out.push(slab(planAt(x, y, 1.6, 1.6, 0.3), F, TABLE_Z - F - 1.2, { tone: "mid" }, 0, 2));
  out.push(slab(TABLE, TABLE_Z - 1.2, 1.2, { tone: "hi", crease: "lo" }, 0.3, 2));
  const stack = [0, 1, 2].map((i) => `<g data-tablebox="${i}" style="display:none">${boxSvg(12, 32, TABLE_Z + i * BOX.h, "brown")}</g>`).join("");
  return Z("pack outdock", C("brown", out.join("")) + stack);
}
function loadPool() {
  return Z("outdock", `<g data-part="loadpool">${Array.from({ length: 8 }, (_, i) => `<g data-loadbox="${i}" style="display:none">${C("brown", slab(planAt(12, 32, 2.4, 2.4, 0.3), TABLE_Z, 2, { tone: "hi", crease: "lo" }, 0.2, 2))}</g>`).join("")}</g>`);
}

// ---- 이동 박스 풀 ----
const POOL = 14;
const pool = Array.from({ length: POOL }, (_, i) => `<g data-crate="${i}" style="display:none"><g>${boxSvg(X0, CY, CONV)}</g><g style="display:none">${boxSvg(X0, CY, CONV, "ok")}</g><g style="display:none">${boxSvg(X0, CY, CONV, "bad")}</g></g>`).join("");

const floor1 = [
  ground(),
  floor1Zones(),
  safetyLines(),
  core(F, FL2 - SLAB),
  backWallAt(F),
  column(168.5, 1.5, F, FL2 - SLAB),
  outLane(),
  HIDE(capBoard()),
  booth(),
  gateHousing(),
  worker(0),
  `<g data-part="yard">${armSvg()}<g data-zone="gate assign dock unload" data-part="truck" class="c-gray"${WAREHOUSE ? " data-whide" : ""}></g><g data-zone="outdock gate" data-part="truck2" class="c-gray"></g></g>`,
  armRest(),
  leftWall(),
  worker(6),
  packTable(),
  loadPool(),
  column(1.5, 108.5, F, FL2 - SLAB),
  leveler(),
  HIDE(Z("inspect", stationBack() + gatePost() + C("gray", conveyorBack()) + `<g data-part="paddle">${paddleSvg(0)}</g>` + gateCap() + C("gray", conveyorFront()))),
  HIDE(binBack()),
  HIDE(Z("inspect", C("gray", `<g data-part="train">${pool}</g>`))),
  HIDE(binFront()),
  HIDE(worker(8)),
  HIDE(worker(2)),
  HIDE(Z("inspect", stationFront())),
  HIDE(worker(1)),
  HIDE(`<g data-zone="unload" class="c-gray" data-part="staging">${SPOTS.map((_, i) => `<g data-pallet="${i}" style="display:none">${palletSvg(FROM_DOCK[0], FROM_DOCK[1], i)}</g>`).join("")}<g data-part="fork"></g></g>`),
  worker(14),
  HIDE(worker(7)),
  column(168.5, 108.5, F, FL2 - SLAB),
  mastPart(0, FL2 - SLAB - 1),
].join("");

// ---- 그림 2 확대창: A-01 아래 칸을 같은 각도로 크게, 10/22 로트(분홍)와 10/29 로트(초록)가 나란히 ----
const INSET = { cx: 96, cy: 158, r: 78, k: 2.0 };
function insetLayer() {
  const [ax, ay, al] = RACK_SLOTS[0], [bx, by] = RACK_SLOTS[1];
  const z0 = SHELF_Z[al];
  const center = [(ax + bx) / 2, ay, z0 + 6];
  const unit = { ...P, origin: [0, 0], scale: P.scale * INSET.k };
  const q = k.iso(center, unit);
  const Q = { ...unit, origin: [INSET.cx - q[0], INSET.cy - q[1] + 6] };
  const sl = (plan, z, h, tone = "hi") => k.solidSvg(k.slabOf({ r: 0.4, ...plan }, z, h, Q, 3, 0.3), { tone, crease: "lo" });
  const box = (cx, cy, z) => {
    const plan = planAt(cx, cy, BOX.w, BOX.d, 0.5);
    return k.solidSvg(k.slabOf(plan, z, BOX.h, Q, 3, 0.3), { tone: "hi", crease: "lo", inner: k.lineSvg(k.sideSeam(plan, z + 2.2, Q, 3), { tone: "faint" }) }) + k.solidSvg(k.slabOf({ x: cx - BOX.w / 2, y: cy - 1, w: BOX.w, d: 2, r: 0 }, z + BOX.h, 0.2, Q, 2), { tone: "mid", flat: true, crease: "none" });
  };
  // 로트 하나 = 같은 날 만든 상자 묶음 (2단)
  const lot = (cx, cy, cls, extra = "") => `<g class="${cls}"${extra}>${box(cx, cy, z0 + 1.5)}${box(cx, cy, z0 + 1.5 + BOX.h)}</g>`;
  const up = (x, y) => sl({ x, y, w: 2.5, d: 2.5 }, z0 - 4, BOX.h * 2 + 8, "mid");
  // 위 선반은 그리지 않는다 (위에서 내려다보는 각도라 로트를 가린다)
  const out = [
    C("green", up(RACK_A.x, RACK_A.y) + up(RACK_A.x + RACK_A.w - 2.5, RACK_A.y) + sl(RACK_A, z0, 1.5, "mid")),
    lot(ax, ay, "c-pink", " data-inset-lot"),
    lot(bx, by, "c-green"),
    C("green", up(RACK_A.x, RACK_A.y + RACK_A.d - 2.5) + up(RACK_A.x + RACK_A.w - 2.5, RACK_A.y + RACK_A.d - 2.5)),
  ];
  const target = at([ax, ay, z0 + 4]);
  const dx = target[0] - INSET.cx, dy = target[1] - INSET.cy, n = Math.hypot(dx, dy);
  const start = [INSET.cx + (dx / n) * INSET.r, INSET.cy + (dy / n) * INSET.r];
  const lead = `<path class="mf-lead" d="M${start[0].toFixed(1)} ${start[1].toFixed(1)}L${target[0].toFixed(1)} ${target[1].toFixed(1)}"/><circle class="mf-lead-end" cx="${target[0].toFixed(1)}" cy="${target[1].toFixed(1)}" r="2"/>`;
  return `<g class="mf-inset z-on" data-inset><clipPath id="mf-inset-clip"><circle cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r - 0.5}"/></clipPath>${lead}<g clip-path="url(#mf-inset-clip)"><circle class="mf-inset-bg" cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r}"/>${out.join("")}</g><circle class="mf-inset-ring" cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r}"/></g>`;
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.svgLabel,
  body: [
    FLR("1", floor1),
    FLR("2", floor2()),
    FLR("1 2", mastPart(FL2 - SLAB - 1, FL3 - SLAB - 1) + cageSvg() + column(168.5, 108.5, FL2, FL3 - SLAB) + column(1.5, 108.5, FL2, FL3 - SLAB)),
    FLR("3", floor3() + mastPart(FL3 - SLAB - 1, FL4 - SLAB - 1) + column(168.5, 108.5, FL3, FL4 - SLAB) + column(1.5, 108.5, FL3, FL4 - SLAB)),
    FLR("4", floor4() + mastPart(FL4 - SLAB - 1, FL4 + 30)),
    WAREHOUSE ? insetLayer() : "",
  ],
});

// ---- 색: 블로그 SVG 팔레트와 같은 의미, 활성(진하게) / 비활성(회색 쪽) ----
// [종이, 윗면, 음영 0..3 (어두운 쪽부터), hi(선, 글자), mid, lo, faint]
const STRONG = {
  // 라이트: 윗면 = 연한 중간 톤, 옆면 = 한 단계 진한 색, 테두리 = 그보다 진한 색, 면 위 세부 선과 글자 = 밝은 색
  blue: { light: ["#B4C9F2", "#B4C9F2", ["#6F96E4", "#779DE7", "#7FA3EA", "#8DADEC"], "#4C7FE0", "#F4F8FF", "#4C7FE0", "#D6E2F8"], dark: ["#6F93DD", "#6F93DD", ["#2F5098", "#3559A5", "#3B62B2", "#416BBF"], "#E3ECFF", "#E8EFFF", "#1E3870", "#A9C2F2"] },
  green: { light: ["#A9D9B0", "#A9D9B0", ["#64B271", "#6CB879", "#74BE80", "#82C58D"], "#3E9B4F", "#F4FBF5", "#3E9B4F", "#D3ECD7"], dark: ["#66B874", "#66B874", ["#2A7339", "#2F7F3F", "#348B45", "#3A974B"], "#E2FBE6", "#E6F8E9", "#134A1E", "#A6DDB0"] },
  pink: { light: ["#F2B8CB", "#F2B8CB", ["#DA7598", "#DF7E9F", "#E487A6", "#E894B0"], "#D04F78", "#FFF5F8", "#D04F78", "#F8DCE5"], dark: ["#E57E9E", "#E57E9E", ["#9A3557", "#A83B5F", "#B64167", "#C4486F"], "#FFE6EE", "#FFE6EE", "#5E1530", "#F6BBCD"] },
  orange: { light: ["#F8D58C", "#F8D58C", ["#EBA92C", "#EFB036", "#F2B640", "#F4BE55"], "#E89400", "#FFFBF0", "#C27C00", "#FBE9C2"], dark: ["#F4B84A", "#F4B84A", ["#9A6800", "#A87200", "#B67C00", "#C48600"], "#FFF0D0", "#FFF2D8", "#5E3C00", "#FFD994"] },
  brown: { light: ["#E6CFAF", "#E6CFAF", ["#B58A55", "#BF955F", "#C9A06B", "#D2AE7E"], "#9A6A3A", "#FFF8EE", "#9A6A3A", "#F0E2CC"], dark: ["#B8946A", "#B8946A", ["#5E4224", "#6A4B2A", "#765430", "#825D36"], "#F6E7D2", "#F8EEDF", "#3A2814", "#D8BF9C"] },
  hat: { light: ["#F4F4F6", "#FFFFFF", ["#C6C6CB", "#D0D0D4", "#DADADE", "#E4E4E7"], "#6A6A70", "#FFFFFF", "#6A6A70", "#E8E8EA"], dark: ["#D8D8DC", "#E6E6EA", ["#8E8E94", "#9A9AA0", "#A6A6AC", "#B2B2B8"], "#F4F4F6", "#FFFFFF", "#3A3A3E", "#C8C8CC"] },
  kurly: { light: ["#A35BC0", "#A35BC0", ["#6E1690", "#7A209C", "#8A3DA8", "#9549B2"], "#4A0F66", "#F6E8FF", "#4A0F66", "#D2B0E0"], dark: ["#B06ACF", "#B06ACF", ["#5A1478", "#661C86", "#722494", "#7E2CA2"], "#F3E0FF", "#F3E0FF", "#2A0038", "#C9A0DE"] },
  kurlytruck: { light: ["#7A2A9A", "#7A2A9A", ["#47005F", "#52006E", "#5F0080", "#6A0A8C"], "#33004A", "#FFFFFF", "#33004A", "#B48AC8"], dark: ["#8A3DAE", "#8A3DAE", ["#3E0A55", "#4A0E63", "#561272", "#621A80"], "#F3E0FF", "#FFFFFF", "#22002E", "#B482CC"] },
  truckwhite: { light: ["#FFFFFF", "#FFFFFF", ["#CFD1D6", "#D9DBDF", "#E3E4E8", "#ECEDF0"], "#6B6E78", "#FFFFFF", "#6B6E78", "#E4E5E9"], dark: ["#D9DAE0", "#E4E5EA", ["#8C8E96", "#989AA2", "#A4A6AE", "#B0B2BA"], "#F4F4F6", "#FFFFFF", "#3A3B40", "#C4C6CC"] },
  steel: { light: ["#C2C5CC", "#C9CCD2", ["#8D9099", "#979AA3", "#A1A4AD", "#ABAEB7"], "#4E515A", "#F0F1F4", "#4E515A", "#B5B8C0"], dark: ["#7E828C", "#8A8E98", ["#44474F", "#4C4F58", "#545861", "#5C606A"], "#E0E2E8", "#F0F1F4", "#26282D", "#6E727C"] },
  skin: { light: ["#F1C9A5", "#F1C9A5", ["#D9A37C", "#E0AE88", "#E7B994", "#EDC3A0"], "#A87452", "#FFF3EA", "#A87452", "#F6DCC6"], dark: ["#E2B48E", "#E2B48E", ["#A9764F", "#B3805A", "#BD8A64", "#C7946E"], "#FCE9D8", "#FFF3EA", "#6A4428", "#F0CDAE"] },
  pants: { light: ["#566074", "#5E687C", ["#343B49", "#3B4352", "#434B5C", "#4B5466"], "#20252F", "#E6E9EF", "#20252F", "#8A93A6"], dark: ["#5E687E", "#68728A", ["#2C3240", "#323948", "#394050", "#404858"], "#DDE2EC", "#E6E9EF", "#151922", "#7E889C"] },
  hair: { light: ["#4A3426", "#5A4030", ["#2E2017", "#35251B", "#3C2A1F", "#432F23"], "#22170F", "#8A6A55", "#22170F", "#6E5444"], dark: ["#5A4232", "#6A4E3C", ["#36261C", "#3E2C21", "#463226", "#4E382B"], "#C8A890", "#9A7A64", "#20150E", "#7E6452"] },
  indigo: { light: ["#B3B7EE", "#B3B7EE", ["#6D75DA", "#767EDD", "#7F86E0", "#8C92E4"], "#5B63D3", "#F5F6FF", "#5B63D3", "#D9DBF6"], dark: ["#8B92EE", "#8B92EE", ["#3E45A8", "#454CB6", "#4C53C4", "#535AD0"], "#E6E8FF", "#ECEDFF", "#20256E", "#BEC2F8"] },
  wrap: { light: ["#F7FAFC", "#FFFFFF", ["#D3DCE5", "#DAE2EA", "#E2E8EE", "#E9EEF2"], "#7C8794", "#FFFFFF", "#7C8794", "#E9EEF2"], dark: ["#C9D2DC", "#D6DEE6", ["#7E8894", "#8A94A0", "#96A0AC", "#A2ACB8"], "#F2F6FA", "#FFFFFF", "#353B42", "#B8C2CC"] },
  safety: { light: ["#FFE27A", "#FFE27A", ["#E3BC2A", "#E9C436", "#EFCC44", "#F3D458"], "#B89400", "#FFFBE6", "#B89400", "#FFF1B8"], dark: ["#E8C440", "#E8C440", ["#8A7000", "#967A00", "#A28400", "#AE8E00"], "#FFF3C4", "#FFF6D6", "#4A3C00", "#F2DA80"] },
  rubber: { light: ["#4A4D55", "#555861", ["#2C2E33", "#32343A", "#383B41", "#3F4248"], "#1E2024", "#B8BCC4", "#1E2024", "#6A6E76"], dark: ["#3A3D44", "#42454C", ["#1E2024", "#232529", "#282A2F", "#2D3035"], "#B8BCC4", "#C8CCD4", "#0E0F12", "#555860"] },
  teal: { light: ["#9FDBE3", "#9FDBE3", ["#47B4C3", "#51BAC8", "#5BBFCD", "#6BC6D2"], "#1E9AAE", "#F0FBFD", "#1E9AAE", "#CFEDF1"], dark: ["#55BFCE", "#55BFCE", ["#13707E", "#167B8A", "#198696", "#1C91A2"], "#DDFAFF", "#E2FBFE", "#08414B", "#A4E6EF"] },
};
// 비활성: 원래 색을 채도 30% 안팎만 남긴 옅은 톤
const mixHex = (a, b, t) => {
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return "#" + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("");
};
const mutedOf = ([paper, top, shades, hi, mid, lo, faint], theme) => {
  const L = theme === "light";
  const face = L ? "#ECECEA" : "#202022", side = L ? "#DCDCDA" : "#18181A", line = L ? "#A4A4A8" : "#58585C";
  return [mixHex(paper, face, 0.7), mixHex(top, face, 0.7), shades.map((c) => mixHex(c, side, 0.7)), mixHex(L ? hi : lo, line, 0.55), mixHex(mid, face, 0.4), mixHex(L ? lo : hi, line, 0.55), mixHex(faint, face, 0.6)];
};
const MUTED = {
  light: ["#EFEFEE", "#F3F3F2", ["#E0E0DE", "#E5E5E3", "#E9E9E7", "#EDEDEB"], "#B4B4B8", "#CACACD", "#D6D6D8", "#E4E4E5"],
  dark: ["#19191B", "#1D1D1F", ["#141416", "#161618", "#18181A", "#1B1B1D"], "#4A4A4E", "#3B3B3E", "#2F2F32", "#252527"],
};
const KIT_GRAY = {
  light: ["#fbfbfa", "#F4F4F2", ["#D2D2CE", "#D9D9D5", "#DEDEDA", "#E3E3E0"], "#8A8A86", "#9A9A96", "#B8B8B4", "#D6D6D2"],
  dark: ["#131313", "#1c1c1c", ["#0f0f0f", "#121212", "#151515", "#181818"], "#d4d4d4", "#6a6a6a", "#3e3e3e", "#2a2a2a"],
};
// 강조 테두리: [라이트 띠와 발광, 라이트 테두리, 다크 띠와 발광, 다크 테두리]
const HL = {
  blue: ["#7FA3EA", "#4C7FE0", "#6F98EA", "#DCE8FF"],
  green: ["#74BE80", "#3E9B4F", "#62C472", "#DCF8E0"],
  pink: ["#E487A6", "#D04F78", "#F07C9F", "#FFDCE8"],
  orange: ["#F2B640", "#E89400", "#FFB43A", "#FFEBC2"],
  brown: ["#C9A06B", "#9A6A3A", "#D3A872", "#F6E7D2"],
  indigo: ["#7F86E0", "#5B63D3", "#8C93F5", "#E2E4FF"],
  teal: ["#5BBFCD", "#1E9AAE", "#45C8DA", "#D4F9FE"],
};
const tokens = ([paper, top, shades, hi, mid, lo, faint]) =>
  `--anatomy-paper:${paper};--anatomy-face:${paper};--anatomy-top:${top};${shades.map((c, i) => `--anatomy-shade-${i}:${c}`).join(";")};--anatomy-hi:${hi};--anatomy-mid:${mid};--anatomy-lo:${lo};--anatomy-faint:${faint};--anatomy-dot:${hi}`;
const colorCss = [
  ...Object.entries(STRONG).map(
    ([n, p]) =>
      `.iso .c-${n}{${tokens(mutedOf(p.dark, "dark"))}}.iso[data-theme="light"] .c-${n}{${tokens(mutedOf(p.light, "light"))}}` +
      `.iso .z-on .c-${n},.iso .z-on.c-${n}{${tokens(p.dark)}}.iso[data-theme="light"] .z-on .c-${n},.iso[data-theme="light"] .z-on.c-${n}{${tokens(p.light)}}` +
      `.sw-${n}{background:${p.light[1]};border-color:${p.light[3]}}.iso:not([data-theme="light"]) .sw-${n}{background:${p.dark[1]};border-color:${p.dark[3]}}`,
  ),
  `.iso .c-gray{${tokens(MUTED.dark)}}.iso[data-theme="light"] .c-gray{${tokens(MUTED.light)}}.iso .z-on .c-gray,.iso .z-on.c-gray{${tokens(KIT_GRAY.dark)}}.iso[data-theme="light"] .z-on .c-gray,.iso[data-theme="light"] .z-on.c-gray{${tokens(KIT_GRAY.light)}}`,
  `.iso .z-on .c-gray .c-blue,.iso .z-on .c-gray.c-blue{${tokens(STRONG.blue.dark)}}.iso[data-theme="light"] .z-on .c-gray .c-blue{${tokens(STRONG.blue.light)}}`,
  ...Object.entries(HL).map(([n, [l, ld, d, dd]]) => `.hl-${n}{--hl:${l};--hl-core:${ld}}.iso:not([data-theme="light"]) .hl-${n}{--hl:${d};--hl-core:${dd}}`),
].join("\n");

const CSS = `
[data-whide]{display:none!important}
.mf-inset{opacity:0;transition:opacity .5s ease;pointer-events:none}
.mf-inset.on{opacity:1}
.mf-inset-bg{fill:var(--anatomy-paper);stroke:none}
.mf-inset-ring{fill:none;stroke:#3E9B4F;stroke-width:2px}
.mf-lead{fill:none;stroke:#3E9B4F;stroke-width:1.4px;stroke-dasharray:4 3}
.mf-lead-end{fill:#3E9B4F}
[data-inset-lot]{transition:opacity .4s ease}
.mf-crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;margin:0 0 8px;font-size:13px;word-break:keep-all}
.mf-crumb{padding:2px 9px;border:1.5px solid var(--anatomy-faint,#ccc);border-radius:999px;color:var(--anatomy-text);opacity:.4;transition:opacity .3s ease,border-color .3s ease,background .3s ease}
.mf-crumb.on{opacity:1}
.mf-crumb.cur{border-color:var(--c);background:color-mix(in srgb,var(--c) 18%,transparent);font-weight:600}
.mf-crumb-sep{opacity:.5}
*{box-sizing:border-box}
html,body{margin:0;padding:0}
html,body,.iso{background:transparent!important}
html{color-scheme:${theme}!important}
.iso{--anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",monospace}
body{font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif}
.iso-page{width:100%;margin:0;padding:4px}
.iso-figure{margin:0}
.iso-plate-corner[data-corner="title"],.iso-plate-corner[data-corner="hint"]{letter-spacing:.04em}
.iso-legend{word-break:keep-all}
@media (max-width:560px){.iso-plate{padding:40px 6px 60px}}
.iso-stage{cursor:pointer;touch-action:pan-y;outline:none}
.iso-stage:focus-visible{outline:1px solid var(--anatomy-muted);outline-offset:6px}
${colorCss}
.iso-stage svg path,.iso-stage svg rect,.iso-stage svg circle,.iso-stage svg text{transition:fill .5s ease,stroke .5s ease}
.mf-floor,[data-zone]{transition:opacity .5s ease}
.mf-floor:not(.f-on){opacity:.6}
.f-on [data-zone]:not(.z-on):not(.mf-hl){opacity:.7}
.mf-hl path{fill:none;stroke:none;vector-effect:non-scaling-stroke;transition:fill-opacity .5s ease,stroke-opacity .5s ease}
.mf-hl .hl-band{fill:var(--hl);fill-opacity:0}
.mf-hl .hl-glow{stroke:var(--hl);stroke-opacity:0;stroke-width:10px;stroke-linejoin:round}
.mf-hl .hl-core{stroke:var(--hl-core);stroke-opacity:0;stroke-width:3px;stroke-linejoin:round}
.mf-hl.z-on .hl-band{fill-opacity:.4}
.mf-hl.z-on .hl-glow{stroke-opacity:.5}
.mf-hl.z-on .hl-core{stroke-opacity:1}
.mf-hl.pulse .hl-glow{animation:mf-pulse .6s ease-out 1}
@keyframes mf-pulse{0%{stroke-width:10px;stroke-opacity:.4}40%{stroke-width:22px;stroke-opacity:.7}100%{stroke-width:10px;stroke-opacity:.4}}
.mf-edge{fill:none;stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke;transition:stroke .5s ease,stroke-width .5s ease}
.f-on>.mf-edge,.f-on .mf-edge{stroke:var(--anatomy-hi);stroke-width:1.8px}
.iso[data-theme="light"] .f-on .mf-edge{stroke:#7D8A99;stroke-width:2px}
@media (prefers-reduced-motion:reduce){.iso-stage svg *{transition:none!important;animation:none!important}}
.mf-slot,.mf-win{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-digits{font-variant-numeric:tabular-nums;letter-spacing:.06em}
.mf-arm{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-stripe{fill:var(--anatomy-mid);stroke:none}
.mf-limb{fill:none;stroke:var(--anatomy-mid);stroke-width:${(1.1 * P.scale).toFixed(2)};stroke-linecap:round}
.mf-cell{fill:var(--anatomy-paper);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-cell[data-busy]{fill:var(--anatomy-lo)}
.mf-cell[data-on]{fill:var(--anatomy-mid);stroke:var(--anatomy-hi)}
.mf-keys{display:flex;flex-wrap:wrap;gap:6px 16px}
.mf-key{display:inline-flex;align-items:center;gap:7px}
.mf-sw{width:14px;height:10px;flex:none;border:1.5px solid;border-radius:2px}
.mf-sw-lit{background:transparent;border-color:var(--anatomy-lit)}
.mf-sw-man{background:transparent;border-color:var(--anatomy-text);border-radius:50%}
.mf-sw-glow{background:transparent;border-color:#4C7FE0;box-shadow:0 0 0 2px #4C7FE066,0 0 6px #4C7FE0}
.mf-digits{fill:#ffffff!important}
.iso[data-theme="light"] .iso-svg{--anatomy-top:#F4F4F2;--anatomy-face:#F4F4F2;--anatomy-shade-0:#D2D2CE;--anatomy-shade-1:#D9D9D5;--anatomy-shade-2:#DEDEDA;--anatomy-shade-3:#E3E3E0;--anatomy-hi:#8A8A86;--anatomy-mid:#9A9A96;--anatomy-lo:#B8B8B4;--anatomy-faint:#D6D6D2}
.mf-limb-edge,.mf-limb-fill{fill:none;stroke-linecap:round;stroke-linejoin:round}
.mf-limb-edge{stroke:var(--anatomy-hi)}
.mf-limb-fill{stroke:var(--anatomy-shade-3)}
.mf-skin{fill:var(--anatomy-top);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-hair{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-eye{fill:#2a1d14}
.mf-cheek{fill:#FF9FB4;opacity:.75}
.mf-smile{fill:none;stroke:#7A3E2A;stroke-linecap:round}
.mf-band{fill:none;stroke:#FFFFFF;stroke-linecap:butt}
.mf-shoe{fill:var(--anatomy-shade-1);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-hat{fill:var(--anatomy-top);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-cap{fill:var(--anatomy-top);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-door{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-handle{fill:var(--anatomy-lo);stroke:none}
.mf-grill{fill:var(--anatomy-shade-0);stroke:none}
.mf-glass{fill:#3E4C60;stroke:#2A3444;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-lamp{fill:#FFF2B8;stroke:#B89A3A;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.iso:not([data-theme="light"]) .mf-glass{fill:#1C2633;stroke:#7D8A99}
.mf-stripe-w{fill:#FFFFFF;stroke:none}
.mf-logo{fill:#FFFFFF;stroke:none}
.mf-hold{fill:#1E1626;stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-door-open{fill:var(--anatomy-shade-2);stroke:var(--anatomy-hi);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-sw-truck{background:linear-gradient(90deg,#FFFFFF 50%,#5F0080 50%);border-color:#5F0080}
.mf-tire{fill:#4a4b50;stroke:#2a2a2e;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.mf-tire-face{fill:#5f6066;stroke:#2a2a2e;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-hub{fill:#dcdde1;stroke:#7a7a80;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-bolt{fill:#5a5a60}
.iso:not([data-theme="light"]) .mf-tire{fill:#0c0c0e;stroke:#7a7a80}
.iso:not([data-theme="light"]) .mf-tire-face{fill:#1b1b1e;stroke:#7a7a80}
.iso:not([data-theme="light"]) .mf-hub{fill:#77777d;stroke:#b4b4b8}
.iso:not([data-theme="light"]) .mf-bolt{fill:#1b1b1e}
`;

const live = `
const P = ${JSON.stringify(P)};
const ORDERED = ${ORDERED}, DEFECTS = ${JSON.stringify(DEFECTS)}, PER_SLOT = ${PER_SLOT}, PALLETS = ${PALLETS}, PER_PALLET = ${PER_PALLET};
const F = ${F}, X0 = ${X0}, CY = ${CY}, CONV = ${CONV}, SPACING = ${SPACING};
const U_STATION = ${U_STATION}, U_GATE = ${U_GATE}, U_END = ${U_END};
const DWELL = ${DWELL}, PUSH = ${PUSH}, DROP = ${DROP}, FADE = ${FADE};
const BIN_SLOTS = ${JSON.stringify(BIN_SLOTS)};
const HINGE = ${JSON.stringify(HINGE)}, PADDLE_LEN = ${PADDLE_LEN};
const GAUGE = ${JSON.stringify(GAUGE)}, GAUGE_R = ${GAUGE_R}, GAUGE_TOP = ${GAUGE_TOP}, SPAN = ${SPAN}, FROM = ${FROM};
const PHASES = ${JSON.stringify(PHASES)};
const SKIP = new Set(${JSON.stringify(SKIP)}), WAREHOUSE = ${WAREHOUSE};
const CRUMBS = ${JSON.stringify(TEXT.crumbs || null)};
const LANE_X = ${LANE_X}, GATE_Y = ${GATE_Y}, WAIT = ${JSON.stringify(WAIT)}, DOCK_AT = ${JSON.stringify(DOCK_AT)};
const SPOTS = ${JSON.stringify(SPOTS)}, FROM_DOCK = ${JSON.stringify(FROM_DOCK)}, FORK = ${FORK};
const LIFT_TRAVEL = ${LIFT_TRAVEL};
const ORDER_N = ${ORDER_N}, STOCK_AFTER = ${STOCK_AFTER}, DOCK2_AT = ${JSON.stringify(DOCK2_AT)}, LANE = ${JSON.stringify(LANE)}, LANE_Z = ${LANE_Z}, TABLE_Z = ${TABLE_Z}, BOX_H = ${BOX.h};
const R = ${JSON.stringify(TEXT.readout)};
const fmt = (tpl, vars) => tpl.replace(/[{]([a-z]+)[}]/g, (_, key) => String(vars[key]));
const WORKERS = ${JSON.stringify(WORKERS)};
const paddleRing = ${paddleRing.toString()};
const paddleSvg = ${paddleSvg.toString()};
const needleAt = ${needleAt.toString()};
const LOGO_D = ${JSON.stringify(LOGO_D)};
const wheelSvg = ${wheelSvg.toString()};
const truckSvg = ${truckSvg.toString()};
const FLOOR1 = ${F};
const forkliftSvg = ${forkliftSvg.toString()};
const personSvg = ${personSvg.toString()};
const REST_POSE = ${JSON.stringify(REST_POSE)};
const WALKS = ${JSON.stringify(WALKS)};
const FLOOR_FORKS = ${JSON.stringify(FLOOR_FORKS)};
const isBad = new Set(DEFECTS);
const DONE_S = ORDERED + (U_END + FADE) / SPACING + 0.2;

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const q = (sel) => svg.querySelector(sel);
const crates = [...svg.querySelectorAll("[data-crate]")];
const paddle = q('[data-part="paddle"]'), needle = q('[data-part="needle"]'), digits = q('[data-part="digits"]');
const yard = q('[data-part="yard"]'), truck = q('[data-part="truck"]'), armG = q('[data-part="arm"]'), arm = q('[data-part="armg"]');
const staging = q('[data-part="staging"]'), fork = q('[data-part="fork"]');
const cage = q('[data-part="cage"]'), load = q('[data-part="load"]'), outload = q('[data-part="outload"]');
const truck2 = q('[data-part="truck2"]');
const floorForks = FLOOR_FORKS.map((f) => ({ f, el: q('[data-part="' + f.part + '"]'), key: "" }));
const laneBoxes = [...svg.querySelectorAll("[data-lanebox]")], tableBoxes = [...svg.querySelectorAll("[data-tablebox]")], loadBoxes = [...svg.querySelectorAll("[data-loadbox]")];
const lanePool = q('[data-part="lanepool"]');
const IDX = Object.fromEntries(PHASES.map((p, i) => [p[0], i]));
const myCell = q('[data-part="mycell"]');
const lightOn = q('[data-light="on"]'), lightOff = q('[data-light="off"]');
const pallets = [...svg.querySelectorAll("[data-pallet]")];
const layers = [...svg.querySelectorAll("[data-layer]")];
const rackSlots = [...svg.querySelectorAll("[data-rackslot]")].sort((a, b) => a.dataset.rackslot - b.dataset.rackslot);
const binSlots = [...svg.querySelectorAll("[data-binslot]")];
const zoneEls = [...svg.querySelectorAll("[data-zone]")];
const floorEls = [...svg.querySelectorAll(".mf-floor")];
const people = WORKERS.map((w) => ({ w, el: svg.querySelector('[data-worker="' + w.id + '"]'), pose: JSON.parse(JSON.stringify(REST_POSE)), key: "" }));
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const clamp01 = (t) => Math.max(0, Math.min(1, t));

function placeOf(i, s) {
  const u = (s - i) * SPACING;
  if (u < 0) return null;
  const bad = isBad.has(i);
  const fadeIn = Math.min(1, u / 3);
  if (!bad || u < U_GATE) {
    if (u >= U_END + FADE) return { done: true, bad };
    const x = X0 + u;
    const out = u > U_END ? 1 - (u - U_END) / FADE : 1;
    return { x, y: CY, z: CONV, o: Math.min(fadeIn, out), inspected: u >= U_STATION, bad };
  }
  const d = u - U_GATE;
  const [, by, bz] = BIN_SLOTS[DEFECTS.indexOf(i)];
  const pushEnd = DWELL + (by - CY) / PUSH;
  const x = X0 + U_GATE;
  if (d < DWELL) return { x, y: CY, z: CONV, o: 1, inspected: true, bad };
  if (d < pushEnd) return { x, y: CY + (d - DWELL) * PUSH, z: CONV, o: 1, inspected: true, bad };
  if (d < pushEnd + DROP) { const f = (d - pushEnd) / DROP; return { x, y: by, z: CONV + (bz - CONV) * f * f, o: 1, inspected: true, bad }; }
  return { done: true, bad };
}
function paddleAngle(s) {
  let theta = 0;
  const reach = 15, maxT = Math.acos(reach / PADDLE_LEN);
  const touch = (y) => Math.min(maxT, Math.atan2(y - 4.5 - 0.6 - HINGE[1], reach));
  const limit = HINGE[1] + 0.6 + reach * Math.tan(maxT) + 4.5 - CY;
  for (const i of DEFECTS) {
    const u = (s - i) * SPACING;
    if (u < U_GATE) continue;
    const d = u - U_GATE;
    let t;
    if (d < DWELL) t = touch(CY) * (d / DWELL);
    else {
      const off = (d - DWELL) * PUSH;
      t = off < limit ? touch(CY + off) : Math.max(0, maxT * (1 - (d - DWELL - limit / PUSH) / 2.5));
    }
    theta = Math.max(theta, t);
  }
  return theta;
}
function counts(s) {
  let inspected = 0, ok = 0, bad = 0, rack = 0, bin = 0, launched = 0;
  for (let i = 1; i <= ORDERED; i++) {
    const u = (s - i) * SPACING;
    if (u < 0) break;
    launched++;
    if (u >= U_STATION) { inspected++; if (isBad.has(i)) bad++; else ok++; }
    const p = placeOf(i, s);
    if (p && p.done) { if (p.bad) bin++; else rack++; }
  }
  return { inspected, ok, bad, rack, bin, launched };
}
const bez = (a, b, c, d, t) => { const m = 1 - t; return [m*m*m*a[0] + 3*m*m*t*b[0] + 3*m*t*t*c[0] + t*t*t*d[0], m*m*m*a[1] + 3*m*m*t*b[1] + 3*m*t*t*c[1] + t*t*t*d[1]]; };
const B = [WAIT, [WAIT[0], WAIT[1] + 32], [DOCK_AT[0] - 32, DOCK_AT[1]], DOCK_AT];
const START_Y = 150;
function truckPose(phase, t) {
  if (phase === 0) {
    const f = ease(t / PHASES[0][1]);
    const y = START_Y + (WAIT[1] - START_Y) * f;
    return { x: LANE_X, y, hx: 0, hy: -1, o: clamp01((START_Y - y) / 14 + 0.05) };
  }
  if (phase === 1) return { x: WAIT[0], y: WAIT[1], hx: 0, hy: -1, o: 1 };
  if (phase === 2) {
    const f = ease(t / PHASES[2][1]);
    const p = bez(...B, f), p2 = bez(...B, Math.min(1, f + 0.002)), p1 = bez(...B, Math.max(0, f - 0.002));
    const dx = p2[0] - p1[0], dy = p2[1] - p1[1], n = Math.hypot(dx, dy) || 1;
    return { x: p[0], y: p[1], hx: -dx / n, hy: -dy / n, o: 1 };
  }
  return { x: DOCK_AT[0], y: DOCK_AT[1], hx: -1, hy: 0, o: 1 };
}
// 지게차: 팔레트 k 를 [k*1.25, +0.85] 동안 옮기고, 다음 팔레트 전까지 돌아온다
function forkPose(phase, t) {
  const dirOf = (k) => { const dx = SPOTS[k][0] - FROM_DOCK[0], dy = SPOTS[k][1] - FROM_DOCK[1], n = Math.hypot(dx, dy); return [dx / n, dy / n]; };
  const restOf = (k) => { const [hx, hy] = dirOf(k); return { x: FROM_DOCK[0] - FORK * hx, y: FROM_DOCK[1] - FORK * hy, hx, hy }; };
  if (phase < 3) { const r = restOf(0); return { ...r, carry: -1, e: 0 }; }
  if (phase > 3) { const [hx, hy] = dirOf(3); return { x: SPOTS[3][0] - FORK * hx - 4 * hx, y: SPOTS[3][1] - FORK * hy - 4 * hy, hx, hy, carry: -1, e: 1 }; }
  const k = Math.min(3, Math.floor(t / 1.25)), local = t - k * 1.25;
  const [hx, hy] = dirOf(k);
  const start = [FROM_DOCK[0] - FORK * hx, FROM_DOCK[1] - FORK * hy], end = [SPOTS[k][0] - FORK * hx, SPOTS[k][1] - FORK * hy];
  if (local < 0.85) { const e = ease(local / 0.85); return { x: start[0] + (end[0] - start[0]) * e, y: start[1] + (end[1] - start[1]) * e, hx, hy, carry: k, e }; }
  const e = ease((local - 0.85) / 0.4);
  const back = k < 3 ? e : 0.25 * e;
  return { x: end[0] + (start[0] - end[0]) * back, y: end[1] + (start[1] - end[1]) * back, hx, hy, carry: -1, e: 1 };
}

// 출고 트럭: 2번 도크에 붙어 있다가 출차 단계에 정문으로 나간다
const B2 = [DOCK2_AT, [DOCK2_AT[0] - 40, DOCK2_AT[1]], [LANE_X, DOCK2_AT[1] + 8], [LANE_X, DOCK2_AT[1] + 36]];
function truck2Pose(phase, t) {
  if (phase < IDX.order) return null;
  if (phase < IDX.exit) return { x: DOCK2_AT[0], y: DOCK2_AT[1], hx: -1, hy: 0, o: phase === IDX.order ? clamp01(t / 0.6) : 1 };
  const f = ease(t / PHASES[IDX.exit][1]);
  if (f < 0.45) {
    const g = f / 0.45, p = bez(...B2, g), a = bez(...B2, Math.max(0, g - 0.002)), b = bez(...B2, Math.min(1, g + 0.002));
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return { x: p[0], y: p[1], hx: dx / n, hy: dy / n, o: 1 };
  }
  const g = (f - 0.45) / 0.55, y = B2[3][1] + (165 - B2[3][1]) * g;
  return { x: LANE_X, y, hx: 0, hy: 1, o: clamp01((165 - y) / 14) };
}
// 출고 박스 수: 포장(레인 → 포장대), 상차(포장대 → 트럭)
const LANE_GAP = 0.22, LANE_RUN = 2.5, LOAD_GAP = 0.15, LOAD_RUN = 0.9;
// 상차: 포장대 옆에서 카트를 밀고 2번 도크 뒷문까지 → 문 열고 하나씩 싣기 → 문 닫고 물러남
const LOAD_PATH = [[24, 30], [24, 48], [9, 48]], LOAD_STOP = [9, 48];
const LOAD_T = { walk: 2.6, open: 2.8, unload: 3.0, close: 5.6, back: 7 };
let phase = 0, pt = 0, s = 0, rate = 0, paused = false, armAt = 0, clock = 0;
let frame = 0, last = 0, visible = false, lastTruck = "", lastTruck2 = "", lastFork = "", lastTheta = -1, lastDigits = "", lastPhase = -1;

// 그림 2: 계층 표시줄과 확대창
const crumbEls = [...document.querySelectorAll(".mf-crumb")], insetEl = svg.querySelector("[data-inset]"), insetLot = svg.querySelector("[data-inset-lot]");
const CRUMB_COLOR = { house: "#8A8A86", chill: "#5B63D3", freeze: "#1E9AAE", ambient: "#E89400", cell: "#3E9B4F", lot: "#D04F78" };
function setCrumbs(name) {
  if (!CRUMBS) return;
  const zone = name === "v_freeze" ? "freeze" : name === "v_ambient" ? "ambient" : "chill";
  const depth = name === "v_house" ? 1 : ["v_chill", "v_freeze", "v_ambient"].includes(name) ? 2 : name === "v_cell" ? 3 : 4;
  const labels = [CRUMBS.house, CRUMBS.zone[zone], CRUMBS.cell, CRUMBS.lot], keys = ["house", zone, "cell", "lot"];
  crumbEls.forEach((el, i) => {
    const on = i < depth;
    el.textContent = on ? labels[i] : CRUMBS.generic[i];
    el.classList.toggle("on", on);
    el.classList.toggle("cur", i === depth - 1);
    el.style.setProperty("--c", CRUMB_COLOR[keys[i]]);
  });
  if (insetEl) insetEl.classList.toggle("on", ["v_cell", "v_lot", "pick"].includes(name));
}
function setZones() {
  if (phase === lastPhase) return;
  lastPhase = phase;
  setCrumbs(PHASES[phase][0]);
  const [, , floors, zones] = PHASES[phase];
  floorEls.forEach((el) => el.classList.toggle("f-on", el.dataset.floor.split(" ").some((f) => floors.includes(+f))));
  zoneEls.forEach((el) => {
    const on = el.dataset.zone.split(" ").some((z) => zones.includes(z));
    el.classList.toggle("z-on", on);
    if (el.classList.contains("mf-hl")) {
      el.classList.remove("pulse");
      if (on && !still.matches) { void el.getBoundingClientRect(); el.classList.add("pulse"); }
    }
  });
}
function draw() {
  setZones();
  const tp = truckPose(phase, pt);
  // 하차 동안 입고 트럭 뒷문을 연다(마지막 팔레트를 내린 뒤 닫음)
  const inOpen = phase === IDX.unload && pt < PHASES[IDX.unload][1] - 0.3;
  const key = tp.x.toFixed(2) + "," + tp.y.toFixed(2) + "," + tp.hx.toFixed(3) + "," + tp.hy.toFixed(3) + (inOpen ? "o" : "");
  if (key !== lastTruck) { truck.innerHTML = truckSvg(tp.x, tp.y, tp.hx, tp.hy, "in", inOpen); lastTruck = key; }
  truck.style.opacity = tp.o < 1 ? tp.o.toFixed(3) : "";
  const t2 = truck2Pose(phase, pt);
  if (t2) {
    const doorOpen = phase === IDX.load && pt > LOAD_T.open && pt < LOAD_T.close;
    const key2 = t2.x.toFixed(2) + "," + t2.y.toFixed(2) + "," + t2.hx.toFixed(3) + "," + t2.hy.toFixed(3) + (doorOpen ? "o" : "");
    if (key2 !== lastTruck2) { truck2.innerHTML = truckSvg(t2.x, t2.y, t2.hx, t2.hy, "out", doorOpen); lastTruck2 = key2; }
    truck2.style.display = "";
    truck2.style.opacity = t2.o < 1 ? t2.o.toFixed(3) : "";
  } else truck2.style.display = "none";
  const yo = [{ el: arm, d: depthOf([LANE_X, GATE_Y, 0], P) }, { el: truck, d: depthOf([tp.x, tp.y, 0], P) }, { el: truck2, d: t2 ? depthOf([t2.x, t2.y, 0], P) : -1e9 }];
  yo.sort((a, b) => a.d - b.d);
  yo.forEach((o, i) => { if (yard.children[i] !== o.el) yard.insertBefore(o.el, yard.children[i]); });
  armG.setAttribute("transform", "rotate(" + (-80 * armAt).toFixed(2) + ")");
  const assigned = phase >= 1;
  lightOn.style.display = assigned ? "" : "none";
  lightOff.style.display = assigned ? "none" : "";
  if (assigned) myCell.setAttribute("data-on", ""); else myCell.removeAttribute("data-on");
  // 하차: 지게차와 팔레트
  const fp = forkPose(phase, pt);
  // 기사: 핸들 돌리는 팔, 대기 중엔 포크가 가끔 살짝 오르내림
  const steer = Math.sin(clock * 2.1);
  const dpose = { r: [1.25, 0.45 + 0.25 * steer], l: [1.25, 0.45 - 0.25 * steer], lean: 0.2, look: 0.25 * Math.sin(clock * 0.9) };
  const fz = phase === 3 ? 0 : 0.8 * Math.max(0, Math.sin(clock * 0.7)) ** 2;
  const fkey = fp.x.toFixed(2) + "," + fp.y.toFixed(2) + "," + fp.hx.toFixed(3) + "," + steer.toFixed(2) + "," + fz.toFixed(2) + "," + dpose.look.toFixed(2);
  if (fkey !== lastFork) { fork.innerHTML = forkliftSvg(fp.x, fp.y, fp.hx, fp.hy, dpose, fz); lastFork = fkey; }
  for (const ff of floorForks) {
    const st = floorForkAt(ff.f, clock);
    const st2 = Math.sin(clock * 1.7 + ff.f.phase);
    const dp = { r: [1.25, 0.45 + 0.2 * st2], l: [1.25, 0.45 - 0.2 * st2], lean: 0.2, look: 0.3 * Math.sin(clock * 0.8 + ff.f.phase) };
    const fk = [st.x, st.y, st.hx, st.fz, st2, dp.look].map((v) => v.toFixed(2)).join(",") + st.loaded;
    if (fk !== ff.key) { ff.el.innerHTML = forkliftSvg(st.x, st.y, st.hx, st.hy, dp, st.fz, ff.f.base, st.loaded ? ff.f.load : ""); ff.key = fk; }
  }
  const c = counts(s);
  const order = [{ el: fork, d: depthOf([fp.x, fp.y, 0], P) }];
  pallets.forEach((g, i) => {
    let pos = null;
    if (phase > 3) pos = SPOTS[i];
    else if (phase === 3) {
      if (fp.carry === i) pos = [FROM_DOCK[0] + (SPOTS[i][0] - FROM_DOCK[0]) * fp.e, FROM_DOCK[1] + (SPOTS[i][1] - FROM_DOCK[1]) * fp.e];
      else if (pt >= i * 1.25 + 0.85) pos = SPOTS[i];
    }
    if (!pos) { g.style.display = "none"; return; }
    g.style.display = "";
    g.setAttribute("transform", translateAlong(P, [pos[0] - FROM_DOCK[0], pos[1] - FROM_DOCK[1], 0]));
    order.push({ el: g, d: depthOf([pos[0], pos[1], 0], P) + (fp.carry === i ? 0.01 : 0) });
  });
  order.sort((a, b) => a.d - b.d);
  order.forEach((o, i) => { if (staging.children[i] !== o.el) staging.insertBefore(o.el, staging.children[i]); });
  layers.forEach((g) => {
    const [i, layer] = g.dataset.layer.split("-").map(Number);
    const left = Math.max(0, Math.min(PER_PALLET, PER_PALLET * (i + 1) - c.launched));
    g.style.display = layer < Math.ceil((left / PER_PALLET) * 4) ? "" : "none";
  });
  // 컨베이어 위 박스
  const live = [];
  for (let i = Math.max(1, Math.floor(s) - 14); i <= Math.min(ORDERED, Math.floor(s)); i++) {
    const p = placeOf(i, s);
    if (p && !p.done) live.push(p);
  }
  live.sort((a, b) => depthOf([a.x, a.y, a.z], P) - depthOf([b.x, b.y, b.z], P));
  crates.forEach((g, n) => {
    const p = live[n];
    if (!p) { if (g.style.display !== "none") g.style.display = "none"; return; }
    g.style.display = "";
    g.setAttribute("transform", translateAlong(P, [p.x - X0, p.y - CY, p.z - CONV]));
    g.style.opacity = p.o < 1 ? p.o.toFixed(3) : "";
    const v = !p.inspected ? 0 : p.bad ? 2 : 1;
    for (let j = 0; j < 3; j++) g.children[j].style.display = j === v ? "" : "none";
  });
  const theta = paddleAngle(s);
  if (Math.abs(theta - lastTheta) > 1e-4) { paddle.innerHTML = paddleSvg(theta); lastTheta = theta; }
  const picked = phase < IDX.pick ? 0 : phase === IDX.pick ? Math.round(ORDER_N * clamp01((pt - 0.4) / 3)) : ORDER_N;
  if (insetLot) insetLot.style.opacity = phase === IDX.pick ? (1 - picked / ORDER_N).toFixed(2) : "";
  const stock = c.rack - picked;
  rackSlots.forEach((g, k) => { g.style.display = c.rack > k * PER_SLOT && !(k === 0 && picked >= ORDER_N / 2) ? "" : "none"; });
  // 출고 박스
  const name0 = PHASES[phase][0];
  let packed = 0, loaded = 0;
  const laneShow = [];
  if (phase === IDX.pack) {
    for (let j = 0; j < ORDER_N; j++) {
      const f = (pt - j * LANE_GAP) / LANE_RUN;
      if (f >= 1) packed++;
      else if (f >= 0) laneShow.push(166 - (166 - 26) * f);
    }
  } else if (phase > IDX.pack) packed = ORDER_N;
  const loadShow = [];
  if (phase === IDX.load) {
    const span = LOAD_T.close - 0.3 - LOAD_T.unload;
    for (let j = 0; j < ORDER_N; j++) {
      const f = (pt - LOAD_T.unload - (j * (span - 0.45)) / ORDER_N) / 0.45;
      if (f >= 1) loaded++;
      else if (f >= 0) loadShow.push(f);
    }
  } else if (phase > IDX.load) loaded = ORDER_N;
  laneShow.sort((a, b) => a - b);
  laneBoxes.forEach((g, i) => {
    const x = laneShow[i];
    if (x === undefined) { g.style.display = "none"; return; }
    g.style.display = "";
    g.setAttribute("transform", translateAlong(P, [x - 166, 0, 0]));
    g.style.opacity = x < 30 ? clamp01((x - 26) / 4).toFixed(3) : "";
  });
  const onTable = phase === IDX.pack ? packed : 0;
  tableBoxes.forEach((g, i) => { g.style.display = onTable > i * 7 ? "" : "none"; });
  loadBoxes.forEach((g, i) => {
    const f = loadShow[i];
    if (f === undefined) { g.style.display = "none"; return; }
    g.style.display = "";
    // 작업자 손(카트 위) → 트럭 뒷문 안쪽으로, 문턱을 넘으면 사라짐
    const sx = LOAD_STOP[0] - 3.4, ex = -9;
    const x = sx + (ex - sx) * ease(f), z = F + 3.2 - 1.2 * f;
    g.setAttribute("transform", translateAlong(P, [x - 12, LOAD_STOP[1] - 32, z - TABLE_Z]));
    g.style.opacity = x < -3 ? clamp01((x + 7) / 4).toFixed(3) : "";
  });
  binSlots.forEach((g, k) => { g.style.display = c.bin > k ? "" : "none"; });
  const text3 = String(c.inspected).padStart(3, "0");
  if (text3 !== lastDigits) { digits.textContent = text3; lastDigits = text3; }
  // 수직 반송기: 검수와 적치 동안 오르내린다
  const running = (phase === IDX.inspect || phase === IDX.store) && !still.matches;
  let wave = running ? 0.5 - 0.5 * Math.cos((clock * 2 * Math.PI) / 2.6) : 0;
  const rising = running && Math.sin((clock * 2 * Math.PI) / 2.6) > 0;
  if (phase === IDX.pick) wave = 1;
  if (phase === IDX.down) wave = 1 - ease(pt / PHASES[IDX.down][1]);
  cage.setAttribute("transform", translateAlong(P, [0, 0, LIFT_TRAVEL * wave]));
  load.style.display = rising && c.rack > 0 ? "" : "none";
  outload.style.display = (phase === IDX.pick && pt > 1) || phase === IDX.down ? "" : "none";
  const settle = phase < IDX.settle ? 0 : phase === IDX.settle ? ease(pt / 2.2) : 1;
  needle.setAttribute("d", needleAt(c.rack * settle));
  for (const m of people) {
    const wd = m.dyn || m.w;
    const key = [m.pose.r[0], m.pose.r[1], m.pose.l[0], m.pose.l[1], m.pose.lean, m.pose.bob || 0, m.pose.look || 0, m.pose.nod || 0, m.pose.walk || 0, wd.x, wd.y, wd.face].map((v) => v.toFixed(3)).join(",") + (m.pose.carry || "") + (m.pose.cartLoad ? "L" : "");
    if (key !== m.key) { m.el.innerHTML = personSvg(wd, m.pose); m.key = key; }
  }
  // 걷는 사람끼리 깊이 순서 (2층 적치, 피킹 작업자)
  const pa = people[3], pb = people[5];
  if (pa.dyn && pb.dyn) {
    const ga = pa.el.closest("[data-zone]"), gb = pb.el.closest("[data-zone]");
    const aFirst = depthOf([pa.dyn.x, pa.dyn.y, 0], P) <= depthOf([pb.dyn.x, pb.dyn.y, 0], P);
    if (ga.parentNode === gb.parentNode) {
      const order = [...ga.parentNode.children];
      if (aFirst !== order.indexOf(ga) < order.indexOf(gb)) ga.parentNode.insertBefore(aFirst ? ga : gb, aFirst ? gb : ga);
    }
  }
  const name = PHASES[phase][0];
  const vars = { total: ORDERED, pallets: PALLETS, n: 0, ok: c.ok, bad: c.bad, rack: c.rack, bin: c.bin, order: ORDER_N, from: c.rack, stock: c.rack - ORDER_N };
  if (name === "unload") vars.n = pallets.filter((g) => g.style.display !== "none").length;
  if (name === "inspect") vars.n = c.inspected;
  if (name === "pack") vars.n = packed;
  if (name === "load") vars.n = loaded;
  const text = fmt(R[name], vars);
  if (readout.textContent !== text) readout.textContent = text;
}
// 왕복 걷기: 지점 A에서 일하고 → B로 걸어가 일하고 → A로 돌아옴
// 여러 지점을 도는 경로: pts[i]에서 pause[i]초 일하고(0이면 지나침) 다음 지점으로. 마지막 지점에서 처음으로 돌아온다.
// carry[i] = i → i+1 구간에 든 물건, face[i] = i에서 일할 때 보는 방향(없으면 다음 구간 방향)
function loopOf(wk) {
  const pts = wk.pts, n = pts.length, segs = [];
  let total = 0;
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    segs.push({ a, b, len, h: Math.atan2(b[1] - a[1], b[0] - a[0]), start: total });
    total += len;
  }
  return { segs, total };
}
const turnTo = (from, to, f) => { let dd = to - from; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; return from + dd * f; };
function walkerAt(wk, t) {
  const lp = wk._loop || (wk._loop = loopOf(wk)), n = wk.pts.length;
  const pause = (i) => (wk.pause && wk.pause[i]) || 0;
  const dur = lp.segs.map((g) => g.len / wk.speed);
  let T = 0;
  for (let i = 0; i < n; i++) T += pause(i) + dur[i];
  let u = ((t % T) + T) % T;
  for (let i = 0; i < n; i++) {
    const g = lp.segs[i], prev = lp.segs[(i - 1 + n) % n];
    if (u < pause(i)) {
      // 일하는 동안: 들어온 방향 → 일하는 방향 → 나갈 방향으로 천천히 돌아섬
      const f = u / pause(i), work = wk.cart || wk.face == null || wk.face[i] == null ? g.h : wk.face[i];
      const face = f < 0.5 ? turnTo(prev.h, work, ease(clamp01(f / 0.3))) : turnTo(work, g.h, ease(clamp01((f - 0.7) / 0.3)));
      const carry = wk.carry || [];
      return { x: g.a[0], y: g.a[1], face, moving: false, load: f < 0.5 ? !!carry[(i - 1 + n) % n] : !!carry[i], pi: i, pf: f };
    }
    u -= pause(i);
    if (u < dur[i]) {
      // 멈추는 지점 앞뒤로만 가감속, 지나치는 모서리는 일정한 속도로 돌며 지나감
      let f = u / dur[i];
      const e0 = pause(i) > 0, e1 = pause((i + 1) % n) > 0;
      if (e0 && e1) f = ease(f); else if (e0) f = 2 * ease(f / 2); else if (e1) f = 2 * ease(0.5 + f / 2) - 1;
      const d = f * g.len, x = g.a[0] + (g.b[0] - g.a[0]) * f, y = g.a[1] + (g.b[1] - g.a[1]) * f;
      let face = g.h;
      const R = 3.5;
      if (!e1 && g.len - d < R) face = turnTo(g.h, lp.segs[(i + 1) % n].h, 0.5 * (1 - (g.len - d) / R));
      if (!e0 && d < R) face = turnTo(prev.h, g.h, 0.5 + 0.5 * d / R);
      const carry = (wk.carry || [])[i] || "";
      return { x, y, face, moving: true, dist: g.start + d, carry, load: !!carry };
    }
    u -= dur[i];
  }
  const g = lp.segs[0];
  return { x: g.a[0], y: g.a[1], face: g.h, moving: false };
}
function floorForkAt(f, t) {
  const st = walkerAt(f, t + f.phase);
  let fz = st.load ? 2.2 : 0, loaded = !!st.load;
  if (!st.moving && st.pi != null) {
    const n = f.pts.length, picking = !f.carry[(st.pi - 1 + n) % n] && f.carry[st.pi], dropping = f.carry[(st.pi - 1 + n) % n] && !f.carry[st.pi];
    // 포크를 넣고 들어 올리기 / 내려놓고 포크 빼기
    if (picking) { loaded = st.pf > 0.25; fz = 2.2 * ease(clamp01((st.pf - 0.25) / 0.4)); }
    if (dropping) { loaded = st.pf < 0.65; fz = 2.2 * (1 - ease(clamp01((st.pf - 0.2) / 0.4))); }
  }
  return { x: st.x, y: st.y, hx: Math.cos(st.face), hy: Math.sin(st.face), fz, loaded };
}
function loadedNow() {
  if (phase < IDX.load) return 0;
  if (phase > IDX.load) return ORDER_N;
  const span = LOAD_T.close - 0.3 - LOAD_T.unload;
  let n = 0;
  for (let j = 0; j < ORDER_N; j++) if ((pt - LOAD_T.unload - (j * (span - 0.45)) / ORDER_N) / 0.45 >= 1) n++;
  return n;
}
// 상차 단계의 포장 작업자: 카트를 밀고 경로를 따라 도크로 갔다가 돌아옴
function loaderAt(t) {
  const segs = [];
  let total = 0;
  for (let i = 0; i < LOAD_PATH.length - 1; i++) { const len = Math.hypot(LOAD_PATH[i + 1][0] - LOAD_PATH[i][0], LOAD_PATH[i + 1][1] - LOAD_PATH[i][1]); segs.push(len); total += len; }
  const along = (dist) => {
    let rest = dist;
    for (let i = 0; i < segs.length; i++) {
      if (rest <= segs[i] || i === segs.length - 1) {
        const p = LOAD_PATH[i], q = LOAD_PATH[i + 1], f = Math.min(1, rest / segs[i]);
        const h = Math.atan2(q[1] - p[1], q[0] - p[0]);
        // 모서리에서 부드럽게 돌기
        let face = h;
        if (i < segs.length - 1 && segs[i] - rest < 3) { const h2 = Math.atan2(LOAD_PATH[i + 2][1] - q[1], LOAD_PATH[i + 2][0] - q[0]); let dd = h2 - h; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; face = h + dd * 0.5 * (1 - (segs[i] - rest) / 3); }
        if (i > 0 && rest < 3) { const h0 = Math.atan2(p[1] - LOAD_PATH[i - 1][1], p[0] - LOAD_PATH[i - 1][0]); let dd = h - h0; while (dd > Math.PI) dd -= 2 * Math.PI; while (dd < -Math.PI) dd += 2 * Math.PI; face = h0 + dd * (0.5 + 0.5 * rest / 3); }
        return { x: p[0] + (q[0] - p[0]) * f, y: p[1] + (q[1] - p[1]) * f, face };
      }
      rest -= segs[i];
    }
  };
  if (t < LOAD_T.walk) { const f = ease(t / LOAD_T.walk), dist = f * total; return { ...along(dist), moving: true, dist, stage: "go" }; }
  if (t < LOAD_T.close + 0.2) { const p = along(total); return { ...p, moving: false, stage: t < LOAD_T.unload ? "open" : t < LOAD_T.close ? "unload" : "close" }; }
  // 뒤로 물러남 (카트를 당기며 후진, 얼굴은 트럭 쪽)
  const f = ease(clamp01((t - LOAD_T.close - 0.2) / (LOAD_T.back - LOAD_T.close - 0.2))), p = along(total);
  return { x: p.x + 10 * f, y: p.y, face: Math.PI, moving: f > 0 && f < 1, dist: 10 * f, stage: "back" };
}
// 작업자 동작: 자기 단계가 활성일 때는 큰 동작, 아닐 때도 직무에 맞는 작은 반복 동작(사람마다 위상 다름)
function poseTarget(id, tp) {
  const name = PHASES[phase][0];
  const t2 = truck2Pose(phase, pt);
  const nearGate = (t) => t && t.y - 26 < GATE_Y + 30 && t.y + 26 > GATE_Y - 10;
  const t = clock + id * 0.83;
  const cyc = (period) => (t % period) / period;
  const wave = (p) => 0.5 - 0.5 * Math.cos(p * 2 * Math.PI);
  if (id === 0) {
    if ((name === "entry" && nearGate(tp)) || (name === "exit" && nearGate(t2))) return { r: [2.75, 0.2], l: [0.12, 0.15], lean: 0 };
    const p = cyc(4), writing = p > 0.62;
    return writing ? { r: [0.95, 1.25 + 0.18 * Math.sin(t * 11)], l: [0.85, 1.0], lean: 0.1, look: 0.15, carry: "clip" } : { r: [0.12, 0.15], l: [0.12, 0.15], lean: 0, look: 0.6 * Math.sin(p / 0.62 * 2 * Math.PI) };
  }
  if (id === 1) {
    if (name === "inspect") return { r: [1.25 + 0.25 * Math.sin(t * 4), 0.35], l: [0.9, 0.7], lean: 0.7 };
    const p = cyc(3), lift = Math.sin(Math.PI * Math.min(1, p / 0.8));
    return { r: [0.7 + 0.6 * lift, 0.9 + 0.2 * Math.sin(t * 7) * lift], l: [0.7 + 0.6 * lift, 0.9], lean: 0.5 * (1 - lift), look: 0.35 * Math.sin(p * 2 * Math.PI), carry: p > 0.12 && p < 0.7 ? "plain" : "" };
  }
  if (id === 2) {
    if (name === "store" || (name === "inspect" && s > 12)) return { r: [1.0 + 0.15 * Math.sin(t * 2), 0.8], l: [1.0 + 0.15 * Math.sin(t * 2), 0.8], lean: 0.3 };
    const p = cyc(3.2);
    return { r: [0.9 + 0.5 * wave(p), 0.8], l: [0.9 + 0.5 * wave(p), 0.8], lean: 0.4 * (1 - wave(p)), look: 0.5 * Math.sin(p * 2 * Math.PI), carry: p < 0.55 ? "pink" : "" };
  }
  if (id === 3) {
    if (name === "store" || name === "inspect") return { r: [1.9 + 0.3 * Math.sin(t * 2.5), 0.2], l: [0.3, 0.4], lean: 0 };
    const p = cyc(2.8), push = wave(p);
    return { r: [1.3 + 0.35 * push, 0.6 - 0.4 * push], l: [1.2 + 0.3 * push, 0.7 - 0.4 * push], lean: 0.1 + 0.3 * push, carry: p < 0.5 ? "green" : "" };
  }
  if (id === 4) {
    const nod = Math.max(0, Math.sin(t * 1.3)) ** 8;
    if (name === "settle" || name === "order") return { r: [1.15, 0.45 + 0.12 * Math.sin(t * 3)], l: [1.15, 0.5], lean: 0.15, nod };
    return { r: [1.15, 0.5 + 0.12 * Math.sin(t * 9)], l: [1.15, 0.5 + 0.12 * Math.sin(t * 9 + 1.6)], lean: 0.1, nod };
  }
  if (id === 5) {
    if (name === "pick") return { r: [1.45 + 0.3 * Math.sin(t * 3), 0.15], l: [1.45 + 0.3 * Math.sin(t * 3 + 1.5), 0.15], lean: 0.4 };
    const p = cyc(3.5), reach = wave(p);
    return { r: [0.9 + 0.6 * reach, 0.6 - 0.4 * reach], l: [0.9 + 0.6 * reach, 0.6 - 0.4 * reach], lean: 0.35 * reach, look: 0.9 * (reach - 0.5), carry: p > 0.3 && p < 0.85 ? "brown" : "" };
  }
  if (id === 8) {
    // 검수 보조: 컨베이어 위 박스를 스캐너로 찍고 기록
    const p = cyc(2.4), scan = wave(p);
    return { r: [1.2 + 0.3 * scan, 0.5 + 0.3 * scan], l: [0.95, 0.9], lean: 0.35 + 0.2 * scan, look: 0.4 * Math.sin(p * 2 * Math.PI), carry: name === "inspect" && p > 0.5 ? "clip" : "" };
  }
  if (id === 11) {
    // 냉동 랙 보충: 바닥 상자를 들어 선반에 올림
    const p = cyc(3.0), up = wave(p);
    return { r: [0.6 + 1.3 * up, 0.5 - 0.3 * up], l: [0.6 + 1.3 * up, 0.5 - 0.3 * up], lean: 0.5 * (1 - up), carry: p > 0.15 && p < 0.6 ? "teal" : "" };
  }
  if (id !== 6) {
    const p = cyc(3.2), w2 = wave(p);
    return { r: [0.9 + 0.4 * w2, 0.7], l: [0.9 + 0.4 * w2, 0.7], lean: 0.3 * w2, look: 0.4 * Math.sin(p * 2 * Math.PI) };
  }
  if (name === "pack" || name === "load") return { r: [1.0 + 0.25 * Math.sin(t * 4), 0.9], l: [1.0 + 0.25 * Math.sin(t * 4), 0.9], lean: 0.3 };
  return { r: [1.1, 0.8 + 0.35 * Math.sin(t * 6)], l: [1.0, 0.95 + 0.15 * Math.sin(t * 3)], lean: 0.2 + 0.1 * Math.sin(t * 1.5) };
}
function wantRate(s) {
  const base = s < 8 ? 2.2 : 2.2 + Math.min(1, (s - 8) / 4) * 12;
  for (const i of DEFECTS) {
    const u = (s - i) * SPACING;
    if (u > U_GATE - 6 && u < U_GATE + 18) return base * (s < 12 ? 0.3 : 0.16);
  }
  return base;
}
function goTo(next) {
  phase = next % PHASES.length; pt = 0;
  while (SKIP.has(PHASES[phase][0])) phase = (phase + 1) % PHASES.length;
  if (phase === 0) { s = 0; rate = 0; }
  if (phase > 4 || WAREHOUSE) s = DONE_S;
}
function step(dt) {
  if (paused) return;
  clock += dt;
  if (PHASES[phase][0] === "inspect") {
    rate += (wantRate(s) - rate) * (1 - Math.exp(-dt / 0.4));
    s = Math.min(DONE_S, s + rate * dt);
    if (s >= DONE_S) goTo(phase + 1);
    return;
  }
  pt += dt;
  if (pt >= PHASES[phase][1]) goTo(phase + 1);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still.matches) step(dt);
  const tp = truckPose(phase, pt);
  const t2 = truck2Pose(phase, pt);
  const near = (t, enter) => t && t.y - 26 < GATE_Y + 26 && t.y + 26 > GATE_Y - 4;
  const up = (phase === 0 && near(tp)) || (phase === IDX.exit && near(t2)) ? 1 : 0;
  const k = still.matches ? 1 : 1 - Math.exp(-dt / 0.3);
  armAt += (up - armAt) * k;
  let moving = Math.abs(up - armAt) > 1e-3;
  const kk = still.matches ? 1 : 1 - Math.exp(-dt / 0.25);
  for (const m of people) {
    const t = poseTarget(m.w.id, tp);
    for (const key of ["r", "l"]) for (const j of [0, 1]) { m.pose[key][j] += (t[key][j] - m.pose[key][j]) * kk; if (Math.abs(t[key][j] - m.pose[key][j]) > 1e-3) moving = true; }
    m.pose.lean += (t.lean - m.pose.lean) * kk;
    m.pose.look = (m.pose.look || 0) + ((t.look || 0) - (m.pose.look || 0)) * kk;
    m.pose.nod = t.nod || 0;
    m.pose.carry = t.carry || "";
    m.pose.bob = m.w.sit || still.matches ? 0 : 0.22 * (0.5 + 0.5 * Math.sin(clock * 5 + m.w.id * 1.3));
    m.pose.walk = 0;
    const wk = WALKS[m.w.id];
    if (m.w.id === 6 && phase === IDX.load) {
      const st = loaderAt(pt);
      m.dyn = { ...m.w, x: st.x, y: st.y, face: st.face };
      m.pose.cart = true;
      m.pose.cartLoad = Math.ceil((ORDER_N - loadedNow()) / 10);
      m.pose.grip = st.stage !== "unload";
      m.pose.carry = "";
      if (st.stage === "unload") { const sw = Math.sin(clock * 8); m.pose.r = [1.35 + 0.25 * sw, 0.35]; m.pose.l = [1.35 - 0.25 * sw, 0.35]; m.pose.lean = 0.35; m.pose.carry = "brown"; }
      if (st.moving) { const sw = Math.sin(st.dist * 2 * Math.PI / 3.4); m.pose.walk = still.matches ? 0 : sw * 0.9; m.pose.bob = still.matches ? 0 : 0.3 * Math.abs(sw); m.pose.look = 0; m.pose.lean = 0.15; }
    } else if (wk) {
      const st = walkerAt(wk, clock + m.w.id * 1.7);
      m.dyn = { ...m.w, x: st.x, y: st.y, face: st.face };
      m.pose.cart = !!wk.cart;
      m.pose.grip = !!wk.cart && st.moving;
      m.pose.cartLoad = wk.cart && st.load;
      if (st.moving) {
        const sw = Math.sin(st.dist * 2 * Math.PI / 3.4);
        m.pose.walk = still.matches ? 0 : sw * 0.9;
        m.pose.bob = still.matches ? 0 : 0.3 * Math.abs(sw);
        m.pose.look = 0; m.pose.lean = 0.1;
        if (st.carry && !wk.cart) { m.pose.r = [1.1, 0.7]; m.pose.l = [1.1, 0.7]; m.pose.carry = st.carry; }
        else if (wk.cart) { m.pose.carry = ""; }
        else { m.pose.r = [0.1 + 0.45 * sw, 0.3]; m.pose.l = [0.1 - 0.45 * sw, 0.3]; m.pose.carry = ""; }
      }
    }
  }
  draw();
  frame = visible && (!(paused || still.matches) || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const setPaused = (value) => { paused = value; stage.setAttribute("aria-pressed", paused ? "true" : "false"); run(); };
goTo(0);
if (still.matches) { const end = WAREHOUSE ? IDX.v_lot : IDX.settle; goTo(end); pt = PHASES[end][1]; }
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
stage.addEventListener("click", () => setPaused(!paused));
stage.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "Enter") { event.preventDefault(); setPaused(!paused); }
  else if (event.key === "ArrowRight") {
    event.preventDefault();
    paused = true; stage.setAttribute("aria-pressed", "true");
    goTo(phase + 1);
    if (phase === 4) { s = 0; rate = 0; }
    draw(); run();
  }
});
draw();
`;

const plate = k.plateHtml({
  fig: TEXT.fig,
  title: TEXT.title,
  hint: TEXT.hint,
  readout: WAREHOUSE ? TEXT.readout.v_house : TEXT.readout.entry.replace("{total}", String(ORDERED)),
  body: `<div class="iso-stage" tabindex="0" role="button" aria-pressed="false" aria-label="${TEXT.aria}">${svg}</div>`,
});
const swatch = (c) => (c === "lit" ? "mf-sw-lit" : c === "man" ? "mf-sw-man" : c === "glow" ? "mf-sw-glow" : c === "truck" ? "mf-sw-truck" : `sw-${c}`);
const legend = `<figcaption class="iso-legend"><span class="mf-keys">${TEXT.keys.map(([c, label]) => `<span class="mf-key"><span class="mf-sw ${swatch(c)}"></span>${label}</span>`).join("")}</span><span class="iso-caption">${TEXT.caption}</span></figcaption>`;
const crumbs = TEXT.crumbs ? `<div class="mf-crumbs" aria-hidden="true">${TEXT.crumbs.generic.map((g, i) => `${i ? '<span class="mf-crumb-sep">›</span>' : ""}<span class="mf-crumb">${g}</span>`).join("")}</div>` : "";
const body = plate.replace(/<\/figure>$/, `${legend}</figure>`).replace(/^(<figure[^>]*>)/, `$1${crumbs}`);

mkdirSync(OUT, { recursive: true });
const name = `${WAREHOUSE ? "scm-warehouse" : "scm-milk-flow"}${theme === "light" ? "-light" : ""}.html`;
const html = k
  .pageHtml({ title: TEXT.page, theme, body: `<style>${CSS}</style>${body}`, script: kitScript() + live })
  .replace('<html lang="en">', '<html lang="ko">');
writeFileSync(join(OUT, name), html);
console.log("wrote", join(OUT, name));
