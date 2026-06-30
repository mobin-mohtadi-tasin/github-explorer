import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Loader2, Users } from 'lucide-react'
import { searchUsers } from '../utils/api'

export default function SearchInput({
  placeholder = 'Search GitHub users...',
  initialValue = '',
  size = 'md', // 'lg' for home page, 'md' for navbar
  autoFocus = false
}) {
  const [q, setQ] = useState(initialValue)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const navigate = useNavigate()
  
  const containerRef = useRef(null)
  const debounceRef = useRef(null)

  // Keep state in sync with initial value (e.g. if routing updates query param)
  useEffect(() => {
    setQ(initialValue)
  }, [initialValue])

  // Handle typing with debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const query = q.trim()
    if (!query) {
      setResults([])
      setIsOpen(false)
      return
    }

    setLoading(true)
    debounceRef.current = setTimeout(() => {
      searchUsers(query, 1)
        .then(data => {
          // Limit to top 5 results for dropdown
          setResults((data.items || []).slice(0, 5))
          setIsOpen(true)
          setFocusedIndex(-1)
        })
        .catch(() => {
          setResults([])
        })
        .finally(() => {
          setLoading(false)
        })
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q])

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const query = q.trim()
    if (query) {
      setIsOpen(false)
      navigate(`/search?q=${encodeURIComponent(query)}`)
    }
  }

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter') {
      if (focusedIndex >= 0 && results[focusedIndex]) {
        e.preventDefault()
        const selected = results[focusedIndex]
        setIsOpen(false)
        setQ('')
        navigate(`/user/${selected.login}`)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const handleSelectUser = (login) => {
    setIsOpen(false)
    setQ('')
    navigate(`/user/${login}`)
  }

  // Size styling classes
  const isLg = size === 'lg'
  const paddingClass = isLg ? 'py-3 pl-10 pr-10 text-base' : 'py-1.5 pl-9 pr-8 text-sm'
  const iconLeftClass = isLg ? 'left-3 w-4 h-4' : 'left-3 w-4.5 h-4.5'
  const iconRightClass = isLg ? 'right-3' : 'right-2.5'
  const dropdownTopClass = isLg ? 'top-14' : 'top-10'

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-500 ${iconLeftClass}`} />
          
          {/* Input field */}
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => q.trim() && results.length > 0 && setIsOpen(true)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className={`w-full bg-gh-surface border border-gh-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gh-blue transition-colors ${paddingClass}`}
          />

          {/* Loading Indicator */}
          {loading && (
            <div className={`absolute top-1/2 -translate-y-1/2 ${iconRightClass}`}>
              <Loader2 className="w-4 h-4 animate-spin text-gh-blue" />
            </div>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className={`absolute left-0 w-full bg-gh-surface border border-gh-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in ${dropdownTopClass}`}>
          <div className="py-1.5 divide-y divide-gh-border">
            {results.map((user, idx) => (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.login)}
                onMouseEnter={() => setFocusedIndex(idx)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors ${
                  idx === focusedIndex ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                }`}
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-8 h-8 rounded-full border border-gh-border shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-sm truncate">
                      {user.login}
                    </span>
                    {user.type === 'Organization' && (
                      <span className="text-[10px] font-mono bg-gh-purple/10 text-gh-purple px-1.5 py-0.5 rounded border border-gh-purple/20">
                        Org
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-mono truncate block">
                    github.com/{user.login}
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="bg-gh-darker/50 px-4 py-2 border-t border-gh-border text-center">
            <button
              onClick={handleSubmit}
              className="text-[11px] font-semibold text-gh-blue hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              <Users className="w-3.5 h-3.5" />
              See all results for "{q}"
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
