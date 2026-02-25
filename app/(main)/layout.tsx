import Sidebar from '@/components/layout/Sidebar'
import BottomTabBar from '@/components/layout/BottomTabBar'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 데스크탑 사이드바 */}
      <Sidebar />

      {/* 메인 콘텐츠 */}
      <main className="md:ml-60 pb-20 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* 모바일 하단 탭바 */}
      <BottomTabBar />
    </div>
  )
}
