'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface PhotoUploaderProps {
  userId: string
  onChange: (urls: string[]) => void
}

export default function PhotoUploader({ userId, onChange }: PhotoUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    const isHeic = file.type === 'image/heic' || file.type === 'image/heif' ||
      file.name.toLowerCase().endsWith('.heic') || file.name.toLowerCase().endsWith('.heif')

    if (!isHeic) return file

    const heic2any = (await import('heic2any')).default
    const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.85 })
    const blob = Array.isArray(converted) ? converted[0] : converted
    return new File([blob], file.name.replace(/\.(heic|heif)$/i, '.jpg'), { type: 'image/jpeg' })
  }

  const handleFiles = async (files: FileList) => {
    if (uploadedUrls.length + files.length > 3) {
      alert('사진은 최대 3장까지 업로드할 수 있어요')
      return
    }

    setLoading(true)
    const newUrls: string[] = []
    const newPreviews: string[] = []

    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name}은 5MB를 초과해요`)
        continue
      }

      try {
        const converted = await convertHeicToJpeg(file)

        // 미리보기
        const previewUrl = URL.createObjectURL(converted)
        newPreviews.push(previewUrl)

        // Supabase Storage 업로드
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
        const path = `${userId}/${fileName}`

        const { error } = await supabase.storage
          .from('experience-photos')
          .upload(path, converted, { contentType: 'image/jpeg' })

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('experience-photos')
          .getPublicUrl(path)

        newUrls.push(publicUrl)
      } catch (err) {
        console.error('업로드 실패:', err)
        alert('업로드 중 오류가 발생했어요')
      }
    }

    const updatedUrls = [...uploadedUrls, ...newUrls]
    const updatedPreviews = [...previews, ...newPreviews]

    setUploadedUrls(updatedUrls)
    setPreviews(updatedPreviews)
    onChange(updatedUrls)
    setLoading(false)
  }

  const removePhoto = async (index: number) => {
    const urlToRemove = uploadedUrls[index]
    const path = urlToRemove.split('/experience-photos/')[1]

    await supabase.storage.from('experience-photos').remove([path])

    const updatedUrls = uploadedUrls.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)

    setUploadedUrls(updatedUrls)
    setPreviews(updatedPreviews)
    onChange(updatedUrls)
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 flex-wrap">
        {previews.map((src, i) => (
          <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
            <Image src={src} alt={`사진 ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removePhoto(i)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center"
            >
              <X size={12} className="text-white" />
            </button>
          </div>
        ))}

        {uploadedUrls.length < 3 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
            className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-1 text-slate-400 hover:border-blue-300 hover:text-blue-400 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <ImagePlus size={20} />
                <span className="text-xs">사진 추가</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="text-xs text-slate-400">JPG, PNG, HEIC 최대 3장 · 장당 5MB 이하</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  )
}
