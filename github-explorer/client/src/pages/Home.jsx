import { useNavigate } from 'react-router-dom'
import { Telescope, Star, GitFork, Users, Zap } from 'lucide-react'
import SearchInput from '../components/SearchInput'

const TRENDING = ['torvalds', 'gaearon', 'yyx990803', 'tj', 'sindresorhus', 'antirez']

const FEATURES = [
  { icon: Star, title: 'Profile Analytics', desc: 'Star counts, fork stats, repo rankings, and developer rank scores.' },
  { icon: GitFork, title: 'Language Breakdown', desc: 'See which languages a developer uses across all their public repos.' },
  { icon: Users, title: 'Activity Heatmap', desc: 'GitHub-style contribution grid from the last 52 weeks of public events.' },
  { icon: Zap, title: 'Instant Search', desc: 'Search millions of GitHub users and explore any public profile instantly.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[calc(100vh-56px)] flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Telescope className="w-12 h-12 text-gh-blue" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
          Explore any GitHub profile
        </h1>
        <p className="text-gray-400 text-lg mb-10">
          Deep-dive into repos, languages, activity, and developer rank — all in one place.
        </p>

        <div className="max-w-md mx-auto mb-6">
          <SearchInput size="lg" placeholder="Enter a GitHub username..." autoFocus />
        </div>

        {/* Trending */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-xs text-gray-600 pt-0.5">Try:</span>
          {TRENDING.map(u => (
            <button
              key={u}
              onClick={() => navigate(`/user/${u}`)}
              className="text-xs text-gh-blue hover:text-white hover:bg-gh-blue/10 px-2.5 py-1 rounded-full border border-gh-blue/20 transition-colors font-mono"
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-20 max-w-3xl w-full animate-slide-up">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card text-center hover:border-gh-blue/40 transition-colors">
            <Icon className="w-6 h-6 text-gh-blue mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
