import React, { useState } from 'react'
import { Search, Filter, Lock, Crown, Languages, Sparkles, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import Button from './Button'
import ScriptCard from './ScriptCard'
import openaiService from '../services/openaiService'

const ScriptLibrary = ({ scripts, subscription, onUpgrade, selectedState }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showCustomGenerator, setShowCustomGenerator] = useState(false)
  const [customScenario, setCustomScenario] = useState('')
  const [generatedScripts, setGeneratedScripts] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)

  const categories = [
    { id: 'all', label: 'All Scripts' },
    { id: 'traffic', label: 'Traffic Stops' },
    { id: 'search', label: 'Searches' },
    { id: 'arrest', label: 'Arrests' },
    { id: 'general', label: 'General Interaction' },
  ]

  const languages = [
    { id: 'en', label: 'English' },
    { id: 'es', label: 'Español' },
  ]

  const filteredScripts = scripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.scenario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || script.category === selectedCategory
    const matchesLanguage = script.language === selectedLanguage
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const freeScripts = filteredScripts.filter(script => !script.premium)
  const premiumScripts = filteredScripts.filter(script => script.premium)

  const handleGenerateCustomScript = async () => {
    if (!customScenario.trim()) {
      toast.error('Please describe your scenario')
      return
    }

    if (subscription !== 'premium') {
      toast.error('Custom script generation requires premium subscription')
      onUpgrade('user@example.com') // In production, get actual user email
      return
    }

    setIsGenerating(true)
    try {
      const generatedContent = await openaiService.generateScript(
        customScenario,
        selectedState || 'General',
        selectedLanguage
      )

      const newScript = {
        id: `generated_${Date.now()}`,
        title: `Custom Script: ${customScenario.substring(0, 30)}...`,
        scenario: customScenario,
        category: 'general',
        language: selectedLanguage,
        premium: true,
        content: generatedContent,
        generated: true,
        timestamp: new Date().toISOString()
      }

      setGeneratedScripts(prev => [newScript, ...prev])
      setCustomScenario('')
      toast.success('Custom script generated successfully!')
    } catch (error) {
      toast.error(error.message || 'Failed to generate script')
    } finally {
      setIsGenerating(false)
    }
  }

  // Combine generated scripts with existing ones
  const allScripts = [...generatedScripts, ...scripts]
  const allFilteredScripts = allScripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         script.scenario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || script.category === selectedCategory
    const matchesLanguage = script.language === selectedLanguage
    
    return matchesSearch && matchesCategory && matchesLanguage
  })

  const allFreeScripts = allFilteredScripts.filter(script => !script.premium)
  const allPremiumScripts = allFilteredScripts.filter(script => script.premium)

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          Script Library
        </h1>
        <p className="text-text-secondary text-lg">
          Pre-written scripts to help you communicate safely and effectively during police interactions.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search scripts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg border border-text-secondary/20 rounded-md text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg border border-text-secondary/20 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="relative">
            <Languages className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-bg border border-text-secondary/20 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none"
            >
              {languages.map(language => (
                <option key={language.id} value={language.id}>
                  {language.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Custom Script Generator */}
      <div className="card p-6 mb-8 border-accent/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Sparkles className="w-6 h-6 text-accent mr-2" />
            <h2 className="text-xl font-semibold text-text-primary">
              AI Script Generator
            </h2>
            {subscription !== 'premium' && (
              <Crown className="w-5 h-5 text-accent ml-2" />
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCustomGenerator(!showCustomGenerator)}
          >
            <Plus className="w-4 h-4 mr-1" />
            {showCustomGenerator ? 'Hide' : 'Generate Custom Script'}
          </Button>
        </div>

        {showCustomGenerator && (
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-medium mb-2">
                Describe your scenario:
              </label>
              <textarea
                value={customScenario}
                onChange={(e) => setCustomScenario(e.target.value)}
                placeholder="e.g., I'm being questioned at a DUI checkpoint, or I'm a passenger in a car that was pulled over..."
                className="w-full px-4 py-3 bg-bg border border-text-secondary/20 rounded-md text-text-primary focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent resize-none"
                rows={3}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm text-text-secondary">
                {selectedState && (
                  <span>State: <strong>{selectedState}</strong> • </span>
                )}
                Language: <strong>{selectedLanguage === 'en' ? 'English' : 'Español'}</strong>
              </div>
              
              <Button
                variant="primary"
                onClick={handleGenerateCustomScript}
                disabled={isGenerating || !customScenario.trim()}
                className="flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Script
                  </>
                )}
              </Button>
            </div>

            {subscription !== 'premium' && (
              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-accent text-sm">
                  <Crown className="w-4 h-4 inline mr-1" />
                  Custom script generation is a premium feature. 
                  <button 
                    onClick={() => onUpgrade('user@example.com')}
                    className="underline ml-1 hover:text-accent/80"
                  >
                    Upgrade now
                  </button> to create personalized scripts for any scenario.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Free Scripts */}
      {allFreeScripts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Free Scripts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFreeScripts.map((script, index) => (
              <ScriptCard 
                key={script.id || index} 
                script={script} 
                subscription={subscription}
              />
            ))}
          </div>
        </div>
      )}

      {/* Premium Scripts */}
      {allPremiumScripts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <Crown className="w-6 h-6 text-accent mr-2" />
              Premium Scripts
              {generatedScripts.length > 0 && (
                <span className="ml-2 text-sm bg-accent/20 text-accent px-2 py-1 rounded-full">
                  {generatedScripts.length} AI Generated
                </span>
              )}
            </h2>
            {subscription !== 'premium' && (
              <Button onClick={() => onUpgrade('user@example.com')} size="sm">
                Upgrade to Premium
              </Button>
            )}
          </div>
          
          {subscription === 'premium' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {allPremiumScripts.map((script, index) => (
                <ScriptCard 
                  key={script.id || index} 
                  script={script} 
                  subscription={subscription}
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {premiumScripts.slice(0, 2).map((script, index) => (
                <ScriptCard 
                  key={index} 
                  script={script} 
                  subscription={subscription}
                  showUpgrade={onUpgrade}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {filteredScripts.length === 0 && (
        <div className="card p-8 text-center">
          <h3 className="text-xl font-semibold text-text-primary mb-2">
            No Scripts Found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search terms or filters.
          </p>
        </div>
      )}
    </div>
  )
}

export default ScriptLibrary
