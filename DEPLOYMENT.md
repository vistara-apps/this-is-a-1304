# Shield & Script Deployment Guide

This guide covers deploying Shield & Script to production environments.

## 🚀 Quick Deploy Options

### Option 1: Docker (Recommended)

```bash
# Build and run with Docker
docker build -t shield-script .
docker run -p 3000:3000 shield-script
```

### Option 2: Static Hosting (Vercel, Netlify, etc.)

```bash
# Build for production
npm run build

# Deploy the dist/ folder to your hosting service
```

## 🔧 Environment Configuration

### Required Environment Variables

Create a `.env` file with these variables:

```env
# OpenAI API Key (Required for AI features)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe Configuration (Required for payments)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key-here
VITE_STRIPE_PRICE_ID_MONTHLY=price_your-monthly-price-id-here

# Pinata API Keys (Required for cloud storage)
VITE_PINATA_API_KEY=your-pinata-api-key-here
VITE_PINATA_SECRET_KEY=your-pinata-secret-key-here

# Optional: Airstack API Key
VITE_AIRSTACK_API_KEY=your-airstack-api-key-here

# Production Mode
NODE_ENV=production
```

### API Setup Checklist

#### OpenAI Setup
1. Create account at [OpenAI Platform](https://platform.openai.com/)
2. Generate API key in API Keys section
3. Set up billing and usage limits
4. Test API key with a simple request

#### Stripe Setup
1. Create account at [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to Live mode for production
3. Create a monthly subscription product
4. Get publishable key and price ID
5. Set up webhooks for subscription events
6. Configure success/cancel URLs

#### Pinata Setup
1. Create account at [Pinata Cloud](https://pinata.cloud/)
2. Generate API key and secret
3. Test authentication
4. Set up IPFS gateway preferences

## 🌐 Hosting Platforms

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Environment Variables**
   - Add all environment variables in Vercel dashboard
   - Ensure VITE_ prefix for client-side variables

3. **Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### Netlify Deployment

1. **Build Settings**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "dist"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Environment Variables**
   - Add in Netlify dashboard under Site Settings > Environment Variables

### Docker Production

1. **Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     shield-script:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
       env_file:
         - .env
       restart: unless-stopped
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## 🔒 Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Set up API key usage monitoring

### Content Security Policy
Add CSP headers for enhanced security:

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://js.stripe.com; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  connect-src 'self' https://api.openai.com https://api.pinata.cloud https://gateway.pinata.cloud https://api.stripe.com;
```

### HTTPS Configuration
- Always use HTTPS in production
- Configure SSL certificates
- Set up HTTP to HTTPS redirects

## 📊 Monitoring & Analytics

### Error Tracking
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage analytics

### Performance Monitoring
- Monitor API response times
- Track bundle size and loading performance
- Set up uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_OPENAI_API_KEY: ${{ secrets.VITE_OPENAI_API_KEY }}
          VITE_STRIPE_PUBLISHABLE_KEY: ${{ secrets.VITE_STRIPE_PUBLISHABLE_KEY }}
          VITE_STRIPE_PRICE_ID_MONTHLY: ${{ secrets.VITE_STRIPE_PRICE_ID_MONTHLY }}
          VITE_PINATA_API_KEY: ${{ secrets.VITE_PINATA_API_KEY }}
          VITE_PINATA_SECRET_KEY: ${{ secrets.VITE_PINATA_SECRET_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Pre-Deployment Testing

### Build Testing
```bash
# Test production build locally
npm run build
npm run preview

# Test with different environment configurations
NODE_ENV=production npm run build
```

### API Testing
```bash
# Test API connections
curl -H "Authorization: Bearer $VITE_OPENAI_API_KEY" \
  https://api.openai.com/v1/models

# Test Pinata connection
curl -H "pinata_api_key: $VITE_PINATA_API_KEY" \
  -H "pinata_secret_api_key: $VITE_PINATA_SECRET_KEY" \
  https://api.pinata.cloud/data/testAuthentication
```

## 📱 Mobile Optimization

### PWA Configuration
The app includes PWA capabilities:
- Service worker for offline functionality
- Web app manifest for installation
- Mobile-optimized touch targets

### Performance Optimization
- Bundle splitting for faster loading
- Image optimization
- Lazy loading of components
- CDN for static assets

## 🆘 Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (16+ required)
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and reinstall

2. **API Connection Issues**
   - Verify environment variables are set
   - Check API key validity
   - Ensure CORS settings for APIs

3. **Deployment Issues**
   - Check build output in dist/ folder
   - Verify hosting platform configuration
   - Check environment variable names (VITE_ prefix)

### Support
For deployment issues:
- Check the GitHub Issues
- Review hosting platform documentation
- Contact support@shieldandscript.com

---

**Ready for production deployment! 🚀**
