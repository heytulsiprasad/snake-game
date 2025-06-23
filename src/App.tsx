import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { LogOut, User } from 'lucide-react'
import { GameBoard } from './components/Game/GameBoard'
import { GameStats } from './components/Game/GameStats'
import { GameControls } from './components/Game/GameControls'
import { AuthModal } from './components/Auth/AuthModal'
import { LeaderboardTable } from './components/Leaderboard/LeaderboardTable'
import { Button } from './components/UI/Button'
import { useGame } from './hooks/useGame'
import { useAuth } from './hooks/useAuth'
import { useLeaderboard } from './hooks/useLeaderboard'
import { useGameSession } from './hooks/useGameSession'
import { supabase } from './lib/supabase'
import type { Profile } from './lib/supabase'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const { gameState, startGame, pauseGame, changeDirection, setDifficulty } = useGame()
  const { user, signOut } = useAuth()
  const { leaderboard, updateLeaderboard } = useLeaderboard()
  const { saveGameSession } = useGameSession()

  // Handle spacebar for pause/resume/restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
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
    if (gameState.isGameOver && user && userProfile) {
      saveGameSession(user.id, gameState)
      updateLeaderboard(user.id, userProfile.username, gameState.score)
    }
  }, [gameState.isGameOver, user, userProfile, gameState, saveGameSession, updateLeaderboard])

  // Fetch user profile
  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setUserProfile(data))
    } else {
      setUserProfile(null)
    }
  }, [user])

  return (
    <div className="min-h-screen bg-game-bg p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          className="flex flex-wrap items-center justify-between mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-4xl font-bold text-green-500 flex items-center">
            🐍 Snake Game
          </h1>
          
          <div className="flex items-center gap-4">
            {user && userProfile ? (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">{userProfile.username}</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In to Save Scores
              </Button>
            )}
          </div>
        </motion.header>

        {/* Game Stats */}
        <div className="mb-6">
          <GameStats gameState={gameState} />
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2 flex flex-col items-center space-y-6">
            <GameBoard
              gameState={gameState}
              onDirectionChange={changeDirection}
            />
            
            <GameControls
              isPaused={gameState.isPaused}
              isGameOver={gameState.isGameOver}
              onStart={startGame}
              onPause={pauseGame}
              onDirectionChange={changeDirection}
              onDifficultyChange={setDifficulty}
            />

            {/* Instructions */}
            <motion.div
              className="bg-gray-800 rounded-lg p-4 text-sm text-gray-400 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="mb-2">
                <strong>Desktop:</strong> Use Arrow Keys or WASD to move
              </p>
              <p className="mb-2">
                <strong>Mobile:</strong> Swipe or use on-screen controls
              </p>
              <p>
                <strong>Space:</strong> Pause/Resume/Restart
              </p>
            </motion.div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <LeaderboardTable
              entries={leaderboard}
              currentUserId={user?.id}
            />
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </div>
    </div>
  )
}

export default App