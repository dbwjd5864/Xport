import { Trophy, Star, CalendarDays } from 'lucide-react'
import { differenceInDays, parseISO } from 'date-fns'

interface StatCardsProps {
  totalExperiences: number
  avgFunScore: number | null
  nextSchedule: { scheduled_at: string; sports: { name: string } } | null
}

export default function StatCards({ totalExperiences, avgFunScore, nextSchedule }: StatCardsProps) {
  const getDday = () => {
    if (!nextSchedule) return null
    const diff = differenceInDays(parseISO(nextSchedule.scheduled_at), new Date())
    if (diff === 0) return 'D-Day'
    if (diff < 0) return null
    return `D-${diff}`
  }

  const dday = getDday()

  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
          <Trophy size={16} className="text-blue-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{totalExperiences}</p>
          <p className="text-xs text-slate-400 mt-0.5">체험한 운동</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-xl bg-yellow-50 flex items-center justify-center">
          <Star size={16} className="text-yellow-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">
            {avgFunScore ? avgFunScore.toFixed(1) : '-'}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">평균 재미도</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center">
          <CalendarDays size={16} className="text-green-500" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-900">{dday ?? '-'}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {nextSchedule ? nextSchedule.sports.name : '다음 일정'}
          </p>
        </div>
      </div>
    </div>
  )
}
