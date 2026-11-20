// 창고 > 존 > 로케이션 > 로트 계층을 층별로 띄운 창고 건물 모형으로 보여 주는 anatomy 그림.
// node tools/anatomy/scm-warehouse/build.mjs [--light]
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

// ---- 사람이 읽는 문구 (여기서만 고친다) ----
const TEXT = {
  fig: "그림 2",
  title: "창고 위치 계층",
  hint: "칸을 가리키거나 눌러 보세요",
  pageTitle: "창고 위치 계층",
  svgLabel:
    "그림 1과 같은 4층 물류센터 모형입니다. 2층은 냉장존, 3층은 냉동존, 4층은 상온존이고, 존마다 랙 칸 하나하나가 로케이션입니다. 냉장존 A-01 칸에는 10/22 로트와 10/29 로트가 있고, 유통기한이 이른 10/22 로트를 먼저 출고합니다. 작업자가 이 로트를 반송기로 1층에 내려 포장한 뒤 출고 트럭에 싣고, 트럭은 정문으로 출차합니다.",
  stageLabel: "창고 위치 계층 그림입니다. 방향키로 칸을 선택하면 그 칸의 층, 존, 칸 이름, 로트 개수를 보여 줍니다.",
  // readout: 층, 장소, 지금 일어나는 일 순서
  readout: {
    warehouse: "창고 전체, 2층 냉장, 3층 냉동, 4층 상온",
    zoneA: "2층 냉장존, 랙 3줄",
    zoneF: "3층 냉동존, 랙 3줄",
    zoneB: "4층 상온존, 랙 3줄",
    cell: "{floor}층 {zone} {id}, 로트 {n}개",
    cellEmpty: "{floor}층 {zone} {id}, 비어 있음",
    lotSoon: "2층 A-01, 10/22 로트 유통기한 임박",
    lotOut: "2층 A-01, 10/22 로트 먼저 출고",
    outbound: "1층 출고 대기, 카트에 실음",
    pack: "1층 포장대, 포장",
    load: "1층 도크, 출고 트럭 상차",
    exit: "1층 정문, 출고 트럭 출차",
  },
  zone: { A: "냉장존", F: "냉동존", B: "상온존" },
  // 범례: 색 견본 + 이름: 짧은 설명
  keys: [
    ["gray", "raised", "창고(회색): 건물 전체, 그림 1과 같은 센터"],
    ["blue", "raised", "냉장존(파랑): 2층"],
    ["teal", "raised", "냉동존(청록): 3층, 영하 보관"],
    ["orange", "raised", "상온존(주황): 4층"],
    ["green", "flat", "로케이션(초록): 랙의 칸 하나 (예: A-01)"],
    ["gray", "raised", "로트(회색 상자): 제조일과 유통기한이 같은 상품 집합"],
    ["pink", "raised", "먼저 나갈 로트(분홍): 유통기한이 이른 10/22 로트"],
    ["brown", "raised", "출고 경로(갈색): 출고 대기부터 상차까지"],
    ["gray", "raised", "확대창: 선택한 칸을 크게 보여 줌"],
    ["purple", "raised", "작업자(보라): 로트 운반, 재고 확인, 포장, 상차"],
    ["truck", "raised", "트럭: 흰색은 입고(공급사), 보라는 출고"],
    ["gray", "raised", "수직 반송기: 층 사이로 로트를 옮김"],
  ],
  caption: "로트를 나눠 두어야 유통기한이 이른 상품부터 출고할 수 있습니다. 층 배치는 예시입니다.",
};

const ANATOMY = process.env.ANATOMY_HOME || join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(ANATOMY, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(ANATOMY, "kit/lathe.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(ANATOMY, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
// 페이지에서도 둥근 팔을 다시 그리도록 lathe 모듈을 블록 안에 넣는다 (이름 충돌 방지)
const LATHE_SRC = `const LATHE = (() => {\n${readFileSync(join(ANATOMY, "kit/lathe.mjs"), "utf8").replace(/^import .*$/m, "").replace(/^export /gm, "")}\nreturn { solidOf, sphereOf, frameAlong };\n})();\n`;
const OUT_DIR = join(HERE, "..", "..", "..", "static", "diagrams");
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 600;
const HEIGHT = 720;
// 빌드와 페이지가 같은 함수를 쓰도록 kit 함수를 전역 이름으로 둔다 (그림 1과 같은 방식)
Object.assign(globalThis, k);
const ROOT = join(HERE, "..", "..", "..");
const LOGO_D = [...readFileSync(join(ROOT, "static", "img", "kurly-logo.svg"), "utf8").matchAll(/<path[^>]*\sd="([^"]+)"/g)].map((m) => m[1]).filter((d) => d !== "M0 0h82v42H0z").join("");
globalThis.LOGO_D = LOGO_D;

// ---- 그림 1(scm-milk-flow)과 같은 건물 틀: 카메라, 층 간격, 바닥판, 야드, 코어, 반송기 ----
const CAMERA = { azimuth: 40, elevation: 22 };
const F = 6; // 1층 바닥 윗면
const SLAB = 5;
const GAP = 96;
const FL2 = F + GAP;
const FL3 = FL2 + GAP;
const FL4 = FL3 + GAP;
const BUILD = { x: 0, y: 0, w: 170, d: 110, r: 1.5 };
const PLATE = { x: -138, y: -20, w: 342, d: 150, r: 8 };
const YARD = { x: -132, y: -14, w: 129, d: 138, r: 3 };
const LANE_X = -90;
const GATE_Y = 100;
const BOOTH = { x: -122, y: 92, w: 14, d: 16, r: 1 };
const PIVOT = [-105, GATE_Y, 11];
const ARM_LEN = 30;
const WAIT = [-90, 34];
const DOCK2_AT = [-28, 48];
const DOOR1 = [70, 90];
const DOOR2 = [40, 56];
const LIFT = { x: 174, y: 31, w: 22, d: 18, r: 0.6 };
const P = k.fitProjection(
  [...k.boxCorners(PLATE, -15, 0), [-90, 34, 30], [-28, 80, 30], [0, 0, FL4 + 26], [170, 110, FL4 + 20], [196, 31, FL4 + 30], [170, 0, FL4 + 20]],
  WIDTH,
  HEIGHT,
  { pad: 8, ...CAMERA },
);
globalThis.P = P;
const KPX = k.cameraOf(P).k;

// ---- 랙 줄 (x 방향으로 긴 랙, 칸 = bay x 단) ----
const LV = [3, 14]; // 단 바닥 높이 (층 바닥 기준)
const RACK_H = 25;
const SHELF_T = 1.5;
const TRAY_T = 0.6;
const LOT_H = 7.4;
const ROWS = {
  A: { base: FL2, area: { x: 24, y: 3, w: 143, d: 104, r: 1 }, rows: [{ x0: 40, x1: 166, y0: 30, y1: 44, bays: 7 }, { x0: 40, x1: 130, y0: 62, y1: 76, bays: 5 }, { x0: 40, x1: 130, y0: 88, y1: 102, bays: 5 }] },
  F: { base: FL3, area: { x: 24, y: 3, w: 143, d: 104, r: 1 }, rows: [{ x0: 32, x1: 166, y0: 30, y1: 44, bays: 6 }, { x0: 32, x1: 166, y0: 56, y1: 70, bays: 6 }, { x0: 32, x1: 166, y0: 88, y1: 102, bays: 6 }] },
  B: { base: FL4, area: { x: 88, y: 3, w: 79, d: 104, r: 1 }, rows: [{ x0: 92, x1: 164, y0: 30, y1: 44, bays: 4 }, { x0: 92, x1: 164, y0: 56, y1: 70, bays: 4 }, { x0: 92, x1: 164, y0: 88, y1: 102, bays: 4 }] },
};
const CELLS = [
  { id: "A-01", zone: "A", row: 0, bay: 6, lvl: 0, lots: [[0.1, 0.46, "1029"], [0.54, 0.92, "1022"]] },
  { id: "A-02", zone: "A", row: 0, bay: 5, lvl: 0, lots: [[0.15, 0.85]] },
  { id: "A-03", zone: "A", row: 0, bay: 6, lvl: 1, lots: [[0.2, 0.8]] },
  { id: "A-04", zone: "A", row: 0, bay: 5, lvl: 1, lots: [] },
  { id: "F-01", zone: "F", row: 2, bay: 0, lvl: 0, lots: [[0.15, 0.85]] },
  { id: "F-02", zone: "F", row: 2, bay: 1, lvl: 0, lots: [[0.1, 0.46], [0.54, 0.9]] },
  { id: "F-03", zone: "F", row: 2, bay: 0, lvl: 1, lots: [[0.2, 0.8]] },
  { id: "F-04", zone: "F", row: 2, bay: 1, lvl: 1, lots: [] },
  { id: "B-01", zone: "B", row: 1, bay: 0, lvl: 0, lots: [[0.15, 0.85]] },
  { id: "B-02", zone: "B", row: 1, bay: 1, lvl: 0, lots: [[0.1, 0.46], [0.54, 0.9]] },
  { id: "B-03", zone: "B", row: 1, bay: 0, lvl: 1, lots: [[0.2, 0.8]] },
  { id: "B-04", zone: "B", row: 1, bay: 1, lvl: 1, lots: [] },
];
const FLOOR_OF = { A: 2, F: 3, B: 4 };
const bayOf = (row, i) => {
  const w = (row.x1 - row.x0) / row.bays;
  return [row.x0 + i * w, row.x0 + (i + 1) * w];
};
const cellAt = (zone, row, bay, lvl) => CELLS.find((c) => c.zone === zone && c.row === row && c.bay === bay && c.lvl === lvl);
const LOT_Y = (row) => [row.y0 + 3, row.y1 - 3];
const A01 = CELLS[0];
const A01_ROW = ROWS.A.rows[0];
const A01_BAY = bayOf(A01_ROW, A01.bay);
const LOT_BASE = FL2 + LV[0] + SHELF_T + TRAY_T;
const LOT1022_X = [A01_BAY[0] + (A01_BAY[1] - A01_BAY[0]) * 0.54, A01_BAY[0] + (A01_BAY[1] - A01_BAY[0]) * 0.92];
const LOT_W = LOT1022_X[1] - LOT1022_X[0];
const LOT_D = 8;
const CAR_Z = LOT_BASE; // 2층에서 반송기 바닥 윗면
const CART_TOP = FL2 + 6;
const TABLE = { x: 108, y: 28, w: 16, d: 12, r: 0.6 };
const TABLE_TOP = F + 5;
const WAIT_AREA = { x: 136, y: 26, w: 32, d: 30, r: 1 };
// 10/22 로트의 경로 (로트 모서리 좌표): 랙 → 카트 → 카트 밀기 → 반송기 → 1층 → 출고 대기 → 포장대 → 도크 → 트럭
const R0 = [LOT1022_X[0], LOT_Y(A01_ROW)[0], LOT_BASE];
const KEYS = [
  R0,
  [155 - LOT_W / 2, 49, CART_TOP],
  [162 - LOT_W / 2, 49, CART_TOP],
  [LIFT.x + 4, 35, CAR_Z],
  [LIFT.x + 4, 35, F],
  [146.6, 33, F + 0.3],
  [116 - LOT_W / 2, 30, TABLE_TOP],
  [116 - LOT_W / 2, 30, TABLE_TOP],
  [5, 44, F],
  [-12, 44, 7],
];
// pos 구간: 0-1 랙→카트, 1-2 카트 밀기, 2-3 반송기로, 3-4 내려감, 4-5 출고 대기, 5-6 포장대로, 6-6.6 포장, 6.6-7.6 도크로, 7.6-8 트럭 안
const KEY_AT = [0, 1, 2, 3, 4, 5, 6, 6.6, 7.6, 8];

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const slab = (plan, z0, z1, steps = 3, bevel = 0.4) => k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel);
const mslab = (plan, z, h, style = {}, bevel = 0.4, steps = 3) => S(k.slabOf(plan, z, h, P, steps, bevel), style);
const planAt = (cx, cy, w, d, r = 0.6) => ({ x: cx - w / 2, y: cy - d / 2, w, d, r });
const depth = (x, y, z = 0) => k.depthOf([x, y, z], P);
const sortBy = (list, f) => [...list].sort((a, b) => f(a) - f(b));
const TINT = (name) =>
  name === "zone-A" ? "c-blue" : name === "zone-F" ? "c-teal" : name === "zone-B" ? "c-orange" : name.startsWith("cell-") ? "c-green" : name === "lot-1022" ? "c-pink" : /^(wait|pack|dock)$/.test(name) ? "c-brown" : "";
const BLD_PART = /^(floor-|core|shaft|bench|car|gate|office)/;
const part = (name, html, extra = "") => { const c = TINT(name) || (BLD_PART.test(name) ? "wh-bld" : ""); return `<g data-part="${name}"${c ? ` class="${c}"` : ""}${extra}>${html}</g>`; };
const quad = (pts) => k.pathOf(pts.map(at), true);

// ---- 바닥판, 야드, 1층 바닥 ----
function ground() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -15, 15, P)}"/>`];
  for (const [x, y] of sortBy(k.corners(PLATE, 24), (p) => depth(...p))) {
    out.push(S(k.cylinder(x, y, 7, -15, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -13.4, 3.4, P, 28), { tone: "mid" }));
  }
  out.push(mslab(PLATE, -10, 10, { tone: "mid" }, 1.6, 8));
  const screws = k.corners(PLATE, 10);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  out.push(S(k.slabOf(YARD, 0, 0.6, P, 4), { tone: "lo", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(YARD, 3), 0.6, P, 4), { tone: "faint" }));
  for (let y = 120; y > -4; y -= 14) out.push(S(k.slabOf({ x: LANE_X - 14.6, y: y - 6, w: 1.2, d: 6, r: 0.3 }, 0.6, 0.15, P, 2), { tone: "hi", flat: true, crease: "none" }));
  out.push(L(k.planOutline(planAt(WAIT[0], WAIT[1], 22, 54, 1), 0.6, P, 2), { tone: "mid" }));
  out.push(mslab({ x: 172, y: 24, w: 26, d: 32, r: 1 }, 0, 2, { tone: "lo" }, 0.3, 2));
  out.push(mslab(BUILD, 0, F, { tone: "mid" }, 0.8, 3));
  out.push(L(k.sideSeam(BUILD, F / 2, P, 3), { tone: "faint" }));
  return out.join("");
}
const WALL_H = 11;
const backWallAt = (z) => {
  const w = { x: BUILD.x, y: BUILD.y, w: BUILD.w, d: 3, r: 0.3 };
  return mslab(w, z, WALL_H, { tone: "mid", inner: L(k.sideSeam(w, z + WALL_H - 3, P, 2), { tone: "faint" }) }, 0.4, 2);
};
const LEFT_SEGS = [[3, DOOR2[0]], [DOOR2[1], DOOR1[0]], [DOOR1[1], BUILD.d]];
const leftSeg = ([y0, y1]) => mslab({ x: 0, y: y0, w: 3, d: y1 - y0, r: 0.3 }, F, WALL_H, { tone: "mid" }, 0.4, 2);
const lintel = ([y0, y1]) => mslab({ x: 0, y: y0, w: 3, d: y1 - y0, r: 0.3 }, F + WALL_H - 3, 3, { tone: "lo" }, 0.3, 2);
function dockLight(y) {
  return S(k.cylinder(1.5, y, 2, F + WALL_H, 2, P, 16), { tone: "mid" }) + S(k.cylinder(1.5, y, 1.4, F + WALL_H + 2, 1.6, P, 16, 0.3), { tone: "hi" });
}
const leftWall = () => [leftSeg(LEFT_SEGS[0]), lintel(DOOR2), leftSeg(LEFT_SEGS[1]), lintel(DOOR1), dockLight(DOOR2[1] + 3), dockLight(DOOR1[0] - 3), leftSeg(LEFT_SEGS[2])].join("");
const column = (x, y, z0, z1) => mslab(planAt(x, y, 3, 3, 0.4), z0, z1 - z0, { tone: "mid" }, 0.2, 2);
function core(z0, z1, roof = false) {
  const plan = { x: 0, y: 0, w: 20, d: 20, r: 0.6 };
  const out = [mslab(plan, z0, z1 - z0, { tone: "mid", crease: "lo", inner: L(k.sideSeam(plan, z0 + 12, P, 2), { tone: "faint" }) }, 0.4, 2)];
  const door = k.sideMatrix([6, 20], z0 + 11, P, "left");
  out.push(`<g transform="${door}"><rect class="mf-win" x="0" y="0" width="8" height="11" rx=".4"/></g>`);
  const win = k.sideMatrix([20, 20], z1 - 2, P, "right");
  out.push(`<g transform="${win}"><rect class="mf-win" x="4" y="2" width="12" height="3" rx=".4"/></g>`);
  if (roof) out.push(mslab({ x: -1, y: -1, w: 22, d: 22, r: 0.8 }, z1, 2, { tone: "lo" }, 0.4, 2));
  return out.join("");
}
const slabFloor = (z) => mslab(BUILD, z - SLAB, SLAB, { tone: "mid", inner: L(k.sideSeam(BUILD, z - SLAB / 2, P, 3), { tone: "faint" }) }, 0.8, 3);
function booth() {
  const out = [mslab(BOOTH, 0, 18, { tone: "hi", crease: "lo" }, 0.4, 2)];
  const side = k.sideMatrix([BOOTH.x + BOOTH.w, BOOTH.y + BOOTH.d], 15, P, "right");
  out.push(`<g transform="${side}"><rect class="mf-win" x="3" y="1.5" width="10" height="6" rx=".5"/></g>`);
  const front = k.sideMatrix([BOOTH.x, BOOTH.y + BOOTH.d], 14, P, "left");
  out.push(`<g transform="${front}"><rect class="mf-win" x="4" y="0" width="5" height="14" rx=".4"/></g>`);
  out.push(mslab({ x: BOOTH.x - 2, y: BOOTH.y - 2, w: BOOTH.w + 4, d: BOOTH.d + 4, r: 1 }, 18, 2.5, { tone: "mid" }, 0.5, 2));
  return out.join("");
}
function gate() {
  const [x, y] = PIVOT;
  const housing = mslab({ x: x - 3.5, y: y - 3, w: 5, d: 6, r: 0.6 }, 0, 13, { tone: "hi", crease: "lo" }, 0.4, 2) + S(k.cylinder(x - 1, y, 1, 13, 1, P, 12), { tone: "mid" });
  const m = k.sideMatrix([PIVOT[0], PIVOT[1] + 3.2], PIVOT[2], P, "left");
  const stripes = [6, 14, 22].map((sx) => `<rect class="mf-stripe" x="${sx}" y="-.9" width="3.5" height="1.8"/>`).join("");
  const arm = `<g transform="${m}"><g data-gatearm><rect class="mf-arm" x="0" y="-.9" width="${ARM_LEN}" height="1.8" rx=".9"/>${stripes}<circle class="mf-arm" cx="0" cy="0" r="1.3"/></g></g>`;
  const rest = mslab({ x: PIVOT[0] + ARM_LEN + 0.5, y: PIVOT[1] + 2, w: 3, d: 3, r: 0.6 }, 0, PIVOT[2] - 1, { tone: "mid" }, 0.3, 2);
  return booth() + housing + arm + rest;
}
// 바퀴와 출고 트럭 (그림 1과 같은 함수)
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
function truckSvg(cx, cy, hx, hy, kind, door) {
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
    const nx = side * vx, ny = side * vy, rx = ny, ry = -nx;
    const lh = 22.5 * 0.55, lw = (lh * 82) / 42, su = lh / 42;
    const c0 = W(-8, side * 8.54);
    const tl = [c0[0] - rx * (lw / 2), c0[1] - ry * (lw / 2), 6.5 + 22.5 / 2 + lh / 2];
    const O = iso(tl, P), X = iso([tl[0] + rx * su, tl[1] + ry * su, tl[2]], P), Y = iso([tl[0], tl[1], tl[2] - su], P);
    boxExtra += '<g transform="matrix(' + [X[0] - O[0], X[1] - O[1], Y[0] - O[0], Y[1] - O[1], O[0], O[1]].map((v) => v.toFixed(4)).join(" ") + ')"><path class="mf-logo" d="' + LOGO_D + '"/></g>';
  }
  const open = door || 0;
  if (!front && open < 0.05) {
    boxExtra += poly(onU(-24.03, -8, -0.15, 7.2, 28.4), "mf-door") + poly(onU(-24.03, 0.15, 8, 7.2, 28.4), "mf-door");
    boxExtra += poly(onU(-24.06, -1.3, -0.6, 15.5, 19), "mf-handle") + poly(onU(-24.06, 0.6, 1.3, 15.5, 19), "mf-handle");
  } else if (!front) boxExtra += poly(onU(-24.03, -8, 8, 7.2, 28.4), "mf-hold");
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
  if (open >= 0.05) {
    // 뒷문: 경첩을 축으로 바깥쪽으로 열린다
    const al = open * Math.PI * 0.55;
    for (const sd of [1, -1]) {
      const h0 = [-24, sd * 8.5], e = [-24 - 8 * Math.sin(al), sd * (8.5 - 8 * Math.cos(al))];
      const n = [Math.cos(al) * 0.4 * sd * 0 + 0.0, 0];
      const ring = [W(h0[0], h0[1]), W(e[0], e[1]), W(e[0] - 0.4 * Math.cos(al), e[1] + sd * 0.4 * Math.sin(al)), W(h0[0] - 0.4 * Math.cos(al), h0[1] + sd * 0.4 * Math.sin(al))];
      parts.push({ ring, z: 7.2, h: 21.2, cls: "c-kurlytruck", extra: "", c: W((h0[0] + e[0]) / 2 - 3, (h0[1] + e[1]) / 2) });
    }
  }
  const chassis = '<g class="c-steel">' + solidSvg(extrude(rect(-23, 23, -6, 6), 3, 3.6, P), { tone: "hi", crease: "lo" }) + "</g>";
  parts.sort((a, b) => depthOf([a.c[0], a.c[1], 0], P) - depthOf([b.c[0], b.c[1], 0], P));
  return chassis + parts.map((p) => {
    if (p.kind === "wheel") return wheelSvg(p.c[0], p.c[1], 3.5, hx, hy, vx, vy, 3.5, 2.4);
    return '<g class="' + p.cls + '">' + solidSvg(extrude(p.ring, p.z, p.h, P, { bevel: 0.4 }), { tone: "hi", crease: "lo" }) + p.extra + "</g>";
  }).join("");
}

