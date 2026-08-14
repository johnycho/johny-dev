import React, {useEffect, useRef} from 'react';

// 블로그용 경량 애니메이션 canvas 차트 (의존성 없음, 직접 구현)
// - AnimatedLineChart: 선이 왼→오로 부드럽게 그려지며 반복
// - AnimatedBars: 막대가 목표치까지 자라며 반복
// 레이아웃: 제목(1행) → 범례(2행, 있으면) → 플롯 → x축 라벨. y축 라벨은 좌측 세로 회전.
// SSR 안전: 그리기는 클라이언트 useEffect에서만. 색은 테마(라이트/다크)에 맞춰 매 프레임 산출.

type Tone = 'accent' | 'accent2' | 'good' | 'bad';
type Common = {title?: string; height?: number; unit?: string; xLabel?: string; yLabel?: string};

type Pal = {
  text: string;
  muted: string;
  grid: string;
  accent: string;
  accent2: string;
  good: string;
  bad: string;
  trend: string;
};

function palette(): Pal {
  const light =
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';
  return light
    ? {
        text: '#2b3440',
        muted: '#5a6472',
        grid: 'rgba(80,90,100,0.14)',
        accent: '#1596b3',
        accent2: '#c07d3a',
        good: '#2f9e57',
        bad: '#cf5a55',
        trend: 'rgba(196,90,86,0.85)',
      }
    : {
        text: '#c9d1d9',
        muted: '#8a9199',
        grid: 'rgba(128,135,145,0.16)',
        accent: '#5bbccf',
        accent2: '#dda36a',
        good: '#5cc389',
        bad: '#e0757e',
        trend: 'rgba(224,150,150,0.8)',
      };
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void, height: number) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let start = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const cssW = canvas.clientWidth || 600;
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const frame = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      const w = canvas.clientWidth || 600;
      ctx.clearRect(0, 0, w, height);
      draw(ctx, w, height, t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [draw, height]);
  return canvasRef;
}

const PAD_L = 44; // y축 세로 라벨 + 눈금 숫자 공간
const PAD_R = 14;
const CYCLE = 3.4;
const FONT = '11px system-ui, sans-serif';

