import { useState } from 'react'
import HabitRow from '../components/HabitRow'
import Nav from '../components/Nav'
import { ACCENT, fmt, hexA, iso, ratio, todayDate } from '../lib'

const LETTERS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export default function Month({ store }) {
  const { habits, toggle } = store
  const today = todayDate()
  const todayKey = iso(today)
  const [month, setMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [sel, setSel] = useState(todayKey)

  const y = month.getFullYear()
  const m = month.getMonth()
  const total = new Date(y, m + 1, 0).getDate()
  const lead = (month.getDay() + 6) % 7
  const isCurrent = y === today.getFullYear() && m === today.getMonth()

  // Días del mes con al menos un hábito cumplido
  let activeDays = 0
  for (let d = 1; d <= total; d++) {
    const r = ratio(habits, iso(new Date(y, m, d)))
    if (r) activeDays++
  }

  const go = (n) => {
    const next = new Date(y, m + n, 1)
    setMonth(next)
    setSel(null)
  }

  const selDate = sel ? new Date(sel + 'T00:00:00') : null

  return (
    <section>
      <Nav
        label={fmt(month, { month: 'long', year: 'numeric' })}
        sub={habits.length ? `${activeDays} día${activeDays === 1 ? '' : 's'} con actividad` : undefined}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        nextDisabled={isCurrent}
      />

      <div className="mb-1 grid grid-cols-7 gap-1.5 text-center text-xs text-neutral-500 dark:text-neutral-400">
        {LETTERS.map((l) => (
          <div key={l}>{l}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: lead }).map((_, i) => (
          <div key={'b' + i} />
        ))}
        {Array.from({ length: total }).map((_, i) => {
          const d = i + 1
          const k = iso(new Date(y, m, d))
          const future = k > todayKey
          const r = ratio(habits, k)
          const filled = r > 0
          return (
            <button
              key={k}
              disabled={future}
              onClick={() => setSel(k)}
              aria-label={k}
              className={`aspect-square rounded-lg text-xs tabular-nums disabled:opacity-30 ${
                filled ? '' : 'bg-neutral-200 dark:bg-neutral-800'
              } ${r >= 0.6 ? 'text-white' : ''} ${
                sel === k ? 'ring-2 ring-neutral-900 dark:ring-neutral-100' : k === todayKey ? 'ring-1 ring-neutral-400' : ''
              }`}
              style={filled ? { backgroundColor: hexA(ACCENT, 0.25 + 0.75 * r) } : undefined}
            >
              {d}
            </button>
          )
        })}
      </div>

      {selDate && (
        <div className="mt-5">
          <div className="text-sm font-semibold">{fmt(selDate, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
          {habits.length === 0 ? (
            <p className="py-6 text-sm text-neutral-500">Sin hábitos todavía.</p>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {habits.map((h) => (
                <HabitRow key={h.id} habit={h} dateKey={sel} onToggle={toggle} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
