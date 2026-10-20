// Navegación entre períodos: ‹ título ›
export default function Nav({ label, sub, onPrev, onNext, nextDisabled }) {
  const btn =
    'grid h-10 w-10 place-items-center rounded-full text-xl text-neutral-600 active:bg-neutral-200 disabled:opacity-25 dark:text-neutral-300 dark:active:bg-neutral-800'
  return (
    <div className="mb-3 flex items-center justify-between">
      <button className={btn} onClick={onPrev} aria-label="Anterior">
        ‹
      </button>
      <div className="text-center">
        <div className="font-semibold">{label}</div>
        {sub && <div className="text-xs text-neutral-500 dark:text-neutral-400">{sub}</div>}
      </div>
      <button className={btn} onClick={onNext} disabled={nextDisabled} aria-label="Siguiente">
        ›
      </button>
    </div>
  )
}
