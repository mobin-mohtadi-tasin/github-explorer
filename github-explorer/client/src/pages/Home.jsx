import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Telescope, Star, GitFork, Users, Zap, Briefcase, MapPin, ExternalLink, Loader2, DollarSign } from 'lucide-react'
import SearchInput from '../components/SearchInput'
import { fetchJobs } from '../utils/api'

const TRENDING = ['torvalds', 'gaearon', 'yyx990803', 'tj', 'sindresorhus', 'antirez']

const FEATURES = [
  { icon: Star, title: 'Profile Analytics', desc: 'Star counts, fork stats, repo rankings, and developer rank scores.' },
  { icon: GitFork, title: 'Language Breakdown', desc: 'See which languages a developer uses across all their public repos.' },
  { icon: Users, title: 'Activity Heatmap', desc: 'GitHub-style contribution grid from the last 52 weeks of public events.' },
  { icon: Zap, title: 'Instant Search', desc: 'Search millions of GitHub users and explore any public profile instantly.' },
]

export default function Home() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loadingJobs, setLoadingJobs] = useState(true)

  useEffect(() => {
    fetchJobs()
      .then(setJobs)
      .catch(() => console.warn('Failed to load jobs.'))
      .finally(() => setLoadingJobs(false))
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 min-h-[calc(100vh-56px)] flex flex-col lg:flex-row gap-8 lg:gap-32 items-center lg:items-start justify-center">
      {/* ── LEFT: HERO & SEARCH ── */}
      <div className="flex-1 max-w-2xl w-full flex flex-col justify-center animate-fade-in">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
            <Telescope className="w-12 h-12 text-gh-blue" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Explore any GitHub profile
          </h1>
          <p className="text-gray-400 text-lg mb-10">
            Deep-dive into repos, languages, activity, and developer rank — all in one place.
          </p>

          <div className="max-w-md mx-auto lg:mx-0 mb-6">
            <SearchInput size="lg" placeholder="Enter a GitHub username..." autoFocus />
          </div>

          {/* Trending */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            <span className="text-xs text-gray-600 pt-0.5 font-mono">Try:</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-16 max-w-3xl w-full animate-slide-up">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card hover:border-gh-blue/40 transition-colors flex gap-3.5 items-start">
              <Icon className="w-6 h-6 text-gh-blue shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: REMOTE JOBS WIDGET ── */}
      <div className="w-full lg:w-[380px] shrink-0 card flex flex-col gap-4 animate-fade-in border border-gh-border/80 bg-gh-surface/50 backdrop-blur-sm self-stretch lg:self-auto">
        <div className="border-b border-gh-border pb-3">
          <h2 className="flex items-center gap-2 text-md font-bold text-white mb-1">
            <Briefcase className="w-5 h-5 text-gh-blue" />
            Remote Tech Jobs
          </h2>
          <p className="text-xs text-gray-500 font-medium">
            Open developer roles at leading tech teams.
          </p>
        </div>

        {loadingJobs ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin text-gh-blue" />
            <span className="text-xs font-mono">Fetching remote jobs...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="py-8 text-center text-xs text-gray-500">
            No remote roles available right now.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {jobs.slice(0, 5).map(job => (
              <div 
                key={job.id} 
                className="p-3 bg-gh-darker/35 border border-gh-border rounded-lg hover:border-gh-blue/30 transition-colors flex gap-3 items-start"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-bold text-white truncate mb-0.5">{job.title}</h3>
                  <p className="text-[11px] font-semibold text-gray-400 mb-1">{job.company}</p>
                  
                  <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-gray-500 font-medium mb-2.5">
                    <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5 shrink-0" /> {job.location}</span>
                    <span className="flex items-center gap-0.5"><DollarSign className="w-2.5 h-2.5 shrink-0" /> {job.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 items-center">
                    {job.tags.slice(0, 3).map(t => (
                      <span 
                        key={t} 
                        className="text-[9px] bg-gh-surface text-gray-400 border border-gh-border px-1.5 py-0.2 rounded font-mono"
                      >
                        {t}
                      </span>
                    ))}
                    
                    <a 
                      href={job.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="ml-auto text-[10px] font-bold text-gh-blue hover:underline flex items-center gap-0.5 shrink-0"
                    >
                      Apply <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}

            {jobs.length > 5 && (
              <button
                onClick={() => navigate('/jobs')}
                className="w-full mt-1 py-2 text-xs font-semibold text-center text-gh-blue hover:text-white bg-gh-darker/20 hover:bg-gh-darker/40 border border-gh-border hover:border-gh-blue/30 rounded-lg transition-colors"
              >
                Find More Jobs
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
