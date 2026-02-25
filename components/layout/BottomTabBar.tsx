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

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full text-xs font-medium transition-colors',
                isActive ? 'text-blue-500' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={cn(isActive ? 'text-blue-500' : 'text-slate-400')}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
