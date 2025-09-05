import React, { useState, useEffect } from 'react'
import { Shield, BookOpen, Mic, Share2, MapPin, ChevronDown } from 'lucide-react'
import Button from './Button'
import { US_STATES } from '../data/legalData'

const LandingPage = ({ onStateSelect }) => {
  const [selectedState, setSelectedState] = useState('')
  const [showStateSelector, setShowStateSelector] = useState(false)
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)

  const features = [
    {
      icon: Shield,
      title: 'State-Specific Rights Guides',
      description: 'Know your rights instantly with tailored legal information for your state.',
    },
    {
      icon: BookOpen,
      title: 'Actionable Scripts',
      description: 'Pre-written scripts in English and Spanish for safer police interactions.',
    },
    {
      icon: Mic,
      title: 'One-Tap Recording',
      description: 'Discreetly record encounters and alert trusted contacts immediately.',
    },
    {
      icon: Share2,
      title: 'Shareable Knowledge Cards',
      description: 'Share critical legal information with friends and family instantly.',
    },
  ]

  const detectLocation = () => {
    setIsDetectingLocation(true)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you'd use reverse geocoding to get the state
          // For demo purposes, we'll simulate this
          setTimeout(() => {
            const demoState = 'California'
            setSelectedState(demoState)
            setIsDetectingLocation(false)
            alert(`Location detected: ${demoState}`)
          }, 2000)
        },
        (error) => {
          setIsDetectingLocation(false)
          setShowStateSelector(true)
          console.error('Geolocation error:', error)
        }
      )
    } else {
      setIsDetectingLocation(false)
      setShowStateSelector(true)
      alert('Geolocation is not supported by this browser.')
    }
  }

  const handleStateSelect = (state) => {
    setSelectedState(state)
    setShowStateSelector(false)
  }

  const handleGetStarted = () => {
    if (selectedState) {
      onStateSelect(selectedState)
    } else {
      setShowStateSelector(true)
    }
  }

  return (
    <div className="py-12 sm:py-20">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-accent/10 rounded-full">
            <Shield className="w-16 h-16 text-accent" />
          </div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
          Know Your Rights,{' '}
          <span className="text-accent">Instantly</span>
        </h1>
        
        <p className="text-xl text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed">
          Mobile-optimized, state-specific guides and scripts for safe interactions with law enforcement, 
          plus instant recording capabilities.
        </p>

        {/* State Selection */}
        <div className="mb-8 max-w-md mx-auto">
          {!selectedState ? (
            <div className="space-y-4">
              <Button
                onClick={detectLocation}
                disabled={isDetectingLocation}
                className="w-full"
              >
                <MapPin className="w-5 h-5 mr-2" />
                {isDetectingLocation ? 'Detecting Location...' : 'Auto-Detect My State'}
              </Button>
              
              <div className="text-text-secondary">or</div>
              
              <Button
                variant="secondary"
                onClick={() => setShowStateSelector(true)}
                className="w-full"
              >
                Select State Manually
                <ChevronDown className="w-5 h-5 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="card p-4">
              <div className="text-sm text-text-secondary mb-1">Selected State:</div>
              <div className="text-lg font-semibold text-accent">{selectedState}</div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowStateSelector(true)}
                className="mt-2"
              >
                Change State
              </Button>
            </div>
          )}
        </div>

        {/* State Selector Modal */}
        {showStateSelector && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="card p-6 w-full max-w-md max-h-96 overflow-y-auto">
              <h3 className="text-xl font-semibold mb-4">Select Your State</h3>
              <div className="space-y-2">
                {US_STATES.map((state) => (
                  <button
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className="w-full text-left p-3 rounded-md hover:bg-surface transition-colors"
                  >
                    {state}
                  </button>
                ))}
              </div>
              <Button
                variant="secondary"
                onClick={() => setShowStateSelector(false)}
                className="w-full mt-4"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <Button
          onClick={handleGetStarted}
          size="lg"
          className="px-8 py-4 text-lg"
        >
          Get Started Now
        </Button>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature, index) => (
          <div key={index} className="card p-6 hover:shadow-modal transition-shadow duration-300">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-accent/10 rounded-md flex-shrink-0">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-text-primary mb-8">
          Choose Your Plan
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="card p-8">
            <h3 className="text-2xl font-semibold text-text-primary mb-4">Free</h3>
            <div className="text-4xl font-bold text-accent mb-6">$0</div>
            <ul className="space-y-3 text-text-secondary mb-8">
              <li>✓ Basic rights guide for one state</li>
              <li>✓ Limited script access</li>
              <li>✓ Local recording storage</li>
              <li>✗ Multiple states</li>
              <li>✗ Cloud backup</li>
              <li>✗ Premium scripts</li>
            </ul>
            <Button variant="secondary" className="w-full">
              Current Plan
            </Button>
          </div>

          {/* Premium Plan */}
          <div className="card p-8 border-2 border-accent relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-accent text-bg px-4 py-1 text-sm font-medium">
              Popular
            </div>
            <h3 className="text-2xl font-semibold text-text-primary mb-4">Premium</h3>
            <div className="text-4xl font-bold text-accent mb-6">
              $2.99<span className="text-lg text-text-secondary">/month</span>
            </div>
            <ul className="space-y-3 text-text-secondary mb-8">
              <li>✓ All states rights guides</li>
              <li>✓ Unlimited premium scripts</li>
              <li>✓ Cloud backup & sync</li>
              <li>✓ Advanced recording features</li>
              <li>✓ Multilingual support</li>
              <li>✓ Priority updates</li>
            </ul>
            <Button className="w-full">
              Upgrade to Premium
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage