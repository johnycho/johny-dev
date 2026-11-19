// 창고 > 존 > 로케이션 > 로트 계층을 층별로 띄운 창고 건물 모형으로 보여 주는 anatomy 그림.
// node tools/anatomy/scm-warehouse/build.mjs [--light]
import { mkdirSync, writeFileSync } from "node:fs";
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
    "층별로 띄워 놓은 창고 건물 모형입니다. 1층에는 입출고 도크와 출고 대기 구역이 있고, 2층에는 단열 벽으로 나뉜 냉동존과 냉장존이, 3층에는 상온존 선반이 있습니다. 각 존은 선반 칸(로케이션)으로 나뉘고, 냉장존 A-01 칸에는 10/22에 들어온 우유와 10/29에 들어온 우유가 서로 다른 로트로 놓여 있습니다. 유통기한이 이른 10/22 로트가 먼저 칸에서 나와 수직 반송기를 타고 1층 출고 대기 구역으로 내려갑니다.",
  stageLabel: "창고 위치 계층 그림입니다. 방향키로 칸을 고르면 그 칸이 있는 층과 존, 칸 이름, 로트 개수를 아래에 보여 줍니다.",
  // readout: 층, 장소, 지금 일어나는 일 순서
  readout: {
    warehouse: "창고 전체, 2층 냉동존과 냉장존, 3층 상온존",
    zoneF: "2층 냉동존, 로케이션 4칸",
    zoneA: "2층 냉장존, 로케이션 4칸",
    zoneB: "3층 상온존, 로케이션 4칸",
    cell: "{floor}층 {zone} {id}, 로트 {n}개 보관 중",
    cellEmpty: "{floor}층 {zone} {id}, 비어 있음",
    lotSoon: "2층 냉장존 A-01, 10/22 로트는 유통기한 임박",
    lotOut: "2층 냉장존 A-01, 10/22 로트를 먼저 출고",
    outbound: "1층 출고 대기 구역, 10/22 로트 도착",
  },
  zone: { A: "냉장존", F: "냉동존", B: "상온존" },
  // 범례: 색 견본 + 이름: 한 문장
  keys: [
    ["gray", "raised", "창고: 회색 건물 전체가 창고(물류센터) 하나입니다. 안이 보이도록 층을 띄워 그렸습니다."],
    ["teal", "raised", "냉동존(청록): 2층 왼쪽 구역으로, 상품을 영하로 보관합니다."],
    ["blue", "raised", "냉장존(파랑): 2층 오른쪽 구역으로, 상품을 차갑게 보관합니다."],
    ["orange", "raised", "상온존(주황): 3층 선반 구역으로, 상품을 실온에서 보관합니다."],
    ["green", "flat", "로케이션(초록): 선반 칸 하나입니다. 칸마다 깔린 초록 판이 A-01 같은 칸 하나를 나타냅니다."],
    ["gray", "raised", "로트(회색 상자): 제조일과 유통기한이 같은 상품을 한 단위로 관리하는 것입니다."],
    ["pink", "raised", "먼저 나갈 로트(분홍): 10/22에 들어온 우유입니다. 10/29에 들어온 우유보다 유통기한이 일러 먼저 출고합니다."],
    ["purple", "raised", "작업자(보라 작업복): 2층 작업자는 로트를 출고하고, 3층 작업자는 스캐너로 재고를 확인합니다."],
    ["gray", "raised", "수직 반송기: 오른쪽 앞의 승강기로, 출고할 로트를 1층 출고 대기 구역까지 내립니다."],
  ],
  caption: "로트를 나눠 두어야 유통기한이 이른 상품부터 내보낼 수 있습니다. 층 배치는 이해를 돕기 위한 예시입니다.",
};

const ANATOMY = process.env.ANATOMY_HOME || join(homedir(), ".claude/skills/anatomy");
const k = await import(pathToFileURL(join(ANATOMY, "kit/iso-kit.mjs")).href);
const G = await import(pathToFileURL(join(ANATOMY, "kit/lathe.mjs")).href);
const { kitScript } = await import(pathToFileURL(join(ANATOMY, "scripts/inline-kit.mjs")).href);

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "..", "..", "static", "diagrams");
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 600;
const HEIGHT = 700;

// ---- 세계 배치 (x: 앞뒤, +x가 앞, y: 좌우, +y가 화면 왼쪽, z: 위) ----
const PLATE = { x: -48, y: -80, w: 94, d: 170, r: 8 };
const PLATE_H = 8;
const FOOT_H = 5;
const BLD = { x: -36, y: -66, w: 70, d: 128, r: 1 }; // x -36..34, y -66..62
const SLAB_T = 4;
const F1 = 4; // 1층 바닥 윗면
const F2 = 70; // 2층 바닥 윗면
const F3 = 146; // 3층 바닥 윗면
const TOP = F3 + 44;
const CORE = { x: -36, y: 62, w: 14, d: 12, r: 0.6 };
const CORE_TOP = TOP + 4;
const SHAFT = { x0: 12, x1: 34, y0: -46, y1: -22 };
const SLABS_UP = [
  { x: -36, y: -66, w: 48, d: 128, r: 0.6 },
  { x: 12, y: -66, w: 22, d: 20, r: 0.6 },
  { x: 12, y: -22, w: 22, d: 84, r: 0.6 },
];
const FRONT = 10;
const BACK = -30;
const LOT_X = [FRONT - 4 - 16, FRONT - 4];
const OUT_DX = 24;
const CAR = { x: 14.5, y: -44, w: 17, d: 20, r: 0.6 };
const CAR_Z = F2 + 4; // 2층에서 차 윗면 = 로트 바닥
const DROP = CAR_Z - (F1 + 1.5);
const SLOT_DZ = -(14.4 + SLAB_T);

// 2층 캐비닛 두 개, 3층 랙
const CAB = {
  A: { plan: { x: BACK, y: -48, w: FRONT - BACK, d: 60, r: 1.2 }, T: 4, cols: [[-44, -19], [-17, 8]] },
  F: { plan: { x: BACK, y: 14, w: FRONT - BACK, d: 46, r: 1.2 }, T: 5, cols: [[19, 36], [38, 55]] },
};
const LV2 = [[F2 + 3, F2 + 19], [F2 + 21, F2 + 37]];
const RK = { x: BACK, y: -48, w: FRONT - BACK, d: 70 };
const POST = 3;
const RK_BOARDS = [[F3 + 2, F3 + 4], [F3 + 20, F3 + 22], [F3 + 38, F3 + 40]];
const RK_COLS = [[-45, -14], [-12, 19]];
const LV3 = [[F3 + 4, F3 + 20], [F3 + 22, F3 + 38]];

