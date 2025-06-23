import { useCallback } from 'react'
import { supabase, GameSession } from '../lib/supabase'
import { GameState } from '../types/game'

export const useGameSession = () => {
  const saveGameSession = useCallback(async (
    userId: string,
    gameState: GameState
  ): Promise<void> => {
    try {
      const duration = Math.floor((Date.now() - gameState.startTime) / 1000)
      
      const gameSession: Omit<GameSession, 'id' | 'created_at'> = {
        user_id: userId,
        score: gameState.score,
        level: gameState.level,
        duration,
        max_length: gameState.snake.length,
        food_eaten: gameState.foodEaten,
        power_ups_collected: 0, // To be implemented later
        game_mode: gameState.gameMode,
        device_type: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      }

      const { error } = await supabase
        .from('game_sessions')
        .insert(gameSession)

      if (error) throw error

      // Update user profile stats
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_score, games_played')
        .eq('id', userId)
        .single()

      if (profile) {
        await supabase
          .from('profiles')
          .update({
            total_score: profile.total_score + gameState.score,
            games_played: profile.games_played + 1,
          })
          .eq('id', userId)
      }
    } catch (error) {
      console.error('Error saving game session:', error)
    }
  }, [])

  return {
    saveGameSession,
  }
}