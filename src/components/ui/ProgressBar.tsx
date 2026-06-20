interface ProgressBarProps {
  /** CSS width string, e.g. "74%". */
  pct: string
  color: string
  track?: string
  height?: number
  radius?: number
}

export function ProgressBar({
  pct,
  color,
  track = '#e6e3d8',
  height = 8,
  radius = 5,
}: ProgressBarProps) {
  return (
    <div
      style={{ height, borderRadius: radius, background: track, overflow: 'hidden' }}
    >
      <div style={{ width: pct, height: '100%', borderRadius: radius, background: color }} />
    </div>
  )
}
