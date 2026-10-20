import { useState } from 'react'
import { streak } from '../lib'

// Fila de un hábito: círculo para marcar, nombre y racha.
export default function HabitRow({ habit, dateKey, onToggle, editing, onRemove }) {
  const [armed, setArmed] = useState(false)
  const done = !!habit.log[dateKey]
  const s = streak(habit)

  return (
    <div className="flex items-center gap-3 py-3">
      <button
        onClick={() => onToggle(habit.id, dateKey)}
        aria-label={done ? `Desmarcar ${habit.name}` : `Marcar ${habit.name}`}
        aria-pressed={done}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 text-lg text-white transition-colors"
        style={{ borderColor: habit.color, backgroundColor: done ? habit.color : 'transparent' }}
      >
        {done ? '✓' : ''}
      </button>
      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">{habit.name}</div>
        <div className="text-xs text-neutral-500 dark:text-neutral-400">
          {s ? `Racha de ${s} día${s > 1 ? 's' : ''}` : 'Sin racha'}
        </div>
      </div>
      {editing && (
        <button
          onClick={() => (armed ? onRemove(habit.id) : setArmed(true))}
          onBlur={() => setArmed(false)}
          className={`rounded-lg px-2 py-1 text-sm ${
            armed ? 'font-semibold text-red-600 dark:text-red-400' : 'text-neutral-500'
          }`}
        >
          {armed ? '¿Borrar?' : 'Borrar'}
        </button>
      )}
    </div>
  )
}
