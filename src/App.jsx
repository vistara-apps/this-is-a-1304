import React, { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import RightsGuide from './components/RightsGuide'
import ScriptLibrary from './components/ScriptLibrary'
import RecordingInterface from './components/RecordingInterface'
import Profile from './components/Profile'
import SubscriptionSuccess from './components/SubscriptionSuccess'
import ShareView from './components/ShareView'
import { stateRights, scriptScenarios } from './data/legalData'
import { validateEnvironment } from './config/api'
import stripeService from './services/stripeService'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedState, setSelectedState] = useState('')
  const [userSubscription, setUserSubscription] = useState('free')
  const [recordings, setRecordings] = useState([])
  const [userId] = useState(() => {
    // Generate or retrieve user ID
    let id = localStorage.getItem('userId')
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('userId', id)
    }
    return id
  })

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedState = localStorage.getItem('selectedState')
    const savedSubscription = localStorage.getItem('userSubscription')
    const savedRecordings = localStorage.getItem('recordings')
    
    if (savedState) setSelectedState(savedState)
    if (savedSubscription) setUserSubscription(savedSubscription)
    if (savedRecordings) setRecordings(JSON.parse(savedRecordings))

    // Validate environment variables
    validateEnvironment()

    // Check URL for subscription success/cancel
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success') === 'true') {
      setCurrentPage('subscription-success')
    }
  }, [])

  // Save user data to localStorage
  useEffect(() => {
    if (selectedState) localStorage.setItem('selectedState', selectedState)
  }, [selectedState])

  useEffect(() => {
    localStorage.setItem('userSubscription', userSubscription)
  }, [userSubscription])

  useEffect(() => {
    localStorage.setItem('recordings', JSON.stringify(recordings))
  }, [recordings])

  const handleStateSelect = (state) => {
    setSelectedState(state)
    setCurrentPage('rights')
  }

  const addRecording = (recording) => {
    setRecordings(prev => [...prev, recording])
  }

  const handleUpgradeToPremium = async (email) => {
    try {
      await stripeService.createCheckoutSession(userId, email)
    } catch (error) {
      console.error('Upgrade error:', error)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStateSelect={handleStateSelect} />
      case 'rights':
        return (
          <RightsGuide 
            state={selectedState} 
            rights={stateRights[selectedState]} 
            onUpgrade={handleUpgradeToPremium}
            subscription={userSubscription}
          />
        )
      case 'scripts':
        return (
          <ScriptLibrary 
            scripts={scriptScenarios} 
            subscription={userSubscription}
            onUpgrade={handleUpgradeToPremium}
            selectedState={selectedState}
          />
        )
      case 'record':
        return (
          <RecordingInterface 
            onSaveRecording={addRecording}
            subscription={userSubscription}
            userId={userId}
          />
        )
      case 'profile':
        return (
          <Profile 
            subscription={userSubscription}
            onUpgrade={handleUpgradeToPremium}
            recordings={recordings}
            selectedState={selectedState}
            userId={userId}
          />
        )
      case 'subscription-success':
        return (
          <SubscriptionSuccess 
            onContinue={() => {
              setUserSubscription('premium')
              setCurrentPage('profile')
            }}
          />
        )
      case 'share':
        return (
          <ShareView 
            hash={window.location.pathname.split('/').pop()}
          />
        )
      default:
        return <LandingPage onStateSelect={handleStateSelect} />
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'hsl(210 40% 20%)',
            color: 'hsl(0 0% 95%)',
            border: '1px solid hsl(37 96% 55%)'
          }
        }}
      />
      <Header 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        subscription={userSubscription}
      />
      <main className="container mx-auto px-4 sm:px-6 max-w-6xl">
        {renderCurrentPage()}
      </main>
    </div>
  )
}

export default App