const CELLS = [
  { id: "A-01", zone: "A", col: 0, lvl: 0, lots: [[-42, -31.5, "1022"], [-30, -20.5, "1029"]] },
  { id: "A-02", zone: "A", col: 1, lvl: 0, lots: [[-14, 5]] },
  { id: "A-03", zone: "A", col: 0, lvl: 1, lots: [[-41, -22]] },
  { id: "A-04", zone: "A", col: 1, lvl: 1, lots: [] },
  { id: "F-01", zone: "F", col: 0, lvl: 0, lots: [[21, 34]] },
  { id: "F-02", zone: "F", col: 1, lvl: 0, lots: [[40, 53]] },
  { id: "F-03", zone: "F", col: 0, lvl: 1, lots: [[21, 34]] },
  { id: "F-04", zone: "F", col: 1, lvl: 1, lots: [] },
  { id: "B-01", zone: "B", col: 0, lvl: 0, lots: [[-42, -18]] },
  { id: "B-02", zone: "B", col: 1, lvl: 0, lots: [[-9, 3], [5, 16]] },
  { id: "B-03", zone: "B", col: 0, lvl: 1, lots: [[-42, -18]] },
  { id: "B-04", zone: "B", col: 1, lvl: 1, lots: [] },
];
const FLOOR_OF = { A: 2, F: 2, B: 3 };
const colsOf = (zone) => (zone === "B" ? RK_COLS : CAB[zone].cols);
const levelsOf = (zone) => (zone === "B" ? LV3 : LV2);
const cellOf = (zone, col, lvl) => CELLS.find((c) => c.zone === zone && c.col === col && c.lvl === lvl);

const P = k.fitProjection(
  [
    ...k.boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    [CORE.x, CORE.y + CORE.d, CORE_TOP],
    [CORE.x + CORE.w, CORE.y + CORE.d, CORE_TOP],
    [SHAFT.x1, SHAFT.y0, TOP + 8],
    [BLD.x, BLD.y, F3 + 40],
  ],
  WIDTH,
  HEIGHT,
  { pad: 12, azimuth: 30, elevation: 24 },
);

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (pts, style) => k.dotsSvg(pts, style);
const slab = (plan, z0, z1, steps = 3, bevel = 0.4) => k.slabOf({ r: 0.6, ...plan }, z0, z1 - z0, P, steps, bevel);
const seg = (a, b) => k.segment(a, b, P);
const TINT = (name) =>
  name === "zone-A" ? "c-blue" : name === "zone-F" ? "c-teal" : name === "zone-B" ? "c-orange" : name.startsWith("cell-") ? "c-green" : name === "lot-1022" ? "c-pink" : "";
const part = (name, html, extra = "") => `<g data-part="${name}"${TINT(name) ? ` class="${TINT(name)}"` : ""}${extra}>${html}</g>`;
const quad = (pts) => k.pathOf(pts.map(at), true);
const byDepth = (pts) => [...pts].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));

