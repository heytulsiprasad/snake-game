import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Trophy, Timer, Apple } from 'lucide-react'
import { GameBoard } from './Game/GameBoard'
import { GameControls } from './Game/GameControls'
import { LeaderboardTable } from './Leaderboard/LeaderboardTable'
import { Button } from './UI/Button'
import { useGame } from '../hooks/useGame'
import { useGameSession } from '../hooks/useGameSession'
import { useLeaderboard } from '../hooks/useLeaderboard'
import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Profile } from '../lib/supabase'
import { supabase } from '../lib/supabase'

interface GamePageProps {
  user: SupabaseUser | null
  userProfile: Profile | null
  onBack: () => void
  updateLeaderboard: (userId: string, username: string, score: number) => void
}

export const GamePage: React.FC<GamePageProps> = ({ user, userProfile, onBack, updateLeaderboard }) => {
  const { gameState, startGame, pauseGame, changeDirection, setDifficulty } = useGame()
  const { saveGameSession } = useGameSession()
  const { leaderboard } = useLeaderboard()
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [sessionStats, setSessionStats] = useState({
    gamesPlayed: 0,
    highScore: 0,
    totalFood: 0,
    totalTime: 0,
  })

  // Handle spacebar for pause/resume/restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't handle spacebar if user is typing in an input field
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return
      }

      if (e.code === 'Space') {
        e.preventDefault()
        if (gameState.isGameOver) {
          startGame()
        } else {
          pauseGame()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.isGameOver, pauseGame, startGame])

  // Save game session when game ends
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > 0) {
      // Update session stats
      setSessionStats(prev => ({
        gamesPlayed: prev.gamesPlayed + 1,
        highScore: Math.max(prev.highScore, gameState.score),
        totalFood: prev.totalFood + gameState.foodEaten,
        totalTime: prev.totalTime + gameState.gameTime,
      }))

      // Save to database if user is logged in
      if (user && userProfile) {
        saveGameSession(user.id, gameState)
        updateLeaderboard(user.id, userProfile.username, gameState.score)
      }
    }
  }, [gameState.isGameOver, user, userProfile, gameState, saveGameSession, updateLeaderboard])

  // Calculate board scale to fit screen
  const [boardScale, setBoardScale] = useState(1)
  useEffect(() => {
    const updateScale = () => {
      const padding = showLeaderboard ? 400 : 32 // More padding when leaderboard is shown
      const maxWidth = window.innerWidth - padding
      const maxHeight = window.innerHeight - 200 // info bar + controls
      const boardSize = 600 // 20 * 30
      const scale = Math.min(maxWidth / boardSize, maxHeight / boardSize, 1)
      setBoardScale(scale)
    }
    
    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [showLeaderboard])

  return (
    <div className="min-h-screen bg-game-bg flex flex-col">
      {/* Info Bar */}
      <motion.div
        className="bg-gray-900 border-b border-gray-800 px-4 py-3"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-green-500">Snake Game</h1>
          </div>

          {/* Toggle Leaderboard Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLeaderboard(!showLeaderboard)}
          >
            <Trophy className="w-4 h-4 mr-1" />
            {showLeaderboard ? 'Hide' : 'Show'} Leaderboard
          </Button>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Score: {gameState.score}</span>
            </div>
            <div className="flex items-center gap-2">
              <Apple className="w-4 h-4 text-red-500" />
              <span>Food: {gameState.foodEaten}</span>
            </div>
            <div className="flex items-center gap-2">
              <Timer className="w-4 h-4 text-blue-500" />
              <span>{Math.floor(gameState.gameTime)}s</span>
            </div>
            {userProfile && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span>{userProfile.username}</span>
              </div>
            )}
          </div>

          {/* Session Stats */}
          {sessionStats.gamesPlayed > 0 && (
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Session: {sessionStats.gamesPlayed} games</span>
              <span>Best: {sessionStats.highScore}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col lg:flex-row p-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
          <div style={{ transform: `scale(${boardScale})` }}>
            <GameBoard
              gameState={gameState}
              onDirectionChange={changeDirection}
            />
          </div>

          <GameControls
            isPaused={gameState.isPaused}
            isGameOver={gameState.isGameOver}
            onStart={startGame}
            onPause={pauseGame}
            onDirectionChange={changeDirection}
            onDifficultyChange={setDifficulty}
          />

          {/* Mobile Instructions */}
          <motion.div
            className="text-center text-sm text-gray-400 max-w-md lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>Swipe or use arrow buttons to control the snake</p>
          </motion.div>

          {/* Desktop Instructions */}
          <motion.div
            className="text-center text-sm text-gray-400 max-w-md hidden lg:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>Use Arrow Keys or WASD to move • Space to pause/resume</p>
          </motion.div>
          </div>
        </div>

        {/* Leaderboard Sidebar */}
        {showLeaderboard && (
          <motion.div
            className="w-full lg:w-80 lg:ml-4 mt-4 lg:mt-0"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            <LeaderboardTable
              entries={leaderboard}
              currentUserId={user?.id}
            />
          </motion.div>
        )}
      </div>
    </div>
  )
}