const MASTS = [{ x: 176, y: 26, w: 3, d: 3, r: 0.4 }, { x: 191, y: 26, w: 3, d: 3, r: 0.4 }];
const mastPart = (z0, z1, cap) => MASTS.map((m) => mslab(m, z0, z1 - z0, { tone: "mid" }, 0.2, 2)).join("") + (cap ? mslab({ x: 175, y: 25, w: 20, d: 5, r: 0.5 }, z1, 3, { tone: "hi", crease: "lo" }, 0.3, 2) : "");

// ---- 로트: 받침 + 상자 두 개 + 꼬리표 ----
function lotSvg(x0, x1, y0, y1, z, mark, proj = P) {
  const sl = (plan, a, b, bevel = 0.3) => k.solidSvg(k.slabOf({ r: 0.4, ...plan }, a, b - a, proj, 3, bevel), { tone: "mid", crease: "faint" });
  const out = [sl({ x: x0, y: y0, w: x1 - x0, d: y1 - y0 }, z, z + 1, 0.2)];
  const mid = (y0 + y1) / 2;
  out.push(sl({ x: x0 + 0.4, y: y0 + 0.4, w: x1 - x0 - 0.8, d: mid - y0 - 0.6 }, z + 1, z + 1 + LOT_H));
  const front = { x: x0 + 0.4, y: mid + 0.2, w: x1 - x0 - 0.8, d: y1 - mid - 0.6, r: 0.4 };
  out.push(k.solidSvg(k.slabOf(front, z + 1, LOT_H, proj, 3, 0.3), { tone: "mid", crease: "faint" }));
  const fy = front.y + front.d, xc = (x0 + x1) / 2, tz0 = z + 1 + LOT_H * 0.3, tz1 = z + 1 + LOT_H * 0.7;
  const tag = { x: xc - 1.6, y: fy, w: 3.2, d: 0.4, r: 0.1 };
  const grooves = (mark === "1029" ? [xc - 0.6, xc + 0.6] : [xc]).map((gx) => k.segment([gx, fy + 0.4, tz0], [gx, fy + 0.4, tz1], proj)).join("");
  out.push(k.solidSvg(k.slabOf(tag, tz0, tz1 - tz0, proj, 2, 0), { tone: "mid", crease: "none", inner: k.lineSvg(grooves, { tone: "lo" }) }));
  return out.join("");
}
// 포장한 상자 (갈색, 테이프)
function packedSvg(x0, x1, y0, y1, z) {
  const plan = { x: x0 + 0.3, y: y0 + 0.3, w: x1 - x0 - 0.6, d: y1 - y0 - 0.6, r: 0.5 };
  const tape = k.lineOnTop([plan.x, (y0 + y1) / 2], [plan.x + plan.w, (y0 + y1) / 2], z + LOT_H, P);
  return `<g class="c-brown">${S(k.slabOf(plan, z, LOT_H, P, 3, 0.4), { tone: "mid", inner: L(k.sideSeam(plan, z + LOT_H * 0.6, P, 3), { tone: "faint" }) })}${L(tape, { tone: "lo" })}</g>`;
}