// ---- 작업대 ----
function bench() {
  const out = [`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`];
  for (const [x, y] of byDepth(k.corners(PLATE, 20))) {
    out.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 28), { tone: "lo" }));
    out.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 28), { tone: "mid" }));
  }
  out.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }));
  out.push(L(k.planOutline(k.insetPlan(PLATE, 4), 0, P), { tone: "lo" }));
  const screws = k.corners(PLATE, 9);
  out.push(L(screws.map(([x, y]) => k.ring(x, y, 2, 0, P, 16)).join(""), { tone: "lo" }));
  out.push(D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  const strip = { x: 37, y: -70, w: 5, d: 100, r: 1 };
  out.push(S(k.slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(strip.y + 4, strip.y + strip.d - 4, 4, 5, strip.x + 0.4, 0.6, [1.6, 3], P, "y");
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const label = { x: 36, y: 50, w: 7, d: 30, r: 1.2 };
  out.push(S(k.slabOf(label, 0, 0.8, P, 3), { tone: "mid", crease: "none" }));
  out.push(L(k.planOutline(k.insetPlan(label, 1.2), 0.8, P, 3), { tone: "faint" }));
  out.push(L([[38, 74, 58], [40, 74, 62]].map(([x, y0, y1]) => k.lineOnTop([x, y0], [x, y1], 0.8, P)).join(""), { tone: "lo", free: true }));
  return out.join("");
}

// ---- 건물 구조 ----
const POSTS_BACK = [[-36, -66], [-36, 59]];
const POSTS_FRONT = [[31, -66], [31, 59]];
function posts(list, z0, z1) {
  return byDepth(list).map(([x, y]) => S(slab({ x, y, w: 3, d: 3, r: 0.4 }, z0, z1, 2, 0.3), { tone: "mid" })).join("");
}
const SHAFT_BACK = [[12, -46], [12, -24]];
const SHAFT_FRONT = [[32, -46], [32, -24]];
function shaftPosts(list, z0, z1) {
  return byDepth(list)
    .map(([x, y]) => S(slab({ x, y, w: 2, d: 2, r: 0.3 }, z0, z1, 2, 0.2), { tone: "mid", inner: L(k.sideSeam({ x, y, w: 2, d: 2, r: 0.3 }, z0 + (z1 - z0) / 2, P, 2), { tone: "faint" }) }))
    .join("");
}
function upperSlab(zTop) {
  return SLABS_UP.map((p) => S(slab(p, zTop - SLAB_T, zTop, 2, 0.5), { tone: "mid" })).join("");
}
function coreSeg(z0, z1, floorTop, cap) {
  const out = [S(slab(CORE, z0, z1, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(CORE, z1 - 0.6, P, 2), { tone: "faint" }) })];
  // 층마다 엘리베이터 문 (닫힌 윤곽)
  const fx = CORE.x + CORE.w;
  const door = quad([[fx, 64.5, floorTop], [fx, 71.5, floorTop], [fx, 71.5, floorTop + 15], [fx, 64.5, floorTop + 15]]);
  out.push(L(door + seg([fx, 68, floorTop], [fx, 68, floorTop + 15]), { tone: "lo" }));
  out.push(D([at([fx, 72.8, floorTop + 8])], { size: 0.55, tone: "hi" }));
  if (cap) out.push(S(slab(k.insetPlan(CORE, -0.6), z1, z1 + 1.6, 2, 0.3), { tone: "mid" }));
  return out.join("");
}

// ---- 1층: 도크와 출고 대기 구역 ----
function floor1() {
  const out = [];
  const lanes = [26, 30].map((x) => k.lineOnTop([x, BLD.y], [x, BLD.y + BLD.d], F1, P)).join("");
  out.push(part("floor-1", S(k.slabOf(BLD, 0, F1, P, 2, 0.6), { tone: "mid" }) + L(lanes, { tone: "faint" }) + posts(POSTS_BACK, F1, F2 - SLAB_T)));
  // 도크 벽과 셔터 두 개
  const wall = { x: BLD.x, y: -66, w: 3, d: 110, r: 0.4 };
  const w = [S(slab(wall, F1, F1 + 22, 2, 0.4), { tone: "mid" })];
  for (const y0 of [-44, -18]) {
    const door = { x: wall.x + 3, y: y0, w: 0.8, d: 18, r: 0.2 };
    const slats = [];
    for (let z = F1 + 3; z < F1 + 17; z += 2.4) slats.push(seg([door.x + 0.8, y0, z], [door.x + 0.8, y0 + 18, z]));
    w.push(S(slab(door, F1, F1 + 18, 2, 0), { tone: "mid", crease: "none", inner: L(slats.join(""), { tone: "lo" }) }));
    for (const yb of [y0 - 2, y0 + 18.4]) w.push(S(slab({ x: wall.x + 3, y: yb, w: 2, d: 1.6, r: 0.3 }, F1 + 1, F1 + 5, 2, 0), { tone: "lo" }));
  }
  // 들어온 팔레트
  const pal = { x: -22, y: -14, w: 14, d: 12, r: 0.4 };
  w.push(S(slab(pal, F1, F1 + 1.6, 2, 0.2), { tone: "lo" }));
  w.push(S(slab({ x: pal.x + 1, y: pal.y + 1, w: 12, d: 10, r: 0.5 }, F1 + 1.6, F1 + 9, 3, 0.4), { tone: "mid", inner: L(k.lineOnTop([pal.x + 1.5, pal.y + 6], [pal.x + 12.5, pal.y + 6], F1 + 9, P), { tone: "faint" }) }));
  out.push(part("floor-1", w.join("")));
  // 출고 대기 구역 바닥 표시
  const zone = { x: 11, y: -50, w: 22, d: 32, r: 0.6 };
  const marks = L(k.planOutline(zone, F1, P, 2), { tone: "mid" }) + L(k.planOutline(k.insetPlan(zone, 1.4), F1, P, 2), { tone: "faint" });
  out.push(part("wait", marks + D(k.corners(zone, 1.4).map(([x, y]) => at([x, y, F1])), { size: 0.5, tone: "hi" })));
  out.push(part("shaft", shaftPosts(SHAFT_BACK, F1, F2)));
  out.push(`<g data-slot="F1"></g>`);
  out.push(part("shaft", shaftPosts(SHAFT_FRONT, F1, F2)));
  out.push(part("floor-1", posts(POSTS_FRONT, F1, F2 - SLAB_T)));
  out.push(part("core", coreSeg(0, F2 - SLAB_T, F1, false)));
  return out.join("");
}

// ---- 칸 받침판(로케이션)과 번호판 ----
function tray(cell) {
  const [y0, y1] = colsOf(cell.zone)[cell.col];
  const [z] = levelsOf(cell.zone)[cell.lvl];
  const inner = cell.zone === "B" ? POST : CAB[cell.zone].T;
  const plan = { x: BACK + inner + 1.5, y: y0 + 1.5, w: FRONT - BACK - inner - 3, d: y1 - y0 - 3, r: 1 };
  return part(`cell-${cell.id}`, S(slab(plan, z, z + 1, 3, 0.3), { tone: "mid" }) + L(k.planOutline(k.insetPlan(plan, 2), z + 1, P, 3), { tone: "faint" }));
}
function numberPlate(cell, zBottom, zTop) {
  const [y0, y1] = colsOf(cell.zone)[cell.col];
  const yc = (y0 + y1) / 2;
  const out = [S(slab({ x: FRONT, y: yc - 4, w: 0.8, d: 8, r: 0.3 }, zBottom, zTop, 2, 0), { tone: "mid", crease: "none" })];
  if (cell.id === "A-01") out.push(k.faceTextSvg(k.sideMatrix([FRONT + 0.8, yc], zBottom + 0.5, P, "right"), "A-01", { size: 1.7, tone: "hi", anchor: "middle" }));
  else out.push(D([at([FRONT + 0.8, yc - 3, (zBottom + zTop) / 2]), at([FRONT + 0.8, yc + 3, (zBottom + zTop) / 2])], { size: 0.35, tone: "lo" }));
  return part(`plate-${cell.id}`, out.join(""));
}

// 칸 입구 테두리: 평소에는 보이지 않고, 칸이 강조될 때만 굵게 켜진다
function cellFrames(zone) {
  return CELLS.filter((c) => c.zone === zone)
    .map((cell) => {
      const [y0, y1] = colsOf(zone)[cell.col];
      const [z0, z1] = levelsOf(zone)[cell.lvl];
      const d = quad([[FRONT + 0.2, y0, z0], [FRONT + 0.2, y1, z0], [FRONT + 0.2, y1, z1], [FRONT + 0.2, y0, z1]]);
      return part(`cell-${cell.id}`, L(d, { tone: "lit", className: "wh-cellframe" }));
    })
    .join("");
}

// ---- 로트 (받침 + 상자 두 개 + 꼬리표) ----
function lot(y0, y1, z, mark, zone) {
  const [x0, x1] = LOT_X;
  const h = zone === "B" ? 8 : 9;
  const out = [S(slab({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r: 0.5 }, z, z + 1.4, 2, 0.2), { tone: "lo" })];
  const mid = (x0 + x1) / 2;
  out.push(S(slab({ x: x0 + 0.6, y: y0 + 0.6, w: mid - x0 - 1, d: y1 - y0 - 1.2, r: 0.5 }, z + 1.4, z + 1.4 + h, 3, 0.5), { tone: "mid", crease: "faint" }));
  const front = { x: mid + 0.4, y: y0 + 0.6, w: x1 - mid - 1, d: y1 - y0 - 1.2, r: 0.5 };
  const tape = k.lineOnTop([front.x + 0.5, (y0 + y1) / 2], [front.x + front.w - 0.5, (y0 + y1) / 2], z + 1.4 + h, P);
  out.push(S(slab(front, z + 1.4, z + 1.4 + h, 3, 0.5), { tone: "mid", crease: "faint", inner: L(tape, { tone: "faint" }) }));
  const fx = front.x + front.w;
  const yc = (y0 + y1) / 2;
  const tz0 = z + 1.4 + h * 0.3, tz1 = z + 1.4 + h * 0.7;
  const notches = mark === "1029" ? [yc - 1, yc + 1] : [yc];
  const grooves = notches.map((y) => seg([fx + 0.6, y, tz0], [fx + 0.6, y, tz1])).join("");
  out.push(S(slab({ x: fx, y: yc - 2.6, w: 0.6, d: 5.2, r: 0.2 }, tz0, tz1, 2, 0), { tone: "mid", crease: "none", inner: L(grooves, { tone: "lo" }) }));
  return out.join("");
}

// ---- 2층 캐비닛 (냉장 A, 냉동 F) ----
function cabinet(zone, mover) {
  const c = CAB[zone];
  const { plan, T } = c;
  const y0 = plan.y, y1 = plan.y + plan.d;
  const Z = (html) => part(`zone-${zone}`, html);
  const out = [];
  out.push(Z(S(slab(plan, F2, F2 + 3, 4, 0.6), { tone: "mid" })));
  out.push(Z(S(slab({ x: BACK, y: y0 + T, w: T, d: plan.d - 2 * T }, F2 + 3, F2 + 37), { tone: "mid" })));
  out.push(Z(S(slab({ x: BACK, y: y0, w: plan.w, d: T }, F2 + 3, F2 + 37), { tone: "mid" })));
  out.push(Z(S(slab({ x: FRONT, y: y0 + 0.5, w: 1.6, d: 2.6, r: 0.3 }, F2 + 3, F2 + 37, 2, 0), { tone: "mid" })));
  LV2.forEach(([z0], lvl) => {
    if (lvl === 1) out.push(Z(S(slab({ x: BACK + T, y: y0 + T, w: FRONT - BACK - T, d: plan.d - 2 * T, r: 0.3 }, F2 + 19, F2 + 21, 2, 0.4), { tone: "mid" })));
    const zp = lvl === 0 ? [F2 + 0.4, F2 + 2.6] : [F2 + 19.3, F2 + 20.7];
    for (const col of [0, 1]) out.push(numberPlate(cellOf(zone, col, lvl), zp[0], zp[1]));
    for (const col of [0, 1]) {
      const cell = cellOf(zone, col, lvl);
      out.push(tray(cell));
      for (const [ya, yb, mark] of cell.lots) {
        const html = lot(ya, yb, z0 + 1, mark, zone);
        out.push(mark === "1022" ? mover(html) : part(`lot-${cell.id}`, html));
      }
      if (col === 0) {
        const dy = c.cols[0][1];
        out.push(Z(S(slab({ x: BACK + T, y: dy, w: FRONT - BACK - T, d: 2, r: 0.3 }, z0, lvl === 0 ? F2 + 19 : F2 + 37, 2, 0.3), { tone: "mid" })));
      }
    }
  });
  const near = { x: BACK, y: y1 - T, w: plan.w, d: T };
  const joints = [BACK + plan.w / 3, BACK + (plan.w * 2) / 3].map((x) => seg([x, y1, F2 + 3], [x, y1, F2 + 37])).join("");
  out.push(Z(S(slab(near, F2 + 3, F2 + 37), { tone: "mid", inner: L(joints, { tone: "faint" }) })));
  out.push(Z(S(slab({ x: FRONT, y: y1 - 3.1, w: 1.6, d: 2.6, r: 0.3 }, F2 + 3, F2 + 37, 2, 0), { tone: "mid" })));
  const roofZ = F2 + 40;
  const roof = [S(slab(plan, F2 + 37, roofZ, 4, 0.6), { tone: "mid", inner: L(k.planOutline(k.insetPlan(plan, 2.5), roofZ, P, 4), { tone: "faint" }) })];
  if (zone === "F") roof.push(D(k.dotGrid(BACK + 6, y0 + 5, 7, 4, 4.4, roofZ, P).slice(0, 28), { size: 0.4, tone: "lo" }));
  // 냉각기(냉동기) 유닛
  const unit = zone === "A" ? { x: BACK + 2, y: -40, w: 18, d: 24, r: 1.5 } : { x: BACK + 2, y: 30, w: 22, d: 26, r: 1.5 };
  const uz1 = roofZ + (zone === "A" ? 7 : 9);
  const fins = [];
  for (let y = unit.y + 2.5; y <= unit.y + unit.d - 2.5; y += 2) fins.push(seg([unit.x + unit.w, y, roofZ], [unit.x + unit.w, y, uz1]));
  roof.push(S(slab(unit, roofZ, uz1, 3, 0.6), { tone: "mid", inner: L(fins.join(""), { tone: "lo" }) }));
  const fans = zone === "A" ? [[unit.x + 9, unit.y + 12]] : [[unit.x + 11, unit.y + 7], [unit.x + 11, unit.y + 19]];
  for (const fan of fans) {
    const r = zone === "A" ? 5 : 4.6;
    // 둥근 팬 슈라우드 위에 가드
    roof.push(S(k.cylinder(fan[0], fan[1], r + 0.8, uz1, 1, P, 48, 0.3), { tone: "mid" }));
    const fz = uz1 + 1;
    const spokes = Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      return k.lineOnTop([fan[0] + Math.cos(a) * 1.4, fan[1] + Math.sin(a) * 1.4], [fan[0] + Math.cos(a) * r, fan[1] + Math.sin(a) * r], fz, P);
    }).join("");
    roof.push(L(k.ring(fan[0], fan[1], r, fz, P, 44), { tone: "lo" }), L(k.ring(fan[0], fan[1], 1.4, fz, P, 20), { tone: "mid" }), L(spokes, { tone: "faint" }));
    roof.push(D([at([fan[0], fan[1], fz])], { size: 0.45, tone: "hi" }));
  }
  // 온도계 다이얼 (냉동존은 바늘이 거의 끝까지 내려감)
  const dial = zone === "A" ? [FRONT - 7, 0] : [FRONT - 7, 22];
  const dz = roofZ + 3;
  roof.push(S(k.cylinder(dial[0], dial[1], 5.6, roofZ, 1, P, 36), { tone: "lo" }));
  roof.push(`<g class="wh-dial">${S(k.cylinder(dial[0], dial[1], 4.8, roofZ + 1, 2, P, 40, 0.3), { tone: "hi", crease: "lo" })}`);
  const ticks = k.radialTicks(dial[0], dial[1], 3.9, 20, 4, dz, [0.7, 1.4], P, -Math.PI * 0.75, Math.PI * 1.5);
  roof.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  const na = zone === "A" ? -Math.PI * 0.45 : -Math.PI * 0.72;
  roof.push(L(k.lineOnTop([dial[0] - Math.sin(na) * 0.9, dial[1] + Math.cos(na) * 0.9], [dial[0] + Math.sin(na) * 3.4, dial[1] - Math.cos(na) * 3.4], dz, P), { tone: "hi", free: true }));
  roof.push(D([at([dial[0], dial[1], dz])], { size: 0.5, tone: "hi" }), `</g>`);
  out.push(Z(roof.join("")));
  return out.join("");
}

