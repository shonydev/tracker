import { useState } from 'react'
import { COLORS } from '../lib'

export default function AddForm({ onAdd, onDone }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(COLORS[0])

  const submit = (e) => {
    e.preventDefault()
    const n = name.trim()
    if (!n) return
    onAdd(n, color)
    setName('')
    onDone()
  }

  return (
    <form
      onSubmit={submit}
      className="mb-4 space-y-3 rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800"
    >
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={40}
        placeholder="Nuevo hábito, ej. Leer 20 min"
        className="w-full rounded-xl border border-neutral-200 bg-transparent px-3 py-2.5 text-base dark:border-neutral-800"
      />
      <div className="flex items-center justify-between gap-3">
        <div className="flex gap-2" role="radiogroup" aria-label="Color">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={color === c}
              aria-label={c}
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full ${
                color === c ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-neutral-100 dark:ring-offset-neutral-950' : ''
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <button
          type="submit"
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Agregar
        </button>
      </div>
    </form>
  )
}