// ---- 랙 줄 하나: 먼 쪽 기둥 → 단마다 선반, 칸 받침, 로트 → 가까운 쪽 기둥 → 위 틀 ----
function rackRow(zone, ri, opts = {}) {
  const Zd = ROWS[zone], row = Zd.rows[ri], B = Zd.base;
  const zp = (html) => part(`zone-${zone}`, html);
  const ups = [];
  for (let i = 0; i <= row.bays; i++) {
    const x = Math.min(row.x0 + ((row.x1 - row.x0) / row.bays) * i, row.x1 - 2.5);
    ups.push({ far: { x, y: row.y0, w: 2.5, d: 2.5, r: 0.3 }, near: { x, y: row.y1 - 2.5, w: 2.5, d: 2.5, r: 0.3 } });
  }
  const up = (p) => mslab(p, B, RACK_H, { tone: "mid" }, 0.2, 2);
  const out = [zp(ups.map((u) => up(u.far)).join(""))];
  const [ly0, ly1] = LOT_Y(row);
  LV.forEach((lz, lvl) => {
    const z = B + lz;
    out.push(zp(mslab({ x: row.x0, y: row.y0, w: row.x1 - row.x0, d: row.y1 - row.y0, r: 0.3 }, z, SHELF_T, { tone: "mid", crease: "faint" }, 0.3, 2)));
    for (let b = 0; b < row.bays; b++) {
      const [bx0, bx1] = bayOf(row, b);
      const cell = cellAt(zone, ri, b, lvl);
      const top = z + SHELF_T;
      if (cell) {
        const tp = { x: bx0 + 2, y: row.y0 + 1.5, w: bx1 - bx0 - 4, d: row.y1 - row.y0 - 3, r: 0.6 };
        out.push(part(`cell-${cell.id}`, mslab(tp, top, TRAY_T, { tone: "mid" }, 0.2, 3) + L(k.planOutline(k.insetPlan(tp, 1.4), top + TRAY_T, P, 3), { tone: "faint" })));
        for (const [a, b2, mark] of cell.lots) {
          const lx0 = bx0 + (bx1 - bx0) * a, lx1 = bx0 + (bx1 - bx0) * b2;
          if (mark === "1022") {
            const html = `<g data-lotv="raw">${lotSvg(lx0, lx1, ly0, ly1, top + TRAY_T, mark)}</g><g data-lotv="packed" style="opacity:0">${packedSvg(lx0, lx1, ly0, ly1, top + TRAY_T)}</g>`;
            out.push(`<g data-slot="rack">${part("lot-1022", html, " data-move")}</g>`);
          } else out.push(part(`lot-${cell.id}`, lotSvg(lx0, lx1, ly0, ly1, top + TRAY_T, mark)));
        }
      } else {
        const seed = (b * 7 + lvl * 3 + ri * 5 + zone.charCodeAt(0)) % 5;
        if (seed === 4) continue;
        const spans = seed % 2 ? [[0.12, 0.48], [0.54, 0.9]] : [[0.2, 0.8]];
        out.push(part(`lot-${zone}-s`, spans.map(([a, b2]) => lotSvg(bx0 + (bx1 - bx0) * a, bx0 + (bx1 - bx0) * b2, ly0, ly1, top, "")).join("")));
      }
    }
  });
  out.push(zp(ups.map((u) => up(u.near)).join("") + mslab({ x: row.x0, y: row.y0, w: row.x1 - row.x0, d: row.y1 - row.y0, r: 0.3 }, B + RACK_H, 1.5, { tone: "mid" }, 0.3, 2)));
  if (opts.label) {
    const tag = { x: A01_BAY[0] + 2, y: row.y0 + 4, w: 12, d: 6, r: 0.5 };
    out.push(zp(mslab(tag, B + RACK_H + 1.5, 0.5, { tone: "hi", crease: "none" }, 0, 2) + k.faceTextSvg(k.topMatrix([tag.x + 6, tag.y + 4.2], B + RACK_H + 2, P, "x"), "A-01", { size: 3.4, tone: "hi", anchor: "middle" })));
  }
  return out.join("");
}
function aisles(zone) {
  const Zd = ROWS[zone];
  const out = [];
  for (let i = 0; i < Zd.rows.length - 1; i++) {
    const a = Zd.rows[i], b = Zd.rows[i + 1];
    out.push(L(k.planOutline({ x: Math.min(a.x0, b.x0), y: a.y1 + 2, w: Math.max(a.x1, b.x1) - Math.min(a.x0, b.x0), d: b.y0 - a.y1 - 4, r: 1 }, Zd.base + 0.35, P, 2), { tone: "lo" }));
  }
  return part(`zone-${zone}`, mslab(Zd.area, Zd.base, 0.3, { tone: "mid", flat: true, crease: "none" }, 0, 3) + out.join(""));
}

// ---- 작업자: 귀여운 2.5등신, 페이지에서 매 프레임 그린다 (걷기, 팔 흔들기, 물건 들기) ----
// 팔 하나: 어깨에서 dir 방향으로 뻗은 둥근 원통 + 동그란 손 (빌드와 페이지 양쪽에서 쓴다)
function chibiArm(o, dir, len, P) {
  const n = Math.hypot(dir[0], dir[1], dir[2]);
  const a = [dir[0] / n, dir[1] / n, dir[2] / n];
  const r = 1.05;
  const prof = [[0, 0.3, 1], [0.35, 0.8, 1], [0.8, r, 1], [len - 0.4, r, 1], [len, r * 0.9, 1]];
  const arm = G.solidOf(prof, G.frameAlong(o, a), P);
  const hand = G.sphereOf([o[0] + a[0] * (len + 0.6), o[1] + a[1] * (len + 0.6), o[2] + a[2] * (len + 0.6)], 1.2, P);
  return '<g class="c-purple">' + k.solidSvg(arm, { tone: "mid" }) + '</g><g class="wh-skin">' + k.solidSvg(hand, { tone: "mid" }) + "</g>";
}
// 얼굴 방향: 보는 사람 쪽과 몸 방향 사이, turn 만큼 더 돌림
function faceDir(f, turn) {
  let fx = Math.cos(Math.PI / 6) + f[0] * 0.55, fy = Math.sin(Math.PI / 6) + f[1] * 0.55;
  const n = Math.hypot(fx, fy);
  fx /= n; fy /= n;
  const c = Math.cos(turn), sn = Math.sin(turn);
  return [fx * c - fy * sn, fx * sn + fy * c];
}
// 동그란 눈, 볼, 미소 (빌드와 페이지 양쪽에서 쓴다)
function chibiFace(head, d, kpx, P) {
  const R = 4.4;
  const on = (ang, el) => {
    const c = Math.cos(ang), sn = Math.sin(ang);
    const dx = d[0] * c - d[1] * sn, dy = d[0] * sn + d[1] * c;
    return k.iso([head[0] + dx * R * Math.cos(el), head[1] + dy * R * Math.cos(el), head[2] + R * Math.sin(el)], P);
  };
  const dot = (cls, p, r) => '<circle class="' + cls + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (r * kpx).toFixed(2) + '"/>';
  const cheeks = [-0.66, 0.66].map((a) => dot("wh-cheek", on(a, -0.32), 0.62)).join("");
  const eyes = [-0.36, 0.36].map((a) => dot("wh-eye", on(a, -0.06), 0.5)).join("");
  const smile = k.pathOf([-0.2, -0.1, 0, 0.1, 0.2].map((a) => on(a, -0.42 - 0.06 * Math.cos(a * 8))));
  return cheeks + eyes + k.lineSvg(smile, { tone: "hi", className: "wh-smile", free: true });
}
const reachDir = (f, side, r) => [f[0] * (0.35 + 0.95 * r) + side[0] * 0.25, f[1] * (0.35 + 0.95 * r) + side[1] * 0.25, -(1 - 0.8 * r)];

// 머리와 몸통은 기준 위치에서 한 번만 그려 두고 평행 이동한다
function personParts(p) {
  const B = p.base, x = p.x, y = p.y;
  const cls = (c, h) => '<g class="' + c + '">' + h + "</g>";
  const dome = (z, rb, h, c) => cls(c, solidSvg(G.solidOf([[0, rb], [h * 0.3, rb * 0.95, 1], [h * 0.6, rb * 0.78, 1], [h * 0.85, rb * 0.48, 1], [h, 0, 1]], G.frameAlong([x, y, z], [0, 0, 1]), P), { tone: "mid" }));
  const torso = cls("c-purple", solidSvg(cylinder(x, y, 3.1, B + 4.6, 6.6, P, 40, 0.6), { tone: "mid", inner: lineSvg(sideArc(x, y, 3.1, B + 8.2, P, 32), { tone: "hi" }) })) + dome(B + 11.2, 3.1, 1.6, "c-purple");
  const head = cls("wh-skin", solidSvg(G.sphereOf([x, y, B + 17], 4.4, P), { tone: "mid" })) + dome(B + 18, Math.sqrt(4.4 * 4.4 - 1) + 0.15, 3.55, "wh-hair");
  let hat;
  if (p.hat === "helmet") hat = cls("wh-hat", solidSvg(cylinder(x, y, 5.1, B + 18.6, 0.4, P, 40, 0.2), { tone: "mid" })) + dome(B + 19, Math.sqrt(4.4 * 4.4 - 4) + 0.5, 3.7, "wh-hat");
  else if (p.hat === "beanie") hat = dome(B + 17.9, Math.sqrt(4.4 * 4.4 - 0.81) + 0.35, 4.3, "c-purple") + cls("c-purple", solidSvg(G.sphereOf([x, y, B + 22.6], 1.2, P), { tone: "mid" }));
  else hat = dome(B + 18.5, Math.sqrt(4.4 * 4.4 - 2.25) + 0.35, 3.6, "c-purple");
  return { x, y, torso, head, hat };
}
function personSvg(p, c) {
  const h = p.heading, fx = Math.cos(h), fy = Math.sin(h), lx = -fy, ly = fx;
  const tv = towardViewer(P);
  const near = lx * tv[0] + ly * tv[1] >= 0 ? 1 : -1, facing = fx * tv[0] + fy * tv[1];
  const hop = p.hop || 0, B = p.base + hop;
  const A = (f, l, z) => [p.x + fx * f + lx * l, p.y + fy * f + ly * l, B + z];
  const f2 = (v) => v.toFixed(1);
  const path = (pts) => "M" + pts.map((q) => { const v = iso(q, P); return f2(v[0]) + " " + f2(v[1]); }).join("L");
  const limb = (pts, w, cl) => '<g class="' + cl + '"><path class="wh-limb-edge" style="stroke-width:' + ((w + 0.5) * KPX).toFixed(2) + '" d="' + path(pts) + '"/><path class="wh-limb-fill" style="stroke-width:' + (w * KPX).toFixed(2) + '" d="' + path(pts) + '"/></g>';
  const ball = (q, r, cl) => { const v = iso(q, P); return '<circle class="' + cl + '" cx="' + f2(v[0]) + '" cy="' + f2(v[1]) + '" r="' + (r * KPX).toFixed(2) + '"/>'; };
  const sw = Math.sin(p.phase || 0) * (p.stride || 0);
  const legs = [-1, 1].map((side) => {
    const hip = A(0, side * 1.35, 5.2 - hop), foot = A(side * sw * 1.8, side * 1.5, 1.2 - hop);
    return limb([hip, foot], 2.3, "wh-pants") + ball([foot[0] + fx * 0.5, foot[1] + fy * 0.5, foot[2]], 1.35, "wh-shoe-c");
  });
  const legOrder = near > 0 ? legs[0] + legs[1] : legs[1] + legs[0];
  const mode = p.arms || "walk";
  const arm = (side) => {
    const sh = A(0, side * 3.0, 10.4);
    let hand;
    if (p.hands) hand = p.hands[side < 0 ? 0 : 1];
    else if (mode === "carry") hand = A(3.6, side * 2.2, 8.4);
    else if (mode === "push") hand = A(3.4, side * 2.4, 8.2);
    else if (mode === "reach") { const r = p.reach || 0; hand = A(1.4 + 4 * r, side * 2.6, 6.4 + 3 * r); }
    else if (mode === "scan" && side === near) hand = A(3.6, side * 2.4, 12);
    else hand = A(-side * sw * 1.7, side * 3.7, 6.4);
    const el = [(sh[0] + hand[0]) / 2 + lx * side * 0.5, (sh[1] + hand[1]) / 2 + ly * side * 0.5, (sh[2] + hand[2]) / 2 - 0.3];
    return { side, hand, svg: limb([sh, el, hand], 1.9, "c-purple") + ball(hand, 1.05, "wh-hand") };
  };
  const arms = [arm(-1), arm(1)];
  const farArm = arms.find((a) => a.side !== near), nearArm = arms.find((a) => a.side === near);
  const tr = '<g transform="' + translateAlong(P, [p.x - c.x, p.y - c.y, hop]) + '">';
  const face = '<g class="wh-face">' + chibiFace([p.x, p.y, B + 17], faceDir([fx, fy], p.look || 0), KPX, P) + "</g>";
  let visor = "";
  if (p.hat === "cap") {
    const q = (a, b) => [p.x + fx * a + lx * b, p.y + fy * a + ly * b];
    visor = '<g class="c-purple">' + solidSvg(extrude([q(2.6, -2.1), q(6.3, -2.1), q(6.3, 2.1), q(2.6, 2.1)], B + 18.5, 0.45, P), { tone: "mid" }) + "</g>";
  }
  let held = "";
  if (mode === "scan") {
    const hd = nearArm.hand;
    held = '<g class="wh-scan">' + solidSvg(slabOf({ x: hd[0] - 1.1, y: hd[1] - 1.1, w: 2.2, d: 2.2, r: 0.4 }, hd[2] + 0.4, 1.4, P, 3, 0.2), { tone: "mid" }) + "</g>";
    if (p.beam) held += lineSvg(path([[hd[0] + fx * 1.4, hd[1] + fy * 1.4, hd[2] + 1.1], p.beam]), { tone: "lit", className: "wh-beam", free: true });
  }
  const halo = '<path class="iso-halo" style="filter:blur(3px)" d="' + haloOf({ x: p.x - 3.4, y: p.y - 3.4, w: 6.8, d: 6.8, r: 3.4 }, p.base, 0.1, P) + '"/>';
  if (facing < 0) return halo + legOrder + farArm.svg + nearArm.svg + held + visor + tr + c.torso + "</g>" + tr + c.head + "</g>" + face + tr + c.hat + "</g>";
  return halo + legOrder + farArm.svg + tr + c.torso + "</g>" + nearArm.svg + held + tr + c.head + "</g>" + face + tr + c.hat + "</g>" + visor;
}
// 손수레 (2층 작업자가 민다)
function cartSvg(x, y, h, base) {
  const fx = Math.cos(h), fy = Math.sin(h), lx = -fy, ly = fx;
  const Q = (a, b) => [x + fx * a + lx * b, y + fy * a + ly * b];
  const ring = (a0, a1, b0, b1) => [Q(a0, b0), Q(a1, b0), Q(a1, b1), Q(a0, b1)];
  const wheels = [[-3.2, -2.6], [-3.2, 2.6], [3.2, -2.6], [3.2, 2.6]].map(([a, b]) => { const q = Q(a, b), v = iso([q[0], q[1], base + 0.9], P); return '<circle class="wh-cartwheel" cx="' + v[0].toFixed(1) + '" cy="' + v[1].toFixed(1) + '" r="' + (0.9 * KPX).toFixed(2) + '"/>'; }).join("");
  const deck = solidSvg(extrude(ring(-4.2, 4.2, -3.2, 3.2), base + 1.6, 1.2, P, { bevel: 0.3 }), { tone: "mid", crease: "lo" });
  const posts = [-2.8, 2.8].map((b) => solidSvg(extrude(ring(-4.2, -3.4, b - 0.4, b + 0.4), base + 2.8, 6, P), { tone: "mid" })).join("");
  const bar = solidSvg(extrude(ring(-4.2, -3.4, -3.2, 3.2), base + 8.4, 0.8, P), { tone: "mid" });
  return '<g class="wh-cart">' + wheels + deck + posts + bar + "</g>";
}

