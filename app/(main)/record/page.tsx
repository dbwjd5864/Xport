import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import RecordForm from './_components/RecordForm'

export default async function RecordPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: sports } = await supabase
    .from('sports')
    .select('id, name, category')
    .order('name', { ascending: true })

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">기록하기</h1>
        <p className="text-slate-500 text-sm mt-1">오늘의 운동을 기록해보세요</p>
      </div>
      <RecordForm sports={sports ?? []} userId={user.id} />
    </div>
  )
}
