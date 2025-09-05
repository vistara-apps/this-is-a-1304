import React from 'react'
import { Crown, MapPin, Clock, Database, Settings, CreditCard } from 'lucide-react'
import Button from './Button'

const Profile = ({ subscription, onUpgrade, recordings, selectedState }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Profile
        </h1>
        <p className="text-text-secondary text-lg">
          Manage your account, subscription, and recorded encounters.
        </p>
      </div>

      {/* Subscription Status */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-text-primary flex items-center">
            {subscription === 'premium' ? (
              <>
                <Crown className="w-6 h-6 text-accent mr-2" />
                Premium Account
              </>
            ) : (
              'Free Account'
            )}
          </h2>
          {subscription !== 'premium' && (
            <Button onClick={onUpgrade} size="sm">
              Upgrade to Premium
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-bg p-4 rounded-md">
            <div className="text-sm text-text-secondary mb-1">Current Plan</div>
            <div className="text-lg font-semibold text-accent">
              {subscription === 'premium' ? 'Premium' : 'Free'}
            </div>
          </div>
          
          <div className="bg-bg p-4 rounded-md">
            <div className="text-sm text-text-secondary mb-1">Monthly Cost</div>
            <div className="text-lg font-semibold text-accent">
              {subscription === 'premium' ? '$2.99' : '$0.00'}
            </div>
          </div>
          
          <div className="bg-bg p-4 rounded-md">
            <div className="text-sm text-text-secondary mb-1">Features</div>
            <div className="text-lg font-semibold text-accent">
              {subscription === 'premium' ? 'All Access' : 'Limited'}
            </div>
          </div>
        </div>

        {subscription === 'premium' && (
          <div className="mt-4 p-4 bg-accent/10 rounded-md">
            <h3 className="font-semibold text-accent mb-2">Premium Benefits Active:</h3>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>✓ Access to all state guides</li>
              <li>✓ Unlimited premium scripts</li>
              <li>✓ Cloud backup for recordings</li>
              <li>✓ Multilingual support</li>
              <li>✓ Priority customer support</li>
            </ul>
          </div>
        )}
      </div>

      {/* Account Settings */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          Account Settings
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-text-secondary/10">
            <div>
              <div className="font-medium text-text-primary">Current State</div>
              <div className="text-sm text-text-secondary">
                {selectedState || 'No state selected'}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <MapPin className="w-4 h-4 mr-1" />
              Change
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-text-secondary/10">
            <div>
              <div className="font-medium text-text-primary">Emergency Contacts</div>
              <div className="text-sm text-text-secondary">
                Configure trusted contacts for alerts
              </div>
            </div>
            <Button variant="ghost" size="sm">
              Configure
            </Button>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-text-secondary/10">
            <div>
              <div className="font-medium text-text-primary">Payment Method</div>
              <div className="text-sm text-text-secondary">
                {subscription === 'premium' ? 'Card ending in ****' : 'No payment method'}
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <CreditCard className="w-4 h-4 mr-1" />
              {subscription === 'premium' ? 'Update' : 'Add'}
            </Button>
          </div>
        </div>
      </div>

      {/* Recorded Encounters */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center">
          <Database className="w-6 h-6 mr-2" />
          Recorded Encounters ({recordings.length})
        </h2>
        
        {recordings.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-text-secondary mb-4">No recordings yet</div>
            <p className="text-sm text-text-secondary">
              Use the Record feature to document encounters
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div key={recording.id} className="bg-bg p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-text-primary">
                    Encounter #{recording.id}
                  </div>
                  <div className="text-sm text-text-secondary">
                    {formatDate(recording.timestamp)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-text-secondary">Duration</div>
                    <div className="text-text-primary font-medium">
                      {formatDuration(recording.duration)}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Size</div>
                    <div className="text-text-primary font-medium">
                      {formatFileSize(recording.size)}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Location</div>
                    <div className="text-text-primary font-medium">
                      {recording.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-text-secondary">Alerts</div>
                    <div className="text-text-primary font-medium">
                      {recording.alertedContacts ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mt-3">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Download
                  </Button>
                  {subscription === 'premium' && (
                    <span className="text-xs text-accent">✓ Cloud Backed Up</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile