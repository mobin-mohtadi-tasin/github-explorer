import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Star, GitFork, ExternalLink, Loader2, ArrowLeft, User } from 'lucide-react'
import { fetchTrending } from '../utils/api'

const LANGUAGES = ['All', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'CSS', 'HTML', 'C++']
const TIME_RANGES = [
  { value: 'daily', label: 'Today' },
  { value: 'weekly', label: 'This Week' },
  { value: 'monthly', label: 'This Month' }
]

const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  CSS: '#563d7c',
  HTML: '#e34c26',
  Java: '#b07219',
  'C++': '#f34b7d',
}

export default function Trending() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLang, setSelectedLang] = useState('All')
  const [timeRange, setTimeRange] = useState('weekly')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)
    setSearchQuery('') // Reset search query when filters change
    fetchTrending(selectedLang, timeRange)
      .then(setRepos)
      .catch(() => {
        setError('Failed to fetch trending repositories. Please try again.')
      })
      .finally(() => setLoading(false))
  }, [selectedLang, timeRange])

  const filteredRepos = repos.filter(repo => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      repo.name.toLowerCase().includes(term) ||
      (repo.description && repo.description.toLowerCase().includes(term)) ||
      repo.owner.login.toLowerCase().includes(term)
    )
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gh-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 mb-2">
            <Flame className="w-7 h-7 text-gh-orange animate-pulse-slow" />
            Trending Repositories
          </h1>
          <p className="text-gray-400 text-sm">
            See what the GitHub community is excited about today.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search Repositories */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-gray-500">Filter Repositories</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by name, desc..."
              className="bg-gh-surface border border-gh-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gh-blue transition-colors w-44 sm:w-56"
            />
          </div>

          {/* Language dropdown */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-gray-500">Language</span>
            <select
              value={selectedLang}
              onChange={e => setSelectedLang(e.target.value)}
              className="bg-gh-surface border border-gh-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer hover:border-gh-border/80 transition-colors"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Time range selector */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-mono text-gray-500">Date Range</span>
            <div className="flex bg-gh-surface border border-gh-border rounded-lg p-0.5">
              {TIME_RANGES.map(range => (
                <button
                  key={range.value}
                  onClick={() => setTimeRange(range.value)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-md transition-colors ${
                    timeRange === range.value
                      ? 'bg-gh-border text-white'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gh-blue" />
          <span className="text-sm font-mono">Loading trending projects...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchTrending(selectedLang, timeRange).then(setRepos).catch(() => {})}
            className="btn-primary text-sm"
          >
            Retry
          </button>
        </div>
      ) : filteredRepos.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No repositories match your filter search.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredRepos.map((repo, idx) => (
            <div
              key={repo.id || idx}
              className="card flex flex-col md:flex-row justify-between gap-4 hover:border-gh-blue/30 transition-colors"
            >
              <div className="flex gap-4 items-start min-w-0">
                {/* Index Rank */}
                <div className="text-gray-500 font-mono text-sm pt-1 shrink-0 w-6 text-right">
                  {idx + 1}
                </div>

                <div className="min-w-0">
                  {/* Repo Name */}
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gh-blue font-semibold hover:underline text-base truncate flex items-center gap-1"
                    >
                      {repo.owner.login} / {repo.name}
                      <ExternalLink className="w-3.5 h-3.5 opacity-50 shrink-0" />
                    </a>
                  </div>

                  {/* Description */}
                  {repo.description && (
                    <p className="text-gray-400 text-sm mb-3 leading-relaxed max-w-3xl">
                      {repo.description}
                    </p>
                  )}

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 font-medium">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: LANG_COLORS[repo.language] || '#8b949e' }}
                        />
                        {repo.language}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {repo.stargazers_count.toLocaleString()}
                    </span>

                    <span className="flex items-center gap-1">
                      <GitFork className="w-3.5 h-3.5" />
                      {repo.forks_count.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex md:flex-col justify-end gap-2 shrink-0 pt-1">
                <button
                  onClick={() => navigate(`/user/${repo.owner.login}`)}
                  className="btn-ghost border border-gh-border text-xs py-1.5 px-3 flex items-center gap-1 hover:text-gh-blue hover:border-gh-blue/30 text-gray-400 font-semibold"
                >
                  <User className="w-3.5 h-3.5" />
                  Explore Owner
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
