import { GitCommit, Star, GitFork, GitPullRequest, AlertCircle, Clock } from 'lucide-react'
import { timeAgo } from '../utils/helpers'

const EVENT_ICONS = {
  PushEvent: { Icon: GitCommit, color: 'text-gh-accent', label: 'Pushed to' },
  WatchEvent: { Icon: Star, color: 'text-yellow-400', label: 'Starred' },
  ForkEvent: { Icon: GitFork, color: 'text-gh-purple', label: 'Forked' },
  PullRequestEvent: { Icon: GitPullRequest, color: 'text-gh-blue', label: 'PR on' },
  IssuesEvent: { Icon: AlertCircle, color: 'text-gh-orange', label: 'Issue on' },
  CreateEvent: { Icon: GitCommit, color: 'text-green-400', label: 'Created' },
}

export default function EventFeed({ events }) {
  if (!events?.length) return null

  return (
    <div className="card animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-gh-blue" />
        Recent Activity
      </h3>
      <div className="flex flex-col gap-3">
        {events.map((event, i) => {
          const cfg = EVENT_ICONS[event.type] || EVENT_ICONS.PushEvent
          const { Icon, color, label } = cfg
          const repoName = event.repo?.name?.split('/')[1] || event.repo?.name
          return (
            <div key={i} className="flex items-start gap-3 text-sm">
              <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color}`} />
              <div className="flex-1 min-w-0">
                <span className="text-gray-400">{label} </span>
                <a
                  href={`https://github.com/${event.repo?.name}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gh-blue hover:underline truncate"
                >
                  {repoName}
                </a>
                {event.type === 'PushEvent' && event.payload?.commits?.length > 0 && (
                  <p className="text-xs text-gray-600 truncate mt-0.5">
                    {event.payload.commits[0]?.message}
                  </p>
                )}
              </div>
              <span className="text-xs text-gray-600 shrink-0">{timeAgo(event.created_at)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
