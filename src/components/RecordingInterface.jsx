import React, { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Square, Phone, AlertTriangle, Shield } from 'lucide-react'
import Button from './Button'

const RecordingInterface = ({ onSaveRecording, subscription }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPermission, setHasPermission] = useState(null)
  const [alertedContacts, setAlertedContacts] = useState(false)
  const mediaRecorderRef = useRef(null)
  const recordingRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    // Check for media permissions on component mount
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(() => setHasPermission(true))
      .catch(() => setHasPermission(false))
  }, [])

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: true 
      })
      
      mediaRecorderRef.current = new MediaRecorder(stream)
      const chunks = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        recordingRef.current = blob
        
        // Save recording
        const recording = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          duration: recordingTime,
          size: blob.size,
          alertedContacts: alertedContacts,
          location: 'Demo Location', // In real app, get actual location
        }
        
        onSaveRecording(recording)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to start recording. Please check your camera and microphone permissions.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setAlertedContacts(false)
    }
  }

  const alertContacts = () => {
    setAlertedContacts(true)
    // In a real app, this would send alerts to pre-configured contacts
    alert('Emergency contacts have been notified!')
  }

  if (hasPermission === false) {
    return (
      <div className="py-8">
        <div className="card p-8 text-center">
          <AlertTriangle className="w-16 h-16 text-accent mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Camera & Microphone Access Required
          </h2>
          <p className="text-text-secondary mb-6">
            To use the recording feature, please enable camera and microphone permissions in your browser settings.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh & Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Encounter Recording
        </h1>
        <p className="text-text-secondary text-lg">
          Discreetly record interactions and alert trusted contacts if needed.
        </p>
      </div>

      {/* Recording Status */}
      <div className="card p-8 text-center mb-8">
        {isRecording ? (
          <div className="space-y-6">
            <div className="relative">
              <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto animate-pulse-record">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <div className="absolute top-0 right-0 w-6 h-6 bg-red-600 rounded-full animate-pulse"></div>
            </div>
            
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">
                {formatTime(recordingTime)}
              </div>
              <div className="text-text-secondary">Recording in progress...</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="destructive"
                onClick={stopRecording}
                className="px-8"
              >
                <Square className="w-5 h-5 mr-2" />
                Stop Recording
              </Button>
              
              {!alertedContacts && (
                <Button
                  variant="outline"
                  onClick={alertContacts}
                  className="px-8"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Alert Contacts
                </Button>
              )}
            </div>

            {alertedContacts && (
              <div className="bg-green-600/20 border border-green-600/30 rounded-md p-4">
                <p className="text-green-400 font-medium">
                  ✓ Emergency contacts have been notified
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <Shield className="w-24 h-24 text-accent mx-auto" />
            
            <div>
              <h2 className="text-2xl font-semibold text-text-primary mb-2">
                Ready to Record
              </h2>
              <p className="text-text-secondary">
                Tap the button below to start recording your encounter
              </p>
            </div>

            <Button
              onClick={startRecording}
              size="lg"
              className="px-12 py-4 text-lg"
            >
              <Mic className="w-6 h-6 mr-3" />
              Start Recording
            </Button>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-4">
          Recording Safety Tips
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                Keep your phone in a visible location when recording
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                You have the right to record police interactions in public
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                Don't interfere with police duties while recording
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                Inform the officer you are recording if asked
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                Stay calm and follow instructions while recording
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-text-secondary text-sm">
                {subscription === 'premium' ? 'Your recordings are automatically backed up to the cloud' : 'Upgrade to Premium for cloud backup of recordings'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecordingInterface