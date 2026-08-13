export const COLOR_MAP: Record<string, string> = {
  Purple: "#7c3aed",
  "Space Grey": "#6b7280",
  Silver: "#d1d5db",
  Blue: "#3b82f6",
  Starlight: "#fef9ee",
  Black: "#111827",
  "Space Black": "#1f2937",
  Pink: "#f472b6",
  Yellow: "#fbbf24",
  Gold: "#d97706",
  Green: "#22c55e",
  Midnight: "#1e293b",
  "Sky Blue": "#38bdf8",
  Red: "#ef4444",
  White: "#f3f4f6",
  "Pink Gold": "#fbcfe8",
  Graphite: "#4b5563",
  "Graphite Gray": "#374151",
  "Lavender Purple": "#a78bfa",
  "Gravity Grey": "#6b7280",
  "Misty Blue": "#93c5fd",
};

export function colorHex(color: string): string {
  return COLOR_MAP[color] ?? "#9ca3af";
}

export function ColorSwatches({
  colors,
  limit = 5,
  size = "h-2.5 w-2.5",
}: {
  colors: string[];
  limit?: number;
  size?: string;
}) {
  if (!colors?.length) return null;

  return (
    <div className="flex flex-wrap gap-1">
      {colors.slice(0, limit).map((color) => (
        <span
          key={color}
          title={color}
          className={`${size} rounded-full border border-gray-300`}
          style={{ backgroundColor: colorHex(color) }}
        />
      ))}
    </div>
  );
}