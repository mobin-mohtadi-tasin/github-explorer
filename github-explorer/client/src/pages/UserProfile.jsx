import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  MapPin, Link2, Building2, Calendar, Twitter,
  GitBranch, ArrowLeft, Share2, Check, Loader2
} from 'lucide-react'
import { fetchProfile } from '../utils/api'
import { timeAgo } from '../utils/helpers'
import StatsGrid from '../components/StatsGrid'
import RepoCard from '../components/RepoCard'
import ActivityHeatmap from '../components/ActivityHeatmap'
import LanguageChart from '../components/LanguageChart'
import RankBadge from '../components/RankBadge'
import EventFeed from '../components/EventFeed'

const TABS = ['Featured', 'All Repos', 'Activity']

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tab, setTab] = useState('Featured')
  const [sort, setSort] = useState('stars')
  const [filterLang, setFilterLang] = useState('All')
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true); setError(null); setData(null)
    fetchProfile(username)
      .then(setData)
      .catch(err => setError(err.response?.data?.error || 'User not found'))
      .finally(() => setLoading(false))
  }, [username])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-gh-blue" />
        <span className="text-sm font-mono">Loading {username}...</span>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-red-400 text-lg">{error}</p>
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Go back
      </button>
    </div>
  )

  const { user, repos, featured, topLanguages, stats, activityMap, events } = data
  const allLangs = ['All', ...new Set(repos.filter(r => r.language).map(r => r.language))]

  const filteredRepos = repos
    .filter(r => filterLang === 'All' || r.language === filterLang)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'stars') return b.stargazers_count - a.stargazers_count
      if (sort === 'forks') return b.forks_count - a.forks_count
      if (sort === 'updated') return new Date(b.updated_at) - new Date(a.updated_at)
      if (sort === 'name') return a.name.localeCompare(b.name)
      return 0
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ── SIDEBAR ── */}
        <aside className="flex flex-col gap-4">
          {/* Avatar & Name */}
          <div className="card flex flex-col items-center text-center gap-3 animate-fade-in">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.login}
                className="w-24 h-24 rounded-full border-2 border-gh-border"
              />
              {user.hireable && (
                <span className="absolute -bottom-1 -right-1 badge bg-gh-accent/20 text-gh-accent border border-gh-accent/30 text-[10px]">
                  Hireable
                </span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{user.name || user.login}</h1>
              <p className="text-gray-500 font-mono text-sm">@{user.login}</p>
            </div>
            {user.bio && <p className="text-gray-400 text-sm leading-relaxed">{user.bio}</p>}

            <div className="flex flex-col gap-2 w-full text-sm text-gray-400">
              {user.company && (
                <span className="flex items-center gap-2"><Building2 className="w-4 h-4 shrink-0" />{user.company}</span>
              )}
              {user.location && (
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 shrink-0" />{user.location}</span>
              )}
              {user.blog && (
                <a href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gh-blue hover:underline truncate">
                  <Link2 className="w-4 h-4 shrink-0" />{user.blog}
                </a>
              )}
              {user.twitter_username && (
                <a href={`https://twitter.com/${user.twitter_username}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gh-blue hover:underline">
                  <Twitter className="w-4 h-4 shrink-0" />@{user.twitter_username}
                </a>
              )}
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 shrink-0" />
                Joined {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div className="flex gap-2 w-full">
              <a href={user.html_url} target="_blank" rel="noreferrer" className="flex-1 btn-primary text-center text-sm py-2">
                View on GitHub
              </a>
              <button onClick={handleShare} className="btn-ghost border border-gh-border px-3 py-2 rounded-lg" title="Copy link">
                {copied ? <Check className="w-4 h-4 text-gh-accent" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Rank */}
          <RankBadge rank={stats.rank} score={stats.score} />

          {/* Languages */}
          <LanguageChart topLanguages={topLanguages} />
        </aside>

        {/* ── MAIN ── */}
        <main className="flex flex-col gap-5 min-w-0">
          {/* Stats */}
          <StatsGrid stats={stats} user={user} />

          {/* Activity Heatmap */}
          <ActivityHeatmap activityMap={activityMap} />

          {/* Tabs */}
          <div className="border-b border-gh-border flex gap-0">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === t
                    ? 'border-gh-orange text-white'
                    : 'border-transparent text-gray-500 hover:text-gray-300'
                }`}
              >
                {t}
                {t === 'All Repos' && (
                  <span className="ml-1.5 badge bg-gh-surface text-gray-400">{repos.length}</span>
                )}
              </button>
            ))}
          </div>

          {/* Tab: Featured */}
          {tab === 'Featured' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featured.map(repo => <RepoCard key={repo.id} repo={repo} username={username} />)}
            </div>
          )}

          {/* Tab: All Repos */}
          {tab === 'All Repos' && (
            <>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  type="text"
                  placeholder="Filter repos..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="bg-gh-surface border border-gh-border rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gh-blue transition-colors w-48"
                />
                <select
                  value={filterLang}
                  onChange={e => setFilterLang(e.target.value)}
                  className="bg-gh-surface border border-gh-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer"
                >
                  {allLangs.map(l => <option key={l}>{l}</option>)}
                </select>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="bg-gh-surface border border-gh-border rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none cursor-pointer"
                >
                  <option value="stars">Most starred</option>
                  <option value="forks">Most forked</option>
                  <option value="updated">Recently updated</option>
                  <option value="name">Name A–Z</option>
                </select>
                <span className="text-xs text-gray-500 ml-auto">{filteredRepos.length} repos</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredRepos.map(repo => <RepoCard key={repo.id} repo={repo} username={username} />)}
              </div>
              {filteredRepos.length === 0 && (
                <p className="text-gray-500 text-center py-8">No repos match your filters.</p>
              )}
            </>
          )}

          {/* Tab: Activity */}
          {tab === 'Activity' && (
            <EventFeed events={events} />
          )}
        </main>
      </div>
    </div>
  )
}
