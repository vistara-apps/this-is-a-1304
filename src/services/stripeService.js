import { loadStripe } from '@stripe/stripe-js'
import { API_CONFIG } from '../config/api'

class StripeService {
  constructor() {
    this.stripePromise = loadStripe(API_CONFIG.STRIPE.PUBLISHABLE_KEY)
    this.priceId = API_CONFIG.STRIPE.PRICE_ID_MONTHLY
  }

  /**
   * Initialize Stripe checkout session for subscription
   * @param {string} userId - User identifier
   * @param {string} email - User email
   * @returns {Promise<void>}
   */
  async createCheckoutSession(userId, email) {
    try {
      const stripe = await this.stripePromise
      
      // In a real app, this would call your backend API to create a checkout session
      // For demo purposes, we'll simulate the checkout flow
      const sessionData = {
        mode: 'subscription',
        line_items: [
          {
            price: this.priceId,
            quantity: 1,
          },
        ],
        success_url: API_CONFIG.STRIPE.SUCCESS_URL,
        cancel_url: API_CONFIG.STRIPE.CANCEL_URL,
        customer_email: email,
        metadata: {
          userId: userId
        }
      }

      // This would typically be a call to your backend
      const response = await this.createCheckoutSessionOnBackend(sessionData)
      
      if (response.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.sessionId,
        })
        
        if (error) {
          throw new Error(error.message)
        }
      }
    } catch (error) {
      console.error('Stripe Checkout Error:', error)
      throw new Error('Failed to initialize payment. Please try again.')
    }
  }

  /**
   * Simulate backend API call to create checkout session
   * In production, this would be replaced with actual backend API call
   */
  async createCheckoutSessionOnBackend(sessionData) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // For demo purposes, return a mock session ID
    // In production, your backend would create the actual Stripe session
    return {
      sessionId: 'cs_test_' + Math.random().toString(36).substr(2, 9)
    }
  }

  /**
   * Handle successful subscription
   * @param {string} sessionId - Stripe session ID
   * @returns {Promise<object>} Subscription details
   */
  async handleSuccessfulSubscription(sessionId) {
    try {
      // In production, verify the session with your backend
      const subscriptionDetails = await this.verifySubscriptionOnBackend(sessionId)
      
      // Update local storage with subscription status
      localStorage.setItem('userSubscription', 'premium')
      localStorage.setItem('subscriptionDetails', JSON.stringify(subscriptionDetails))
      
      return subscriptionDetails
    } catch (error) {
      console.error('Subscription Verification Error:', error)
      throw new Error('Failed to verify subscription. Please contact support.')
    }
  }

  /**
   * Simulate backend verification of subscription
   */
  async verifySubscriptionOnBackend(sessionId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id: 'sub_' + Math.random().toString(36).substr(2, 9),
      status: 'active',
      current_period_start: Date.now(),
      current_period_end: Date.now() + (30 * 24 * 60 * 60 * 1000), // 30 days
      plan: {
        id: this.priceId,
        amount: 299, // $2.99
        currency: 'usd',
        interval: 'month'
      }
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Stripe subscription ID
   * @returns {Promise<void>}
   */
  async cancelSubscription(subscriptionId) {
    try {
      // In production, call your backend to cancel the subscription
      await this.cancelSubscriptionOnBackend(subscriptionId)
      
      // Update local storage
      localStorage.setItem('userSubscription', 'free')
      localStorage.removeItem('subscriptionDetails')
      
      return { success: true }
    } catch (error) {
      console.error('Subscription Cancellation Error:', error)
      throw new Error('Failed to cancel subscription. Please try again.')
    }
  }

  /**
   * Simulate backend cancellation
   */
  async cancelSubscriptionOnBackend(subscriptionId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { success: true }
  }

  /**
   * Get subscription status
   * @param {string} userId - User identifier
   * @returns {Promise<object>} Subscription status
   */
  async getSubscriptionStatus(userId) {
    try {
      const savedDetails = localStorage.getItem('subscriptionDetails')
      if (savedDetails) {
        const details = JSON.parse(savedDetails)
        
        // Check if subscription is still active
        if (details.current_period_end > Date.now()) {
          return {
            status: 'active',
            ...details
          }
        } else {
          // Subscription expired
          localStorage.setItem('userSubscription', 'free')
          localStorage.removeItem('subscriptionDetails')
          return { status: 'expired' }
        }
      }
      
      return { status: 'free' }
    } catch (error) {
      console.error('Subscription Status Error:', error)
      return { status: 'free' }
    }
  }

  /**
   * Create customer portal session for subscription management
   * @param {string} customerId - Stripe customer ID
   * @returns {Promise<string>} Portal URL
   */
  async createPortalSession(customerId) {
    try {
      // In production, call your backend to create portal session
      const response = await this.createPortalSessionOnBackend(customerId)
      return response.url
    } catch (error) {
      console.error('Portal Session Error:', error)
      throw new Error('Failed to access subscription management. Please try again.')
    }
  }

  /**
   * Simulate backend portal session creation
   */
  async createPortalSessionOnBackend(customerId) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      url: `https://billing.stripe.com/p/session/test_${Math.random().toString(36).substr(2, 9)}`
    }
  }

  /**
   * Validate subscription for premium features
   * @returns {boolean} Whether user has active premium subscription
   */
  isPremiumUser() {
    const subscription = localStorage.getItem('userSubscription')
    const details = localStorage.getItem('subscriptionDetails')
    
    if (subscription === 'premium' && details) {
      const subscriptionDetails = JSON.parse(details)
      return subscriptionDetails.current_period_end > Date.now()
    }
    
    return false
  }
}

export default new StripeService()