// ---- 3층 선반 랙 ----
function rack() {
  const out = [];
  const Z = (html) => part("zone-B", html);
  const postsAt = (y) =>
    [BACK, FRONT - POST]
      .map((x) => S(slab({ x, y, w: POST, d: POST, r: 0.4 }, F3, F3 + 42, 2, 0.3), { tone: "mid" }) + D([F3 + 14, F3 + 30].map((z) => at([x + POST, y + POST / 2, z])), { size: 0.4 }))
      .join("");
  out.push(Z(postsAt(RK.y)));
  out.push(Z(S(slab({ x: BACK, y: -15.5, w: POST, d: POST }, F3, F3 + 42, 2, 0.3), { tone: "mid" })));
  RK_BOARDS.forEach(([z0, z1], index) => {
    const board = { x: BACK, y: RK.y + POST, w: FRONT - BACK, d: RK.d - POST * 2, r: 0.4 };
    out.push(Z(S(slab(board, z0, z1, 2, 0.4), { tone: "mid", inner: L(k.sideSeam(board, z0 + 1, P, 2), { tone: "faint" }) })));
    if (index >= LV3.length) return;
    for (const col of [0, 1]) out.push(numberPlate(cellOf("B", col, index), z0 + 0.3, z1 - 0.3));
    for (const col of [0, 1]) {
      const cell = cellOf("B", col, index);
      out.push(tray(cell));
      for (const [ya, yb, mark] of cell.lots) out.push(part(`lot-${cell.id}`, lot(ya, yb, z1 + 1, mark, "B")));
    }
  });
  out.push(Z(postsAt(RK.y + RK.d - POST)));
  const yb = RK.y + RK.d;
  const brace = seg([BACK + POST, yb, F3 + 24], [FRONT - POST, yb, F3 + 36]) + seg([BACK + POST, yb, F3 + 36], [FRONT - POST, yb, F3 + 24]);
  out.push(Z(L(brace, { tone: "lo" }) + D([F3 + 24, F3 + 36].flatMap((z) => [at([BACK + POST, yb, z]), at([FRONT - POST, yb, z])]), { size: 0.45, tone: "mid" })));
  return out.join("");
}

