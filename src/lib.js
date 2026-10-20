// Utilidades de fechas y estadísticas. Las fechas se guardan como "YYYY-MM-DD".

const pad = (n) => String(n).padStart(2, '0')

export const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const todayDate = () => {
  const x = new Date()
  x.setHours(0, 0, 0, 0)
  return x
}

export const addDays = (d, n) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// La semana empieza el lunes
export const startOfWeek = (d) => {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return addDays(x, -((x.getDay() + 6) % 7))
}

export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
export const fmt = (d, opts) => cap(d.toLocaleDateString('es', opts))

export const hexA = (hex, a) => {
  const n = parseInt(hex.slice(1), 16)
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`
}

// Un hábito cuenta desde el día en que se creó (o si ya tiene registro ese día)
export const activeOn = (h, key) => key >= h.created || !!h.log[key]

// Fracción de hábitos cumplidos ese día (null si aún no había hábitos)
export function ratio(habits, key) {
  const active = habits.filter((h) => activeOn(h, key))
  if (!active.length) return null
  return active.filter((h) => h.log[key]).length / active.length
}

export function streak(h, from = todayDate()) {
  let n = 0
  let d = from
  if (!h.log[iso(d)]) d = addDays(d, -1)
  while (h.log[iso(d)]) {
    n++
    d = addDays(d, -1)
  }
  return n
}

export const COLORS = ['#16a34a', '#2563eb', '#db2777', '#ea580c', '#7c3aed', '#0891b2']
export const ACCENT = '#16a34a'
