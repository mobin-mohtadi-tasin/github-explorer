import { useMemo } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function getCellColor(count) {
  if (!count || count === 0) return '#161b22'
  if (count === 1) return '#0e4429'
  if (count <= 3) return '#006d32'
  if (count <= 5) return '#26a641'
  return '#39d353'
}

export default function ActivityHeatmap({ activityMap }) {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date()
    const cells = []
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      cells.push({ date: key, count: activityMap[key] || 0, d })
    }

    // Pad to start on Sunday
    const firstDay = cells[0].d.getDay()
    const padded = [...Array(firstDay).fill(null), ...cells]

    const weeks = []
    for (let i = 0; i < padded.length; i += 7) {
      weeks.push(padded.slice(i, i + 7))
    }

    // Month labels
    const labels = []
    weeks.forEach((week, wi) => {
      const firstCell = week.find(c => c)
      if (firstCell && firstCell.d.getDate() <= 7) {
        labels.push({ month: MONTHS[firstCell.d.getMonth()], wi })
      }
    })

    return { weeks, monthLabels: labels }
  }, [activityMap])

  const totalActivity = Object.values(activityMap).reduce((s, v) => s + v, 0)

  return (
    <div className="card animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300">Activity — last 52 weeks</h3>
        <span className="text-xs text-gray-500">{totalActivity} public events</span>
      </div>

      <div className="overflow-x-auto">
        <div style={{ minWidth: 640 }}>
          {/* Month labels */}
          <div className="flex ml-7 mb-1">
            {weeks.map((_, wi) => {
              const label = monthLabels.find(l => l.wi === wi)
              return (
                <div key={wi} className="w-3 mr-0.5 shrink-0 text-[9px] text-gray-600">
                  {label ? label.month : ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {DAYS.map((d, i) => (
                <div key={d} className={`h-3 text-[9px] text-gray-600 flex items-center ${i % 2 === 0 ? 'opacity-0' : ''}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Grid */}
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((cell, di) =>
                  cell ? (
                    <div
                      key={di}
                      className="activity-cell w-3 h-3 rounded-sm cursor-pointer"
                      style={{ background: getCellColor(cell.count) }}
                      title={`${cell.date}: ${cell.count} events`}
                    />
                  ) : (
                    <div key={di} className="w-3 h-3" />
                  )
                )}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center gap-1 mt-2 justify-end">
            <span className="text-[9px] text-gray-600">Less</span>
            {['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'].map(c => (
              <div key={c} className="w-3 h-3 rounded-sm" style={{ background: c }} />
            ))}
            <span className="text-[9px] text-gray-600">More</span>
          </div>
        </div>
      </div>
    </div>
  )
}