// ---- 작업자 (마네킹형, -y 쪽을 바라봄) ----
const WA = { id: "A", cx: 22, cy: -16, base: F2, tint: "c-purple", rest: 6.1, reach: 14.1 };
const WB = { id: "B", cx: 22, cy: -4, base: F3, tint: "c-purple", rest: 6.1, scanner: true };
const ARM = { w: 1.6, z0: 12.6, z1: 14.4 };
const armPlan = (w, len) => ({ x: w.cx + 3.8, y: w.cy + 1 - len, w: ARM.w, d: len, r: 0.5 });
function worker(w) {
  const { cx, cy, base: B } = w;
  const out = [`<path class="iso-halo" d="${k.haloOf({ x: cx - 4.4, y: cy - 3, w: 8.8, d: 6, r: 2.6 }, B, 0.1, P)}" style="filter:blur(3px)"/>`];
  for (const lx of [cx - 3.1, cx + 0.5]) {
    out.push(S(slab({ x: lx, y: cy - 2.6, w: 2.6, d: 4, r: 0.9 }, B, B + 1.2, 3, 0.2), { tone: "lo" }));
    out.push(S(slab({ x: lx, y: cy - 1.3, w: 2.6, d: 2.6, r: 1 }, B + 1.2, B + 12, 3, 0.2), { tone: "mid" }));
  }
  out.push(S(slab({ x: cx - 3.4, y: cy - 1.6, w: 6.8, d: 3.2, r: 1.1 }, B + 11, B + 13.5, 3, 0.2), { tone: "mid" }));
  out.push(S(slab({ x: cx - 5.4, y: cy - 0.9, w: ARM.w, d: 1.8, r: 0.6 }, B + 13, B + 21.5, 3, 0.2), { tone: "mid" }));
  const vest = { x: cx - 3.8, y: cy - 2.1, w: 7.6, d: 4.2, r: 1.5 };
  const stripes = [B + 16, B + 17.6].map((z) => k.sideSeam(vest, z, P, 4)).join("");
  const tinted = [S(slab(vest, B + 13, B + 22, 4, 0.4), { tone: "mid", inner: L(stripes, { tone: "hi" }) })];
  tinted.push(S(k.cylinder(cx, cy, 1.1, B + 22, 1.4, P, 20), { tone: "mid", crease: "none" }));
  out.push(`<g class="${w.tint}">${tinted.join("")}</g>`);
  const head = [S(G.sphereOf([cx, cy, B + 25.4], 2.2, P), { tone: "mid" })];
  const hat = [[0, 3.1], [0.4, 3.1], [0.4, 2.5, 1], [0.9, 2.4, 1], [1.5, 2.1, 1], [1.9, 1.5, 1], [2.2, 0.8, 1], [2.4, 0, 1]];
  head.push(`<g class="wh-hat">${S(G.solidOf(hat, G.frameAlong([cx, cy, B + 26], [0, 0, 1]), P), { tone: "mid" })}</g>`);
  out.push(head.join(""));
  out.push(S(slab({ x: cx + 3.8, y: cy - 0.9, w: ARM.w, d: 1.8, r: 0.6 }, B + ARM.z0, B + 21.5, 3, 0.2), { tone: "mid" }));
  if (w.scanner) {
    const y1 = cy + 1 - w.rest;
    const fore = S(slab(armPlan(w, w.rest), B + ARM.z0 + 1.6, B + ARM.z1 + 1.6, 3, 0.2), { tone: "mid" });
    const sc = { x: cx + 3.4, y: y1 - 1, w: 2.4, d: 3.4, r: 0.5 };
    const lens = k.lineOnTop([sc.x + 0.5, y1 - 0.2], [sc.x + sc.w - 0.5, y1 - 0.2], B + ARM.z1 + 3.2, P);
    const scanner = S(slab(sc, B + ARM.z1 + 1.6, B + ARM.z1 + 3.2, 3, 0.2), { tone: "hi", inner: L(lens, { tone: "lo" }) });
    out.push(`<g data-scanner>${fore}${scanner}${D([at([sc.x + sc.w / 2, y1 + 1.4, B + ARM.z1 + 3.2])], { size: 0.45, tone: "hi" })}</g>`);
  } else {
    out.push(`<g data-arm="${w.id}">${S(slab(armPlan(w, w.rest), B + ARM.z0, B + ARM.z1, 3, 0.2), { tone: "mid" })}</g>`);
  }
  return part(`worker-${w.id}`, out.join(""));
}

// ---- 수직 반송기 차체 + 10/22 로트 (층 사이를 오가며 그리는 위치가 바뀜) ----
function moverOf(lotHtml) {
  const carHtml = S(slab(CAR, CAR_Z - 1.5, CAR_Z, 3, 0.3), { tone: "mid", inner: L(k.planOutline(k.insetPlan(CAR, 1.6), CAR_Z, P, 3), { tone: "faint" }) });
  return `<g data-mover><g data-part="car" data-car>${carHtml}</g>${part("lot-1022", lotHtml, " data-move")}</g>`;
}

