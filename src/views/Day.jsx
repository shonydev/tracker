import { useState } from 'react'
import HabitRow from '../components/HabitRow'
import Nav from '../components/Nav'
import { activeOn, addDays, fmt, iso, ratio, todayDate } from '../lib'

export default function Day({ store, editing }) {
  const { habits, toggle, remove } = store
  const today = todayDate()
  const [date, setDate] = useState(today)
  const key = iso(date)
  const isToday = key === iso(today)

  const active = habits.filter((h) => activeOn(h, key))
  const done = active.filter((h) => h.log[key]).length
  const r = ratio(habits, key)

  return (
    <section>
      <Nav
        label={isToday ? 'Hoy' : fmt(date, { weekday: 'long' })}
        sub={fmt(date, { day: 'numeric', month: 'long', year: 'numeric' })}
        onPrev={() => setDate(addDays(date, -1))}
        onNext={() => setDate(addDays(date, 1))}
        nextDisabled={isToday}
      />

      {habits.length > 0 && (
        <div className="mb-2">
          <div className="mb-1 flex justify-between text-sm tabular-nums text-neutral-500 dark:text-neutral-400">
            <span>
              {done} de {active.length}
            </span>
            <span>{Math.round((r || 0) * 100)}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
            <div
              className="h-full rounded-full bg-green-600 transition-all dark:bg-green-500"
              style={{ width: `${(r || 0) * 100}%` }}
            />
          </div>
        </div>
      )}

      {habits.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">
          Aún no tienes hábitos.
          <br />
          Toca + arriba para crear el primero.
        </p>
      ) : (
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {habits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              dateKey={key}
              onToggle={toggle}
              editing={editing}
              onRemove={remove}
            />
          ))}
        </div>
      )}
    </section>
  )
}
