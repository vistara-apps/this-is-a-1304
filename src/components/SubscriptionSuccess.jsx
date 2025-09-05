import React, { useEffect } from 'react'
import { CheckCircle, Shield, Sparkles } from 'lucide-react'
import Button from './Button'

const SubscriptionSuccess = ({ onContinue }) => {
  useEffect(() => {
    // Handle successful subscription
    const urlParams = new URLSearchParams(window.location.search)
    const sessionId = urlParams.get('session_id')
    
    if (sessionId) {
      // In production, verify the session with your backend
      console.log('Subscription successful:', sessionId)
    }
  }, [])

  const premiumFeatures = [
    {
      icon: Shield,
      title: 'Unlimited Scripts',
      description: 'Access all pre-written scripts and generate custom ones for any scenario'
    },
    {
      icon: Sparkles,
      title: 'AI-Generated Content',
      description: 'Create personalized scripts and knowledge cards using advanced AI'
    },
    {
      icon: CheckCircle,
      title: 'Cloud Backup',
      description: 'Secure storage for all your recordings and generated content'
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to Premium!
          </h1>
          <p className="text-xl text-gray-300">
            Your subscription is now active. You have access to all premium features.
          </p>
        </div>

        {/* Premium Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {premiumFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div 
                key={index}
                className="bg-surface rounded-lg p-6 border border-gray-700"
              >
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Subscription Details */}
        <div className="bg-surface rounded-lg p-6 border border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Subscription Details
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="text-left">
              <span className="text-gray-400">Plan:</span>
              <span className="text-white ml-2">Shield & Script Premium</span>
            </div>
            <div className="text-left">
              <span className="text-gray-400">Price:</span>
              <span className="text-white ml-2">$2.99/month</span>
            </div>
            <div className="text-left">
              <span className="text-gray-400">Billing:</span>
              <span className="text-white ml-2">Monthly</span>
            </div>
            <div className="text-left">
              <span className="text-gray-400">Next billing:</span>
              <span className="text-white ml-2">
                {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            onClick={onContinue}
            className="px-8 py-3"
          >
            Start Using Premium Features
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('https://billing.stripe.com', '_blank')}
            className="px-8 py-3"
          >
            Manage Subscription
          </Button>
        </div>

        {/* Support Info */}
        <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border border-blue-700">
          <p className="text-blue-200 text-sm">
            <strong>Need help?</strong> Contact our support team at{' '}
            <a 
              href="mailto:support@shieldandscript.com" 
              className="text-blue-400 hover:text-blue-300 underline"
            >
              support@shieldandscript.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionSuccess
