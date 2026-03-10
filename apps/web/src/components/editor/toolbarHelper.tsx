export function Btn({onClick, active, title, children, disabled,}: {onClick: () => void ,
  active?: boolean , title: string , children: React.ReactNode,disabled?: boolean}) {
  return (
    <button type="button" onClick={onClick} title={title} aria-pressed={active} disabled={disabled}
      className={`
        w-8 h-8 flex items-center justify-center rounded-md transition-all duration-100 outline-none
        font-['DM_Sans',sans-serif] disabled:opacity-30 disabled:cursor-not-allowed
        ${active
          ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
          : `text-neutral-400 dark:text-neutral-500
             hover:bg-neutral-100 dark:hover:bg-neutral-800
             hover:text-neutral-800 dark:hover:text-neutral-200`
        }
      `}
    >
      {children}
    </button>
  )
}

export function Sep() {
  return <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-0.5 shrink-0" />
}

export function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>
}