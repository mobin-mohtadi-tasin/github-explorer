import { RANK_CONFIG } from '../utils/helpers'

export default function RankBadge({ rank, score }) {
  const cfg = RANK_CONFIG[rank] || RANK_CONFIG['C']

  return (
    <div
      className="card flex flex-col items-center justify-center gap-2 animate-slide-up"
      style={{ boxShadow: `0 0 20px ${cfg.glow}` }}
    >
      <span className="text-xs text-gray-500 uppercase tracking-widest font-mono">Rank</span>
      <div
        className="text-6xl font-bold font-mono leading-none"
        style={{ color: cfg.color, textShadow: `0 0 30px ${cfg.glow}` }}
      >
        {rank}
      </div>
      <span className="text-xs font-medium" style={{ color: cfg.color }}>{cfg.label}</span>
      <div className="w-full mt-2 border-t border-gh-border pt-2">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Score</span>
          <span className="font-mono font-medium text-gray-300">{score.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
