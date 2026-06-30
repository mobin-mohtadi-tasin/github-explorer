import { Star, GitFork, Eye, Clock } from 'lucide-react'
import { getLangColor, formatNumber, timeAgo } from '../utils/helpers'

export default function RepoCard({ repo, username }) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noreferrer"
      className="card flex flex-col gap-3 hover:border-gh-blue/50 hover:bg-white/[0.02] transition-all duration-200 group animate-fade-in"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-gh-blue font-medium text-sm truncate group-hover:underline">
            {repo.name}
          </span>
          {repo.fork && (
            <span className="badge bg-gray-700/50 text-gray-400 shrink-0">fork</span>
          )}
          {repo.archived && (
            <span className="badge bg-yellow-900/30 text-yellow-500 shrink-0">archived</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 shrink-0">
          <Eye className="w-3.5 h-3.5" />
          <span>{formatNumber(repo.watchers_count)}</span>
        </div>
      </div>

      {repo.description && (
        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
          {repo.description}
        </p>
      )}

      {repo.topics?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {repo.topics.slice(0, 4).map(t => (
            <span key={t} className="badge bg-gh-blue/10 text-gh-blue">{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-500 mt-auto pt-1 border-t border-gh-border/50">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: getLangColor(repo.language) }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {formatNumber(repo.stargazers_count)}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {formatNumber(repo.forks_count)}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {timeAgo(repo.updated_at)}
        </span>
      </div>
    </a>
  )
}
