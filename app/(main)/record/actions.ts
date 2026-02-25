'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createExperience(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const sportId = formData.get('sport_id') as string
  const startedAt = formData.get('started_at') as string
  const endedAt = formData.get('ended_at') as string
  const funScore = formData.get('fun_score') ? Number(formData.get('fun_score')) : null
  const difficultyScore = formData.get('difficulty_score') ? Number(formData.get('difficulty_score')) : null
  const review = formData.get('review') as string
  const photosJson = formData.get('photos') as string
  const photos = photosJson ? JSON.parse(photosJson) : []

  const { error } = await supabase.from('experiences').insert({
    user_id: user.id,
    sport_id: sportId,
    started_at: startedAt,
    ended_at: endedAt || null,
    fun_score: funScore,
    difficulty_score: difficultyScore,
    review: review || null,
    photos,
  })

  if (error) throw new Error(error.message)

  redirect('/')
}
