import { useEffect, useState } from 'react'
import { HomePage } from './components/HomePage'
import { GamePage } from './components/GamePage'
import { LeaderboardPage } from './components/LeaderboardPage'
import { AuthModal } from './components/Auth/AuthModal'
import { useAuth } from './hooks/useAuth'
import { useLeaderboard } from './hooks/useLeaderboard'
import { supabase } from './lib/supabase'
import type { Profile } from './lib/supabase'

type AppState = 'home' | 'game' | 'leaderboard'

function App() {
  const [appState, setAppState] = useState<AppState>('home')
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [userProfile, setUserProfile] = useState<Profile | null>(null)
  const { user } = useAuth()
  const { updateLeaderboard } = useLeaderboard()

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

  // If user signs in successfully, go to game
  useEffect(() => {
    if (user && showAuthModal) {
      setShowAuthModal(false)
      setAppState('game')
    }
  }, [user, showAuthModal])

  const handlePlayAsGuest = () => {
    setAppState('game')
  }

  const handleSignIn = () => {
    setShowAuthModal(true)
  }

  const handleBackToHome = () => {
    setAppState('home')
  }

  const handleViewLeaderboard = () => {
    setAppState('leaderboard')
  }

  return (
    <>
      {appState === 'home' && (
        <HomePage
          onPlayAsGuest={handlePlayAsGuest}
          onSignIn={handleSignIn}
          onViewLeaderboard={handleViewLeaderboard}
        />
      )}

      {appState === 'game' && (
        <GamePage
          user={user}
          userProfile={userProfile}
          onBack={handleBackToHome}
          updateLeaderboard={updateLeaderboard}
        />
      )}

      {appState === 'leaderboard' && (
        <LeaderboardPage
          user={user}
          onBack={handleBackToHome}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  )
}

export default App