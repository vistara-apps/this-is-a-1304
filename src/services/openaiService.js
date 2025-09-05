import axios from 'axios'
import { API_CONFIG, getHeaders } from '../config/api'

class OpenAIService {
  constructor() {
    this.baseURL = API_CONFIG.OPENAI.BASE_URL
    this.model = API_CONFIG.OPENAI.MODEL
    this.maxTokens = API_CONFIG.OPENAI.MAX_TOKENS
    this.temperature = API_CONFIG.OPENAI.TEMPERATURE
  }

  /**
   * Generate a custom script for a specific scenario and state
   * @param {string} scenario - The scenario description
   * @param {string} state - The state for legal context
   * @param {string} language - Language preference (en/es)
   * @returns {Promise<string>} Generated script
   */
  async generateScript(scenario, state, language = 'en') {
    try {
      const prompt = this.buildScriptPrompt(scenario, state, language)
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a legal assistant that helps create respectful, constitutional scripts for police interactions. Always emphasize constitutional rights and de-escalation.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: this.maxTokens,
          temperature: this.temperature
        },
        {
          headers: getHeaders('openai')
        }
      )

      return response.data.choices[0].message.content.trim()
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to generate script. Please try again.')
    }
  }

  /**
   * Generate shareable knowledge card content
   * @param {string} state - The state for legal context
   * @param {string} topic - Specific topic (rights, traffic, search, etc.)
   * @returns {Promise<object>} Card content with title, summary, and key points
   */
  async generateKnowledgeCard(state, topic) {
    try {
      const prompt = this.buildCardPrompt(state, topic)
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: 'You are a legal educator creating concise, accurate knowledge cards about constitutional rights during police encounters.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.5
        },
        {
          headers: getHeaders('openai')
        }
      )

      const content = response.data.choices[0].message.content.trim()
      return this.parseCardContent(content)
    } catch (error) {
      console.error('OpenAI API Error:', error)
      throw new Error('Failed to generate knowledge card. Please try again.')
    }
  }

  /**
   * Build prompt for script generation
   */
  buildScriptPrompt(scenario, state, language) {
    const langText = language === 'es' ? 'Spanish' : 'English'
    
    return `Create a respectful, constitutional script for the following police interaction scenario:

Scenario: ${scenario}
State: ${state}
Language: ${langText}

Requirements:
- Emphasize constitutional rights (4th, 5th, 6th amendments)
- Use respectful, non-confrontational language
- Include specific phrases for exercising rights
- Keep it concise and memorable
- Consider ${state} specific laws if relevant

Format the response as a direct quote that someone could say during the interaction.`
  }

  /**
   * Build prompt for knowledge card generation
   */
  buildCardPrompt(state, topic) {
    return `Create a concise knowledge card about ${topic} rights during police encounters in ${state}.

Include:
- Title (max 8 words)
- Summary (2-3 sentences)
- 3-4 key bullet points
- State-specific considerations for ${state}

Format as JSON with keys: title, summary, keyPoints (array)`
  }

  /**
   * Parse knowledge card content from AI response
   */
  parseCardContent(content) {
    try {
      // Try to parse as JSON first
      return JSON.parse(content)
    } catch {
      // Fallback to text parsing
      const lines = content.split('\n').filter(line => line.trim())
      return {
        title: lines[0] || 'Know Your Rights',
        summary: lines[1] || 'Understanding your constitutional rights during police encounters.',
        keyPoints: lines.slice(2).map(line => line.replace(/^[-•*]\s*/, ''))
      }
    }
  }

  /**
   * Translate existing script to another language
   * @param {string} script - Original script
   * @param {string} targetLanguage - Target language (en/es)
   * @returns {Promise<string>} Translated script
   */
  async translateScript(script, targetLanguage) {
    try {
      const langText = targetLanguage === 'es' ? 'Spanish' : 'English'
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: `You are a legal translator specializing in constitutional rights. Translate legal scripts while maintaining their legal accuracy and respectful tone.`
            },
            {
              role: 'user',
              content: `Translate this police interaction script to ${langText}, maintaining legal accuracy and respectful tone:\n\n"${script}"`
            }
          ],
          max_tokens: this.maxTokens,
          temperature: 0.3
        },
        {
          headers: getHeaders('openai')
        }
      )

      return response.data.choices[0].message.content.trim().replace(/^"|"$/g, '')
    } catch (error) {
      console.error('Translation Error:', error)
      throw new Error('Failed to translate script. Please try again.')
    }
  }
}

export default new OpenAIService()
