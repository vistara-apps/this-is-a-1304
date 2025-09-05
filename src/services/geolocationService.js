class GeolocationService {
  constructor() {
    this.options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    }
  }

  /**
   * Get current position using browser geolocation API
   * @returns {Promise<object>} Position coordinates
   */
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          })
        },
        (error) => {
          let errorMessage = 'Failed to get location'
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable'
              break
            case error.TIMEOUT:
              errorMessage = 'Location request timed out'
              break
          }
          
          reject(new Error(errorMessage))
        },
        this.options
      )
    })
  }

  /**
   * Convert coordinates to state using reverse geocoding
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   * @returns {Promise<string>} State name
   */
  async getStateFromCoordinates(latitude, longitude) {
    try {
      // Using a free reverse geocoding service
      // In production, you might want to use Google Maps API or similar
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      )
      
      if (!response.ok) {
        throw new Error('Reverse geocoding failed')
      }
      
      const data = await response.json()
      
      // Extract state from the response
      const state = data.principalSubdivision || data.locality
      
      if (!state) {
        throw new Error('Could not determine state from location')
      }
      
      return this.normalizeStateName(state)
    } catch (error) {
      console.error('Reverse Geocoding Error:', error)
      throw new Error('Failed to determine state from location')
    }
  }

  /**
   * Get user's state automatically
   * @returns {Promise<string>} State name
   */
  async detectUserState() {
    try {
      const position = await this.getCurrentPosition()
      const state = await this.getStateFromCoordinates(
        position.latitude, 
        position.longitude
      )
      
      return state
    } catch (error) {
      console.error('State Detection Error:', error)
      throw error
    }
  }

  /**
   * Normalize state name to match our data format
   * @param {string} stateName - Raw state name from API
   * @returns {string} Normalized state name
   */
  normalizeStateName(stateName) {
    // Handle common variations and abbreviations
    const stateMap = {
      'CA': 'California',
      'TX': 'Texas',
      'FL': 'Florida',
      'NY': 'New York',
      'IL': 'Illinois',
      'PA': 'Pennsylvania',
      'OH': 'Ohio',
      'GA': 'Georgia',
      'NC': 'North Carolina',
      'MI': 'Michigan',
      'NJ': 'New Jersey',
      'VA': 'Virginia',
      'WA': 'Washington',
      'AZ': 'Arizona',
      'MA': 'Massachusetts',
      'TN': 'Tennessee',
      'IN': 'Indiana',
      'MO': 'Missouri',
      'MD': 'Maryland',
      'WI': 'Wisconsin',
      'CO': 'Colorado',
      'MN': 'Minnesota',
      'SC': 'South Carolina',
      'AL': 'Alabama',
      'LA': 'Louisiana',
      'KY': 'Kentucky',
      'OR': 'Oregon',
      'OK': 'Oklahoma',
      'CT': 'Connecticut',
      'UT': 'Utah',
      'IA': 'Iowa',
      'NV': 'Nevada',
      'AR': 'Arkansas',
      'MS': 'Mississippi',
      'KS': 'Kansas',
      'NM': 'New Mexico',
      'NE': 'Nebraska',
      'WV': 'West Virginia',
      'ID': 'Idaho',
      'HI': 'Hawaii',
      'NH': 'New Hampshire',
      'ME': 'Maine',
      'RI': 'Rhode Island',
      'MT': 'Montana',
      'DE': 'Delaware',
      'SD': 'South Dakota',
      'ND': 'North Dakota',
      'AK': 'Alaska',
      'VT': 'Vermont',
      'WY': 'Wyoming'
    }

    // Check if it's an abbreviation
    if (stateMap[stateName.toUpperCase()]) {
      return stateMap[stateName.toUpperCase()]
    }

    // Handle full state names with proper capitalization
    return stateName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Check if geolocation is supported and permission is granted
   * @returns {Promise<boolean>} Whether geolocation is available
   */
  async checkGeolocationSupport() {
    if (!navigator.geolocation) {
      return false
    }

    try {
      // Check permission status if available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'geolocation' })
        return permission.state !== 'denied'
      }
      
      return true
    } catch (error) {
      console.error('Permission check failed:', error)
      return true // Assume it's available if we can't check
    }
  }

  /**
   * Watch position changes (for future features)
   * @param {function} callback - Callback function for position updates
   * @returns {number} Watch ID for clearing the watch
   */
  watchPosition(callback) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported')
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        callback({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        })
      },
      (error) => {
        console.error('Position watch error:', error)
      },
      this.options
    )
  }

  /**
   * Clear position watch
   * @param {number} watchId - Watch ID to clear
   */
  clearWatch(watchId) {
    if (navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  /**
   * Get distance between two coordinates (Haversine formula)
   * @param {number} lat1 - First latitude
   * @param {number} lon1 - First longitude
   * @param {number} lat2 - Second latitude
   * @param {number} lon2 - Second longitude
   * @returns {number} Distance in kilometers
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1)
    const dLon = this.toRadians(lon2 - lon1)
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * Convert degrees to radians
   * @param {number} degrees - Degrees to convert
   * @returns {number} Radians
   */
  toRadians(degrees) {
    return degrees * (Math.PI / 180)
  }
}

export default new GeolocationService()
