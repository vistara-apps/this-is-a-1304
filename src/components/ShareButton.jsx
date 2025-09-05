import React, { useState } from 'react'
import { Share2, Link, MessageSquare, Mail, X } from 'lucide-react'
import Button from './Button'

const ShareButton = ({ content, title, size = 'default' }) => {
  const [showShareModal, setShowShareModal] = useState(false)

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Link,
      action: () => {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
        setShowShareModal(false)
      }
    },
    {
      name: 'Text Message',
      icon: MessageSquare,
      action: () => {
        const text = `${title}\n\n${content}\n\nShared from Shield & Script`
        window.open(`sms:?body=${encodeURIComponent(text)}`)
        setShowShareModal(false)
      }
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => {
        const subject = encodeURIComponent(title)
        const body = encodeURIComponent(`${content}\n\nShared from Shield & Script`)
        window.open(`mailto:?subject=${subject}&body=${body}`)
        setShowShareModal(false)
      }
    }
  ]

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: content,
          url: window.location.href,
        })
      } catch (err) {
        if (err.name !== 'AbortError') {
          setShowShareModal(true)
        }
      }
    } else {
      setShowShareModal(true)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size={size}
        onClick={handleShare}
      >
        <Share2 className="w-4 h-4 mr-1" />
        Share
      </Button>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Share</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2">
              {shareOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full flex items-center space-x-3 p-3 rounded-md hover:bg-surface transition-colors"
                >
                  <option.icon className="w-5 h-5 text-accent" />
                  <span className="text-text-primary">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ShareButton