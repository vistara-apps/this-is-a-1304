import React, { useState } from 'react'
import { Search, Filter, Lock, Crown, Languages } from 'lucide-react'
import Button from './Button'
import ScriptCard from './ScriptCard'

const ScriptLibrary = ({ scripts, subscription, onUpgrade }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLanguage, setSelectedLanguage] = useState('en')

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

      {/* Free Scripts */}
      {freeScripts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-4">
            Free Scripts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {freeScripts.map((script, index) => (
              <ScriptCard 
                key={index} 
                script={script} 
                subscription={subscription}
              />
            ))}
          </div>
        </div>
      )}

      {/* Premium Scripts */}
      {premiumScripts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-text-primary flex items-center">
              <Crown className="w-6 h-6 text-accent mr-2" />
              Premium Scripts
            </h2>
            {subscription !== 'premium' && (
              <Button onClick={onUpgrade} size="sm">
                Upgrade to Premium
              </Button>
            )}
          </div>
          
          {subscription === 'premium' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {premiumScripts.map((script, index) => (
                <ScriptCard 
                  key={index} 
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