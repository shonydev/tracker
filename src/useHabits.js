import { useEffect, useState } from 'react'
import { iso, todayDate } from './lib'

const KEY = 'habitos.v2'

function load() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

export function useHabits() {
  const [habits, setHabits] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(habits))
    } catch {}
  }, [habits])

  const add = (name, color) =>
    setHabits((hs) => [
      ...hs,
      { id: Date.now().toString(36), name, color, created: iso(todayDate()), log: {} },
    ])

  const remove = (id) => setHabits((hs) => hs.filter((h) => h.id !== id))

  const toggle = (id, key) =>
    setHabits((hs) =>
      hs.map((h) => {
        if (h.id !== id) return h
        const log = { ...h.log }
        if (log[key]) delete log[key]
        else log[key] = 1
        return { ...h, log }
      })
    )

  return { habits, add, remove, toggle }
}
