import { useState } from 'react'
import { useHabits } from './useHabits'
import AddForm from './components/AddForm'
import Day from './views/Day'
import Week from './views/Week'
import Month from './views/Month'
import Year from './views/Year'

const TABS = ['Día', 'Semana', 'Mes', 'Año']

export default function App() {
  const store = useHabits()
  const [tab, setTab] = useState(0)
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState(false)

  const iconBtn =
    'grid h-10 min-w-10 place-items-center rounded-full px-2 text-sm text-neutral-600 active:bg-neutral-200 dark:text-neutral-300 dark:active:bg-neutral-800'

  return (
    <div className="mx-auto min-h-screen max-w-xl" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <header className="flex items-center justify-between px-4 pb-3 pt-5">
        <h1 className="text-2xl font-bold tracking-tight">Hábitos</h1>
        <div className="flex items-center gap-1">
          {tab === 0 && store.habits.length > 0 && (
            <button className={iconBtn} onClick={() => setEditing(!editing)}>
              {editing ? 'Listo' : 'Editar'}
            </button>
          )}
          <button
            className={`${iconBtn} text-2xl`}
            onClick={() => setAdding(!adding)}
            aria-label="Agregar hábito"
            aria-expanded={adding}
          >
            {adding ? '×' : '+'}
          </button>
        </div>
      </header>

      <main className="px-4 pb-28">
        {adding && <AddForm onAdd={store.add} onDone={() => setAdding(false)} />}
        {tab === 0 && <Day store={store} editing={editing} />}
        {tab === 1 && <Week store={store} />}
        {tab === 2 && <Month store={store} />}
        {tab === 3 && <Year store={store} />}
      </main>

      <nav
        className="fixed inset-x-0 bottom-0 border-t border-neutral-200 bg-neutral-50/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto grid max-w-xl grid-cols-4">
          {TABS.map((t, i) => (
            <button
              key={t}
              onClick={() => setTab(i)}
              aria-current={tab === i ? 'page' : undefined}
              className={`py-3.5 text-sm ${
                tab === i
                  ? 'font-semibold text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
