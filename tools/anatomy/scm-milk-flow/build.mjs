// 물류센터 입고 흐름: 우유 100박스, 층별 분해 단면 (anatomy Hero)
// node tools/anatomy/scm-milk-flow/build.mjs [--light]
import { mkdirSync, writeFileSync } from "node:fs";
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
const TEXT = {
  fig: "그림 1",
  title: "물류센터 입고와 출고 흐름",
  hint: "클릭하면 정지, → 키로 다음 단계",
  aria: "층별로 나눈 물류센터의 입고와 출고 흐름. 클릭하거나 스페이스를 누르면 멈추고 다시 움직입니다. 오른쪽 화살표를 누르면 다음 단계로 넘어갑니다.",
  svgLabel:
    "층을 위아래로 띄워 그린 3층 물류센터 모형입니다. 1층에서 트럭이 정문으로 들어와 1번 도크에 붙고, 지게차가 팔레트를 내립니다. 박스는 검수대에서 세어지고 상태를 확인받아, 불량 박스는 1층 반품 구역으로, 정상 박스는 수직 반송기로 2층 냉장존 A-01 랙에 올라갑니다. 3층 사무실 정산 계기는 받은 수량 95를 가리킵니다. 출고 때는 주문이 들어오면 2층에서 박스를 피킹해 1층으로 내리고, 포장해 2번 도크의 출고 트럭에 실어 정문으로 내보냅니다.",
  page: "물류센터 입고와 출고 흐름",
  display: { freezer: "-18°C", rack: "A-01" },
  readout: {
    entry: "1층 정문, 트럭 입차 (우유 {total}박스)",
    assign: "1층 도크, 입고 예약을 확인해 1번 도크 배정",
    dock: "1층 1번 도크, 트럭이 후진해 도크에 붙음",
    unload: "1층 입고 대기 구역, 팔레트 하차 {n}/{pallets}",
    inspect: "1층 검수대, {n}/{total}박스 검수 (정상 {ok}, 불량 {bad})",
    store: "2층 냉장존 A-01, 정상 {rack}박스 적치 (불량 {bin}박스 반품)",
    settle: "3층 사무실, 입고 {rack}박스 확정, 받은 수량으로 정산",
    order: "3층 사무실, 출고 주문 접수 (우유 {order}박스)",
    pick: "2층 냉장존 A-01, 10/22 로트부터 피킹 (재고 {from} → {stock})",
    down: "수직 반송기, {order}박스를 2층에서 1층으로 내림",
    pack: "1층 출고 구역, 포장과 분류 {n}/{order}",
    load: "1층 2번 도크, 출고 트럭에 싣는 중 {n}/{order}",
    exit: "1층 정문, 출고 트럭 출차",
  },
  keys: [
    ["blue", "공정과 설비(파랑): 정문, 경비 부스, 도크, 검수대, 수직 반송기입니다. 입고 관제 시스템이 맡습니다."],
    ["green", "정상(초록): 검수를 통과한 박스와 그 박스를 보관하는 2층 냉장존 A-01 랙입니다. 창고 관리 시스템(WMS)이 맡습니다."],
    ["pink", "불량(분홍): 검수에서 불량으로 판정된 박스와 1층 반품 구역입니다. 반품, 정리 시스템이 맡습니다."],
    ["orange", "정산(주황): 3층 사무실의 정산 계기입니다(정문 차단기도 같은 색). 구매, 정산 시스템이 맡습니다."],
    ["brown", "출고(갈색): 주문 표시등부터 피킹, 포장대, 2번 도크, 출고 트럭까지 이어지는 출고 경로입니다."],
    ["indigo", "냉장존(남색): 냉장 상품을 차갑게 보관하는 2층 구역입니다."],
    ["teal", "냉동존(청록): 영하로 보관하는 2층 구역으로, 두꺼운 단열 벽으로 냉장존과 구분합니다."],
    ["kurly", "작업자(보라 작업복): 단계마다 일하는 사람입니다(경비, 지게차 기사, 검수, 반품, 적치, 정산, 피킹, 포장)."],
    ["lit", "흰 테두리 막대: 분기 게이트입니다. 불량 박스가 올 때만 젖혀져 그 박스를 반품 구역으로 보냅니다."],
    ["glow", "빛나는 테두리: 지금 진행 중인 단계의 구역입니다. 나머지 층과 구역은 흐리게 보입니다."],
  ],
  caption:
    "3층 물류센터를 층별로 띄워 그렸습니다. 입고는 트럭이 정문으로 들어와 1번 도크에 붙는 데서 시작합니다. 지게차가 팔레트 4개를 입고 대기 구역에 내리면, 검수대에서 박스 수를 세고(CI) 상태를 확인합니다(QI). 정상 95박스는 수직 반송기로 2층 냉장존 A-01 랙에 올리고, 불량 5박스는 1층 반품 구역으로 보냅니다. 3층 정산 계기의 핀은 주문 수량 100을, 바늘은 실제로 받은 수량 95를 가리키며, 정산은 받은 수량을 기준으로 합니다. 출고는 주문이 들어오면 2층에서 유통기한이 이른 10/22 로트부터 피킹해 1층으로 내리고, 포장한 뒤 2번 도크의 출고 트럭에 실어 내보냅니다. 층 배치와 주문 수량 20박스는 예시이며 실제 센터마다 다릅니다.",
};

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..", "..");
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
const SLAB = 5;
const GAP = 132;
const FL2 = F + GAP; // 2층 바닥 윗면
const FL3 = FL2 + GAP; // 3층 바닥 윗면
const BUILD = { x: 0, y: 0, w: 170, d: 110, r: 1.5 };

