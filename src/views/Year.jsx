import { useEffect, useRef, useState } from 'react'
import Nav from '../components/Nav'
import { ACCENT, activeOn, addDays, fmt, hexA, iso, ratio, startOfWeek, todayDate } from '../lib'

const CELL = 12
const GAP = 3
const STEP = CELL + GAP
const DAY_LABELS = ['L', '', 'X', '', 'V', '', 'D']

export default function Year({ store }) {
  const { habits } = store
  const today = todayDate()
  const todayKey = iso(today)
  const [year, setYear] = useState(today.getFullYear())
  const [filter, setFilter] = useState('all')
  const [picked, setPicked] = useState(null)
  const scroller = useRef(null)

  const habit = habits.find((h) => h.id === filter)
  const color = habit ? habit.color : ACCENT

  // Valor de un día: 0..1 o null si no aplica
  const valueOf = (k) => {
    if (!habit) return ratio(habits, k)
    return activeOn(habit, k) ? (habit.log[k] ? 1 : 0) : null
  }

  const gridStart = startOfWeek(new Date(year, 0, 1))
  const dec31 = new Date(year, 11, 31)
  const totalDays = Math.round((dec31 - gridStart) / 864e5) + 1
  const weeks = Math.ceil(totalDays / 7)

  // Etiquetas de mes: sobre la semana que contiene el día 1
  const monthLabels = []
  for (let w = 0; w < weeks; w++) {
    for (let r = 0; r < 7; r++) {
      const d = addDays(gridStart, w * 7 + r)
      if (d.getFullYear() === year && d.getDate() === 1) {
        monthLabels.push({ w, text: d.toLocaleDateString('es', { month: 'short' }).replace('.', '') })
      }
    }
  }

  // Estadísticas del año
  const end = year === today.getFullYear() ? today : dec31
  const flags = []
  for (let d = new Date(year, 0, 1); d <= end; d = addDays(d, 1)) {
    const v = valueOf(iso(d))
    flags.push(!!v && v > 0)
  }
  const activeCount = flags.filter(Boolean).length
  let best = 0
  let run = 0
  flags.forEach((f) => {
    run = f ? run + 1 : 0
    best = Math.max(best, run)
  })
  let cur = 0
  let i = flags.length - 1
  if (year === today.getFullYear() && i > 0 && !flags[i]) i-- // hoy aún puede completarse
  while (i >= 0 && flags[i]) {
    cur++
    i--
  }

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    if (year === today.getFullYear()) {
      const idx = Math.floor(Math.round((today - gridStart) / 864e5) / 7)
      el.scrollLeft = Math.max(0, idx * STEP - el.clientWidth + 90)
    } else {
      el.scrollLeft = 0
    }
  }, [year])

  const chip = (active) =>
    `shrink-0 rounded-full border px-3 py-1 text-sm ${
      active
        ? 'border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900'
        : 'border-neutral-200 text-neutral-600 dark:border-neutral-800 dark:text-neutral-300'
    }`

  const cells = []
  for (let w = 0; w < weeks; w++) {
    for (let r = 0; r < 7; r++) {
      const d = addDays(gridStart, w * 7 + r)
      const k = iso(d)
      if (d.getFullYear() !== year || k > todayKey) {
        cells.push(<div key={k + w + r} />)
        continue
      }
      const v = valueOf(k)
      cells.push(
        <button
          key={k}
          onClick={() => setPicked(k)}
          aria-label={k}
          className={`rounded-[3px] ${v > 0 ? '' : 'bg-neutral-200 dark:bg-neutral-800'} ${
            picked === k ? 'ring-1 ring-neutral-900 dark:ring-neutral-100' : ''
          }`}
          style={{
            width: CELL,
            height: CELL,
            ...(v > 0 ? { backgroundColor: hexA(color, 0.3 + 0.7 * v) } : {}),
          }}
        />
      )
    }
  }

  let pickedText = ' '
  if (picked && picked.startsWith(String(year))) {
    const d = new Date(picked + 'T00:00:00')
    const names = habits.filter((h) => h.log[picked]).map((h) => h.name)
    pickedText = `${fmt(d, { day: 'numeric', month: 'short' })}: ${names.length ? names.join(', ') : 'sin registros'}`
  }

  return (
    <section>
      <Nav
        label={String(year)}
        onPrev={() => setYear(year - 1)}
        onNext={() => setYear(year + 1)}
        nextDisabled={year >= today.getFullYear()}
      />

      {habits.length > 1 && (
        <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <button className={chip(filter === 'all')} onClick={() => setFilter('all')}>
            Todos
          </button>
          {habits.map((h) => (
            <button key={h.id} className={chip(filter === h.id)} onClick={() => setFilter(h.id)}>
              {h.name}
            </button>
          ))}
        </div>
      )}

      {habits.length === 0 ? (
        <p className="py-16 text-center text-neutral-500">Crea un hábito para empezar a llenar el año.</p>
      ) : (
        <>
          <div className="flex gap-1.5">
            <div className="shrink-0" style={{ paddingTop: 20 }}>
              <div
                className="text-[10px] leading-none text-neutral-400"
                style={{ display: 'grid', gridTemplateRows: `repeat(7, ${CELL}px)`, gap: GAP }}
              >
                {DAY_LABELS.map((l, i) => (
                  <span key={i} className="flex items-center">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div ref={scroller} className="min-w-0 flex-1 overflow-x-auto pb-2">
              <div style={{ width: weeks * STEP - GAP }}>
                <div className="relative mb-1 h-4 text-[10px] text-neutral-400">
                  {monthLabels.map((m) => (
                    <span key={m.w} className="absolute capitalize" style={{ left: m.w * STEP }}>
                      {m.text}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'column',
                    gridTemplateRows: `repeat(7, ${CELL}px)`,
                    gridAutoColumns: `${CELL}px`,
                    gap: GAP,
                  }}
                >
                  {cells}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
            <span className="min-h-[1rem] truncate pr-3">{pickedText}</span>
            <span className="flex shrink-0 items-center gap-1">
              Menos
              {[0, 0.3, 0.55, 0.8, 1].map((a) => (
                <span
                  key={a}
                  className={a === 0 ? 'bg-neutral-200 dark:bg-neutral-800' : ''}
                  style={{ width: 10, height: 10, borderRadius: 2, ...(a ? { backgroundColor: hexA(color, 0.3 + 0.7 * a) } : {}) }}
                />
              ))}
              Más
            </span>
          </div>

          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              [activeCount, 'días activos'],
              [cur, 'racha actual'],
              [best, 'mejor racha'],
            ].map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-neutral-200 py-3 dark:border-neutral-800">
                <dd className="text-2xl font-semibold tabular-nums">{n}</dd>
                <dt className="text-xs text-neutral-500 dark:text-neutral-400">{l}</dt>
              </div>
            ))}
          </dl>
        </>
      )}
    </section>
  )
}