// ---- 1층: 정문, 도크, 출고 트럭, 출고 대기, 포장대 ----
function floor1() {
  const out = [part("bench", ground())];
  out.push(part("floor-1", core(F, FL2 - SLAB) + backWallAt(F) + column(168.5, 1.5, F, FL2 - SLAB)));
  out.push(part("gate", gate()));
  out.push(part("truck", truckSvg(DOCK2_AT[0], DOCK2_AT[1], -1, 0, "out"), " data-truck"));
  out.push(part("dock", mslab({ x: 3, y: DOOR2[0], w: 14, d: DOOR2[1] - DOOR2[0], r: 0.6 }, F, 0.6, { tone: "mid" }, 0.2, 2) + L(k.planOutline({ x: 4.5, y: DOOR2[0] + 1.5, w: 11, d: DOOR2[1] - DOOR2[0] - 3, r: 0.4 }, F + 0.6, P, 2), { tone: "faint" })));
  out.push(part("floor-1", leftWall() + column(1.5, 108.5, F, FL2 - SLAB)));
  const marks = L(k.planOutline(k.insetPlan(WAIT_AREA, 1.6), F + 0.3, P, 2), { tone: "faint" });
  out.push(part("wait", mslab(WAIT_AREA, F, 0.3, { tone: "mid", flat: true, crease: "none" }, 0, 2) + marks));
  const legs = k.corners(TABLE, 1.5).map(([x, y]) => mslab(planAt(x, y, 1.6, 1.6, 0.3), F, TABLE_TOP - F - 1.2, { tone: "mid" }, 0, 2)).join("");
  const roll = S(k.cylinder(TABLE.x + 3, TABLE.y + 2.5, 1.6, TABLE_TOP, 2.4, P, 20, 0.2), { tone: "mid" });
  out.push(part("pack", legs + mslab(TABLE, TABLE_TOP - 1.2, 1.2, { tone: "mid" }, 0.3, 2) + roll));
  out.push(`<g data-people="1"></g>`);
  out.push(part("floor-1", column(168.5, 108.5, F, FL2 - SLAB)));
  out.push(part("shaft", mastPart(0, FL2 - SLAB - 1, false)));
  return out.join("");
}
// ---- 2층: 냉장존 ----
function floor2() {
  const out = [part("floor-2", slabFloor(FL2)), aisles("A")];
  out.push(part("floor-2", core(FL2, FL3 - SLAB) + backWallAt(FL2) + column(168.5, 1.5, FL2, FL3 - SLAB)));
  out.push(rackRow("A", 0, { label: true }));
  out.push(`<g data-people="2"></g>`);
  out.push(rackRow("A", 1), rackRow("A", 2));
  out.push(part("floor-2", column(1.5, 108.5, FL2, FL3 - SLAB)));
  const car = mslab({ x: LIFT.x, y: LIFT.y - 2, w: LIFT.w, d: 2, r: 0.3 }, CAR_Z - 1.5, 12, { tone: "mid" }, 0.2, 2) + mslab(LIFT, CAR_Z - 1.5, 1.5, { tone: "hi", crease: "lo" }, 0.3, 2) + mslab({ x: LIFT.x + LIFT.w - 1, y: LIFT.y, w: 1, d: LIFT.d, r: 0.3 }, CAR_Z, 4, { tone: "mid" }, 0, 2);
  out.push(part("shaft", mastPart(FL2 - SLAB - 1, FL3 - SLAB - 1, false)), part("car", car, " data-car"), `<g data-slot="cage"></g>`, part("floor-2", column(168.5, 108.5, FL2, FL3 - SLAB)));
  return out.join("");
}
// ---- 3층: 냉동존 (두꺼운 단열 벽, 냉동기) ----
function floor3() {
  const out = [part("floor-3", slabFloor(FL3)), aisles("F")];
  out.push(part("floor-3", core(FL3, FL4 - SLAB) + backWallAt(FL3) + column(168.5, 1.5, FL3, FL4 - SLAB)));
  const unit = { x: 60, y: 4, w: 36, d: 9, r: 0.8 };
  out.push(part("zone-F", mslab(unit, FL3, 12, { tone: "mid" }, 0.5, 2) + [70, 86].map((x) => S(k.cylinder(x, 8.5, 3.6, FL3 + 12, 0.8, P, 32, 0.2), { tone: "mid" }) + L(k.ring(x, 8.5, 2.6, FL3 + 12.8, P, 28) + k.ring(x, 8.5, 0.9, FL3 + 12.8, P, 12), { tone: "lo" })).join("")));
  const wall = { x: 18, y: 3, w: 6, d: 107, r: 0.5 };
  out.push(part("zone-F", mslab(wall, FL3, 16, { tone: "mid", inner: L(k.sideSeam(wall, FL3 + 8, P, 2), { tone: "faint" }) }, 0.6, 2)));
  out.push(rackRow("F", 0), rackRow("F", 1));
  out.push(`<g data-people="3"></g>`);
  out.push(rackRow("F", 2));
  out.push(part("floor-3", column(1.5, 108.5, FL3, FL4 - SLAB)));
  out.push(part("shaft", mastPart(FL3 - SLAB - 1, FL4 - SLAB - 1, false)), part("floor-3", column(168.5, 108.5, FL3, FL4 - SLAB)));
  return out.join("");
}
// ---- 4층: 상온존과 사무실 ----
function floor4() {
  const out = [part("floor-4", slabFloor(FL4)), aisles("B")];
  out.push(part("floor-4", core(FL4, FL4 + 18, true) + backWallAt(FL4)));
  const o = [];
  const desk = { x: 34, y: 8, w: 22, d: 11, r: 0.6 };
  o.push(mslab(desk, FL4, 6, { tone: "mid" }, 0.3, 2), mslab({ x: 40, y: 10, w: 10, d: 1.6, r: 0.3 }, FL4 + 6, 6, { tone: "hi", crease: "lo" }, 0.2, 2), mslab({ x: 42, y: 24, w: 5, d: 5, r: 1 }, FL4, 4, { tone: "mid" }, 0.2, 2));
  const pr = { x: 84, y: 3, w: 2, d: 56, r: 0.3 }, pf = { x: 26, y: 57, w: 60, d: 2, r: 0.3 };
  o.push(mslab(pr, FL4, 7, { tone: "mid" }, 0.2, 2), mslab(pf, FL4, 7, { tone: "mid" }, 0.2, 2));
  out.push(part("office", o.join("")));
  out.push(rackRow("B", 0), rackRow("B", 1));
  out.push(`<g data-people="4"></g>`);
  out.push(rackRow("B", 2));
  out.push(part("floor-4", column(1.5, 108.5, FL4, FL4 + 16) + column(168.5, 108.5, FL4, FL4 + 16)));
  out.push(part("shaft", mastPart(FL4 - SLAB - 1, FL4 + 27, true)));
  return out.join("");
}

// ---- 확대창: 선택한 칸을 같은 등각 투영으로 크게 ----
const cellCenter = (c) => {
  const row = ROWS[c.zone].rows[c.row];
  const [bx0, bx1] = bayOf(row, c.bay);
  return [(bx0 + bx1) / 2, (row.y0 + row.y1) / 2, ROWS[c.zone].base + LV[c.lvl] + 5];
};
const A01_SCREEN = at(cellCenter(A01));
const INSET = { cx: 96, cy: Math.round(A01_SCREEN[1] - 30), r: 80 };
const INSET_K = 2.7;
function insetProj(c) {
  const unit = { origin: [0, 0], scale: P.scale * INSET_K, ...CAMERA };
  const q = k.iso(cellCenter(c), unit);
  return { ...unit, origin: [INSET.cx - q[0] + 8, INSET.cy - q[1] + 18] };
}
const PIN_A01 = insetProj(A01);
function insetCell(c) {
  const Q = insetProj(c);
  const row = ROWS[c.zone].rows[c.row];
  const [bx0, bx1] = bayOf(row, c.bay);
  const z = ROWS[c.zone].base + LV[c.lvl];
  const sl = (plan, a, h) => k.solidSvg(k.slabOf({ r: 0.3, ...plan }, a, h, Q, 2, 0.2), { tone: "mid", crease: "faint" });
  const tint = TINT(`zone-${c.zone}`);
  const ext = [bx0 - 14, bx1 + 14];
  const out = [`<g class="${tint}">${[bx0, bx1 - 2.5].map((x) => sl({ x, y: row.y0, w: 2.5, d: 2.5 }, z - 6, 26)).join("")}${sl({ x: ext[0], y: row.y0, w: ext[1] - ext[0], d: row.y1 - row.y0 }, z, SHELF_T)}</g>`];
  const top = z + SHELF_T;
  const tp = { x: bx0 + 2, y: row.y0 + 1.5, w: bx1 - bx0 - 4, d: row.y1 - row.y0 - 3, r: 0.6 };
  out.push(`<g class="c-green">${k.solidSvg(k.slabOf(tp, top, TRAY_T, Q, 3, 0.2), { tone: "mid" })}${k.lineSvg(k.planOutline(k.insetPlan(tp, 1.4), top + TRAY_T, Q, 3), { tone: "faint" })}</g>`);
  const [ly0, ly1] = LOT_Y(row);
  for (const [a, b, mark] of c.lots) {
    const html = lotSvg(bx0 + (bx1 - bx0) * a, bx0 + (bx1 - bx0) * b, ly0, ly1, top + TRAY_T, mark, Q);
    out.push(mark === "1022" ? `<g class="c-pink" data-inset-lot>${html}</g>` : `<g>${html}</g>`);
  }
  out.push(`<g class="${tint}">${sl({ x: ext[0], y: row.y0, w: ext[1] - ext[0], d: row.y1 - row.y0 }, z + LV[1] - LV[0], SHELF_T)}</g>`);
  const target = at(cellCenter(c));
  const dx = target[0] - INSET.cx, dy = target[1] - INSET.cy, n = Math.hypot(dx, dy);
  const start = [INSET.cx + (dx / n) * INSET.r, INSET.cy + (dy / n) * INSET.r];
  const lead = `<path class="iso-line wh-lead" data-tone="mid" d="M${start[0].toFixed(1)} ${start[1].toFixed(1)}L${target[0].toFixed(1)} ${target[1].toFixed(1)}"/><circle class="wh-lead-end" cx="${target[0].toFixed(1)}" cy="${target[1].toFixed(1)}" r="1.6"/>`;
  return `<g data-inset="${c.id}" style="display:none"><g clip-path="url(#wh-inset-clip)"><circle class="wh-inset-bg" cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r}"/>${out.join("")}</g>${lead}</g>`;
}
function insetLayer() {
  return `<g class="wh-inset" data-inset-layer><clipPath id="wh-inset-clip"><circle cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r - 0.5}"/></clipPath>${CELLS.map(insetCell).join("")}<circle class="wh-inset-ring" cx="${INSET.cx}" cy="${INSET.cy}" r="${INSET.r}"/></g>`;
}
function hits() {
  return CELLS.map((c) => {
    const row = ROWS[c.zone].rows[c.row];
    const [bx0, bx1] = bayOf(row, c.bay);
    const z0 = ROWS[c.zone].base + LV[c.lvl], z1 = z0 + 11;
    return `<path class="wh-hit" data-cell="${c.id}" d="${quad([[bx0, row.y1, z0], [bx1, row.y1, z0], [bx1, row.y1, z1], [bx0, row.y1, z1]])}"/>`;
  }).join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.svgLabel,
  body: [floor1(), floor2(), floor3(), floor4(), `<g class="wh-hits">${hits()}</g>`, insetLayer()],
});

