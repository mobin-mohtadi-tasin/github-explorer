import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MapPin, DollarSign, ExternalLink, Loader2, ArrowLeft, Search } from 'lucide-react'
import { fetchJobs } from '../utils/api'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchJobs()
      .then(setJobs)
      .catch(() => {
        setError('Failed to fetch remote jobs. Please check your internet connection.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredJobs = jobs.filter(job => {
    const term = searchQuery.toLowerCase().trim()
    if (!term) return true
    return (
      job.title.toLowerCase().includes(term) ||
      job.company.toLowerCase().includes(term) ||
      job.tags.some(tag => tag.toLowerCase().includes(term))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="btn-ghost flex items-center gap-2 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-gh-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5 mb-2">
            <Briefcase className="w-7 h-7 text-gh-blue" />
            Remote Tech Jobs
          </h1>
          <p className="text-gray-400 text-sm">
            Discover active remote developer job listings from leading engineering teams.
          </p>
        </div>

        {/* Search Filter */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by title, tech stack..."
            className="w-full bg-gh-surface border border-gh-border rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gh-blue transition-colors"
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gh-blue" />
          <span className="text-sm font-mono">Loading remote developer positions...</span>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => fetchJobs().then(setJobs).catch(() => {})}
            className="btn-primary text-sm"
          >
            Retry
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No remote jobs match your search filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="card flex flex-col justify-between hover:border-gh-blue/30 transition-colors"
            >
              <div>
                {/* Header info */}
                <div className="mb-2">
                  <h3 className="text-base font-bold text-white mb-0.5 line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-xs font-semibold text-gh-blue font-mono">
                    {job.company}
                  </p>
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 font-medium mb-4">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    {job.salary}
                  </span>
                </div>

                {/* Tags */}
                {job.tags && job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {job.tags.slice(0, 5).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-gh-surface text-gray-400 border border-gh-border px-2 py-0.5 rounded font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="border-t border-gh-border/60 pt-3 mt-auto">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full btn-ghost border border-gh-border hover:bg-gh-blue/10 hover:border-gh-blue/30 hover:text-white text-center text-xs py-2 px-4 rounded-lg flex items-center justify-center gap-1.5 font-bold transition-all text-gray-400"
                >
                  Apply on Job Board
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
