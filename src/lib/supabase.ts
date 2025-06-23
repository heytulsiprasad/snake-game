import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  avatar_url?: string
  total_score: number
  games_played: number
  achievements: any[]
  preferences: Record<string, any>
  created_at: string
}

export type GameSession = {
  id: string
  user_id: string
  score: number
  level: number
  duration: number
  max_length: number
  food_eaten: number
  power_ups_collected: number
  game_mode: 'classic' | 'time_attack' | 'survival'
  device_type?: string
  created_at: string
}

export type LeaderboardEntry = {
  id: string
  user_id: string
  username: string
  score: number
  achieved_at: string
}