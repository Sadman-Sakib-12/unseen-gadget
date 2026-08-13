"use client";

import { useCallback, useRef } from "react";

export function PriceSlider({
  min,
  max,
  low,
  high,
  onLowChange,
  onHighChange,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onLowChange: (v: number) => void;
  onHighChange: (v: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.min(hi, Math.max(lo, v));

  const valueFromEvent = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return Math.round(min + ratio * (max - min));
    },
    [min, max]
  );

  const startDrag = (
    e: React.MouseEvent | React.TouchEvent,
    which: "low" | "high"
  ) => {
    e.preventDefault();
    const move = (ev: MouseEvent | TouchEvent) => {
      const x =
        "touches" in ev ? ev.touches[0]!.clientX : (ev as MouseEvent).clientX;
      const v = valueFromEvent(x);
      if (which === "low") onLowChange(clamp(v, min, high - 1));
      else onHighChange(clamp(v, low + 1, max));
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move, { passive: false });
    window.addEventListener("touchend", up);
  };

  const lowPct = pct(low);
  const highPct = pct(high);

  return (
    <div className="px-2 py-1">
      <div
        ref={trackRef}
        className="relative h-1.5 w-full rounded-full bg-gray-200 cursor-pointer"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute h-full rounded-full bg-blue-400"
          style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
        />
        <button
          aria-label="Minimum price"
          onMouseDown={(e) => startDrag(e, "low")}
          onTouchStart={(e) => startDrag(e, "low")}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 bg-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
          style={{ left: `${lowPct}%` }}
        />
        <button
          aria-label="Maximum price"
          onMouseDown={(e) => startDrag(e, "high")}
          onTouchStart={(e) => startDrag(e, "high")}
          className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-400 bg-white shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 cursor-pointer"
          style={{ left: `${highPct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] font-medium text-gray-600">
        <span>৳{low.toLocaleString()}</span>
        <span>৳{high.toLocaleString()}</span>
      </div>
    </div>
  );
}