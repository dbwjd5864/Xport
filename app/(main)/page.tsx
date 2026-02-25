import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">안녕하세요, {user.user_metadata.full_name}님!</h1>
        <p className="text-slate-500 text-sm">Xport에 오신 걸 환영해요 🎉</p>
      </div>
    </div>
  )
}
