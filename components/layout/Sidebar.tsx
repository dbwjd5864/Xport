'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Compass, PlusCircle, Calendar, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/explore', icon: Compass, label: '탐험' },
  { href: '/record', icon: PlusCircle, label: '기록' },
  { href: '/calendar', icon: Calendar, label: '캘린더' },
  { href: '/profile', icon: User, label: '프로필' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-slate-200 z-50">
      {/* 로고 */}
      <div className="px-6 py-6 border-b border-slate-100">
        <span className="text-xl font-bold tracking-tight text-slate-900">Xport</span>
        <p className="text-xs text-slate-400 mt-0.5">세상의 모든 운동</p>
      </div>

      {/* 메뉴 */}
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-500'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