// ---- 작업자 설정 (페이지에서 움직인다) ----
const PEOPLE = [
  { id: "A", floor: 2, base: FL2, hat: "helmet", x: 80, y: 53, heading: 0, part: "worker-A" },
  { id: "E", floor: 3, base: FL3, hat: "beanie", x: 60, y: 79, heading: 0, part: "worker-E" },
  { id: "B", floor: 4, base: FL4, hat: "cap", x: 101, y: 79, heading: 0, part: "worker-B" },
  { id: "C", floor: 1, base: F, hat: "helmet", x: 140, y: 64, heading: Math.PI, part: "worker-C" },
];
const CART_IDLE = [148, 58];
const CELL_INFO = Object.fromEntries(CELLS.map((c) => [c.id, { zone: TEXT.zone[c.zone], floor: FLOOR_OF[c.zone], lots: c.lots.length }]));
const ORDER = ["B-04", "B-03", "B-02", "B-01", "F-04", "F-03", "F-02", "F-01", "A-04", "A-03", "A-02", "A-01"];
const B_STOPS = ROWS.B.rows[1];
const SCAN_X = [0, 1, 2, 3].map((i) => { const [a, b] = bayOf(B_STOPS, i); return (a + b) / 2; });
const live = `
const P = ${JSON.stringify(P)};
const KPX = ${KPX};
const T = ${JSON.stringify(TEXT.readout)};
const CELLS = ${JSON.stringify(CELL_INFO)};
const ORDER = ${JSON.stringify(ORDER)};
const R0 = ${JSON.stringify(R0)};
const LOT_W = ${LOT_W}, LOT_D = ${LOT_D}, PIN = ${JSON.stringify(PIN_A01)};
const PEOPLE = ${JSON.stringify(PEOPLE)};
const FL2 = ${FL2}, F = ${F}, CAR_Z = ${CAR_Z}, LIFT_X = ${LIFT.x};
const TABLE_TOP = ${TABLE_TOP}, TABLE_C = [${TABLE.x + TABLE.w / 2}, ${TABLE.y + TABLE.d / 2}];
const SCAN_X = ${JSON.stringify(SCAN_X)}, SCAN_Y = ${B_STOPS.y1}, FL4 = ${FL4};
const DOCK2_AT = ${JSON.stringify(DOCK2_AT)}, LANE_X = ${LANE_X};
const LOGO_D = ${JSON.stringify(LOGO_D)};
const G = LATHE, k = { solidSvg, iso, pathOf, lineSvg };
const chibiArm = ${chibiArm.toString()};
const faceDir = ${faceDir.toString()};
const chibiFace = ${chibiFace.toString()};
const personParts = ${personParts.toString()};
const personSvg = ${personSvg.toString()};
const cartSvg = ${cartSvg.toString()};
const wheelSvg = ${wheelSvg.toString()};
const truckSvg = ${truckSvg.toString()};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const lotEl = svg.querySelector("[data-move]");
const lotRaw = lotEl.querySelector('[data-lotv="raw"]'), lotPacked = lotEl.querySelector('[data-lotv="packed"]');
const carEl = svg.querySelector("[data-car]");
const truckEl = svg.querySelector("[data-truck]");
const gateArm = svg.querySelector("[data-gatearm]");
const slots = { rack: svg.querySelector('[data-slot="rack"]'), cage: svg.querySelector('[data-slot="cage"]') };
const peopleSlots = {};
svg.querySelectorAll("[data-people]").forEach((el) => (peopleSlots[el.dataset.people] = el));
const insetLayer = svg.querySelector("[data-inset-layer]");
const insets = Object.fromEntries([...svg.querySelectorAll("[data-inset]")].map((el) => [el.dataset.inset, el]));
const insetLot = svg.querySelector('[data-inset="A-01"] [data-inset-lot]');
const NS = "http://www.w3.org/2000/svg";
const people = PEOPLE.map((p) => {
  const el = document.createElementNS(NS, "g");
  el.setAttribute("data-part", p.part);
  peopleSlots[p.floor].appendChild(el);
  return { ...p, el, cache: personParts(p), phase: 0, stride: 0, hop: 0, look: 0, arms: "walk", reach: 0, wait: 0, leg: 0, hands: null };
});
const mkCart = (floor, x, y, base) => {
  const el = document.createElementNS(NS, "g");
  el.setAttribute("data-part", floor === 2 ? "cart" : "cartc");
  peopleSlots[floor].appendChild(el);
  return { el, x, y, h: 0, v: 0, base, home: [x, y] };
};
const cartA = mkCart(2, 70, 53, FL2), cartC = mkCart(1, 140, 64, F);
const GROUPS = [...svg.querySelectorAll("g[data-part]")];
const FLOOR = { A: 2, F: 3, B: 4 };
const WORKER = { A: "worker-A", F: "worker-E", B: "worker-B" };
function stateOf(n, f) {
  if (f === "warehouse") return /^(floor-|core|shaft)/.test(n) ? "on" : "";
  if (f.startsWith("zone-")) {
    const z = f.slice(5);
    if (n === f || n === WORKER[z] || (z === "A" && n === "cart")) return "on";
    if (n.startsWith("cell-" + z) || n.startsWith("lot-" + z) || n === "floor-" + FLOOR[z]) return "";
    if (z === "A" && (n === "lot-1022" || n === "car")) return "";
    return "dim";
  }
  if (f.startsWith("cell-")) {
    const id = f.slice(5), z = id[0];
    if (n === f) return "on";
    if (n === "lot-" + id || n === "floor-" + FLOOR[z]) return "";
    if (id === "A-01" && (n === "lot-1022" || n === "car")) return "";
    return "dim";
  }
  const sets = {
    "lot-1022": [["lot-1022", "worker-A", "cart", "car"], ["floor-2", "shaft", "cell-A-01", "lot-A-01"]],
    outbound: [["lot-1022", "car", "wait", "worker-C", "cartc"], ["floor-1", "shaft", "pack", "dock", "truck", "gate"]],
    pack: [["pack", "lot-1022", "worker-C", "cartc"], ["floor-1", "wait", "dock", "truck", "gate", "shaft"]],
    load: [["dock", "truck", "lot-1022", "worker-C", "cartc"], ["floor-1", "pack", "wait", "gate"]],
    exit: [["truck", "gate"], ["floor-1", "dock", "bench", "worker-C", "cartc"]],
  }[f];
  if (!sets) return "";
  if (sets[0].includes(n)) return "on";
  if (sets[1].includes(n)) return "";
  return "dim";
}
let focusNow = "";
function focus(name) {
  if (name === focusNow) return;
  focusNow = name;
  for (const g of GROUPS) {
    const s = stateOf(g.dataset.part, name);
    if (s) g.setAttribute("data-state", s); else g.removeAttribute("data-state");
  }
}
const cellText = (id) => {
  const c = CELLS[id];
  return (c.lots ? T.cell : T.cellEmpty).replace("{floor}", c.floor).replace("{zone}", c.zone).replace("{id}", id).replace("{n}", c.lots);
};
// 단계: [시간, 강조, 문구, 대본]
const TOUR = [
  [2.8, "warehouse", T.warehouse, ""],
  [2.2, "zone-A", T.zoneA, ""],
  [2.0, "zone-F", T.zoneF, ""],
  [2.0, "zone-B", T.zoneB, ""],
  [2.6, "cell-A-01", cellText("A-01"), ""],
  [3.4, "lot-1022", T.lotSoon, "soon"],
  [8.4, "lot-1022", T.lotOut, "out"],
  [6.4, "outbound", T.outbound, "down"],
  [7.4, "pack", T.pack, "pack"],
  [9.6, "load", T.load, "load"],
  [5.0, "exit", T.exit, "exit"],
];
const CYCLE = TOUR.reduce((s, t) => s + t[0], 0);
function stepAt(t) { let u = t % CYCLE; for (let i = 0; i < TOUR.length; i++) { if (u < TOUR[i][0]) return [i, u]; u -= TOUR[i][0]; } return [0, 0]; }
const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const clamp01 = (t) => Math.max(0, Math.min(1, t));
const seg = (u, a, b) => ease((u - a) / (b - a));
const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const wrap = (d) => { while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return d; };
let frame = 0, last = 0, clock = 0, bob = 0, lastStep = -1, touring = !still.matches, visible = false, idleTimer = 0, picked = null, text = TOUR[0][2], insetNow = "";
// 흐름 상태: 로트 위치와 보이는 정도, 포장 여부, 반송기 높이, 트럭 뒷문, 트럭 출차, 차단기
const flow = { lot: R0.slice(), packed: 0, fade: 1, slot: "rack", car: CAR_Z, door: 0, truck: 0, arm: 0, insetLot: 0 };
function resetFlow() {
  Object.assign(flow, { lot: R0.slice(), packed: 0, fade: 1, slot: "rack", car: CAR_Z, door: 0, truck: 0, arm: 0, insetLot: 0 });
  cartA.x = cartA.home[0]; cartA.y = cartA.home[1]; cartA.h = 0; cartA.v = 0;
  cartC.x = cartC.home[0]; cartC.y = cartC.home[1]; cartC.h = 0; cartC.v = 0;
  for (const p of people) p.wait = 0;
  truckKey = "";
}
function show(name, words) { focus(name); text = words; }
// ---- 걷기와 카트 ----
function walk(p, tx, ty, dt, speed) {
  const dx = tx - p.x, dy = ty - p.y, d = Math.hypot(dx, dy);
  if (d > 0.3) {
    const stepLen = Math.min(d, speed * dt);
    p.x += (dx / d) * stepLen; p.y += (dy / d) * stepLen;
    turn(p, Math.atan2(dy, dx), dt);
    p.phase += stepLen * 0.55;
    p.stride += (1 - p.stride) * Math.min(1, dt * 8);
    return false;
  }
  p.stride += (0 - p.stride) * Math.min(1, dt * 8);
  return true;
}
function turn(p, h, dt) { p.heading += wrap(h - p.heading) * Math.min(1, dt * 7); }
// 카트: 진행 방향으로 천천히 돌고, 가속, 감속. 사람은 손잡이 뒤에 붙어 걷는다.
const HOLD = 8.2;
function driveCart(c, tx, ty, th, dt, vmax = 11) {
  const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy);
  const want = d > 0.6 ? Math.atan2(dy, dx) : th;
  const diff = wrap(want - c.h);
  const tr = 1.6 * dt;
  c.h += Math.max(-tr, Math.min(tr, diff));
  const vt = d > 0.6 ? (Math.abs(diff) < 0.3 ? Math.min(vmax, d * 1.4) : 1.5) : 0;
  c.v += Math.max(-14 * dt, Math.min(9 * dt, vt - c.v));
  const stepLen = Math.max(0, Math.min(c.v * dt, d));
  c.x += Math.cos(c.h) * stepLen; c.y += Math.sin(c.h) * stepLen;
  return d <= 0.6 && Math.abs(wrap(th - c.h)) < 0.06;
}
const handleOf = (c) => {
  const fx = Math.cos(c.h), fy = Math.sin(c.h), lx = -fy, ly = fx;
  return [-1, 1].map((s) => [c.x - fx * 4.4 + lx * s * 2.4, c.y - fy * 4.4 + ly * s * 2.4, c.base + 8.8]);
};
// 사람을 카트 손잡이에 붙인다 (손 위치 = 손잡이 좌표)
function attach(p, c) {
  const nx = c.x - Math.cos(c.h) * HOLD, ny = c.y - Math.sin(c.h) * HOLD;
  const moved = Math.hypot(nx - p.x, ny - p.y);
  p.x = nx; p.y = ny; p.heading = c.h;
  p.phase += moved * 0.55;
  p.stride += ((moved > 0.02 ? 1 : 0) - p.stride) * 0.2;
  p.arms = "push";
  p.hands = handleOf(c);
}
const nearHandle = (p, c) => Math.hypot(c.x - Math.cos(c.h) * HOLD - p.x, c.y - Math.sin(c.h) * HOLD - p.y) < 0.8;
// 손에 든 로트 위치 (상자 모서리)
const handsLot = (p) => [p.x + Math.cos(p.heading) * 4.4 - LOT_W / 2, p.y + Math.sin(p.heading) * 4.4 - LOT_D / 2, p.base + 6.2];
const cartLot = (c) => [c.x - LOT_W / 2, c.y - LOT_D / 2, c.base + 2.8];
const carLot = () => [LIFT_X + 4, 35, flow.car];
const tableLot = [TABLE_C[0] - LOT_W / 2, TABLE_C[1] - LOT_D / 2, TABLE_TOP];
const truckLot = [-12, 44, 7.5];
// 평소 동작: 카트 밀며 통로 왕복, 걸어서 통로 왕복, 칸마다 스캔
function cartPatrol(p, c, xs, y, dt) {
  if (p.wait > 0) { p.wait -= dt; attach(p, c); p.look = 0.5 * Math.sin(bob * 2); return; }
  if (!nearHandle(p, c)) { walk(p, c.x - Math.cos(c.h) * HOLD, c.y - Math.sin(c.h) * HOLD, dt, 16); p.arms = "walk"; p.hands = null; return; }
  const tx = xs[p.leg % xs.length];
  if (driveCart(c, tx, y, tx > c.x - 1 ? 0 : Math.PI, dt)) { p.leg++; p.wait = 1.4; }
  attach(p, c);
}
function patrol(p, xs, y, dt, speed, face, onStop) {
  if (p.wait > 0) { p.wait -= dt; turn(p, face, dt); p.stride += (0 - p.stride) * Math.min(1, dt * 8); onStop && onStop(p); return; }
  if (walk(p, xs[p.leg % xs.length], y, dt, speed)) { p.leg++; p.wait = 1.2; }
}
const pA = people.find((p) => p.id === "A"), pB = people.find((p) => p.id === "B"), pC = people.find((p) => p.id === "C"), pE = people.find((p) => p.id === "E");
const C1 = [150, 54], C2 = [160, 54], PICK = [160, 50], LIFTSIDE = [167, 41];
function stage2(script, u, dt) {
  // 2층 작업자: 손수레로 A-01의 10/22 로트를 반송기까지
  pA.hands = null; pA.arms = "walk"; pA.reach = 0;
  if (script === "soon") {
    if (!nearHandle(pA, cartA) && cartA.v < 0.1) walk(pA, cartA.x - Math.cos(cartA.h) * HOLD, cartA.y - Math.sin(cartA.h) * HOLD, dt, 16);
    else { driveCart(cartA, C1[0], C1[1], 0, dt); attach(pA, cartA); }
    return;
  }
  if (script !== "out") { cartPatrol(pA, cartA, [70, 132], 53, dt); return; }
  if (u < 1.0) { walk(pA, PICK[0], PICK[1], dt, 14); }
  else if (u < 2.2) { walk(pA, PICK[0], PICK[1], dt, 14); turn(pA, -Math.PI / 2, dt); pA.arms = "reach"; pA.reach = seg(u, 1.0, 1.6); flow.lot = lerp3(R0, handsLot(pA), seg(u, 1.4, 2.2)); flow.slot = u < 1.8 ? "rack" : "p2"; }
  else if (u < 3.0) { turn(pA, Math.atan2(cartA.y - pA.y, cartA.x - pA.x), dt); pA.arms = "carry"; flow.lot = lerp3(handsLot(pA), cartLot(cartA), seg(u, 2.4, 3.0)); flow.slot = "p2"; }
  else if (u < 3.6) { walk(pA, cartA.x - Math.cos(cartA.h) * HOLD, cartA.y - Math.sin(cartA.h) * HOLD, dt, 16); flow.lot = cartLot(cartA); }
  else if (u < 5.4) { driveCart(cartA, C2[0], C2[1], 0, dt); attach(pA, cartA); flow.lot = cartLot(cartA); }
  else if (u < 6.0) { walk(pA, LIFTSIDE[0], LIFTSIDE[1] + 6, dt, 14); flow.lot = cartLot(cartA); }
  else if (u < 6.6) { turn(pA, Math.atan2(cartA.y - pA.y, cartA.x - pA.x), dt); pA.arms = "carry"; flow.lot = lerp3(cartLot(cartA), handsLot(pA), seg(u, 6.0, 6.6)); }
  else if (u < 7.4) { walk(pA, LIFTSIDE[0], LIFTSIDE[1], dt, 12); pA.arms = "carry"; flow.lot = handsLot(pA); }
  else { turn(pA, 0, dt); pA.arms = "carry"; flow.lot = lerp3(handsLot(pA), carLot(), seg(u, 7.5, 8.3)); flow.slot = u > 7.9 ? "cage" : "p2"; }
}
const CC_LIFT = [158, 42], CC_TABLE = [134, 50], CC_DOCK = [21, 48];
function stage1(script, u, dt) {
  // 1층 작업자: 반송기 → 카트 → 포장대 → 카트 → 트럭 뒷문
  pC.hands = null; pC.arms = "walk"; pC.reach = 0;
  const behind = () => [cartC.x - Math.cos(cartC.h) * HOLD, cartC.y - Math.sin(cartC.h) * HOLD];
  const push = (tx, ty, th, vmax) => { if (!nearHandle(pC, cartC)) { const b = behind(); walk(pC, b[0], b[1], dt, 20); } else { driveCart(cartC, tx, ty, th, dt, vmax); attach(pC, cartC); } };
  if (script === "down") {
    flow.car = CAR_Z - (CAR_Z - F) * seg(u, 0, 2.4);
    if (u < 2.6) { flow.lot = carLot(); flow.slot = "cage"; push(CC_LIFT[0], CC_LIFT[1], 0); }
    else if (u < 3.2) { walk(pC, LIFTSIDE[0], LIFTSIDE[1] - 6, dt, 14); flow.lot = carLot(); }
    else if (u < 4.0) { turn(pC, 0, dt); pC.arms = "carry"; flow.lot = lerp3(carLot(), handsLot(pC), seg(u, 3.2, 4.0)); flow.slot = u > 3.6 ? "p1" : "cage"; }
    else if (u < 4.8) { turn(pC, Math.atan2(cartC.y - pC.y, cartC.x - pC.x), dt); pC.arms = "carry"; flow.lot = lerp3(handsLot(pC), cartLot(cartC), seg(u, 4.2, 4.8)); flow.slot = "p1"; }
    else { const b = behind(); walk(pC, b[0], b[1], dt, 16); flow.lot = cartLot(cartC); }
    return;
  }
  if (script === "pack") {
    if (u < 3.2) { push(CC_TABLE[0], CC_TABLE[1], Math.PI); flow.lot = cartLot(cartC); }
    else if (u < 3.8) { walk(pC, TABLE_C[0] + 6, TABLE_C[1] + 9, dt, 14); flow.lot = cartLot(cartC); }
    else if (u < 4.6) { turn(pC, Math.atan2(cartC.y - pC.y, cartC.x - pC.x), dt); pC.arms = "carry"; flow.lot = lerp3(cartLot(cartC), handsLot(pC), seg(u, 3.8, 4.4)); }
    else if (u < 5.2) { turn(pC, -Math.PI / 2 - 0.5, dt); pC.arms = "carry"; flow.lot = lerp3(handsLot(pC), tableLot, seg(u, 4.6, 5.2)); }
    else if (u < 6.4) { turn(pC, -Math.PI / 2 - 0.5, dt); pC.arms = "reach"; pC.reach = 0.5 + 0.4 * Math.sin(bob * 5); flow.lot = tableLot; flow.packed = seg(u, 5.3, 6.2); }
    else if (u < 7.0) { pC.arms = "carry"; flow.lot = lerp3(tableLot, handsLot(pC), seg(u, 6.4, 6.8)); turn(pC, Math.atan2(cartC.y - pC.y, cartC.x - pC.x), dt); }
    else { pC.arms = "carry"; flow.lot = lerp3(handsLot(pC), cartLot(cartC), seg(u, 7.0, 7.4)); }
    return;
  }
  if (script === "load") {
    flow.packed = 1;
    if (u < 4.8) { push(CC_DOCK[0], CC_DOCK[1], Math.PI, 34); flow.lot = cartLot(cartC); flow.door = seg(u, 4.0, 4.8); }
    else if (u < 5.5) { walk(pC, 8, 42, dt, 14); flow.lot = cartLot(cartC); flow.door = 1; }
    else if (u < 6.1) { turn(pC, Math.atan2(cartC.y - pC.y, cartC.x - pC.x), dt); pC.arms = "carry"; flow.door = 1; flow.lot = lerp3(cartLot(cartC), handsLot(pC), seg(u, 5.5, 6.1)); }
    else if (u < 7.2) { turn(pC, Math.PI, dt); pC.arms = "carry"; flow.door = 1; flow.lot = lerp3(handsLot(pC), truckLot, seg(u, 6.2, 7.1)); flow.fade = 1 - seg(u, 6.7, 7.2); }
    else { flow.fade = 0; flow.door = 1 - seg(u, 7.3, 7.9); const b = behind(); walk(pC, b[0], b[1], dt, 12); }
    return;
  }
  if (script === "exit") { flow.fade = 0; flow.door = 0; const b = behind(); if (walk(pC, b[0], b[1], dt, 12)) attach(pC, cartC); return; }
  cartPatrol(pC, cartC, [126, 160], 64, dt);
}
function updatePeople(script, u, dt, moving) {
  if (moving || script) { stage2(script, u, dt); stage1(script, u, dt); }
  if (moving) patrol(pE, [44, 150], 79, dt, 12, -Math.PI / 2, (p) => { p.look = 0.4 * Math.sin(bob * 2); });
  pB.arms = "scan"; pB.beam = null;
  if (moving) {
    const scanFocus = focusNow === "zone-B" || focusNow.startsWith("cell-B");
    if (scanFocus) { walk(pB, SCAN_X[0], 79, dt, 13); turn(pB, -Math.PI / 2, dt); }
    else patrol(pB, SCAN_X, 79, dt, 12, -Math.PI / 2);
  }
  if (pB.wait > 0 || pB.stride < 0.2) pB.beam = [pB.x, SCAN_Y, FL4 + 8];
  for (const p of people) {
    p.hop = moving ? (p.stride > 0.1 ? 0.45 * Math.abs(Math.sin(p.phase)) : 0.2 * Math.abs(Math.sin(bob * 1.3 + p.base))) : 0;
    p.el.innerHTML = personSvg(p, p.cache);
  }
  cartA.el.innerHTML = cartSvg(cartA.x, cartA.y, cartA.h, FL2);
  cartC.el.innerHTML = cartSvg(cartC.x, cartC.y, cartC.h, F);
}
function sortSlot(slot, items) {
  const order = items.filter((it) => it.el.parentNode === slot).sort((a, b) => a.d - b.d);
  let ok = true;
  order.forEach((it, i) => { if (slot.children[i] !== it.el) ok = false; });
  if (!ok) order.forEach((it) => slot.appendChild(it.el));
}
// 출고 트럭 (그림 1과 같은 경로)
const bez = (a, b, c, d, t) => { const m = 1 - t; return [m*m*m*a[0] + 3*m*m*t*b[0] + 3*m*t*t*c[0] + t*t*t*d[0], m*m*m*a[1] + 3*m*m*t*b[1] + 3*m*t*t*c[1] + t*t*t*d[1]]; };
const B2 = [DOCK2_AT, [DOCK2_AT[0] - 40, DOCK2_AT[1]], [LANE_X, DOCK2_AT[1] + 8], [LANE_X, DOCK2_AT[1] + 36]];
let truckKey = "";
function truckPose(tr) {
  const f = ease(tr);
  if (f < 0.45) {
    const g = f / 0.45, p = bez(...B2, g), a = bez(...B2, Math.max(0, g - 0.002)), b = bez(...B2, Math.min(1, g + 0.002));
    const dx = b[0] - a[0], dy = b[1] - a[1], n = Math.hypot(dx, dy) || 1;
    return { x: p[0], y: p[1], hx: f === 0 ? -1 : dx / n, hy: f === 0 ? 0 : dy / n, o: 1 };
  }
  const g = (f - 0.45) / 0.55, y = B2[3][1] + (165 - B2[3][1]) * g;
  return { x: LANE_X, y, hx: 0, hy: 1, o: clamp01((165 - y) / 14) };
}
function drawTruck() {
  const t = truckPose(flow.truck);
  const key = t.x.toFixed(2) + t.y.toFixed(2) + t.hx.toFixed(3) + flow.door.toFixed(2);
  if (key !== truckKey) { truckEl.innerHTML = truckSvg(t.x, t.y, t.hx, t.hy, "out", flow.door); truckKey = key; }
  truckEl.style.opacity = t.o < 1 ? t.o.toFixed(3) : "";
}
function draw(script, u, dt) {
  const moving = !still.matches;
  if (script === "") Object.assign(flow, { lot: R0.slice(), slot: "rack", packed: 0, fade: 1, car: CAR_Z });
  if (script === "exit") flow.truck = moving ? Math.min(1, flow.truck + dt / 4.2) : 1;
  updatePeople(script, u, dt, moving);
  if (still.matches && script) { /* 정지 화면에서는 단계 끝 상태 */ }
  const q = flow.lot;
  lotEl.setAttribute("transform", translateAlong(P, [q[0] - R0[0], q[1] - R0[1], q[2] - R0[2]]));
  carEl.setAttribute("transform", translateAlong(P, [0, 0, flow.car - CAR_Z]));
  lotRaw.style.opacity = flow.packed > 0 ? String(1 - flow.packed) : "";
  lotPacked.style.opacity = String(flow.packed);
  lotEl.style.opacity = flow.fade < 1 ? flow.fade.toFixed(3) : "";
  const slot = flow.slot === "rack" ? slots.rack : flow.slot === "cage" ? slots.cage : flow.slot === "p2" ? peopleSlots[2] : peopleSlots[1];
  if (lotEl.parentNode !== slot) slot.appendChild(lotEl);
  // 확대창
  const want = focusNow.startsWith("cell-") ? focusNow.slice(5) : focusNow === "lot-1022" ? "A-01" : "";
  if (want !== insetNow) {
    if (want) for (const id in insets) insets[id].style.display = id === want ? "" : "none";
    insetLayer.classList.toggle("on", !!want);
    insetNow = want;
  }
  const out = script === "out" ? seg(u, 1.4, 2.2) : 0;
  insetLot.setAttribute("transform", translateAlong(PIN, [0, out * 10, out * 4]));
  insetLot.style.opacity = out > 0.5 ? String(clamp01((1 - out) / 0.5)) : "";
  // 깊이 정렬
  const items = people.map((p) => ({ el: p.el, d: depthOf([p.x, p.y, 0], P) }));
  items.push({ el: cartA.el, d: depthOf([cartA.x, cartA.y, 0], P) - 0.01 }, { el: cartC.el, d: depthOf([cartC.x, cartC.y, 0], P) - 0.01 });
  items.push({ el: lotEl, d: depthOf([q[0] + LOT_W / 2, q[1] + LOT_D / 2, 0], P) + 0.02 });
  for (const key in peopleSlots) sortSlot(peopleSlots[key], items);
  drawTruck();
  const up = flow.truck > 0.25 && flow.truck < 0.95 ? 1 : 0;
  flow.arm += (up - flow.arm) * (moving ? Math.min(1, dt * 4) : 1);
  gateArm.setAttribute("transform", "rotate(" + (-80 * flow.arm).toFixed(2) + ")");
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
}
let script = "", stepU = 0;
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  if (!still.matches) bob += dt * 1.6;
  if (touring) {
    clock += dt;
    const [i, u] = stepAt(clock);
    if (i < lastStep) resetFlow();
    lastStep = i;
    show(TOUR[i][1], TOUR[i][2]);
    script = TOUR[i][3]; stepU = u;
  }
  draw(script, stepU, dt);
  frame = visible && !still.matches ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function resumeLater() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { picked = null; touring = !still.matches; clock = 0; lastStep = -1; resetFlow(); run(); }, 3600);
}
function pick(id) {
  touring = false;
  clearTimeout(idleTimer);
  if (picked !== id) { picked = id; resetFlow(); script = ""; show("cell-" + id, cellText(id)); }
  draw(script, 0, 0);
  run();
}
svg.querySelectorAll(".wh-hit").forEach((el) => {
  el.addEventListener("pointerenter", () => pick(el.dataset.cell));
  el.addEventListener("pointerdown", () => { pick(el.dataset.cell); resumeLater(); });
});
stage.addEventListener("pointerleave", resumeLater);
stage.addEventListener("keydown", (event) => {
  const here = picked ? ORDER.indexOf(picked) : ORDER.length - 2;
  let to = null;
  if (event.key === "ArrowRight" || event.key === "ArrowDown") to = (here + 1) % ORDER.length;
  if (event.key === "ArrowLeft" || event.key === "ArrowUp") to = (here - 1 + ORDER.length) % ORDER.length;
  if (event.key === "Home") to = 0;
  if (event.key === "End") to = ORDER.length - 1;
  if (to === null) return;
  event.preventDefault();
  pick(ORDER[to]);
  resumeLater();
});
stage.addEventListener("blur", resumeLater);
new IntersectionObserver((entries) => { visible = entries[entries.length - 1].isIntersecting; if (visible) run(); }, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) show("cell-A-01", cellText("A-01"));
else show(TOUR[0][1], TOUR[0][2]);
draw("", 0, 0);
`;

