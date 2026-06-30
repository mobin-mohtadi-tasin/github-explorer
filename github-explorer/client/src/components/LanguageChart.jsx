import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { getLangColor } from '../utils/helpers'

export default function LanguageChart({ topLanguages }) {
  if (!topLanguages?.length) return null

  const total = topLanguages.reduce((s, l) => s + l.count, 0)

  return (
    <div className="card animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">Top Languages</h3>

      <div className="flex items-center gap-4">
        <div className="w-28 h-28 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={topLanguages}
                dataKey="count"
                nameKey="lang"
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={52}
                paddingAngle={2}
              >
                {topLanguages.map((entry) => (
                  <Cell key={entry.lang} fill={getLangColor(entry.lang)} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, fontSize: 11 }}
                labelStyle={{ color: '#e6edf3' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {topLanguages.map(({ lang, count }) => {
            const pct = Math.round((count / total) * 100)
            return (
              <div key={lang} className="flex items-center gap-2 text-xs">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: getLangColor(lang) }}
                />
                <span className="text-gray-300 truncate flex-1">{lang}</span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <div className="w-12 h-1.5 bg-gh-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: getLangColor(lang) }}
                    />
                  </div>
                  <span className="text-gray-500 w-7 text-right">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
