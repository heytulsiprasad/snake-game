import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { LeaderboardEntry } from '../lib/supabase'

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select('*')
        .order('score', { ascending: false })
        .limit(10)

      if (error) throw error
      console.log('Leaderboard data:', data)
      setLeaderboard(data || [])
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLeaderboard = async (userId: string, username: string, score: number) => {
    try {
      // Check if user already has an entry
      const { data: existing } = await supabase
        .from('leaderboard_entries')
        .select('score')
        .eq('user_id', userId)
        .single()

      if (existing && existing.score >= score) {
        return // Don't update if the existing score is higher
      }

      // Upsert the leaderboard entry
      const { error } = await supabase
        .from('leaderboard_entries')
        .upsert({
          user_id: userId,
          username,
          score,
          achieved_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        })

      if (error) throw error

      // Refresh leaderboard
      fetchLeaderboard()
    } catch (error) {
      console.error('Error updating leaderboard:', error)
    }
  }

  useEffect(() => {
    fetchLeaderboard()

    // Subscribe to realtime updates
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'leaderboard_entries'
      }, () => {
        fetchLeaderboard()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return {
    leaderboard,
    loading,
    updateLeaderboard,
    refetch: fetchLeaderboard,
  }
}