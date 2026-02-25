import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'
import { ChevronRight, Dumbbell } from 'lucide-react'

interface Experience {
  id: string
  experienced_at: string
  fun_score: number | null
  review: string | null
  sports: { name: string; category: string | null }
}

interface RecentExperiencesProps {
  experiences: Experience[]
}

function FunScoreEmoji({ score }: { score: number | null }) {
  if (!score) return null
  const emojis = ['', '😐', '🙂', '😊', '😄', '🤩']
  return <span className="text-lg">{emojis[score]}</span>
}

export default function RecentExperiences({ experiences }: RecentExperiencesProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-slate-900">최근 기록</h2>
        <Link href="/profile" className="text-xs text-blue-500 flex items-center gap-0.5">
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      {experiences.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            <Dumbbell size={22} className="text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600">아직 기록이 없어요</p>
          <p className="text-xs text-slate-400">첫 번째 운동을 기록해보세요!</p>
          <Link
            href="/record"
            className="mt-2 px-4 py-2 bg-blue-500 text-white text-xs font-medium rounded-xl"
          >
            기록하러 가기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-white rounded-2xl border border-slate-100 px-4 py-3.5 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <Dumbbell size={18} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {exp.sports.name}
                  </p>
                  <FunScoreEmoji score={exp.fun_score} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {format(parseISO(exp.experienced_at), 'M월 d일 (EEE)', { locale: ko })}
                </p>
                {exp.review && (
                  <p className="text-xs text-slate-500 mt-1 truncate">{exp.review}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