function progress(t: number) {
  const draw = CYCLE - 0.9;
  let p = (t % CYCLE) / draw;
  p = Math.max(0, Math.min(1, p));
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

// 공통 프레임: 제목·범례·격자·축 라벨을 그리고 플롯 영역 경계를 돌려준다.
function frame(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pal: Pal,
  opts: {
    title?: string;
    yMax: number;
    yAxis?: string;
    xLabel?: string;
    legend?: [string, string];
    legendColors?: [string, string];
    xTicks?: boolean;
  },
) {
  const x0 = PAD_L;
  const x1 = w - PAD_R;
  const hasLegend = Array.isArray(opts.legend);
  const y1 = 30; // 플롯 상단(제목 + y축 라벨 공간)
  const botTicks = opts.xTicks ? 15 : 0; // x 눈금 라벨
  const botX = opts.xLabel ? 22 : 0; // x축 제목(축에서 넉넉히 띄움)
  const botLegend = hasLegend ? 16 : 0; // 범례
  const y0 = h - 6 - botTicks - botX - botLegend; // 플롯 하단

  // 제목
  if (opts.title) {
    ctx.textAlign = 'left';
    ctx.fillStyle = pal.text;
    ctx.font = '600 12px system-ui, sans-serif';
    ctx.fillText(opts.title, x0, 14);
  }

  // 격자 + y 눈금 숫자
  ctx.strokeStyle = pal.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = pal.muted;
  ctx.font = FONT;
  ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const yy = y0 + (y1 - y0) * (g / 4);
    ctx.beginPath();
    ctx.moveTo(x0, yy);
    ctx.lineTo(x1, yy);
    ctx.stroke();
    ctx.fillText(String(Math.round((opts.yMax * g) / 4)), x0 - 6, yy + 3);
  }

  // y축 라벨 — 세로축 왼쪽에 세로(회전)로
  if (opts.yAxis) {
    ctx.save();
    ctx.translate(10, (y1 + y0) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.fillStyle = pal.muted;
    ctx.font = FONT;
    ctx.fillText(opts.yAxis, 0, 0);
    ctx.restore();
  }

  const cx = (x0 + x1) / 2;

  // x축 제목 — 표준: x축 아래 가운데(눈금 라벨 아래)
  if (opts.xLabel) {
    ctx.textAlign = 'center';
    ctx.fillStyle = pal.muted;
    ctx.font = FONT;
    ctx.fillText(opts.xLabel, cx, y0 + botTicks + 18);
  }

  // 라인 설명(범례) — x축 제목 아래, 가운데 정렬
  if (hasLegend && opts.legend && opts.legendColors) {
    ctx.font = FONT;
    const ly = y0 + botTicks + botX + 13;
    const wItem = (s: string) => 16 + ctx.measureText(s).width;
    const total = wItem(opts.legend[0]) + 20 + wItem(opts.legend[1]);
    let lx = cx - total / 2;
    ctx.textAlign = 'left';
    for (let i = 0; i < 2; i++) {
      ctx.fillStyle = opts.legendColors[i];
      ctx.fillRect(lx, ly - 6, 12, 3);
      ctx.fillStyle = pal.muted;
      ctx.fillText(opts.legend[i], lx + 16, ly);
      lx += wItem(opts.legend[i]) + 20;
    }
  }

  return {x0, x1, y0, y1, tickY: y0 + 12};
}

export function AnimatedLineChart({
  title,
  data,
  data2,
  yMax,
  unit,
  yLabel,
  xLabel = '시간 →',
  color,
  color2,
  tone = 'accent',
  tone2 = 'accent2',
  height = 190,
  trend,
  step = false,
  legend,
}: Common & {
  data: number[];
  data2?: number[];
  yMax: number;
  color?: string;
  color2?: string;
  tone?: Tone;
  tone2?: Tone;
  trend?: [number, number];
  step?: boolean;
  legend?: [string, string];
}) {
  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const pal = palette();
      const c1 = color ?? pal[tone];
      const c2 = color2 ?? pal[tone2];
      const {x0, x1, y0, y1} = frame(ctx, w, h, pal, {
        title,
        yMax,
        yAxis: yLabel ?? unit,
        xLabel,
        legend,
        legendColors: [c1, c2],
      });
      const sx = (i: number) => x0 + (x1 - x0) * (i / (data.length - 1));
      const sy = (v: number) => y0 + (y1 - y0) * (v / yMax);

      if (trend) {
        ctx.strokeStyle = pal.trend;
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(sx(0), sy(trend[0]));
        ctx.lineTo(sx(data.length - 1), sy(trend[1]));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const p = progress(t);
      const reveal = (data.length - 1) * p;

      const drawLine = (arr: number[], col: string, useStep: boolean) => {
        ctx.strokeStyle = col;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const full = Math.floor(reveal);
        for (let i = 0; i <= full && i < arr.length; i++) {
          const px = sx(i);
          const py = sy(arr[i]);
          if (i === 0) ctx.moveTo(px, py);
          else if (useStep) {
            ctx.lineTo(px, sy(arr[i - 1]));
            ctx.lineTo(px, py);
          } else ctx.lineTo(px, py);
        }
        let hx: number;
        let hy: number;
        if (full < arr.length - 1) {
          const frac = reveal - full;
          const cx0 = sx(full);
          hx = cx0 + (sx(full + 1) - cx0) * frac;
          hy = useStep ? sy(arr[full]) : sy(arr[full]) + (sy(arr[full + 1]) - sy(arr[full])) * frac;
          ctx.lineTo(hx, hy);
        } else {
          hx = sx(arr.length - 1);
          hy = sy(arr[arr.length - 1]);
        }
        ctx.stroke();
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fill();
      };

      drawLine(data, c1, step);
      if (data2) drawLine(data2, c2, false);
    },
    [data, data2, yMax, unit, yLabel, xLabel, color, color2, tone, tone2, title, trend, step, legend],
  );
  const ref = useCanvas(draw, height);
  return <canvas ref={ref} style={{width: '100%', height, display: 'block'}} aria-label={title} />;
}

export function AnimatedBars({
  title,
  data,
  labels,
  yMax,
  unit,
  yLabel,
  xLabel,
  color,
  tone = 'accent',
  height = 190,
}: Common & {data: number[]; labels: (string | number)[]; yMax: number; color?: string; tone?: Tone}) {
  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const pal = palette();
      const c = color ?? pal[tone];
      const {x0, x1, y0, y1, tickY} = frame(ctx, w, h, pal, {
        title,
        yMax,
        yAxis: yLabel ?? unit,
        xLabel,
        xTicks: true,
      });
      const p = progress(t);
      const n = data.length;
      const bw = ((x1 - x0) / n) * 0.62;
      for (let i = 0; i < n; i++) {
        const cx = x0 + ((x1 - x0) / n) * (i + 0.5);
        const grow = Math.max(0, Math.min(1, p * 1.4 - i * 0.04));
        const bh = (y0 - y1) * (data[i] / yMax) * grow;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.5;
        ctx.fillRect(cx - bw / 2, y0 - bh, bw, bh);
        ctx.globalAlpha = 0.9;
        ctx.fillRect(cx - bw / 2, y0 - bh, bw, Math.min(2, bh));
        ctx.globalAlpha = 1;
        ctx.fillStyle = pal.muted;
        ctx.font = FONT;
        ctx.textAlign = 'center';
        ctx.fillText(String(labels[i]), cx, tickY);
      }
    },
    [data, labels, yMax, unit, yLabel, xLabel, color, tone, title],
  );
  const ref = useCanvas(draw, height);
  return <canvas ref={ref} style={{width: '100%', height, display: 'block'}} aria-label={title} />;
}
