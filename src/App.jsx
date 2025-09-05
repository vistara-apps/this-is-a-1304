import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import LandingPage from './components/LandingPage'
import RightsGuide from './components/RightsGuide'
import ScriptLibrary from './components/ScriptLibrary'
import RecordingInterface from './components/RecordingInterface'
import Profile from './components/Profile'
import { stateRights, scriptScenarios } from './data/legalData'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [selectedState, setSelectedState] = useState('')
  const [userSubscription, setUserSubscription] = useState('free')
  const [recordings, setRecordings] = useState([])

  // Load user data from localStorage on app start
  useEffect(() => {
    const savedState = localStorage.getItem('selectedState')
    const savedSubscription = localStorage.getItem('userSubscription')
    const savedRecordings = localStorage.getItem('recordings')
    
    if (savedState) setSelectedState(savedState)
    if (savedSubscription) setUserSubscription(savedSubscription)
    if (savedRecordings) setRecordings(JSON.parse(savedRecordings))
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

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onStateSelect={handleStateSelect} />
      case 'rights':
        return (
          <RightsGuide 
            state={selectedState} 
            rights={stateRights[selectedState]} 
            onUpgrade={() => setUserSubscription('premium')}
            subscription={userSubscription}
          />
        )
      case 'scripts':
        return (
          <ScriptLibrary 
            scripts={scriptScenarios} 
            subscription={userSubscription}
            onUpgrade={() => setUserSubscription('premium')}
          />
        )
      case 'record':
        return (
          <RecordingInterface 
            onSaveRecording={addRecording}
            subscription={userSubscription}
          />
        )
      case 'profile':
        return (
          <Profile 
            subscription={userSubscription}
            onUpgrade={() => setUserSubscription('premium')}
            recordings={recordings}
            selectedState={selectedState}
          />
        )
      default:
        return <LandingPage onStateSelect={handleStateSelect} />
    }
  }

  return (
    <div className="min-h-screen gradient-bg">
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