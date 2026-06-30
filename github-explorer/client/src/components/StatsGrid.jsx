import { Star, GitFork, BookOpen, Users, UserCheck, Flame } from 'lucide-react'
import { formatNumber } from '../utils/helpers'

const STATS = [
  { key: 'repoCount', label: 'Repos', icon: BookOpen, color: 'text-gh-blue' },
  { key: 'totalStars', label: 'Stars earned', icon: Star, color: 'text-yellow-400' },
  { key: 'totalForks', label: 'Forks', icon: GitFork, color: 'text-gh-purple' },
  { key: 'followers', label: 'Followers', icon: Users, color: 'text-gh-accent' },
  { key: 'following', label: 'Following', icon: UserCheck, color: 'text-gh-orange' },
  { key: 'streak', label: 'Active days', icon: Flame, color: 'text-red-400' },
]

export default function StatsGrid({ stats, user }) {
  const data = { ...stats, followers: user.followers, following: user.following }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-slide-up">
      {STATS.map(({ key, label, icon: Icon, color }) => (
        <div key={key} className="stat-card">
          <div className={`flex items-center gap-1.5 ${color}`}>
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs text-gray-500">{label}</span>
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {formatNumber(data[key])}
          </span>
        </div>
      ))}
    </div>
  )
}