// ---- 색 토큰 ----
// [paper, top, shades 0..3 (어두운 쪽부터), hi(면 위 밝은 표시), mid(테두리), lo(면 위 결), faint(면 위 이음선), lit, glow]
const COLOR = {
  blue: {
    light: ["#C3D4F5", "#D3E0F8", ["#A2BDF0", "#B4C9F2", "#BFD1F4", "#C9D8F6"], "#26508F", "#7FA3EA", "#7FA3EA", "#B0C6F0", "#4C7FE0", "rgba(76,127,224,.5)"],
    dark: ["#2A4170", "#354F84", ["#1E2F55", "#243862", "#2A416F", "#304A7C"], "#FFFFFF", "#94B2EC", "#7C9CDC", "#4E6CA8", "#C7DAFF", "#7FA6FF"],
  },
  teal: {
    light: ["#B5E4EA", "#CBEDF1", ["#86D2DC", "#9FDBE3", "#ADE0E7", "#BBE6EB"], "#0F5E6B", "#5BBFCD", "#5BBFCD", "#9AD8E0", "#1E9AAE", "rgba(30,154,174,.5)"],
    dark: ["#1D5860", "#276A73", ["#14424A", "#184C55", "#1C5660", "#20606A"], "#FFFFFF", "#92D6DF", "#72C4CF", "#3E8E99", "#BFF4FB", "#6FD3E0"],
  },
  orange: {
    light: ["#FADDA2", "#FBE6B8", ["#F6CB72", "#F8D58C", "#F9DB9C", "#FAE0AA"], "#8A5F00", "#E8A820", "#E8A820", "#F3CF80", "#E89400", "rgba(232,148,0,.5)"],
    dark: ["#765520", "#8A6528", ["#4F3912", "#5B4216", "#674B1A", "#73541E"], "#FFFFFF", "#EACB8E", "#D8B26A", "#9C7A34", "#FFE6B0", "#FFC24D"],
  },
  green: {
    light: ["#BBE2C1", "#CDEBD1", ["#97D0A0", "#A9D9B0", "#B5DEBB", "#C1E4C6"], "#2E6B2E", "#74BE80", "#74BE80", "#A2D4AA", "#3E9B4F", "rgba(62,155,79,.5)"],
    dark: ["#2A5C35", "#346C40", ["#1B3F23", "#204829", "#25522F", "#2A5C35"], "#FFFFFF", "#A8DCB2", "#84C792", "#4A8857", "#CDF5D5", "#8FCF8F"],
  },
  purple: {
    light: ["#5F0080", "#8A3DA8", ["#47005F", "#53006F", "#5F0080", "#6C1A8E"], "#FFFFFF", "#3A004D", "#D9B8E6", "#B07CC6", "#3A004D", "rgba(95,0,128,.55)"],
    dark: ["#7A2E9E", "#9B4DBF", ["#4E1068", "#5C1A79", "#6A248A", "#78309B"], "#FFFFFF", "#E3C6F0", "#CDA2E0", "#A060C0", "#F0DDF8", "#B070D8"],
  },
  brown: {
    light: ["#F0E2CC", "#F5EADB", ["#DCC3A0", "#E6CFAF", "#EAD6BA", "#EEDCC4"], "#7A5530", "#C9A06B", "#C9A06B", "#E2CCAB", "#9A6A3A", "rgba(154,106,58,.5)"],
    dark: ["#5C4630", "#6E553A", ["#3E2F20", "#473626", "#503D2B", "#594430"], "#FFFFFF", "#E6CBA6", "#D3B184", "#8F7150", "#F6E7D2", "#D3A872"],
  },
  pink: {
    light: ["#F5C5D5", "#F8D3DF", ["#EEA8BF", "#F2B8CB", "#F4C2D2", "#F6CBD9"], "#9E3A57", "#E487A6", "#E487A6", "#F0B4C7", "#D04F78", "rgba(208,79,120,.55)"],
    dark: ["#723A50", "#84485F", ["#4E2636", "#592C3E", "#643246", "#6F384E"], "#FFFFFF", "#F0B4CA", "#E28EAE", "#A65A79", "#FFD6E3", "#FF9DB8"],
  },
};
// 비활성: 원래 색을 채도 30% 안팎만 남긴 옅은 톤
const DIM_COLOR = {
  blue: {
    light: ["#E6EBF3", "#EEF2F8", ["#DCE3EE", "#E0E6F0", "#E4E9F2", "#E8EDF4"], "#A9B4C8", "#C0C9D8", "#CDD4E0", "#DCE1EA", "#C0C9D8"],
    dark: ["#1E2840", "#243050", ["#172036", "#1A243B", "#1D2840", "#202C46"], "#8094BE", "#5A6E99", "#46587E", "#34425F", "#5A6E99"],
  },
  teal: {
    light: ["#E2EEF0", "#ECF4F5", ["#D7E7EA", "#DBEAEC", "#DFECEE", "#E3EFF0"], "#9EB9BE", "#B7CDD0", "#C6D8DB", "#D6E3E5", "#B7CDD0"],
    dark: ["#1B2F33", "#20383D", ["#152529", "#17292D", "#1A2D31", "#1D3135"], "#7FA9B0", "#557F86", "#43656B", "#324B50", "#557F86"],
  },
  orange: {
    light: ["#F1EADB", "#F7F2E7", ["#EADFC9", "#EDE3CF", "#EFE7D5", "#F2EADB"], "#BFAE88", "#D0C3A6", "#DDD2BB", "#E8E0CF", "#D0C3A6"],
    dark: ["#33291A", "#3C311F", ["#282014", "#2C2316", "#302619", "#342A1C"], "#B39C74", "#8C7550", "#705E40", "#514430", "#8C7550"],
  },
  green: {
    light: ["#E3ECE5", "#EDF3EE", ["#D8E4DA", "#DCE7DE", "#E0EAE2", "#E4EDE5"], "#A2B6A6", "#BACABD", "#C8D5CA", "#D8E2DA", "#BACABD"],
    dark: ["#1E2E22", "#243628", ["#17241A", "#1A281D", "#1D2C20", "#203023"], "#84A88A", "#5A7E61", "#47644D", "#35493A", "#5A7E61"],
  },
  purple: {
    light: ["#E4D9E8", "#EEE6F1", ["#D6C6DC", "#DCCDE1", "#E0D4E5", "#E6DCEA"], "#FFFFFF", "#B8A2C1", "#C9B8D0", "#DACCE0", "#B8A2C1"],
    dark: ["#2A1E30", "#322438", ["#21172A", "#251A2D", "#291D31", "#2D2035"], "#9A80A8", "#6E5A7A", "#574763", "#41364A", "#6E5A7A"],
  },
  brown: {
    light: ["#EEEAE4", "#F4F1EC", ["#E4DED5", "#E8E3DB", "#EBE6DF", "#EEEAE4"], "#B8AB9A", "#C9BEAF", "#D6CDC1", "#E3DDD4", "#C9BEAF"],
    dark: ["#2A241E", "#302922", ["#211C17", "#241E19", "#27211B", "#2A241E"], "#9C8A74", "#6E604F", "#584D40", "#433A31", "#6E604F"],
  },
  pink: {
    light: ["#EFE3E7", "#F6EEF1", ["#E8D9DE", "#EBDDE2", "#EDE1E5", "#F0E5E9"], "#BBA2AB", "#CEBAC1", "#DACBD0", "#E6DBDF", "#CEBAC1"],
    dark: ["#34202A", "#3D2531", ["#29181F", "#2D1B23", "#311E27", "#35212B"], "#B78C9B", "#8E6474", "#71505C", "#523B44", "#8E6474"],
  },
};
const ON_LINE = {"brown": ["#9A6A3A", "#F6E7D2"], "blue": ["#4C7FE0", "#B8CEFF"], "teal": ["#1E9AAE", "#A8EBF3"], "orange": ["#E89400", "#FFDB99"], "green": ["#3E9B4F", "#BDEEC6"], "pink": ["#D04F78", "#FFC7D9"], "purple": ["#3A004D", "#F0DDF8"]};
const GRAY_ON = {
  light: ["#E8E8E5", "#F2F2F0", ["#C8C8C5", "#D2D2CF", "#DBDBD8", "#E3E3E0"], "#333336", "#55555A", "#7A7A80", "#A0A0A6", "#55555A", "rgba(0,0,0,.3)"],
  dark: ["#262626", "#2F2F2F", ["#1C1C1C", "#202020", "#252525", "#2A2A2A"], "#FFFFFF", "#D4D4D4", "#A0A0A0", "#707070", "#FFFFFF", "rgba(255,255,255,.7)"],
};
// 건물 구조(바닥판, 기둥, 코어, 반송기, 작업대): 밝은 회색
const BLDC = {
  light: ["#ECECE9", "#F4F4F2", ["#D2D2CE", "#D9D9D5", "#DEDEDA", "#E3E3E0"], "#6E6E6A", "#9A9A96", "#B4B4B0", "#CACAC6", "#7D8A99", "rgba(125,138,153,.55)"],
  dark: ["#2A2A2A", "#333333", ["#202020", "#242424", "#282828", "#2D2D2D"], "#D0D0D0", "#8C8C8C", "#6A6A6A", "#4A4A4A", "#A9B6C4", "rgba(169,182,196,.5)"],
};
const DIM = {
  light: ["#EFEFED", "#F5F5F3", ["#E2E2DF", "#E7E7E4", "#EBEBE8", "#EFEFEC"], "#B0B0AC", "#BDBDB9", "#CCCCC8", "#DDDDDA", "#BDBDB9"],
  dark: ["#1F1F1F", "#242424", ["#1A1A1A", "#1C1C1C", "#1E1E1E", "#212121"], "#5E5E5E", "#4E4E4E", "#3E3E3E", "#303030", "#4E4E4E"],
};
// 사람 부품
const PERSON = {
  skin: { light: ["#EDC39E", "#F6D8BC", ["#D9A47E", "#E2B18D", "#E9BD9A", "#EEC5A3"], "#7A4A2A", "#A9744F", "#C08A63", "#D9A47E", "#A9744F"], dark: ["#C99A74", "#DDB08A", ["#9E7252", "#AE805E", "#BC8D69", "#C69772"], "#FFFFFF", "#F1C9A5", "#D9A47E", "#B98A64", "#F6D8BC"] },
  hair: { light: ["#4A3426", "#5E4434", ["#2E2018", "#38281E", "#42302A", "#4A3626"], "#C9B3A2", "#2A1C14", "#7A6050", "#5E4434", "#2A1C14"], dark: ["#5A4232", "#6E5240", ["#3A2A1E", "#443224", "#4E3A2A", "#584232"], "#FFFFFF", "#C9A88E", "#9A7A62", "#6E5240", "#E0C4AE"] },
  pants: { light: ["#3E4A66", "#56627E", ["#28324A", "#2F3A54", "#37425E", "#3E4A66"], "#C8D0E0", "#1E2638", "#8A96B0", "#56627E", "#1E2638"], dark: ["#46526E", "#5A6684", ["#2E3850", "#35405A", "#3C4864", "#44506E"], "#FFFFFF", "#C2CCE0", "#9AA6C0", "#6A7694", "#DCE3F0"] },
  shoe: { light: ["#3A3A3C", "#4E4E52", ["#222224", "#2A2A2C", "#323234", "#3A3A3C"], "#BBBBBB", "#1A1A1C", "#6A6A6E", "#4E4E52", "#1A1A1C"], dark: ["#4A4A4E", "#5C5C60", ["#2E2E30", "#363638", "#3E3E42", "#46464A"], "#FFFFFF", "#C8C8CC", "#9A9A9E", "#6A6A6E", "#E0E0E4"] },
  scan: { light: ["#3A3A3C", "#56565A", ["#222224", "#2A2A2C", "#323234", "#3A3A3C"], "#FFFFFF", "#1A1A1C", "#9A9A9E", "#6A6A6E", "#1A1A1C"], dark: ["#4A4A4E", "#606064", ["#2E2E30", "#363638", "#3E3E42", "#46464A"], "#FFFFFF", "#D8D8DC", "#A0A0A4", "#6A6A6E", "#FFFFFF"] },
};
const tok = ([paper, top, sh, hi, mid, lo, faint, lit, glow]) =>
  `--anatomy-paper:${paper};--anatomy-face:${paper};--anatomy-top:${top};${sh.map((c, i) => `--anatomy-shade-${i}:${c};`).join("")}--anatomy-hi:${hi};--anatomy-mid:${mid};--anatomy-lo:${lo};--anatomy-faint:${faint};--anatomy-lit:${lit};--anatomy-lit-top:${top};--anatomy-lit-shade:${sh[2]};--anatomy-dot:${hi};${glow ? `--glow:${glow};` : ""}`;
