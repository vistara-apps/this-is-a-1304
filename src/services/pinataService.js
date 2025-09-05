import axios from 'axios'
import { API_CONFIG, getHeaders } from '../config/api'

class PinataService {
  constructor() {
    this.baseURL = API_CONFIG.PINATA.BASE_URL
    this.gatewayURL = API_CONFIG.PINATA.GATEWAY_URL
  }

  /**
   * Upload recording file to IPFS via Pinata
   * @param {File} file - Recording file (audio/video)
   * @param {object} metadata - Additional metadata
   * @returns {Promise<object>} IPFS hash and URL
   */
  async uploadRecording(file, metadata = {}) {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      // Add metadata
      const pinataMetadata = {
        name: `recording_${Date.now()}_${file.name}`,
        keyvalues: {
          type: 'police_encounter_recording',
          timestamp: new Date().toISOString(),
          fileType: file.type,
          fileSize: file.size.toString(),
          ...metadata
        }
      }
      
      formData.append('pinataMetadata', JSON.stringify(pinataMetadata))
      
      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          headers: {
            ...getHeaders('pinata'),
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      const ipfsHash = response.data.IpfsHash
      const ipfsUrl = `${this.gatewayURL}/${ipfsHash}`
      
      return {
        hash: ipfsHash,
        url: ipfsUrl,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Pinata Upload Error:', error)
      throw new Error('Failed to upload recording to secure storage. Please try again.')
    }
  }

  /**
   * Upload knowledge card data to IPFS
   * @param {object} cardData - Knowledge card content
   * @returns {Promise<object>} IPFS hash and URL
   */
  async uploadKnowledgeCard(cardData) {
    try {
      const pinataContent = {
        ...cardData,
        timestamp: new Date().toISOString(),
        type: 'knowledge_card',
        version: '1.0'
      }

      const pinataMetadata = {
        name: `knowledge_card_${Date.now()}`,
        keyvalues: {
          type: 'knowledge_card',
          state: cardData.state || 'general',
          topic: cardData.topic || 'rights',
          language: cardData.language || 'en'
        }
      }

      const response = await axios.post(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        {
          pinataContent,
          pinataMetadata
        },
        {
          headers: getHeaders('pinata')
        }
      )

      const ipfsHash = response.data.IpfsHash
      const ipfsUrl = `${this.gatewayURL}/${ipfsHash}`
      
      return {
        hash: ipfsHash,
        url: ipfsUrl,
        shareableUrl: `${window.location.origin}/share/${ipfsHash}`,
        metadata: pinataMetadata
      }
    } catch (error) {
      console.error('Pinata JSON Upload Error:', error)
      throw new Error('Failed to create shareable card. Please try again.')
    }
  }

  /**
   * Retrieve content from IPFS
   * @param {string} ipfsHash - IPFS hash
   * @returns {Promise<object>} Retrieved content
   */
  async retrieveContent(ipfsHash) {
    try {
      const response = await axios.get(`${this.gatewayURL}/${ipfsHash}`)
      return response.data
    } catch (error) {
      console.error('IPFS Retrieval Error:', error)
      throw new Error('Failed to retrieve content from secure storage.')
    }
  }

  /**
   * Pin existing content by hash
   * @param {string} ipfsHash - IPFS hash to pin
   * @param {object} metadata - Metadata for the pin
   * @returns {Promise<object>} Pin result
   */
  async pinByHash(ipfsHash, metadata = {}) {
    try {
      const pinataMetadata = {
        name: `pinned_content_${Date.now()}`,
        keyvalues: {
          type: 'user_pinned',
          timestamp: new Date().toISOString(),
          ...metadata
        }
      }

      const response = await axios.post(
        `${this.baseURL}/pinning/pinByHash`,
        {
          hashToPin: ipfsHash,
          pinataMetadata
        },
        {
          headers: getHeaders('pinata')
        }
      )

      return response.data
    } catch (error) {
      console.error('Pin by Hash Error:', error)
      throw new Error('Failed to pin content.')
    }
  }

  /**
   * List user's pinned files
   * @param {object} filters - Filters for the query
   * @returns {Promise<Array>} List of pinned files
   */
  async listPinnedFiles(filters = {}) {
    try {
      const params = new URLSearchParams({
        status: 'pinned',
        pageLimit: '10',
        ...filters
      })

      const response = await axios.get(
        `${this.baseURL}/data/pinList?${params}`,
        {
          headers: getHeaders('pinata')
        }
      )

      return response.data.rows.map(item => ({
        hash: item.ipfs_pin_hash,
        name: item.metadata?.name || 'Unnamed',
        size: item.size,
        timestamp: item.date_pinned,
        url: `${this.gatewayURL}/${item.ipfs_pin_hash}`,
        metadata: item.metadata
      }))
    } catch (error) {
      console.error('List Pinned Files Error:', error)
      throw new Error('Failed to retrieve file list.')
    }
  }

  /**
   * Unpin content from IPFS
   * @param {string} ipfsHash - IPFS hash to unpin
   * @returns {Promise<void>}
   */
  async unpinContent(ipfsHash) {
    try {
      await axios.delete(
        `${this.baseURL}/pinning/unpin/${ipfsHash}`,
        {
          headers: getHeaders('pinata')
        }
      )
    } catch (error) {
      console.error('Unpin Error:', error)
      throw new Error('Failed to remove content from storage.')
    }
  }

  /**
   * Generate shareable link for knowledge card
   * @param {object} cardData - Knowledge card data
   * @returns {Promise<string>} Shareable URL
   */
  async createShareableCard(cardData) {
    try {
      const uploadResult = await this.uploadKnowledgeCard(cardData)
      return uploadResult.shareableUrl
    } catch (error) {
      console.error('Create Shareable Card Error:', error)
      throw new Error('Failed to create shareable link.')
    }
  }

  /**
   * Test Pinata connection and authentication
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      const response = await axios.get(
        `${this.baseURL}/data/testAuthentication`,
        {
          headers: getHeaders('pinata')
        }
      )
      
      return response.data.message === 'Congratulations! You are communicating with the Pinata API!'
    } catch (error) {
      console.error('Pinata Connection Test Failed:', error)
      return false
    }
  }

  /**
   * Get storage usage statistics
   * @returns {Promise<object>} Usage statistics
   */
  async getUsageStats() {
    try {
      const response = await axios.get(
        `${this.baseURL}/data/userPinnedDataTotal`,
        {
          headers: getHeaders('pinata')
        }
      )

      return {
        pinCount: response.data.pin_count,
        totalSize: response.data.pin_size_total,
        formattedSize: this.formatBytes(response.data.pin_size_total)
      }
    } catch (error) {
      console.error('Usage Stats Error:', error)
      return {
        pinCount: 0,
        totalSize: 0,
        formattedSize: '0 B'
      }
    }
  }

  /**
   * Format bytes to human readable format
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new PinataService()
