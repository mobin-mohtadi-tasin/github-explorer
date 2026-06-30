import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, Users, Loader2 } from 'lucide-react'
import { searchUsers } from '../utils/api'

export default function SearchPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const q = params.get('q') || ''
  const [results, setResults] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState(q)
  const reqId = useRef(0)

  useEffect(() => {
    if (!q) { setResults([]); setTotal(0); return }

    const myReq = ++reqId.current      // tag this request
    setLoading(true)
    setQuery(q)
    if (page === 1) setResults([])     // fresh query → clear old list

    searchUsers(q, page)
      .then(data => {
        if (myReq !== reqId.current) return   // ignore stale/out-of-order responses
        setResults(prev => page === 1 ? data.items : [...prev, ...data.items])
        setTotal(data.total_count)
      })
      .catch(err => myReq === reqId.current && console.error(err))
      .finally(() => myReq === reqId.current && setLoading(false))
  }, [q, page])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setPage(1)
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-gh-surface border border-gh-border rounded-lg py-2 pl-9 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-gh-blue transition-colors"
          />
        </div>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {q && (
        <p className="text-gray-400 text-sm mb-6 flex items-center gap-2">
          <Users className="w-4 h-4" />
          {total.toLocaleString()} users for <span className="text-white font-mono">"{q}"</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {results.map(user => (
          <button
            key={user.id}
            onClick={() => navigate(`/user/${user.login}`)}
            className="card flex items-center gap-4 text-left hover:border-gh-blue/50 hover:bg-white/[0.02] transition-all animate-fade-in"
          >
            <img src={user.avatar_url} alt={user.login} className="w-12 h-12 rounded-full border border-gh-border" />
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{user.login}</p>
              <p className="text-xs text-gray-500 font-mono truncate">github.com/{user.login}</p>
              {user.type === 'Organization' && (
                <span className="badge bg-gh-purple/10 text-gh-purple mt-1">Org</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-8">
          <Loader2 className="w-6 h-6 animate-spin text-gh-blue" />
        </div>
      )}

      {!loading && results.length < total && results.length > 0 && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            className="btn-primary px-8"
          >
            Load more
          </button>
        </div>
      )}

      {!loading && !results.length && q && (
        <p className="text-gray-500 text-center py-12">No users found for "{q}"</p>
      )}
    </div>
  )
}
