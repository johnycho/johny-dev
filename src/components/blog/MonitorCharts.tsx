import React, {useEffect, useRef} from 'react';

// 블로그용 경량 애니메이션 canvas 차트 (의존성 없음, 직접 구현)
// - AnimatedLineChart: 선이 왼→오로 부드럽게 그려지며 반복(메모리 톱니/큐 발산/캐시 등)
// - AnimatedBars: 막대가 목표치까지 자라며 반복(응답시간 분포 등)
// SSR 안전: 모든 그리기는 useEffect(클라이언트)에서만. 색은 테마(라이트/다크)에 맞춰 매 프레임 산출.
// 주의: canvas fillStyle 은 CSS var() 를 못 읽으므로 실제 색값만 쓴다.

type Tone = 'accent' | 'accent2' | 'good' | 'bad';
type Common = {title?: string; height?: number; unit?: string};

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
        accent: '#1596b3', // 차분한 틸
        accent2: '#c07d3a', // 부드러운 앰버
        good: '#2f9e57',
        bad: '#cf5a55',
        trend: 'rgba(196,90,86,0.85)',
      }
    : {
        text: '#c9d1d9',
        muted: '#8a9199',
        grid: 'rgba(128,135,145,0.16)',
        accent: '#5bbccf', // 밝지만 눈 편한 틸
        accent2: '#dda36a', // 톤 낮춘 앰버
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

const PAD = {l: 40, r: 12, t: 30, b: 22};
const CYCLE = 3.4;

// 진행도 0→1 채우고 잠시 유지 후 반복 (easeInOutCubic)
function progress(t: number) {
  const draw = CYCLE - 0.9;
  let p = (t % CYCLE) / draw;
  p = Math.max(0, Math.min(1, p));
  return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
}

function grid(ctx: CanvasRenderingContext2D, pal: Pal, x0: number, x1: number, y0: number, y1: number, yMax: number) {
  ctx.strokeStyle = pal.grid;
  ctx.lineWidth = 1;
  ctx.fillStyle = pal.muted;
  ctx.font = '11px system-ui, sans-serif';
  ctx.textAlign = 'right';
  for (let g = 0; g <= 4; g++) {
    const yy = y0 + (y1 - y0) * (g / 4);
    ctx.beginPath();
    ctx.moveTo(x0, yy);
    ctx.lineTo(x1, yy);
    ctx.stroke();
    ctx.fillText(String(Math.round((yMax * g) / 4)), x0 - 6, yy + 3);
  }
}

function titleText(ctx: CanvasRenderingContext2D, pal: Pal, title: string | undefined, x0: number) {
  if (!title) return;
  ctx.textAlign = 'left';
  ctx.fillStyle = pal.text;
  ctx.font = '600 12px system-ui, sans-serif';
  ctx.fillText(title, x0, 14);
}

export function AnimatedLineChart({
  title,
  data,
  data2,
  yMax,
  unit,
  color,
  color2,
  tone = 'accent',
  tone2 = 'accent2',
  height = 180,
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
      const x0 = PAD.l;
      const x1 = w - PAD.r;
      const y0 = h - PAD.b;
      const y1 = PAD.t;
      const sx = (i: number) => x0 + (x1 - x0) * (i / (data.length - 1));
      const sy = (v: number) => y0 + (y1 - y0) * (v / yMax);

      grid(ctx, pal, x0, x1, y0, y1, yMax);
      titleText(ctx, pal, title, x0);

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

      if (legend) {
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        let lx = x1 - 150;
        for (const [col, label] of [
          [c1, legend[0]],
          [c2, legend[1]],
        ] as [string, string][]) {
          ctx.fillStyle = col;
          ctx.fillRect(lx, 6, 10, 3);
          ctx.fillStyle = pal.muted;
          ctx.fillText(label, lx + 14, 11);
          lx += 75;
        }
      }

      if (unit) {
        ctx.fillStyle = pal.muted;
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(unit, x0, h - 6);
      }
    },
    [data, data2, yMax, unit, color, color2, tone, tone2, title, trend, step, legend],
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
  color,
  tone = 'accent',
  height = 180,
}: Common & {data: number[]; labels: (string | number)[]; yMax: number; color?: string; tone?: Tone}) {
  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
      const pal = palette();
      const c = color ?? pal[tone];
      const x0 = PAD.l;
      const x1 = w - PAD.r;
      const y0 = h - PAD.b;
      const y1 = PAD.t;
      const p = progress(t);

      grid(ctx, pal, x0, x1, y0, y1, yMax);
      titleText(ctx, pal, title, x0);

      const n = data.length;
      const bw = ((x1 - x0) / n) * 0.62;
      for (let i = 0; i < n; i++) {
        const cx = x0 + ((x1 - x0) / n) * (i + 0.5);
        const grow = Math.max(0, Math.min(1, p * 1.4 - i * 0.04));
        const bh = (y0 - y1) * (data[i] / yMax) * grow;
        ctx.fillStyle = c;
        ctx.globalAlpha = 0.5; // 채운 막대는 옅게 — 눈부심 완화
        ctx.fillRect(cx - bw / 2, y0 - bh, bw, bh);
        ctx.globalAlpha = 0.9;
        ctx.fillRect(cx - bw / 2, y0 - bh, bw, Math.min(2, bh)); // 상단만 진하게(캡)
        ctx.globalAlpha = 1;
        ctx.fillStyle = pal.muted;
        ctx.font = '11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(labels[i]), cx, h - 6);
      }
    },
    [data, labels, yMax, color, tone, title],
  );
  const ref = useCanvas(draw, height);
  return <canvas ref={ref} style={{width: '100%', height, display: 'block'}} aria-label={title} />;
}
