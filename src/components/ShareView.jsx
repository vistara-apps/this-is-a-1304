import React, { useState, useEffect } from 'react'
import { Shield, Download, Share2, ExternalLink, Loader } from 'lucide-react'
import Button from './Button'
import pinataService from '../services/pinataService'

const ShareView = ({ hash }) => {
  const [cardData, setCardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (hash) {
      loadSharedContent()
    }
  }, [hash])

  const loadSharedContent = async () => {
    try {
      setLoading(true)
      const content = await pinataService.retrieveContent(hash)
      setCardData(content)
    } catch (err) {
      setError('Failed to load shared content. The link may be invalid or expired.')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share && cardData) {
      try {
        await navigator.share({
          title: cardData.title || 'Know Your Rights',
          text: cardData.summary || 'Important legal information from Shield & Script',
          url: window.location.href
        })
      } catch (err) {
        // Fallback to clipboard
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        alert('Link copied to clipboard!')
      })
      .catch(() => {
        alert('Failed to copy link')
      })
  }

  const downloadAsText = () => {
    if (!cardData) return

    const content = `${cardData.title}\n\n${cardData.summary}\n\nKey Points:\n${cardData.keyPoints?.map(point => `• ${point}`).join('\n') || ''}\n\nShared from Shield & Script\n${window.location.href}`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cardData.title?.replace(/[^a-z0-9]/gi, '_') || 'knowledge_card'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-accent animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Loading shared content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/'}
          >
            Go to Shield & Script
          </Button>
        </div>
      </div>
    )
  }

  if (!cardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-300">No content to display</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Shared Knowledge Card
          </h1>
          <p className="text-gray-400">
            Legal information shared from Shield & Script
          </p>
        </div>

        {/* Knowledge Card */}
        <div className="bg-surface rounded-lg border border-gray-700 p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            {cardData.title || 'Know Your Rights'}
          </h2>
          
          <div className="mb-6">
            <p className="text-gray-300 leading-relaxed">
              {cardData.summary || 'Important legal information for police encounters.'}
            </p>
          </div>

          {cardData.keyPoints && cardData.keyPoints.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Key Points:</h3>
              <ul className="space-y-2">
                {cardData.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-gray-700 pt-4 mt-6">
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              {cardData.state && (
                <span>State: {cardData.state}</span>
              )}
              {cardData.topic && (
                <span>Topic: {cardData.topic}</span>
              )}
              {cardData.timestamp && (
                <span>
                  Shared: {new Date(cardData.timestamp).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            variant="primary"
            onClick={handleShare}
            className="flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share This Card
          </Button>
          <Button
            variant="outline"
            onClick={downloadAsText}
            className="flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download as Text
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/', '_blank')}
            className="flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Shield & Script
          </Button>
        </div>

        {/* App Promotion */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 rounded-lg p-6 border border-accent/30">
          <h3 className="text-lg font-semibold text-white mb-2">
            Get More Legal Protection
          </h3>
          <p className="text-gray-300 mb-4">
            Shield & Script provides state-specific rights guides, actionable scripts, 
            and one-tap recording for police encounters. Know your rights instantly.
          </p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/'}
            className="w-full sm:w-auto"
          >
            Try Shield & Script Free
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-yellow-900/20 rounded-lg border border-yellow-700">
          <p className="text-yellow-200 text-sm">
            <strong>Legal Disclaimer:</strong> This information is for educational purposes only 
            and does not constitute legal advice. Laws vary by jurisdiction. Consult with a 
            qualified attorney for specific legal guidance.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ShareView
