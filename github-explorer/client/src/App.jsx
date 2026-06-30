import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import UserProfile from './pages/UserProfile'
import SearchPage from './pages/SearchPage'
import Trending from './pages/Trending'
import Jobs from './pages/Jobs'

export default function App() {
  return (
    <div className="min-h-screen bg-gh-dark">
      <Navbar />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { background: '#161b22', color: '#e6edf3', border: '1px solid #30363d' }
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/jobs" element={<Jobs />} />
      </Routes>
    </div>
  )
}
