# Shield & Script

**Know Your Rights, Instantly.**

Shield & Script is a mobile-optimized web application that provides state-specific legal guides, actionable scripts, and secure recording capabilities for individuals during police encounters.

## 🚀 Features

### Core Features
- **State-Specific Rights Guides**: Tailored legal information for all 50 US states
- **Actionable Scripts**: Pre-written, scenario-based scripts in English and Spanish
- **One-Tap Recording**: Discreet audio/video recording with emergency contact alerts
- **Shareable Knowledge Cards**: Auto-generated, shareable legal information cards

### Premium Features
- **AI-Powered Script Generation**: Custom scripts using OpenAI for any scenario
- **Cloud Backup**: Secure IPFS storage via Pinata for recordings and content
- **Advanced Recording**: Enhanced recording features with metadata and location
- **Unlimited Access**: Full access to all scripts and features

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: Custom component library with shadcn/ui inspiration
- **APIs**: OpenAI, Stripe, Pinata (IPFS), Geolocation
- **Storage**: Local Storage + IPFS for premium users
- **Deployment**: Docker-ready with Vite build

## 📋 Prerequisites

- Node.js 16+ and npm
- API keys for:
  - OpenAI (for script generation)
  - Stripe (for payments)
  - Pinata (for IPFS storage)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/this-is-a-1304.git
   cd this-is-a-1304
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# OpenAI API Key for script generation
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stripe Configuration for payments
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key-here
VITE_STRIPE_PRICE_ID_MONTHLY=price_your-monthly-price-id-here

# Pinata API Keys for IPFS storage
VITE_PINATA_API_KEY=your-pinata-api-key-here
VITE_PINATA_SECRET_KEY=your-pinata-secret-key-here

# Airstack API Key (optional)
VITE_AIRSTACK_API_KEY=your-airstack-api-key-here
```

### API Setup

1. **OpenAI**: Get API key from [OpenAI Platform](https://platform.openai.com/)
2. **Stripe**: Set up account at [Stripe Dashboard](https://dashboard.stripe.com/)
3. **Pinata**: Create account at [Pinata Cloud](https://pinata.cloud/)

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── Button.jsx      # Reusable button component
│   ├── Header.jsx      # Navigation header
│   ├── LandingPage.jsx # Landing page with state selection
│   ├── RightsGuide.jsx # State-specific rights display
│   ├── ScriptLibrary.jsx # Script library with AI generation
│   ├── RecordingInterface.jsx # Recording functionality
│   ├── Profile.jsx     # User profile and settings
│   ├── ShareView.jsx   # Shared content viewer
│   └── SubscriptionSuccess.jsx # Payment success page
├── services/           # API service layers
│   ├── openaiService.js # OpenAI integration
│   ├── stripeService.js # Stripe payment processing
│   ├── pinataService.js # IPFS storage via Pinata
│   └── geolocationService.js # Location services
├── config/             # Configuration files
│   └── api.js         # API configuration and headers
├── data/              # Static data
│   └── legalData.js   # State rights and script data
└── App.jsx            # Main application component
```

## 🎨 Design System

The app uses a custom design system with:

- **Colors**: Dark theme with accent colors
- **Typography**: Responsive text scales
- **Components**: Modular, reusable UI components
- **Layout**: Mobile-first responsive design

### Design Tokens

```css
:root {
  --color-bg: hsl(210 40% 15%);
  --color-surface: hsl(210 40% 20%);
  --color-accent: hsl(37 96% 55%);
  --color-primary: hsl(222 88% 50%);
  --color-text-primary: hsl(0 0% 95%);
  --color-text-secondary: hsl(0 0% 70%);
}
```

## 🔒 Security & Privacy

- **Local-First**: Core functionality works without cloud services
- **Encrypted Storage**: IPFS provides decentralized, secure storage
- **No Personal Data**: Minimal data collection, user privacy focused
- **Secure Recording**: Recordings stored locally with optional cloud backup

## 📱 Mobile Optimization

- **Progressive Web App**: Installable on mobile devices
- **Touch-Friendly**: Large touch targets and gestures
- **Offline Capable**: Core features work without internet
- **Fast Loading**: Optimized bundle size and lazy loading

## 🚀 Deployment

### Docker Deployment

```bash
# Build the image
docker build -t shield-script .

# Run the container
docker run -p 3000:3000 shield-script
```

### Manual Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy dist/ folder to your hosting service
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📄 Legal Disclaimer

This application provides educational information about constitutional rights and is not a substitute for legal advice. Laws vary by jurisdiction. Users should consult with qualified attorneys for specific legal guidance.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@shieldandscript.com or create an issue in this repository.

## 🗺 Roadmap

- [ ] Mobile app versions (iOS/Android)
- [ ] Multi-language support (beyond English/Spanish)
- [ ] Integration with legal aid organizations
- [ ] Advanced analytics and reporting
- [ ] Community-contributed content
- [ ] Real-time legal updates

---

**Built with ❤️ for civil rights and community safety**