const css = [];
for (const th of ["light", "dark"]) {
  const T = `.iso[data-theme="${th}"]`;
  css.push(`${T} g[data-state="on"]:not([class]){${tok(GRAY_ON[th])}}`);
  for (const [name, set] of Object.entries(COLOR)) {
    css.push(`${T} .c-${name}{${tok(set[th])}}`);
    css.push(`${T} .iso-key.k-${name} .iso-swatch path{stroke:${set[th][4]};fill:${set[th][1]}}`);
  }
  css.push(`${T} .iso-key.k-gray .iso-swatch path{stroke:${BLDC[th][4]};fill:${BLDC[th][1]}}`);
  // 진한 면 위 다이얼은 밝은 회색 판으로 둔다
  css.push(`${T} .wh-dial{--anatomy-paper:${th === "light" ? "#F4F4F2" : "#2A2A2A"};--anatomy-face:var(--anatomy-paper);--anatomy-top:${th === "light" ? "#FFFFFF" : "#333333"};--anatomy-hi:${th === "light" ? "#26262A" : "#F0F0F0"};--anatomy-mid:${th === "light" ? "#55555A" : "#B0B0B0"};--anatomy-lo:${th === "light" ? "#8A8A8F" : "#808080"}}`);
  css.push(`${T} .wh-hat{--anatomy-paper:#F2F2F0;--anatomy-face:#F2F2F0;--anatomy-top:#FFFFFF;--anatomy-shade-0:#C8C8C6;--anatomy-shade-1:#D4D4D2;--anatomy-shade-2:#E0E0DE;--anatomy-shade-3:#EAEAE8;--anatomy-mid:${th === "light" ? "#6A6A70" : "#FFFFFF"};--anatomy-lo:#9A9AA0;--anatomy-faint:#B8B8BC;--anatomy-lit:${th === "light" ? "#3A004D" : "#FFFFFF"};--anatomy-lit-top:#FFFFFF;--anatomy-lit-shade:#E0E0DE}`);
  css.push(`${T} .wh-bld{${tok(BLDC[th])}}`);
  css.push(`${T} g.wh-bld[data-state="on"]{${tok(BLDC[th])}--anatomy-mid:${BLDC[th][7]};--anatomy-lit:${BLDC[th][7]}}`);
  for (const [name, set] of Object.entries(PERSON)) css.push(`${T} .wh-${name}{${tok(set[th])}}`);
  css.push(`${T} g[data-state="dim"],${T} g[data-state="dim"] [class^="c-"],${T} g[data-state="dim"] [class^="wh-"]{${tok(DIM[th])}}`);
  for (const [name, on] of Object.entries(ON_LINE)) css.push(`${T} g.c-${name}[data-state="on"],${T} g[data-state="on"] .c-${name}{--anatomy-mid:${on[th === "light" ? 0 : 1]}}`);
  for (const [name, set] of Object.entries(DIM_COLOR)) css.push(`${T} g.c-${name}[data-state="dim"],${T} g[data-state="dim"] .c-${name}{${tok(set[th])}}`);
}
const FX_CSS = `
${css.join("\n")}
g[data-state="on"] .iso-edge{stroke-width:2.6px}
g[data-state="on"] .wh-dial .iso-edge{stroke-width:1px}
g.wh-bld[data-state="on"] .iso-edge{stroke-width:2px}
.wh-eye{fill:#2A1C14}
.wh-cheek{fill:#F4A3B5;opacity:.85}
.iso-line.wh-smile{stroke:#8A4A3A;stroke-width:.8px}
g[data-state="dim"] .wh-face{opacity:.35}
.wh-beam{stroke-width:1.2px;animation:wh-beam 2.4s ease-in-out infinite}
@keyframes wh-beam{0%,100%{opacity:.35}50%{opacity:1}}
.wh-cellframe{stroke-opacity:0}
g[data-state="on"] .wh-cellframe{stroke-opacity:1;stroke-width:2.6px}
g[data-state="on"]{filter:drop-shadow(0 0 3.5px var(--glow,rgba(0,0,0,.45)));animation:wh-pulse .6s ease-out 1}
@keyframes wh-pulse{0%{filter:drop-shadow(0 0 0 var(--glow,rgba(0,0,0,.45)))}40%{filter:drop-shadow(0 0 9px var(--glow,rgba(0,0,0,.45)))}100%{filter:drop-shadow(0 0 3.5px var(--glow,rgba(0,0,0,.45)))}}
.iso-svg .iso-fill,.iso-svg .iso-shade,.iso-svg .iso-top,.iso-svg .iso-dots circle,.iso-svg .iso-face-text{transition:fill .5s ease}
.iso-svg .iso-line,.iso-svg .iso-wire-end{transition:stroke .5s ease,stroke-width .5s ease}
@media (prefers-reduced-motion:reduce){.iso-svg *{transition:none!important;animation:none!important}}
.iso-swatch path{stroke-width:1.4}
.iso[data-theme="light"] .c-kurlytruck{--anatomy-paper:#7A2A9A;--anatomy-face:#7A2A9A;--anatomy-top:#7A2A9A;--anatomy-shade-0:#47005F;--anatomy-shade-1:#52006E;--anatomy-shade-2:#5F0080;--anatomy-shade-3:#6A0A8C;--anatomy-hi:#33004A;--anatomy-mid:#33004A;--anatomy-lo:#B48AC8;--anatomy-faint:#B48AC8}
.iso[data-theme="dark"] .c-kurlytruck{--anatomy-paper:#8A3DAE;--anatomy-face:#8A3DAE;--anatomy-top:#8A3DAE;--anatomy-shade-0:#3E0A55;--anatomy-shade-1:#4A0E63;--anatomy-shade-2:#561272;--anatomy-shade-3:#621A80;--anatomy-hi:#F3E0FF;--anatomy-mid:#F3E0FF;--anatomy-lo:#B482CC;--anatomy-faint:#B482CC}
.iso[data-theme="light"] .c-truckwhite{--anatomy-paper:#FFFFFF;--anatomy-face:#FFFFFF;--anatomy-top:#FFFFFF;--anatomy-shade-0:#CFD1D6;--anatomy-shade-1:#D9DBDF;--anatomy-shade-2:#E3E4E8;--anatomy-shade-3:#ECEDF0;--anatomy-hi:#6B6E78;--anatomy-mid:#6B6E78;--anatomy-lo:#A4A7B0;--anatomy-faint:#E4E5E9}
.iso[data-theme="dark"] .c-truckwhite{--anatomy-paper:#D9DAE0;--anatomy-face:#D9DAE0;--anatomy-top:#E4E5EA;--anatomy-shade-0:#8C8E96;--anatomy-shade-1:#989AA2;--anatomy-shade-2:#A4A6AE;--anatomy-shade-3:#B0B2BA;--anatomy-hi:#3A3B40;--anatomy-mid:#3A3B40;--anatomy-lo:#6A6C74;--anatomy-faint:#C4C6CC}
.iso[data-theme="light"] .c-steel{--anatomy-paper:#C2C5CC;--anatomy-face:#C2C5CC;--anatomy-top:#C9CCD2;--anatomy-shade-0:#8D9099;--anatomy-shade-1:#979AA3;--anatomy-shade-2:#A1A4AD;--anatomy-shade-3:#ABAEB7;--anatomy-hi:#4E515A;--anatomy-mid:#4E515A;--anatomy-lo:#7A7E88;--anatomy-faint:#B5B8C0}
.iso[data-theme="dark"] .c-steel{--anatomy-paper:#7E828C;--anatomy-face:#7E828C;--anatomy-top:#8A8E98;--anatomy-shade-0:#44474F;--anatomy-shade-1:#4C4F58;--anatomy-shade-2:#545861;--anatomy-shade-3:#5C606A;--anatomy-hi:#E0E2E8;--anatomy-mid:#E0E2E8;--anatomy-lo:#A0A4AE;--anatomy-faint:#6E727C}
.mf-win{fill:var(--anatomy-shade-0);stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-arm{fill:var(--anatomy-top);stroke:var(--anatomy-mid);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-stripe{fill:var(--anatomy-mid);stroke:none}
.mf-door{fill:none;stroke:var(--anatomy-lo);stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-handle{fill:var(--anatomy-lo);stroke:none}
.mf-grill{fill:var(--anatomy-shade-0);stroke:none}
.mf-glass{fill:#3E4C60;stroke:#2A3444;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-lamp{fill:#FFF2B8;stroke:#B89A3A;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.iso:not([data-theme="light"]) .mf-glass{fill:#1C2633;stroke:#7D8A99}
.mf-logo{fill:#FFFFFF;stroke:none}
.mf-tire{fill:#4a4b50;stroke:#2a2a2e;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke;stroke-linejoin:round}
.mf-tire-face{fill:#5f6066;stroke:#2a2a2e;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-hub{fill:#dcdde1;stroke:#7a7a80;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.mf-bolt{fill:#5a5a60}
.iso:not([data-theme="light"]) .mf-tire{fill:#0c0c0e;stroke:#7a7a80}
.iso:not([data-theme="light"]) .mf-tire-face{fill:#1b1b1e;stroke:#7a7a80}
.iso:not([data-theme="light"]) .mf-hub{fill:#77777d;stroke:#b4b4b8}
.iso:not([data-theme="light"]) .mf-bolt{fill:#1b1b1e}
g[data-state="dim"] .mf-logo,g[data-state="dim"] .mf-wheel,g[data-state="dim"] .mf-glass,g[data-state="dim"] .mf-lamp{opacity:.35}


.wh-limb-edge,.wh-limb-fill{fill:none;stroke-linecap:round;stroke-linejoin:round}
.wh-limb-edge{stroke:var(--anatomy-mid)}
.wh-limb-fill{stroke:var(--anatomy-top)}
.wh-shoe-c{fill:#3A3A3C;stroke:#1A1A1C;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.wh-hand{fill:#F1C9A5;stroke:#A9744F;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
g[data-state="dim"] .wh-shoe-c,g[data-state="dim"] .wh-hand{opacity:.45}
.mf-hold{fill:#1c1c22;stroke:#33004A;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
.wh-cartwheel{fill:#4a4b50;stroke:#2a2a2e;stroke-width:var(--anatomy-weight);vector-effect:non-scaling-stroke}
[data-part="office"]{opacity:.55}
.iso[data-theme="light"] .iso-key.k-truck .iso-swatch path{fill:#5F0080;stroke:#33004A}
.iso[data-theme="dark"] .iso-key.k-truck .iso-swatch path{fill:#8A3DAE;stroke:#F3E0FF}
.wh-inset{opacity:0;transition:opacity .45s ease;pointer-events:none}
.wh-inset.on{opacity:1}
.wh-inset-bg{fill:var(--anatomy-card)}
.wh-inset-ring{fill:none;stroke:#7D8A99;stroke-width:2px;vector-effect:non-scaling-stroke;filter:drop-shadow(0 0 3px rgba(125,138,153,.5))}
.iso-line.wh-lead{stroke:#7D8A99;stroke-width:1.2px}
.wh-lead-end{fill:#7D8A99}
@media (prefers-reduced-motion:reduce){.wh-inset{transition:none}}

`;