// ---- 1층과 야드 (x: 흐름 방향, y: 앞쪽이 +) ----
const PLATE = { x: -138, y: -20, w: 342, d: 150, r: 8 };
const ORDER_N = 20; // 출고 주문 (예시)
const STOCK_AFTER = 95 - ORDER_N;
const DOCK2_AT = [-28, 48];
const LANE = { x: 24, y: 6, w: 144, d: 12, r: 0.6 };
const LANE_Z = F + 10;
const TABLE = { x: 4, y: 23, w: 16, d: 14, r: 0.6 };
const TABLE_Z = F + 8;
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
const X0 = 28;
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
const SHELF_Z = [FL2 + 3, FL2 + 17, FL2 + 31];
const RACK_TOP = FL2 + 44;
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
const GAUGE_TOP = FL3 + 12 + 4;
const SPAN = Math.PI * 1.5;
const FROM = -SPAN / 2;

// 단계, 시간(초), 층, 구역
const PHASES = [
  ["entry", 4.5, [1], ["gate"]],
  ["assign", 2.5, [1], ["assign"]],
  ["dock", 4, [1], ["dock"]],
  ["unload", 5, [1], ["unload"]],
  ["inspect", 0, [1], ["inspect", "lift"]],
  ["store", 3, [1, 2], ["chill", "freeze", "return", "lift"]],
  ["settle", 3.5, [3], ["settle"]],
  ["order", 2.5, [3], ["order"]],
  ["pick", 4, [2], ["pick"]],
  ["down", 3, [1, 2], ["lift"]],
  ["pack", 6.8, [1], ["pack"]],
  ["load", 4, [1], ["outdock"]],
  ["exit", 5, [1], ["gate", "outdock"]],
];

const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [-90, 34, 30], [-28, 80, 30], [0, 0, FL3 + 26], [170, 110, FL3 + 20], [196, 31, FL2 + 30], [170, 0, FL3 + 20]],
  WIDTH,
  HEIGHT,
  { pad: 8, azimuth: 40, elevation: 24 },
);
globalThis.P = P;

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);
const C = (color, html) => `<g class="c-${color}">${html}</g>`;
const Z = (zone, html) => `<g data-zone="${zone}">${html}</g>`;
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

