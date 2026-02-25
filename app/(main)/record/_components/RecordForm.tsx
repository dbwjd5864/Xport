"use client";

import { useState } from "react";
import { createExperience } from "../actions";
import PhotoUploader from "./PhotoUploader";
import { Loader2 } from "lucide-react";

interface Sport {
  id: string;
  name: string;
  category: string | null;
}

interface RecordFormProps {
  sports: Sport[];
  userId: string;
}

const FUN_EMOJIS = ["", "😐", "🙂", "😊", "😄", "🤩"];
const DIFFICULTY_LABELS = [
  "",
  "매우 쉬움",
  "쉬움",
  "보통",
  "어려움",
  "매우 어려움",
];

export default function RecordForm({ sports, userId }: RecordFormProps) {
  const [funScore, setFunScore] = useState<number>(0);
  const [difficultyScore, setDifficultyScore] = useState<number>(0);
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("fun_score", funScore > 0 ? String(funScore) : "");
    formData.set(
      "difficulty_score",
      difficultyScore > 0 ? String(difficultyScore) : "",
    );
    formData.set("photos", JSON.stringify(photos));

    try {
      await createExperience(formData);
    } catch {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* 운동 선택 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          어떤 운동을 했나요? *
        </label>
        <select
          name="sport_id"
          required
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">운동 선택</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name} {sport.category ? `· ${sport.category}` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* 기간 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          언제 했나요? *
        </label>
        <div className="flex items-center gap-2">
          <input
            name="started_at"
            type="date"
            required
            defaultValue={new Date().toISOString().split("T")[0]}
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <span className="text-slate-400 text-sm shrink-0">~</span>
          <input
            name="ended_at"
            type="date"
            className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <p className="text-xs text-slate-400">하루 체험이면 시작일만 입력해도 돼요</p>
      </div>

      {/* 재미도 */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-slate-700">재미도</label>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setFunScore(score === funScore ? 0 : score)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                funScore === score
                  ? "border-blue-400 bg-blue-50"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <span className="text-2xl">{FUN_EMOJIS[score]}</span>
              <span className="text-xs text-slate-400">{score}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 난이도 */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-slate-700">난이도</label>
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              type="button"
              onClick={() =>
                setDifficultyScore(score === difficultyScore ? 0 : score)
              }
              className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-medium transition-all ${
                difficultyScore === score
                  ? "border-blue-400 bg-blue-50 text-blue-600"
                  : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
              }`}
            >
              {DIFFICULTY_LABELS[score]}
            </button>
          ))}
        </div>
      </div>

      {/* 한줄 리뷰 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">
          한줄 리뷰
        </label>
        <textarea
          name="review"
          placeholder="오늘 운동 어땠나요?"
          rows={3}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none"
        />
      </div>

      {/* 사진 */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-slate-700">사진</label>
        <PhotoUploader userId={userId} onChange={setPhotos} />
      </div>

      {/* 저장 버튼 */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            저장 중...
          </>
        ) : (
          "기록 저장하기"
        )}
      </button>
    </form>
  );
}
