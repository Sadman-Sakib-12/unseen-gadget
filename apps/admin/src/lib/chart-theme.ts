/** Shared Recharts theme so every chart card speaks the same brand language. */
export const chartColors = {
  primary: '#1c2b6e',
  primaryDark: '#111f4d',
  primarySoft: '#dce2f7',
  emerald: '#10b981',
  emeraldSoft: '#d1fae5',
  amber: '#f59e0b',
  amberSoft: '#fef3c7',
  red: '#ef4444',
  redSoft: '#fee2e2',
  slate: '#64748b',
  gray: '#9ca3af',
  transparent: 'transparent',
};

export const chartAxis = {
  stroke: '#cbd5e1',
  tickFill: '#64748b',
  fontSize: 12,
};

export const chartTooltip = {
  contentStyle: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    fontSize: 13,
  },
  labelStyle: { color: '#111827', fontWeight: 600 },
  itemStyle: { color: '#374151' },
};

/** Default revenue-vs-cost series mapping used across overview charts. */
export const chartSeries = [
  { key: 'revenue', color: chartColors.primary, label: 'Revenue' },
  { key: 'cost', color: chartColors.amber, label: 'Cost' },
];