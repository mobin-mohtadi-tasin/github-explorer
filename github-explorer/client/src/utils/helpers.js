export const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00ADD8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#FA7343',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Jupyter: '#DA5B0B',
  R: '#276DC2',
  Scala: '#c22d40',
  Vue: '#41b883',
  Svelte: '#ff3e00',
}

export const getLangColor = (lang) => LANG_COLORS[lang] || '#8b949e'

export const RANK_CONFIG = {
  S: { color: '#FFD700', glow: '#FFD70066', label: 'Legendary' },
  A: { color: '#58a6ff', glow: '#58a6ff44', label: 'Expert' },
  B: { color: '#3fb950', glow: '#3fb95044', label: 'Advanced' },
  C: { color: '#d29922', glow: '#d2992244', label: 'Intermediate' },
  D: { color: '#f0883e', glow: '#f0883e44', label: 'Beginner' },
  F: { color: '#f85149', glow: '#f8514944', label: 'Getting started' },
}

export const formatNumber = (n) => {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n?.toString() || '0'
}

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr)
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}