const KEY_CLASS = TEXT.keys.map(([c]) => `k-${c}`);
let body = k.plateHtml({
  fig: TEXT.fig,
  title: TEXT.title,
  hint: TEXT.hint,
  readout: TEXT.readout.warehouse,
  keys: TEXT.keys.map(([, mark, label]) => ({ mark, label })),
  caption: TEXT.caption,
  body: `<div class="iso-stage" tabindex="0" role="group" aria-roledescription="그림" aria-label="${TEXT.stageLabel}">${svg}</div>`,
});
{
  let n = 0;
  body = body.replace(/<span class="iso-key">/g, () => `<span class="iso-key ${KEY_CLASS[n++]}">`);
}

const PAGE_CSS = `
*{box-sizing:border-box}
html{color-scheme:${theme}}
.iso{--anatomy-mono:ui-monospace,"SF Mono",Menlo,Consolas,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif}
html,body,.iso{background:transparent!important}
html{color-scheme:${theme}!important}
.iso[data-theme="light"]{--anatomy-page:transparent}
html,body{margin:0;padding:0}
body{background:var(--anatomy-page);color:var(--anatomy-text);font:14px/1.6 ui-sans-serif,system-ui,-apple-system,"Segoe UI","Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;-webkit-font-smoothing:antialiased}
.iso-page{width:100%;padding:2px 2px 4px}
.iso-figure{margin:0}
.iso-plate{padding:44px 14px 48px}
.iso-plate-corner[data-corner="title"],.iso-plate-corner[data-corner="hint"]{letter-spacing:.04em}
.iso-stage{outline:none;touch-action:pan-y}
.iso-stage:focus-visible{box-shadow:0 0 0 1px var(--anatomy-mid)}
.wh-hit{fill:transparent;stroke:none;cursor:pointer}
.iso-legend{padding:0 2px}
.iso-keys{display:grid;gap:4px}
${FX_CSS}
@media (max-width:560px){.iso-plate{padding:38px 4px 60px}.iso-plate-corners{inset:14px 12px}.iso-plate-corner[data-corner="hint"]{bottom:20px}.iso-legend{font-size:12.5px}}
`;

const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${TEXT.pageTitle}</title><style>${k.ISO_CSS}${PAGE_CSS}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main><script type="module">${(kitScript() + LATHE_SRC + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(OUT_DIR, { recursive: true });
const name = theme === "light" ? "scm-warehouse-light.html" : "scm-warehouse.html";
writeFileSync(join(OUT_DIR, name), page);
console.log("wrote", join("static/diagrams", name));