function floor2() {
  const out = [part("floor-2", upperSlab(F2) + posts(POSTS_BACK, F2, F3 - SLAB_T))];
  out.push(part("shaft", shaftPosts(SHAFT_BACK, F2, F3)));
  out.push(cabinet("A", (html) => `<g data-slot="F2">${moverOf(html)}</g>`), cellFrames("A"));
  out.push(cabinet("F", () => ""), cellFrames("F"));
  out.push(worker(WA));
  out.push(part("shaft", shaftPosts(SHAFT_FRONT, F2, F3)));
  out.push(part("floor-2", posts(POSTS_FRONT, F2, F3 - SLAB_T)));
  out.push(part("core", coreSeg(F2 - SLAB_T, F3 - SLAB_T, F2, false)));
  return out.join("");
}
function floor3() {
  const out = [part("floor-3", upperSlab(F3))];
  out.push(part("shaft", shaftPosts(SHAFT_BACK, F3, TOP)));
  out.push(rack(), cellFrames("B"));
  out.push(worker(WB));
  out.push(part("shaft", shaftPosts(SHAFT_FRONT, F3, TOP)));
  const beams = [SHAFT.y0, SHAFT.y1 - 2].map((y) => S(slab({ x: SHAFT.x0, y, w: SHAFT.x1 - SHAFT.x0, d: 2, r: 0.3 }, TOP, TOP + 2, 2, 0.2), { tone: "mid" })).join("");
  const motor = { x: 17, y: -40, w: 12, d: 12, r: 1 };
  const ribs = [];
  for (let y = motor.y + 2; y <= motor.y + motor.d - 2; y += 2) ribs.push(seg([motor.x + motor.w, y, TOP + 2], [motor.x + motor.w, y, TOP + 8]));
  out.push(part("shaft", beams + S(slab(motor, TOP + 2, TOP + 8, 3, 0.5), { tone: "mid", inner: L(ribs.join(""), { tone: "lo" }) })));
  out.push(part("core", coreSeg(F3 - SLAB_T, CORE_TOP, F3, true)));
  return out.join("");
}

// ---- 포인터 영역 ----
function hits() {
  return CELLS.map((cell) => {
    const [y0, y1] = colsOf(cell.zone)[cell.col];
    const [z0, z1] = levelsOf(cell.zone)[cell.lvl];
    return `<path class="wh-hit" data-cell="${cell.id}" d="${quad([[FRONT, y0 - 1, z0 - 2], [FRONT, y1 + 1, z0 - 2], [FRONT, y1 + 1, z1], [FRONT, y0 - 1, z1]])}"/>`;
  }).join("");
}

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  label: TEXT.svgLabel,
  body: [part("bench", bench()), floor1(), floor2(), floor3(), `<g class="wh-hits">${hits()}</g>`],
});

// ---- 동작 ----
const CELL_INFO = Object.fromEntries(CELLS.map((c) => [c.id, { zone: TEXT.zone[c.zone], floor: FLOOR_OF[c.zone], lots: c.lots.length }]));
const ORDER = ["B-04", "B-03", "B-02", "B-01", "F-04", "F-03", "F-02", "F-01", "A-04", "A-03", "A-02", "A-01"];
const live = `
const P = ${JSON.stringify(P)};
const T = ${JSON.stringify(TEXT.readout)};
const OUT_DX = ${OUT_DX}, DROP = ${DROP}, SLOT_DZ = ${SLOT_DZ};
const CELLS = ${JSON.stringify(CELL_INFO)};
const ORDER = ${JSON.stringify(ORDER)};
const WA = ${JSON.stringify(WA)}, ARM = ${JSON.stringify(ARM)};
const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const mover = svg.querySelector("[data-mover]");
const lotEl = mover.querySelector("[data-move]");
const carEl = mover.querySelector("[data-car]");
const slots = { F1: svg.querySelector('[data-slot="F1"]'), F2: svg.querySelector('[data-slot="F2"]') };
const armA = svg.querySelector('[data-arm="A"]');
const scannerB = svg.querySelector("[data-scanner]");
const still = matchMedia("(prefers-reduced-motion: reduce)");
const GROUPS = [...svg.querySelectorAll("g[data-part]")];
const FLOOR = { A: 2, F: 2, B: 3 };
function stateOf(n, f) {
  if (f === "warehouse") return /^(floor-|core|shaft)/.test(n) ? "on" : n === "bench" ? "dim" : "";
  if (f.startsWith("zone-")) {
    const z = f.slice(5);
    if (n === f || n === "worker-" + z) return "on";
    if (n.startsWith("cell-" + z) || n.startsWith("lot-" + z) || n.startsWith("plate-" + z) || n === "floor-" + FLOOR[z]) return "";
    if (z === "A" && (n === "lot-1022" || n === "car")) return "";
    return "dim";
  }
  if (f.startsWith("cell-")) {
    const id = f.slice(5), z = id[0];
    if (n === f || n === "plate-" + id) return "on";
    if (n === "lot-" + id || n === "plate-" + id || n === "floor-" + FLOOR[z]) return "";
    if (id === "A-01" && (n === "lot-1022" || n === "car")) return "";
    return "dim";
  }
  if (f === "lot-1022") {
    if (n === f || n === "worker-A" || n === "car") return "on";
    if (n === "floor-2" || n === "shaft" || /A-01$/.test(n)) return "";
    return "dim";
  }
  if (f === "outbound") {
    if (n === "lot-1022" || n === "car" || n === "wait") return "on";
    if (n === "floor-1" || n === "shaft") return "";
    return "dim";
  }
  return "";
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
const TOUR = [
  [2.8, "warehouse", T.warehouse, 0],
  [1.8, "zone-F", T.zoneF, 0],
  [1.8, "zone-B", T.zoneB, 0],
  [2.4, "zone-A", T.zoneA, 0],
  [2.6, "cell-A-01", cellText("A-01"), 0],
  [2.2, "lot-1022", T.lotSoon, 0],
  [2.8, "lot-1022", T.lotOut, 1],
  [3.6, "outbound", T.outbound, 2],
];
const CYCLE = TOUR.reduce((s, t) => s + t[0], 0);
function tourAt(t) {
  let u = t % CYCLE;
  for (const step of TOUR) { if (u < step[0]) return step; u -= step[0]; }
  return TOUR[0];
}
let pos = 0, posTarget = 0, frame = 0, last = 0, clock = 0, bob = 0, touring = !still.matches, visible = false;
let idleTimer = 0, holdTimer = 0, picked = null, text = TOUR[0][2], armNow = -1;
function show(name, words, target) { focus(name); posTarget = target; text = words; }
function drawArm(r) {
  const len = WA.rest + (WA.reach - WA.rest) * r;
  if (Math.abs(len - armNow) < 0.02) return;
  armNow = len;
  armA.innerHTML = solidSvg(slabOf({ x: WA.cx + 3.8, y: WA.cy + 1 - len, w: ARM.w, d: len, r: 0.5 }, WA.base + ARM.z0, ARM.z1 - ARM.z0, P, 3, 0.2), { tone: "mid" });
}
function draw() {
  const dx = Math.min(pos, 1) * OUT_DX, dz = -Math.max(pos - 1, 0) * DROP;
  lotEl.setAttribute("transform", translateAlong(P, [dx, 0, dz]));
  carEl.setAttribute("transform", translateAlong(P, [0, 0, dz]));
  const slot = dz < SLOT_DZ ? slots.F1 : slots.F2;
  if (mover.parentNode !== slot) slot.appendChild(mover);
  drawArm(Math.min(Math.max(pos, 0), 1) - Math.min(Math.max(pos - 1, 0), 1));
  scannerB.setAttribute("transform", translateAlong(P, [0, 0, still.matches ? 0 : 0.5 * Math.sin(bob)]));
  if (readout.textContent !== text) readout.textContent = text;
  stage.setAttribute("aria-valuetext", text);
}
function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  bob += dt * 1.6;
  if (touring) { clock += dt; const s = tourAt(clock); show(s[1], s[2], s[3]); }
  pos = still.matches ? posTarget : pos + (posTarget - pos) * (1 - Math.exp(-dt / 0.45));
  if (Math.abs(posTarget - pos) < 0.002) pos = posTarget;
  draw();
  const settled = !touring && pos === posTarget;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}
const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
function resumeLater() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { picked = null; touring = !still.matches; clock = 0; run(); }, 3600);
}
function pick(id) {
  touring = false;
  clearTimeout(idleTimer);
  clearTimeout(holdTimer);
  if (picked !== id) {
    picked = id;
    show("cell-" + id, cellText(id), 0);
    if (id === "A-01") holdTimer = setTimeout(() => { if (picked === "A-01") { show("lot-1022", T.lotOut, 1); run(); } }, 1100);
  }
  draw();
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
if (still.matches) show("cell-A-01", cellText("A-01"), 0);
else show(TOUR[0][1], TOUR[0][2], 0);
draw();
`;