// ---- 작업자 (단순한 등각 마네킹) ----
const WORKERS = [
  { id: 0, x: -113, y: 84, z: 0.6, face: 0, color: "kurly", zone: "gate" },
  { id: 1, x: 67, y: 57, z: F, face: -Math.PI / 2, color: "kurly", zone: "inspect" },
  { id: 2, x: 121, y: 68, z: F, face: Math.PI, color: "kurly", zone: "return" },
  { id: 3, x: 147, y: 66, z: FL2, face: -Math.PI / 2, color: "kurly", zone: "chill" },
  { id: 4, x: 40, y: 27, z: FL3, face: -Math.PI / 2, color: "kurly", zone: "settle" },
  { id: 5, x: 130, y: 64, z: FL2, face: -Math.PI / 2, color: "kurly", zone: "pick" },
  { id: 6, x: 25, y: 27, z: F, face: Math.PI, color: "kurly", zone: "pack outdock" },
];
function armD(w, side, theta) {
  const fx = Math.cos(w.face), fy = Math.sin(w.face), lx = -fy, ly = fx;
  const sx = w.x + lx * 2.5 * side, sy = w.y + ly * 2.5 * side, sz = w.z + 10.6;
  const a = iso([sx, sy, sz], P);
  const b = iso([sx + fx * 4.4 * Math.sin(theta), sy + fy * 4.4 * Math.sin(theta), sz - 4.4 * Math.cos(theta)], P);
  return "M" + a[0].toFixed(1) + " " + a[1].toFixed(1) + "L" + b[0].toFixed(1) + " " + b[1].toFixed(1);
}
function workerSvg(w) {
  const fx = Math.cos(w.face), fy = Math.sin(w.face), lx = -fy, ly = fx;
  const Q = (f, l) => [w.x + fx * f + lx * l, w.y + fy * f + ly * l];
  const legs = byDepth([Q(0, -1.05), Q(0, 1.05)], (p) => depth(...p));
  const arms = byDepth([-1, 1], (side) => depth(...Q(0, side * 2.5)));
  const limb = (side) => `<path class="mf-limb" data-arm="${w.id}:${side}" d="${armD(w, side, 0.15)}"/>`;
  const torso = [Q(-1.3, -2.1), Q(1.3, -2.1), Q(1.3, 2.1), Q(-1.3, 2.1)];
  const out = [`<path class="iso-halo" d="${k.haloOf(planAt(w.x, w.y, 5, 5, 2), w.z, 1, P)}"/>`];
  for (const [x, y] of legs) out.push(S(k.cylinder(x, y, 0.85, w.z, 6, P, 14), { tone: "mid" }));
  const vest = [limb(arms[0]), S(k.extrude(torso, w.z + 6, 5, P, { bevel: 0.3 }), { tone: "hi", crease: "lo", inner: L(k.ringSeam(torso, w.z + 8.4, P), { tone: "mid" }) }), limb(arms[1])];
  out.push(C(w.color, vest.join("")));
  out.push(S(G.sphereOf([w.x, w.y, w.z + 12.5], 1.4, P), { tone: "hi" }));
  out.push(C("hat", S(k.cylinder(w.x, w.y, 1.8, w.z + 13.3, 0.35, P, 18), { tone: "hi", crease: "lo" }) + S(k.cylinder(w.x, w.y, 1.3, w.z + 13.65, 1, P, 16, 0.2), { tone: "hi", crease: "lo" })));
  return Z(w.zone, C("gray", `<g data-worker="${w.id}">${out.join("")}</g>`));
}
const worker = (id) => workerSvg(WORKERS[id]);

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
    Z("return", tint({ x: 84, y: 52, w: 44, d: 56, r: 1 }, F, "pink")),
    L(k.planOutline({ x: 16, y: 64, w: 42, d: 44, r: 1 }, F, P, 2), { tone: "mid" }),
    L(SPOTS.map(([x, y]) => k.planOutline(planAt(x, y, 18, 18, 0.6), F, P, 2)).join(""), { tone: "faint" }),
    hl("gate", "blue", [{ x: -130, y: 56, w: 62, d: 66, r: 3 }], 0.6),
    hl("assign", "blue", [{ x: -128, y: -16, w: 58, d: 12, r: 2 }], 0.6),
    hl("dock", "blue", [{ x: -56, y: 68, w: 54, d: 24, r: 2 }], 0.6),
    hl("dock", "blue", [{ x: 2, y: 70, w: 14, d: 20, r: 1 }], F),
    hl("unload", "blue", [{ x: 15, y: 63, w: 44, d: 46, r: 2 }], F),
    hl("inspect", "blue", [{ x: 20, y: 22, w: 150, d: 36, r: 2 }], F),
    hl("return", "pink", [{ x: 84, y: 52, w: 44, d: 56, r: 1 }], F),
    hl("lift", "blue", [{ x: 172, y: 24, w: 26, d: 32, r: 1 }], 2),
    hl("pack", "brown", [{ x: 22, y: 4, w: 148, d: 16, r: 1 }, { x: 2, y: 21, w: 28, d: 18, r: 1 }], F),
    hl("outdock", "brown", [{ x: -56, y: 37, w: 54, d: 22, r: 2 }], 0.6),
    hl("outdock", "brown", [{ x: 2, y: 38, w: 18, d: 20, r: 1 }], F),
    floorEdge(F),
  ].join("");
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
const leftWall = () => [leftSeg(LEFT_SEGS[0]), lintel(DOOR2), leftSeg(LEFT_SEGS[1]), lintel(DOOR1), dockLight(DOOR2[1] + 3, false), dockLight(DOOR1[0] - 3, true), leftSeg(LEFT_SEGS[2])].join("");
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
function truckSvg(cx, cy, hx, hy, cab) {
  const vx = -hy, vy = hx;
  const W = (u, v) => [cx + u * hx + v * vx, cy + u * hy + v * vy];
  const rect = (u0, u1, v0, v1) => [W(u0, v0), W(u1, v0), W(u1, v1), W(u0, v1)];
  const parts = [];
  const add = (u0, u1, v0, v1, z, h, tone, cls, extra) => parts.push({ ring: rect(u0, u1, v0, v1), z, h, tone, cls, extra, c: W((u0 + u1) / 2, (v0 + v1) / 2) });
  for (const u of [-19, -11.5, 16]) for (const side of [1, -1]) parts.push({ kind: "wheel", c: W(u, side * 7.2) });
  const ribs = [-18, -10, -2, 6].map((u) => lineOnTop(W(u, -8), W(u, 8), 31, P)).join("");
  add(-24, 10, -8, 8, 7, 24, "hi", "", `<path class="iso-line" data-tone="faint" d="${ribs}"/>`);
  add(12, 24, -8, 8, 5, 14, "hi", cab);
  add(12, 19, -7, 7, 19, 5, "hi", cab);
  const chassis = solidSvg(extrude(rect(-23, 23, -6, 6), 3, 4, P), { tone: "lo" });
  parts.sort((a, b) => depthOf([a.c[0], a.c[1], 0], P) - depthOf([b.c[0], b.c[1], 0], P));
  return chassis + parts.map((p) => {
    if (p.kind === "wheel") return wheelSvg(p.c[0], p.c[1], 3.5, hx, hy, vx, vy, 3.5, 2.4);
    const svg = solidSvg(extrude(p.ring, p.z, p.h, P, { bevel: 0.4 }), { tone: p.tone, crease: "lo", inner: p.extra || "" });
    return p.cls ? `<g class="${p.cls}">${svg}</g>` : svg;
  }).join("");
}
function forkliftSvg(cx, cy, hx, hy) {
  const vx = -hy, vy = hx;
  const W = (u, v) => [cx + u * hx + v * vx, cy + u * hy + v * vy];
  const rect = (u0, u1, v0, v1) => [W(u0, v0), W(u1, v0), W(u1, v1), W(u0, v1)];
  const parts = [];
  const add = (u0, u1, v0, v1, z, h, tone, cls) => parts.push({ kind: "box", ring: rect(u0, u1, v0, v1), z, h, tone, cls, c: W((u0 + u1) / 2, (v0 + v1) / 2), lift: z });
  for (const u of [-4.5, 4]) for (const s of [1, -1]) parts.push({ kind: "wheel", c: W(u, s * 5.2), lift: F });
  add(7.2, 18, 1.2, 2.6, F + 0.5, 0.6, "mid");
  add(7.2, 18, -2.6, -1.2, F + 0.5, 0.6, "mid");
  add(-6, 6, -4.5, 4.5, F + 1.5, 5, "hi", "c-blue");
  add(-8.5, -5.5, -4.5, 4.5, F + 1.5, 6.5, "mid", "c-blue");
  add(6, 7.2, 2.4, 3.6, F, 18, "mid");
  add(6, 7.2, -3.6, -2.4, F, 18, "mid");
  add(-4, -3, 3, 4, F + 6.5, 8.5, "mid");
  add(-4, -3, -4, -3, F + 6.5, 8.5, "mid");
  const [dx, dy] = W(-1, 0);
  parts.push({ kind: "driver", c: [dx, dy], lift: F + 6.5 });
  add(-4, 4, -4, 4, F + 15, 0.8, "mid", "c-blue");
  parts.sort((a, b) => (a.c && b.c ? depthOf([a.c[0], a.c[1], 0], P) - depthOf([b.c[0], b.c[1], 0], P) : 0) || a.lift - b.lift);
  const roof = parts.pop();
  const draw = (p) => {
    if (p.kind === "wheel") return wheelSvg(p.c[0], p.c[1], F + 1.9, hx, hy, vx, vy, 1.9, 1.4);
    if (p.kind === "driver") {
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
const RAIL_B = { x: 22, y: CY - 8.5, w: 148, d: 1.5, r: 0.4 };
const RAIL_F = { x: 22, y: CY + 7, w: 148, d: 1.5, r: 0.4 };
const ROLLERS = Array.from({ length: 25 }, (_, i) => 25 + i * 6);
const LEGS = [26, 130, 166];
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
const mastPart = (z0, z1) => Z("lift", C("blue", MASTS.map((m) => slab(m, z0, z1 - z0, { tone: "mid" }, 0.2, 2)).join("") + (z1 > FL2 ? slab({ x: 175, y: 25, w: 20, d: 5, r: 0.5 }, z1, 3, { tone: "hi", crease: "lo" }, 0.3, 2) : "")));
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

// ---- 2층 ----
function floor2() {
  const out = [];
  out.push(slabFloor(FL2));
  out.push(Z("freeze", tint({ x: 3, y: 3, w: 79, d: 104, r: 1 }, FL2, "teal")));
  out.push(Z("chill", tint({ x: 88, y: 3, w: 79, d: 104, r: 1 }, FL2, "indigo")));
  out.push(hl("freeze", "teal", [{ x: 3, y: 3, w: 79, d: 104, r: 1 }], FL2), hl("chill", "indigo", [{ x: 88, y: 3, w: 79, d: 104, r: 1 }], FL2), hl("pick", "brown", [{ x: 124, y: 22, w: 45, d: 52, r: 1 }], FL2), floorEdge(FL2));
  out.push(core(FL2, FL3 - SLAB));
  out.push(backWallAt(FL2));
  out.push(column(168.5, 1.5, FL2, FL3 - SLAB));
  // 냉동기 유닛과 온도 표시 (-18°C)
  const unit = { x: 30, y: 3, w: 28, d: 9, r: 0.8 };
  const fz = [];
  fz.push(slab(unit, FL2, 16, { tone: "hi", crease: "lo" }, 0.5, 2));
  fz.push(L([37, 51].map((x) => k.ring(x, 7.5, 3.2, FL2 + 16, P, 28) + k.ring(x, 7.5, 1, FL2 + 16, P, 12)).join(""), { tone: "mid" }));
  const m = k.sideMatrix([unit.x, unit.y + unit.d], FL2 + 14, P, "left");
  fz.push(`<g transform="${m}"><rect class="mf-win" x="4" y="2" width="15" height="6" rx=".5"/><text class="iso-face-text mf-digits" data-tone="hi" x="11.5" y="6.6" font-size="4.2" text-anchor="middle">${TEXT.display.freezer}</text></g>`);
  const fr = [{ x: 24, y: 40, w: 40, d: 18, r: 0.4 }, { x: 24, y: 76, w: 40, d: 18, r: 0.4 }];
  for (const p of fr) fz.push(rackSvg(p, [FL2 + 3, FL2 + 17], FL2 + 30, stockOf(p, "teal")));
  out.push(Z("freeze", C("teal", fz.join(""))));
  // 단열 벽 (두꺼운 벽, 문)
  const wall = { x: 82, y: 3, w: 6, d: 107, r: 0.5 };
  const wz = [slab(wall, FL2, 18, { tone: "hi", crease: "lo", inner: L(k.sideSeam(wall, FL2 + 9, P, 2), { tone: "faint" }) }, 0.6, 2)];
  const door = k.sideMatrix([88, 100], FL2 + 13, P, "right");
  wz.push(`<g transform="${door}"><rect class="mf-win" x="2" y="0" width="12" height="13" rx=".4"/></g>`);
  out.push(Z("freeze", C("teal", wz.join(""))));
  // 냉장존 랙과 A-01
  const cr = [{ x: 94, y: 6, w: 28, d: 18, r: 0.4 }, { x: 94, y: 62, w: 28, d: 20, r: 0.4 }];
  out.push(Z("chill", C("indigo", cr.map((p) => rackSvg(p, [FL2 + 3, FL2 + 17, FL2 + 31], FL2 + 44, stockOf(p, "indigo"))).join(""))));
  const stock = (level, z) => RACK_SLOTS.map(([x, y, l], i) => (l === level ? `<g data-rackslot="${i}" style="display:none">${boxSvg(x, y, z, "ok")}</g>` : "")).join("");
  const a = [rackSvg(RACK_A, SHELF_Z, RACK_TOP, stock)];
  const tag = { x: 132, y: 46, w: 14, d: 6, r: 0.5 };
  a.push(slab(tag, RACK_TOP + 1.5, 0.5, { tone: "hi", crease: "none" }, 0, 2));
  a.push(k.faceTextSvg(k.topMatrix([tag.x + 7, tag.y + 4.4], RACK_TOP + 2, P, "x"), TEXT.display.rack, { size: 3.6, tone: "mid", anchor: "middle" }));
  out.push(Z("chill", C("green", a.join(""))));
  out.push(worker(3), worker(5));
  return out.join("");
}

// ---- 3층 ----
const needleAt = (value) => {
  const angle = FROM + (value / 100) * SPAN;
  const sx = Math.sin(angle), sy = -Math.cos(angle);
  return lineOnTop([GAUGE[0] - sx * 1, GAUGE[1] - sy * 1], [GAUGE[0] + sx * (GAUGE_R - 3.4), GAUGE[1] + sy * (GAUGE_R - 3.4)], GAUGE_TOP + 0.2, P);
};
function floor3() {
  const out = [];
  out.push(slabFloor(FL3));
  out.push(Z("settle", tint({ x: 24, y: 3, w: 60, d: 57, r: 1 }, FL3, "orange")));
  out.push(hl("settle", "orange", [{ x: 24, y: 3, w: 60, d: 57, r: 1 }], FL3), hl("order", "brown", [{ x: 26, y: 4, w: 28, d: 30, r: 1 }], FL3), floorEdge(FL3));
  out.push(core(FL3, FL3 + 24, true));
  out.push(backWallAt(FL3));
  // 사무실
  const o = [];
  const desk = { x: 30, y: 6, w: 20, d: 12, r: 0.6 };
  o.push(slab(desk, FL3, 7, { tone: "mid" }, 0.3, 2));
  o.push(C("blue", slab({ x: 34, y: 8, w: 12, d: 2, r: 0.3 }, FL3 + 7, 8, { tone: "hi", crease: "lo" }, 0.2, 2)));
  // 출고 주문 표시등
  o.push(Z("order", C("brown", S(k.cylinder(46, 14, 1, FL3 + 7, 6, P, 12), { tone: "hi", crease: "none" }) + S(k.cylinder(46, 14, 2.4, FL3 + 13, 2.6, P, 20, 0.3), { tone: "hi", crease: "lo" }))));
  o.push(worker(4));
  const [x, y] = GAUGE;
  const base = planAt(x, y, 24, 24, 1.5);
  const g = [];
  g.push(slab(base, FL3, 12, { tone: "hi", crease: "lo", inner: L(k.sideSeam(base, FL3 + 6, P, 3), { tone: "faint" }) }, 0.5));
  g.push(S(k.cylinder(x, y, GAUGE_R, FL3 + 12, 4, P, 56, 0.6), { tone: "hi", crease: "lo" }));
  g.push(L(k.knurl(x, y, GAUGE_R, GAUGE_TOP - 2, GAUGE_TOP, 56, P, 0.3), { tone: "lo" }));
  g.push(L(k.ring(x, y, GAUGE_R - 1.5, GAUGE_TOP, P, 48), { tone: "lo" }));
  const t = k.radialTicks(x, y, GAUGE_R - 1.5, 20, 5, GAUGE_TOP, [1, 2], P, FROM, SPAN);
  g.push(L(t.minor, { tone: "lo" }), L(t.major, { tone: "mid" }));
  const pinA = FROM + SPAN;
  g.push(S(k.cylinder(x + Math.sin(pinA) * (GAUGE_R - 0.9), y - Math.cos(pinA) * (GAUGE_R - 0.9), 0.8, GAUGE_TOP, 1.6, P, 12), { tone: "hi", crease: "none" }));
  g.push(`<path data-part="needle" class="iso-line" data-tone="hi" data-free="end" d="${needleAt(0)}" style="stroke-width:1.4"/>`);
  g.push(S(k.cylinder(x, y, 1.4, GAUGE_TOP, 0.7, P, 14), { tone: "mid" }));
  o.push(C("orange", g.join("")));
  const right = { x: 84, y: 3, w: 2, d: 57, r: 0.3 };
  const front = { x: 24, y: 58, w: 60, d: 2, r: 0.3 };
  o.push(slab(right, FL3, 8, { tone: "mid" }, 0.2, 2));
  o.push(slab(front, FL3, 8, { tone: "mid", inner: L(k.sideSeam(front, FL3 + 5, P, 2), { tone: "faint" }) }, 0.2, 2));
  out.push(Z("settle", o.join("")));
  // 상온존 랙
  const ar = [{ x: 100, y: 10, w: 56, d: 20, r: 0.4 }, { x: 100, y: 62, w: 56, d: 20, r: 0.4 }];
  out.push(Z("ambient", C("gray", ar.map((p) => rackSvg(p, [FL3 + 3, FL3 + 17], FL3 + 30, stockOf(p, "gray"))).join(""))));
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
  const stack = [0, 1, 2].map((i) => `<g data-tablebox="${i}" style="display:none">${boxSvg(12, 30, TABLE_Z + i * BOX.h, "brown")}</g>`).join("");
  return Z("pack outdock", C("brown", out.join("")) + stack);
}
function loadPool() {
  return Z("outdock", `<g data-part="loadpool">${Array.from({ length: 8 }, (_, i) => `<g data-loadbox="${i}" style="display:none">${boxSvg(12, 30, TABLE_Z, "brown")}</g>`).join("")}</g>`);
}

// ---- 이동 박스 풀 ----
const POOL = 14;
const pool = Array.from({ length: POOL }, (_, i) => `<g data-crate="${i}" style="display:none"><g>${boxSvg(X0, CY, CONV)}</g><g style="display:none">${boxSvg(X0, CY, CONV, "ok")}</g><g style="display:none">${boxSvg(X0, CY, CONV, "bad")}</g></g>`).join("");

const floor1 = [
  ground(),
  floor1Zones(),
  core(F, FL2 - SLAB),
  backWallAt(F),
  column(168.5, 1.5, F, FL2 - SLAB),
  outLane(),
  capBoard(),
  booth(),
  gateHousing(),
  worker(0),
  `<g data-part="yard">${armSvg()}<g data-zone="gate assign dock unload" data-part="truck" class="c-gray"></g><g data-zone="outdock gate" data-part="truck2" class="c-gray"></g></g>`,
  armRest(),
  leftWall(),
  packTable(),
  worker(6),
  loadPool(),
  column(1.5, 108.5, F, FL2 - SLAB),
  leveler(),
  Z("inspect", stationBack() + gatePost() + C("gray", conveyorBack()) + `<g data-part="paddle">${paddleSvg(0)}</g>` + gateCap() + C("gray", conveyorFront())),
  binBack(),
  Z("inspect", C("gray", `<g data-part="train">${pool}</g>`)),
  binFront(),
  worker(2),
  Z("inspect", stationFront()),
  worker(1),
  `<g data-zone="unload" class="c-gray" data-part="staging">${SPOTS.map((_, i) => `<g data-pallet="${i}" style="display:none">${palletSvg(FROM_DOCK[0], FROM_DOCK[1], i)}</g>`).join("")}<g data-part="fork"></g></g>`,
  column(168.5, 108.5, F, FL2 - SLAB),
  mastPart(0, FL2 - SLAB - 1),
].join("");

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.svgLabel,
  body: [
    FLR("1", floor1),
    FLR("2", floor2()),
    FLR("1 2", mastPart(FL2 - SLAB - 1, FL2 + 30) + cageSvg() + column(168.5, 108.5, FL2, FL3 - SLAB) + column(1.5, 108.5, FL2, FL3 - SLAB)),
    FLR("3", floor3()),
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
  kurly: { light: ["#8A3DA8", "#8A3DA8", ["#47005F", "#52006E", "#5F0080", "#6E1690"], "#3A004D", "#F6E8FF", "#3A004D", "#C9A3DA"], dark: ["#9B4DBF", "#9B4DBF", ["#4A0A63", "#560E72", "#621281", "#6E1A90"], "#F3E0FF", "#F3E0FF", "#2A0038", "#B482CC"] },
  indigo: { light: ["#B3B7EE", "#B3B7EE", ["#6D75DA", "#767EDD", "#7F86E0", "#8C92E4"], "#5B63D3", "#F5F6FF", "#5B63D3", "#D9DBF6"], dark: ["#8B92EE", "#8B92EE", ["#3E45A8", "#454CB6", "#4C53C4", "#535AD0"], "#E6E8FF", "#ECEDFF", "#20256E", "#BEC2F8"] },
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
  light: ["#fbfbfa", "#ffffff", ["#dcdcd9", "#e5e5e2", "#ededea", "#f4f4f1"], "#26262a", "#8a8a8f", "#b4b4b8", "#d4d4d6"],
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
const wheelSvg = ${wheelSvg.toString()};
const truckSvg = ${truckSvg.toString()};
const forkliftSvg = ${forkliftSvg.toString()};
const armD = ${armD.toString()};
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
const arms = [...svg.querySelectorAll("[data-arm]")].map((el) => { const [id, side] = el.dataset.arm.split(":").map(Number); return { el, w: WORKERS[id], side, at: 0.15 }; });
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
let phase = 0, pt = 0, s = 0, rate = 0, paused = false, armAt = 0, clock = 0;
let frame = 0, last = 0, visible = false, lastTruck = "", lastTruck2 = "", lastFork = "", lastTheta = -1, lastDigits = "", lastPhase = -1;

function setZones() {
  if (phase === lastPhase) return;
  lastPhase = phase;
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
  const key = tp.x.toFixed(2) + "," + tp.y.toFixed(2) + "," + tp.hx.toFixed(3) + "," + tp.hy.toFixed(3);
  if (key !== lastTruck) { truck.innerHTML = truckSvg(tp.x, tp.y, tp.hx, tp.hy, "c-blue"); lastTruck = key; }
  truck.style.opacity = tp.o < 1 ? tp.o.toFixed(3) : "";
  const t2 = truck2Pose(phase, pt);
  if (t2) {
    const key2 = t2.x.toFixed(2) + "," + t2.y.toFixed(2) + "," + t2.hx.toFixed(3) + "," + t2.hy.toFixed(3);
    if (key2 !== lastTruck2) { truck2.innerHTML = truckSvg(t2.x, t2.y, t2.hx, t2.hy, "c-brown"); lastTruck2 = key2; }
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
  const fkey = fp.x.toFixed(2) + "," + fp.y.toFixed(2) + "," + fp.hx.toFixed(3);
  if (fkey !== lastFork) { fork.innerHTML = forkliftSvg(fp.x, fp.y, fp.hx, fp.hy); lastFork = fkey; }
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
    for (let j = 0; j < ORDER_N; j++) {
      const f = (pt - j * LOAD_GAP) / LOAD_RUN;
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
  const onTable = phase >= IDX.pack && phase <= IDX.load ? packed - loaded : 0;
  tableBoxes.forEach((g, i) => { g.style.display = onTable > i * 7 ? "" : "none"; });
  loadBoxes.forEach((g, i) => {
    const f = loadShow[i];
    if (f === undefined) { g.style.display = "none"; return; }
    g.style.display = "";
    const a = ease(Math.min(1, f / 0.45)), b = ease(clamp01((f - 0.45) / 0.55));
    g.setAttribute("transform", translateAlong(P, [-18 * b, 18 * a, -(TABLE_Z - F - 1) * b]));
    g.style.opacity = f > 0.8 ? clamp01((1 - f) / 0.2).toFixed(3) : "";
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
  for (const a of arms) a.el.setAttribute("d", armD(a.w, a.side, a.at));
  const name = PHASES[phase][0];
  const vars = { total: ORDERED, pallets: PALLETS, n: 0, ok: c.ok, bad: c.bad, rack: c.rack, bin: c.bin, order: ORDER_N, from: c.rack, stock: c.rack - ORDER_N };
  if (name === "unload") vars.n = pallets.filter((g) => g.style.display !== "none").length;
  if (name === "inspect") vars.n = c.inspected;
  if (name === "pack") vars.n = packed;
  if (name === "load") vars.n = loaded;
  const text = fmt(R[name], vars);
  if (readout.textContent !== text) readout.textContent = text;
}
function armTarget(a, tp) {
  const id = a.w.id, name = PHASES[phase][0];
  const t2 = truck2Pose(phase, pt);
  const nearGate = (t) => t && t.y - 26 < GATE_Y + 30 && t.y + 26 > GATE_Y - 10;
  if (id === 0) return a.side === 1 && ((name === "entry" && nearGate(tp)) || (name === "exit" && nearGate(t2))) ? 2.6 : 0.15;
  if (id === 1) return name === "inspect" ? (a.side === 1 ? 0.95 + 0.35 * Math.sin(clock * 5) : 0.6) : 0.15;
  if (id === 2) return name === "store" || (name === "inspect" && s > 12) ? 0.9 + 0.25 * Math.sin(clock * 2 + a.side) : 0.15;
  if (id === 3) return name === "store" || name === "inspect" ? 1 + 0.3 * Math.sin(clock * 2.5 + a.side) : 0.15;
  if (id === 4) return name === "settle" || name === "order" ? 1.1 + 0.12 * Math.sin(clock * 3 + a.side) : 0.5;
  if (id === 5) return name === "pick" ? 1.2 + 0.4 * Math.sin(clock * 3 + a.side * 1.5) : 0.15;
  return name === "pack" || name === "load" ? 1.0 + 0.3 * Math.sin(clock * 4 + a.side) : 0.15;
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
  if (phase === 0) { s = 0; rate = 0; }
  if (phase > 4) s = DONE_S;
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
  for (const a of arms) { const t = armTarget(a, tp); a.at += (t - a.at) * (still.matches ? 1 : 1 - Math.exp(-dt / 0.25)); if (Math.abs(t - a.at) > 1e-3) moving = true; }
  draw();
  frame = visible && (!(paused || still.matches) || moving) ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const setPaused = (value) => { paused = value; stage.setAttribute("aria-pressed", paused ? "true" : "false"); run(); };
if (still.matches) { goTo(IDX.settle); pt = PHASES[IDX.settle][1]; }
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
  readout: TEXT.readout.entry.replace("{total}", String(ORDERED)),
  body: `<div class="iso-stage" tabindex="0" role="button" aria-pressed="false" aria-label="${TEXT.aria}">${svg}</div>`,
});
const swatch = (c) => (c === "lit" ? "mf-sw-lit" : c === "man" ? "mf-sw-man" : c === "glow" ? "mf-sw-glow" : `sw-${c}`);
const legend = `<figcaption class="iso-legend"><span class="mf-keys">${TEXT.keys.map(([c, label]) => `<span class="mf-key"><span class="mf-sw ${swatch(c)}"></span>${label}</span>`).join("")}</span><span class="iso-caption">${TEXT.caption}</span></figcaption>`;
const body = plate.replace(/<\/figure>$/, `${legend}</figure>`);

mkdirSync(OUT, { recursive: true });
const name = theme === "light" ? "scm-milk-flow-light.html" : "scm-milk-flow.html";
const html = k
  .pageHtml({ title: TEXT.page, theme, body: `<style>${CSS}</style>${body}`, script: kitScript() + live })
  .replace('<html lang="en">', '<html lang="ko">');
writeFileSync(join(OUT, name), html);
console.log("wrote", join(OUT, name));
