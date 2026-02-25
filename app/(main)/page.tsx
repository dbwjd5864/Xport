import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StatCards from './_components/StatCards'
import RecentExperiences from './_components/RecentExperiences'
import NextSchedule from './_components/NextSchedule'
import WishlistPreview from './_components/WishlistPreview'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // 통계: 체험한 운동 수
  const { count: totalExperiences } = await supabase
    .from('experiences')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // 통계: 평균 재미도
  const { data: funScoreData } = await supabase
    .from('experiences')
    .select('fun_score')
    .eq('user_id', user.id)
    .not('fun_score', 'is', null)

  const avgFunScore = funScoreData && funScoreData.length > 0
    ? funScoreData.reduce((sum, e) => sum + (e.fun_score ?? 0), 0) / funScoreData.length
    : null

  // 최근 기록 3개
  const { data: recentExperiences } = await supabase
    .from('experiences')
    .select('id, started_at, ended_at, fun_score, review, sports(name, category)')
    .eq('user_id', user.id)
    .order('started_at', { ascending: false })
    .limit(3)

  // 다음 일정
  const { data: nextScheduleData } = await supabase
    .from('schedules')
    .select('id, scheduled_at, location, memo, sports(name)')
    .eq('user_id', user.id)
    .eq('status', '예정')
    .gte('scheduled_at', new Date().toISOString())
    .order('scheduled_at', { ascending: true })
    .limit(1)

  const nextSchedule = nextScheduleData?.[0] ?? null

  // 버킷리스트 미리보기
  const { data: wishlistItems } = await supabase
    .from('wishlist')
    .select('id, sports(name, category)')
    .eq('user_id', user.id)
    .order('priority', { ascending: false })
    .limit(6)

  const displayName = user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '탐험가'

  return (
    <div className="flex flex-col gap-6">
      {/* 인사말 */}
      <div>
        <p className="text-sm text-slate-400">안녕하세요 👋</p>
        <h1 className="text-2xl font-bold text-slate-900 mt-0.5">{displayName}님</h1>
        <p className="text-sm text-slate-500 mt-1">오늘도 새로운 운동을 탐험해볼까요?</p>
      </div>

      {/* 통계 카드 */}
      <StatCards
        totalExperiences={totalExperiences ?? 0}
        avgFunScore={avgFunScore}
        nextSchedule={nextSchedule as any}
      />

      {/* 다음 일정 */}
      <NextSchedule schedule={nextSchedule as any} />

      {/* 최근 기록 */}
      <RecentExperiences experiences={(recentExperiences ?? []) as any} />

      {/* 버킷리스트 */}
      <WishlistPreview items={(wishlistItems ?? []) as any} />
    </div>
  )
}
