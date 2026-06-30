import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Telescope, Github, Bell, Flame, X, ExternalLink, BookOpen, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react'
import { fetchOpportunities } from '../utils/api'
import toast from 'react-hot-toast'
import SearchInput from './SearchInput'

const CURATED_COURSES = [
  {
    id: 'course-1',
    provider: 'Google',
    title: 'Machine Learning Crash Course',
    desc: 'Google\'s fast-paced, practical introduction to machine learning using TensorFlow APIs.',
    url: 'https://developers.google.com/machine-learning/crash-course',
    logo: 'https://avatars.githubusercontent.com/u/1342004?v=4',
  },
  {
    id: 'course-2',
    provider: 'Microsoft',
    title: 'Generative AI for Beginners',
    desc: 'A comprehensive 18-lesson curriculum by Microsoft Advocates covering LLMs, prompt engineering, and agents.',
    url: 'https://github.com/microsoft/generative-ai-for-beginners',
    logo: 'https://avatars.githubusercontent.com/u/6154722?v=4',
  },
  {
    id: 'course-3',
    provider: 'Harvard',
    title: 'CS50\'s Introduction to Computer Science',
    desc: 'Harvard University\'s legendary introduction to the intellectual enterprises of computer science and programming.',
    url: 'https://pll.harvard.edu/course/cs50-introduction-computer-science',
    logo: 'https://ui-avatars.com/api/?name=CS50&background=A51C30&color=fff',
  },
  {
    id: 'course-4',
    provider: 'Meta',
    title: 'Introduction to Front-End Development',
    desc: 'Meta\'s foundation-building course on web development languages, React, and styling frameworks.',
    url: 'https://www.coursera.org/learn/introduction-to-front-end-development',
    logo: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
  {
    id: 'course-5',
    provider: 'freeCodeCamp',
    title: 'Scientific Computing with Python',
    desc: 'Over 300 hours of Python programming, loops, data structures, and algorithm projects.',
    url: 'https://www.freecodecamp.org/learn/scientific-computing-with-python/',
    logo: 'https://avatars.githubusercontent.com/u/9892522?v=4',
  },
  {
    id: 'course-6',
    provider: 'Google',
    title: 'Google Cloud Computing Foundations',
    desc: 'Learn about cloud concepts, big data, machine learning, and infrastructure services on Google Cloud.',
    url: 'https://www.cloudskillsboost.google/course_templates/153',
    logo: 'https://avatars.githubusercontent.com/u/1342004?v=4',
  },
  {
    id: 'course-7',
    provider: 'Microsoft',
    title: 'Web Development for Beginners',
    desc: 'A 24-lesson curriculum by Microsoft Advocates covering HTML, CSS, JavaScript, and building web apps.',
    url: 'https://github.com/microsoft/Web-Dev-For-Beginners',
    logo: 'https://avatars.githubusercontent.com/u/6154722?v=4',
  },
  {
    id: 'course-8',
    provider: 'Harvard',
    title: 'CS50\'s Web Programming with Python and JavaScript',
    desc: 'Deep-dive into designing and implementing web apps with Python, JavaScript, Django, and React.',
    url: 'https://pll.harvard.edu/course/cs50s-web-programming-python-and-javascript',
    logo: 'https://ui-avatars.com/api/?name=CS50&background=A51C30&color=fff',
  },
  {
    id: 'course-9',
    provider: 'Meta',
    title: 'Introduction to Back-End Development',
    desc: 'Learn back-end systems, databases, servers, APIs, and python coding essentials.',
    url: 'https://www.coursera.org/learn/introduction-to-back-end-development',
    logo: 'https://avatars.githubusercontent.com/u/69631?v=4',
  },
  {
    id: 'course-10',
    provider: 'freeCodeCamp',
    title: 'Data Analysis with Python',
    desc: 'Learn how to read data from CSVs, use NumPy, Pandas, Matplotlib, and work on data cleaning tasks.',
    url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/',
    logo: 'https://avatars.githubusercontent.com/u/9892522?v=4',
  }
]

export default function Navbar() {
  const navigate = useNavigate()
  const [bellOpen, setBellOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('courses') // 'courses' or 'opportunities'
  const [opportunities, setOpportunities] = useState([])
  const [loadingOpp, setLoadingOpp] = useState(false)
  const [coursesExpanded, setCoursesExpanded] = useState(false)
  const [oppsExpanded, setOppsExpanded] = useState(false)
  const dropdownRef = useRef(null)

  // Reset expansion state when bell closes or activeTab changes
  useEffect(() => {
    if (!bellOpen) {
      setCoursesExpanded(false)
      setOppsExpanded(false)
    }
  }, [bellOpen, activeTab])

  // Load OSS Opportunities when dropdown is opened or tab changed to opportunities
  useEffect(() => {
    if (bellOpen && activeTab === 'opportunities' && opportunities.length === 0) {
      setLoadingOpp(true)
      fetchOpportunities('javascript,typescript,python,go,rust')
        .then(setOpportunities)
        .catch(() => {
          toast.error('Failed to load open source opportunities')
        })
        .finally(() => setLoadingOpp(false))
    }
  }, [bellOpen, activeTab, opportunities.length])

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const visibleCourses = coursesExpanded ? CURATED_COURSES : CURATED_COURSES.slice(0, 3)
  const visibleOpps = oppsExpanded ? opportunities : opportunities.slice(0, 3)

  return (
    <nav className="sticky top-0 z-50 border-b border-gh-border bg-gh-darker/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 text-white font-semibold shrink-0 hover:opacity-80 transition-opacity">
          <Telescope className="w-5 h-5 text-gh-blue" />
          <span className="font-mono text-sm">DevScope</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchInput size="md" placeholder="Search GitHub users..." />
        </div>

        {/* Menu Items */}
        <div className="ml-auto flex items-center gap-4 relative" ref={dropdownRef}>
          {/* Trending Link */}
          <Link
            to="/trending"
            className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors text-sm font-medium"
          >
            <Flame className="w-4 h-4 text-gh-orange" />
            <span className="hidden sm:inline">Trending</span>
          </Link>

          {/* Notifications Bell */}
          <button
            onClick={() => setBellOpen(!bellOpen)}
            className="relative text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {opportunities.length === 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gh-blue rounded-full animate-pulse" />
            )}
          </button>

          {/* Github Icon */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white transition-colors hidden xs:block"
          >
            <Github className="w-5 h-5" />
          </a>

          {/* Notifications Dropdown Panel */}
          {bellOpen && (
            <div className="absolute right-0 top-10 w-80 sm:w-96 bg-gh-surface border border-gh-border rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in">
              {/* Dropdown Tabs */}
              <div className="flex border-b border-gh-border bg-gh-darker/40">
                <button
                  onClick={() => setActiveTab('courses')}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'courses'
                      ? 'border-gh-blue text-white bg-gh-surface/10'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Free Courses
                </button>
                <button
                  onClick={() => setActiveTab('opportunities')}
                  className={`flex-1 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                    activeTab === 'opportunities'
                      ? 'border-gh-blue text-white bg-gh-surface/10'
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  OSS Opportunities
                </button>
              </div>

              {/* Dropdown Body */}
              <div className="max-h-[400px] overflow-y-auto">
                {activeTab === 'courses' ? (
                  <div className="divide-y divide-gh-border">
                    {visibleCourses.map(course => (
                      <a
                        key={course.id}
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-4 flex gap-3 text-sm hover:bg-white/[0.02] transition-colors"
                      >
                        <img
                          src={course.logo}
                          alt={course.provider}
                          className="w-9 h-9 rounded-lg border border-gh-border shrink-0 object-cover bg-white"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-white text-xs truncate">{course.provider}</span>
                            <span className="text-[9px] font-mono font-semibold flex items-center gap-0.5 text-gh-blue">
                              Free <ExternalLink className="w-2.5 h-2.5" />
                            </span>
                          </div>
                          <h4 className="text-xs font-semibold text-white mb-1 line-clamp-1">
                            {course.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-normal line-clamp-2">
                            {course.desc}
                          </p>
                        </div>
                      </a>
                    ))}

                    {CURATED_COURSES.length > 3 && (
                      <button
                        onClick={() => setCoursesExpanded(!coursesExpanded)}
                        className="w-full py-2.5 text-xs text-gh-blue hover:text-white bg-gh-darker/20 hover:bg-gh-darker/40 flex items-center justify-center gap-1 font-semibold transition-colors border-t border-gh-border"
                      >
                        {coursesExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" /> Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" /> Show More Courses ({CURATED_COURSES.length - 3} more)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-gh-border">
                    {loadingOpp ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        Loading opportunities...
                      </div>
                    ) : opportunities.length === 0 ? (
                      <div className="p-8 text-center text-gray-500 text-sm">
                        No active opportunities found
                      </div>
                    ) : (
                      <>
                        {visibleOpps.map(opp => (
                          <a
                            key={opp.id}
                            href={opp.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="p-4 block hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-start gap-2 mb-1">
                              <span className="text-[11px] font-mono font-semibold text-gh-blue bg-gh-blue/10 px-1.5 py-0.5 rounded border border-gh-blue/20">
                                {opp.repository?.full_name}
                              </span>
                              <span className="ml-auto text-[10px] text-gray-500 flex items-center gap-0.5">
                                Open Issue <ExternalLink className="w-2.5 h-2.5" />
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-white mb-1.5 line-clamp-2">
                              {opp.title}
                            </h4>
                            <div className="flex flex-wrap gap-1">
                              {opp.labels.slice(0, 2).map(l => (
                                <span
                                  key={l.name}
                                  className="text-[10px] bg-gh-surface text-gray-400 border border-gh-border px-1.5 py-0.2 rounded-full font-mono"
                                >
                                  {l.name}
                                </span>
                              ))}
                            </div>
                          </a>
                        ))}

                        {opportunities.length > 3 && (
                          <button
                            onClick={() => setOppsExpanded(!oppsExpanded)}
                            className="w-full py-2.5 text-xs text-gh-blue hover:text-white bg-gh-darker/20 hover:bg-gh-darker/40 flex items-center justify-center gap-1 font-semibold transition-colors border-t border-gh-border"
                          >
                            {oppsExpanded ? (
                              <>
                                <ChevronUp className="w-3.5 h-3.5" /> Show Less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3.5 h-3.5" /> Show More Opportunities ({opportunities.length - 3} more)
                              </>
                            )}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