// ---- 색 토큰 ----
// [paper, top, shades 0..3 (어두운 쪽부터), hi(면 위 밝은 표시), mid(테두리), lo(면 위 결), faint(면 위 이음선), lit, glow]
const COLOR = {
  blue: {
    light: ["#A2BEF0", "#B4C9F2", ["#6F95E3", "#7FA3EA", "#8CADEC", "#99B7EE"], "#26508F", "#4C7FE0", "#4C7FE0", "#8FB0EC", "#4C7FE0", "rgba(76,127,224,.6)"],
    dark: ["#2F4F8E", "#3E62A6", ["#22396A", "#29447C", "#30508D", "#375A9C"], "#FFFFFF", "#A9C4F7", "#8EADEE", "#5D7FC4", "#C7DAFF", "#7FA6FF"],
  },
  teal: {
    light: ["#86D2DC", "#9FDBE3", ["#4AB6C5", "#5BBFCD", "#6CC6D2", "#7DCDD8"], "#0F5E6B", "#1E9AAE", "#1E9AAE", "#6FC7D3", "#1E9AAE", "rgba(30,154,174,.6)"],
    dark: ["#1E6B76", "#2A8290", ["#164C54", "#1A5862", "#1E6570", "#22717D"], "#FFFFFF", "#A3E4EC", "#7FD3DE", "#45A3B1", "#BFF4FB", "#6FD3E0"],
  },
  orange: {
    light: ["#F6CC74", "#F8D58C", ["#F0AC2A", "#F2B640", "#F4BF56", "#F5C76A"], "#8A5F00", "#E89400", "#E89400", "#F0BB55", "#E89400", "rgba(232,148,0,.6)"],
    dark: ["#8F6518", "#A87A24", ["#5F430F", "#6E4E12", "#7D5915", "#8C6418"], "#FFFFFF", "#F7D69A", "#ECC071", "#B98A30", "#FFE6B0", "#FFC24D"],
  },
  green: {
    light: ["#95CE9E", "#A9D9B0", ["#63B270", "#74BE80", "#82C58D", "#90CC99"], "#2E6B2E", "#3E9B4F", "#3E9B4F", "#86C690", "#3E9B4F", "rgba(62,155,79,.6)"],
    dark: ["#2A6E3A", "#39854A", ["#1B4A26", "#20562C", "#256233", "#2A6E39"], "#FFFFFF", "#B8E8C1", "#92D59F", "#4E9E5E", "#CDF5D5", "#8FCF8F"],
  },
  purple: {
    light: ["#5F0080", "#8A3DA8", ["#47005F", "#53006F", "#5F0080", "#6C1A8E"], "#FFFFFF", "#3A004D", "#D9B8E6", "#B07CC6", "#3A004D", "rgba(95,0,128,.55)"],
    dark: ["#7A2E9E", "#9B4DBF", ["#4E1068", "#5C1A79", "#6A248A", "#78309B"], "#FFFFFF", "#E3C6F0", "#CDA2E0", "#A060C0", "#F0DDF8", "#B070D8"],
  },
  pink: {
    light: ["#EEA6BE", "#F2B8CB", ["#DE7698", "#E487A6", "#E894B0", "#EBA1BA"], "#9E3A57", "#D04F78", "#D04F78", "#E893AF", "#D04F78", "rgba(208,79,120,.65)"],
    dark: ["#8A3A5A", "#A24C6E", ["#5C2840", "#6A2E4A", "#783454", "#863A5E"], "#FFFFFF", "#F9C3D6", "#F09CBA", "#B85A80", "#FFD6E3", "#FF9DB8"],
  },
};
// 비활성: 원래 색을 채도 30% 안팎만 남긴 옅은 톤
const DIM_COLOR = {
  blue: {
    light: ["#DEE3EC", "#E8ECF3", ["#D3DAE6", "#D9DFE9", "#DEE3EC", "#E3E8EF"], "#9AA5BC", "#AEB8CB", "#BEC6D5", "#D2D8E3", "#AEB8CB"],
    dark: ["#1E2840", "#243050", ["#172036", "#1A243B", "#1D2840", "#202C46"], "#8094BE", "#5A6E99", "#46587E", "#34425F", "#5A6E99"],
  },
  teal: {
    light: ["#D9E8EA", "#E5F0F2", ["#CCDFE2", "#D3E3E6", "#D9E8EA", "#DFECEE"], "#8FAEB4", "#A3BEC3", "#B6CCD0", "#CCDCDF", "#A3BEC3"],
    dark: ["#1B2F33", "#20383D", ["#152529", "#17292D", "#1A2D31", "#1D3135"], "#7FA9B0", "#557F86", "#43656B", "#324B50", "#557F86"],
  },
  orange: {
    light: ["#EDE3CE", "#F5EEE0", ["#E6D8BC", "#EADDC5", "#EDE3CE", "#F0E8D7"], "#B5A27A", "#C6B48F", "#D3C5A6", "#E3D8C2", "#C6B48F"],
    dark: ["#33291A", "#3C311F", ["#282014", "#2C2316", "#302619", "#342A1C"], "#B39C74", "#8C7550", "#705E40", "#514430", "#8C7550"],
  },
  green: {
    light: ["#DDE7DE", "#E8EFE9", ["#D1DED3", "#D7E3D9", "#DDE7DE", "#E2EBE3"], "#97AD9B", "#ABBEAE", "#BDCCBF", "#D1DCD3", "#ABBEAE"],
    dark: ["#1E2E22", "#243628", ["#17241A", "#1A281D", "#1D2C20", "#203023"], "#84A88A", "#5A7E61", "#47644D", "#35493A", "#5A7E61"],
  },
  purple: {
    light: ["#E4D9E8", "#EEE6F1", ["#D6C6DC", "#DCCDE1", "#E0D4E5", "#E6DCEA"], "#FFFFFF", "#B8A2C1", "#C9B8D0", "#DACCE0", "#B8A2C1"],
    dark: ["#2A1E30", "#322438", ["#21172A", "#251A2D", "#291D31", "#2D2035"], "#9A80A8", "#6E5A7A", "#574763", "#41364A", "#6E5A7A"],
  },
  pink: {
    light: ["#EBDDE1", "#F4EAED", ["#E3D1D7", "#E7D7DC", "#EBDDE1", "#EFE3E7"], "#B095A0", "#C3A9B2", "#D1BCC3", "#E1D2D7", "#C3A9B2"],
    dark: ["#34202A", "#3D2531", ["#29181F", "#2D1B23", "#311E27", "#35212B"], "#B78C9B", "#8E6474", "#71505C", "#523B44", "#8E6474"],
  },
};
const GRAY_ON = {
  light: ["#E2E2DF", "#EEEEEC", ["#B6B6B3", "#C3C3C0", "#CFCFCC", "#D9D9D6"], "#111113", "#2E2E32", "#626268", "#94949A", "#2E2E32", "rgba(0,0,0,.4)"],
  dark: ["#252525", "#2E2E2E", ["#1A1A1A", "#1F1F1F", "#242424", "#2A2A2A"], "#FFFFFF", "#D4D4D4", "#A0A0A0", "#707070", "#FFFFFF", "rgba(255,255,255,.8)"],
};
const DIM = {
  light: ["#E9E9E6", "#F2F2F0", ["#DCDCD9", "#E2E2DF", "#E7E7E4", "#ECECE9"], "#9A9A9E", "#A8A8AC", "#BDBDC1", "#D3D3D6", "#A8A8AC"],
  dark: ["#1E1E1E", "#232323", ["#191919", "#1B1B1B", "#1D1D1D", "#202020"], "#666666", "#555555", "#444444", "#333333", "#555555"],
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
  css.push(`${T} .iso-key.k-gray .iso-swatch path{stroke:${GRAY_ON[th][4]};fill:${GRAY_ON[th][2][1]}}`);
  // 진한 면 위 다이얼은 밝은 회색 판으로 둔다
  css.push(`${T} .wh-dial{--anatomy-paper:${th === "light" ? "#F4F4F2" : "#2A2A2A"};--anatomy-face:var(--anatomy-paper);--anatomy-top:${th === "light" ? "#FFFFFF" : "#333333"};--anatomy-hi:${th === "light" ? "#26262A" : "#F0F0F0"};--anatomy-mid:${th === "light" ? "#55555A" : "#B0B0B0"};--anatomy-lo:${th === "light" ? "#8A8A8F" : "#808080"}}`);
  css.push(`${T} .wh-hat{--anatomy-paper:#F2F2F0;--anatomy-face:#F2F2F0;--anatomy-top:#FFFFFF;--anatomy-shade-0:#C8C8C6;--anatomy-shade-1:#D4D4D2;--anatomy-shade-2:#E0E0DE;--anatomy-shade-3:#EAEAE8;--anatomy-mid:${th === "light" ? "#6A6A70" : "#FFFFFF"};--anatomy-lo:#9A9AA0;--anatomy-faint:#B8B8BC;--anatomy-lit:${th === "light" ? "#3A004D" : "#FFFFFF"};--anatomy-lit-top:#FFFFFF;--anatomy-lit-shade:#E0E0DE}`);
  css.push(`${T} g[data-state="dim"],${T} g[data-state="dim"] [class^="c-"],${T} g[data-state="dim"] .wh-dial,${T} g[data-state="dim"] .wh-hat{${tok(DIM[th])}}`);
  for (const [name, set] of Object.entries(DIM_COLOR)) css.push(`${T} g.c-${name}[data-state="dim"],${T} g[data-state="dim"] .c-${name}{${tok(set[th])}}`);
}
const FX_CSS = `
${css.join("\n")}
g[data-state="on"] .iso-edge{stroke-width:2.6px}
g[data-state="on"] .wh-dial .iso-edge{stroke-width:1px}
.wh-cellframe{stroke-opacity:0}
g[data-state="on"] .wh-cellframe{stroke-opacity:1;stroke-width:2.6px}
g[data-state="on"]{filter:drop-shadow(0 0 3.5px var(--glow,rgba(0,0,0,.45)));animation:wh-pulse .6s ease-out 1}
@keyframes wh-pulse{0%{filter:drop-shadow(0 0 0 var(--glow,rgba(0,0,0,.45)))}40%{filter:drop-shadow(0 0 9px var(--glow,rgba(0,0,0,.45)))}100%{filter:drop-shadow(0 0 3.5px var(--glow,rgba(0,0,0,.45)))}}
.iso-svg .iso-fill,.iso-svg .iso-shade,.iso-svg .iso-top,.iso-svg .iso-dots circle,.iso-svg .iso-face-text{transition:fill .5s ease}
.iso-svg .iso-line,.iso-svg .iso-wire-end{transition:stroke .5s ease,stroke-width .5s ease}
@media (prefers-reduced-motion:reduce){.iso-svg *{transition:none!important;animation:none!important}}
.iso-swatch path{stroke-width:1.4}
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

const page = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${TEXT.pageTitle}</title><style>${k.ISO_CSS}${PAGE_CSS}</style></head><body class="iso" data-theme="${theme}"><main class="iso-page">${body}</main><script type="module">${(kitScript() + live).replace(/<\/(script)/gi, "<\\/$1")}</script></body></html>`;

mkdirSync(OUT_DIR, { recursive: true });
const name = theme === "light" ? "scm-warehouse-light.html" : "scm-warehouse.html";
writeFileSync(join(OUT_DIR, name), page);
console.log("wrote", join("static/diagrams", name));
