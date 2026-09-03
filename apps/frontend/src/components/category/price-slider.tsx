"use client";

import { formatBDT } from "@/components/price";

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
  const lowPct = max > min ? Math.max(0, Math.min(100, ((low - min) / (max - min)) * 100)) : 0;
  const highPct = max > min ? Math.max(0, Math.min(100, ((high - min) / (max - min)) * 100)) : 100;

  return (
    <div className="px-2 py-1">
      <div className="relative h-4 w-full flex items-center">
        {/* Track bar */}
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ left: `${lowPct}%`, width: `${Math.max(0, highPct - lowPct)}%` }}
          />
        </div>

        {/* Native React Low Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          aria-label="Minimum price"
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v <= high) onLowChange(v);
          }}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Native React High Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          aria-label="Maximum price"
          onChange={(e) => {
            const v = Number(e.target.value);
            if (v >= low) onHighChange(v);
          }}
          className="pointer-events-none absolute inset-0 w-full appearance-none bg-transparent opacity-0 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer"
        />

        {/* Visual Knobs */}
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-md"
          style={{ left: `${lowPct}%` }}
        />
        <div
          className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-md"
          style={{ left: `${highPct}%` }}
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] font-medium text-muted-foreground">
        <span>{formatBDT(low)}</span>
        <span>{formatBDT(high)}</span>
      </div>
    </div>
  );
}
