"use client"

import Link from "next/link"

export function MobileMenu({
  onClose,
}: {
  onClose: () => void
}) {
  return (
    <div className="fixed w-[50%] inset-0 z-50 bg-background">
      <div className="h-14 px-4 border-b flex items-center justify-between">
        <span className="font-semibold">Menu</span>
        <button onClick={onClose}>✕</button>
      </div>

      <div className="p-6 flex flex-col gap-6">
        <Link href="/" onClick={onClose} className="text-sm font-medium">
          Home
        </Link>
        <Link href="/docs" onClick={onClose} className="text-sm font-medium">
          Docs
        </Link>
        <Link href="/signin" onClick={onClose} className="text-sm font-medium">
          Sign in
        </Link>
      </div>
    </div>
  )
}
