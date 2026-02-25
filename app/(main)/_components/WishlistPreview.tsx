import Link from 'next/link'
import { ChevronRight, Bookmark } from 'lucide-react'

interface WishlistItem {
  id: string
  sports: { name: string; category: string | null }
}

interface WishlistPreviewProps {
  items: WishlistItem[]
}

export default function WishlistPreview({ items }: WishlistPreviewProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900">버킷리스트</h2>
        <Link href="/explore" className="text-xs text-blue-500 flex items-center gap-0.5">
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <Bookmark size={18} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">버킷리스트가 비어있어요</p>
            <Link href="/explore" className="text-xs text-blue-500 mt-0.5 block">
              운동 탐험하러 가기
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-1.5"
            >
              <Bookmark size={13} className="text-blue-400" />
              <span className="text-sm font-medium text-slate-700">{item.sports.name}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
