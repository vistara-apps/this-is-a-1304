import React, { useState } from 'react'
import { Lock, Crown, Eye, Copy, Share2, Check } from 'lucide-react'
import Button from './Button'
import ShareButton from './ShareButton'

const ScriptCard = ({ script, subscription, showUpgrade }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const isLocked = script.premium && subscription !== 'premium'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(script.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleExpand = () => {
    if (isLocked && showUpgrade) {
      showUpgrade()
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <div className={`card p-6 ${isLocked ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-text-primary">
              {script.title}
            </h3>
            {script.premium && (
              <Crown className="w-4 h-4 text-accent" />
            )}
          </div>
          <p className="text-sm text-text-secondary mb-2">
            {script.scenario}
          </p>
          <div className="flex items-center space-x-2 text-xs text-text-secondary">
            <span className="bg-surface px-2 py-1 rounded">
              {script.category}
            </span>
            <span className="bg-surface px-2 py-1 rounded">
              {script.language === 'en' ? 'English' : 'Español'}
            </span>
          </div>
        </div>
        
        {isLocked && (
          <Lock className="w-5 h-5 text-text-secondary flex-shrink-0" />
        )}
      </div>

      {/* Preview */}
      <div className="mb-4">
        <div className="bg-bg p-4 rounded-md">
          <p className="text-text-secondary text-sm italic">
            {isExpanded ? script.content : `${script.content.substring(0, 150)}...`}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExpand}
        >
          {isLocked ? (
            <>
              <Lock className="w-4 h-4 mr-1" />
              Unlock
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-1" />
              {isExpanded ? 'Collapse' : 'View Full'}
            </>
          )}
        </Button>

        {!isLocked && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              disabled={copied}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>

            <ShareButton 
              content={script.content}
              title={script.title}
              size="sm"
            />
          </>
        )}
      </div>

      {/* Upgrade prompt for locked scripts */}
      {isLocked && showUpgrade && (
        <div className="mt-4 p-4 bg-accent/10 rounded-md">
          <p className="text-sm text-text-secondary mb-2">
            Unlock this script and hundreds more with Premium.
          </p>
          <Button size="sm" onClick={showUpgrade}>
            Upgrade to Premium - $2.99/month
          </Button>
        </div>
      )}
    </div>
  )
}

export default ScriptCard