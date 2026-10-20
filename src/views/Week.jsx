import { useState } from 'react'
import Nav from '../components/Nav'
import { activeOn, addDays, fmt, hexA, iso, startOfWeek, todayDate } from '../lib'

const LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export default function Week({ store }) {
  const { habits, toggle } = store
  const today = todayDate()
  const todayKey = iso(today)
  const [start, setStart] = useState(() => startOfWeek(today))
  const days = [...Array(7)].map((_, i) => addDays(start, i))
  const isCurrent = iso(start) === iso(startOfWeek(today))

  // Total de la semana: hábitos cumplidos / posibles (hasta hoy)
  let done = 0
  let possible = 0
  habits.forEach((h) =>
    days.forEach((d) => {
      const k = iso(d)
      if (k > todayKey || !activeOn(h, k)) return
      possible++
      if (h.log[k]) done++
    })
  )
  const pct = possible ? Math.round((done / possible) * 100) : 0

  return (
    <section>
      <Nav
        label={isCurrent ? 'Esta semana' : `${fmt(start, { day: 'numeric', month: 'short' })} – ${fmt(addDays(start, 6), { day: 'numeric', month: 'short' })}`}
        sub={habits.length ? `${pct}% cumplido` : undefined}
        onPrev={() => setStart(addDays(start, -7))}
        onNext={() => setStart(addDays(start, 7))}
        nextDisabled={isCurrent}
      />

      {habits.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">Crea un hábito para verlo aquí.</p>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs text-neutral-500 dark:text-neutral-400">
            {days.map((d, i) => (
              <div key={i} className={iso(d) === todayKey ? 'font-bold text-neutral-900 dark:text-neutral-100' : ''}>
                <div>{LETTERS[i]}</div>
                <div className="tabular-nums">{d.getDate()}</div>
              </div>
            ))}
          </div>

          {habits.map((h) => {
            const count = days.filter((d) => h.log[iso(d)]).length
            return (
              <div key={h.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-2">
                  <span className="truncate text-sm font-medium">{h.name}</span>
                  <span className="shrink-0 text-xs tabular-nums text-neutral-500 dark:text-neutral-400">{count}/7</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {days.map((d) => {
                    const k = iso(d)
                    const future = k > todayKey
                    const on = !!h.log[k]
                    return (
                      <button
                        key={k}
                        disabled={future}
                        onClick={() => toggle(h.id, k)}
                        aria-label={`${h.name}, ${k}`}
                        aria-pressed={on}
                        className={`aspect-square rounded-lg disabled:opacity-30 ${
                          on ? '' : 'bg-neutral-200 dark:bg-neutral-800'
                        } ${k === todayKey ? 'ring-1 ring-neutral-400 dark:ring-neutral-500' : ''}`}
                        style={on ? { backgroundColor: h.color } : undefined}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
