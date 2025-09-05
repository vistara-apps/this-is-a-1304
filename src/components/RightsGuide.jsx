import React, { useState } from 'react'
import { Share2, Download, Lock, Crown } from 'lucide-react'
import Button from './Button'
import ShareButton from './ShareButton'

const RightsGuide = ({ state, rights, onUpgrade, subscription }) => {
  const [activeSection, setActiveSection] = useState('overview')

  if (!rights) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Rights Guide Not Available
        </h2>
        <p className="text-text-secondary">
          Please select a state to view your rights guide.
        </p>
      </div>
    )
  }

  const sections = [
    { id: 'overview', label: 'Overview', premium: false },
    { id: 'traffic-stops', label: 'Traffic Stops', premium: false },
    { id: 'searches', label: 'Searches', premium: subscription !== 'premium' },
    { id: 'arrests', label: 'Arrests', premium: subscription !== 'premium' },
    { id: 'miranda', label: 'Miranda Rights', premium: subscription !== 'premium' },
  ]

  const renderSection = () => {
    if (sections.find(s => s.id === activeSection)?.premium) {
      return (
        <div className="card p-8 text-center">
          <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Premium Content
          </h3>
          <p className="text-text-secondary mb-6">
            Upgrade to Premium to access detailed guides for searches, arrests, and Miranda rights.
          </p>
          <Button onClick={onUpgrade}>
            Upgrade to Premium - $2.99/month
          </Button>
        </div>
      )
    }

    return (
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <h3 className="text-2xl font-semibold text-text-primary mb-4 sm:mb-0">
            {sections.find(s => s.id === activeSection)?.label}
          </h3>
          <ShareButton 
            content={`Know your rights in ${state}! Check out this guide from Shield & Script.`}
            title={`${state} Rights Guide - ${sections.find(s => s.id === activeSection)?.label}`}
          />
        </div>
        
        <div className="prose prose-invert max-w-none">
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-accent mb-3">Your Basic Rights</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li>• You have the right to remain silent</li>
                  <li>• You have the right to refuse searches (in most cases)</li>
                  <li>• You have the right to an attorney</li>
                  <li>• You have the right to record police interactions in public</li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-accent mb-3">Important Reminders</h4>
                <ul className="space-y-2 text-text-secondary">
                  <li>• Stay calm and be respectful</li>
                  <li>• Keep your hands visible</li>
                  <li>• Don't argue or resist, even if you believe the stop is unfair</li>
                  <li>• Ask "Am I free to go?" if unsure about your status</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeSection === 'traffic-stops' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-accent mb-3">During a Traffic Stop</h4>
                <ol className="space-y-3 text-text-secondary list-decimal list-inside">
                  <li>Pull over safely and turn off your engine</li>
                  <li>Keep your hands visible on the steering wheel</li>
                  <li>Wait for the officer to approach</li>
                  <li>Provide license, registration, and insurance when asked</li>
                  <li>You may remain silent beyond providing required documents</li>
                </ol>
              </div>
              
              <div className="bg-accent/10 p-4 rounded-md">
                <h5 className="font-semibold text-accent mb-2">What to Say:</h5>
                <p className="text-text-secondary italic">
                  "Officer, I'm exercising my right to remain silent. I do not consent to any searches."
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          {state} Rights Guide
        </h1>
        <p className="text-text-secondary text-lg">
          Know your rights and stay safe during police interactions in {state}.
        </p>
      </div>

      {/* Section Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors duration-200 ${
                activeSection === section.id
                  ? 'bg-accent text-bg'
                  : 'bg-surface text-text-secondary hover:text-text-primary hover:bg-surface/80'
              }`}
            >
              <span>{section.label}</span>
              {section.premium && <Lock className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {renderSection()}

      {/* Quick Actions */}
      <div className="mt-8 card p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="secondary" className="w-full">
            <Download className="w-5 h-5 mr-2" />
            Download PDF Guide
          </Button>
          <Button variant="secondary" className="w-full">
            <Share2 className="w-5 h-5 mr-2" />
            Share This Guide
          </Button>
        </div>
      </div>
    </div>
  )
}

export default RightsGuide