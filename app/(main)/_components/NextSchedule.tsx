import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CalendarDays, MapPin, ChevronRight } from 'lucide-react'

interface Schedule {
  id: string
  scheduled_at: string
  location: string | null
  memo: string | null
  sports: { name: string }
}

interface NextScheduleProps {
  schedule: Schedule | null
}

export default function NextSchedule({ schedule }: NextScheduleProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900">다음 일정</h2>
        <Link href="/calendar" className="text-xs text-blue-500 flex items-center gap-0.5">
          캘린더 <ChevronRight size={14} />
        </Link>
      </div>

      {!schedule ? (
        <div className="bg-white rounded-2xl border border-slate-100 px-4 py-3.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
            <CalendarDays size={18} className="text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">예정된 일정이 없어요</p>
            <Link href="/calendar" className="text-xs text-blue-500 mt-0.5 block">
              일정 추가하기
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-blue-500 rounded-2xl px-4 py-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={15} className="opacity-80" />
            <span className="text-xs opacity-80">
              {format(parseISO(schedule.scheduled_at), 'M월 d일 (EEE) HH:mm', { locale: ko })}
            </span>
          </div>
          <p className="text-lg font-bold">{schedule.sports.name}</p>
          {schedule.location && (
            <div className="flex items-center gap-1 mt-1.5 opacity-80">
              <MapPin size={13} />
              <span className="text-xs">{schedule.location}</span>
            </div>
          )}
          {schedule.memo && (
            <p className="text-xs opacity-70 mt-1">{schedule.memo}</p>
          )}
        </div>
      )}
    </section>
  )
}
