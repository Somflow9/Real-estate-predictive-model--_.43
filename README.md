# BrickMatrix™ - Premium Real Estate Intelligence Platform

BrickMatrix™ is India's most advanced real estate intelligence platform that provides data-driven property insights powered by cutting-edge AI technology. Built with React, TypeScript, and featuring the revolutionary BrickMatrix™ Engine, it offers comprehensive property analysis, market trends, and investment recommendations.

## 🚀 Features

### Core AI Capabilities
- **BrickMatrix™ Engine**: Revolutionary AI-powered property scoring and recommendation system
- **Real-time Multi-Platform Data**: Live feeds from MagicBricks, 99acres, Housing.com & NoBroker
- **Builder Intelligence**: Comprehensive credibility analysis with RERA verification and delivery scores
- **Location Intelligence**: Advanced connectivity scoring, hotspot detection, and infrastructure analysis
- **Smart Investment Scoring**: AI-driven affordability, livability, and investment potential analysis

### Advanced Features
- **Premium Dark UI**: Deep purple and black theme with glassmorphism effects
- **25+ Buyer Preferences**: Comprehensive filtering including smart home features, sustainability options
- **Competing Projects Analysis**: Nearby scheme detection with distance and pricing comparison
- **BrickMatrix™ Scoring**: Proprietary 10-point scoring system for properties
- **AI Recommendation Engine**: Strong Buy/Buy/Hold recommendations with confidence levels

### Supported Cities
**Tier-1 Cities**: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Gurgaon
**Tier-2 Cities**: Ahmedabad, Surat, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, and more

## 🎨 Design System

### Theme
- **Background**: Gradient from midnight black to deep purple (#000000 to #4B0082)
- **Primary**: Deep purple (#6A0DAD) for main elements
- **Accent**: Electric violet (#8F00FF) for highlights and CTAs
- **Text**: Lilac (#E6E6FA) for optimal contrast and readability
- **Effects**: Advanced glassmorphism, purple glow effects, and premium animations

### UI Components
- Rounded corners (16px) for premium, modern design
- Animated property cards with hover lift effects
- Glowing input elements with purple accents
- Responsive layout for desktop and mobile
- BrickMatrix™ scoring visualizations with progress indicators

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom BrickMatrix™ theme
- **UI Components**: Shadcn/ui library
- **State Management**: React Query for API state
- **Routing**: React Router v6
- **AI Integration**: BrickMatrix™ Engine with OpenAI GPT-4 API
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion for premium interactions

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key (for chat functionality)

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd brickmatrix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

5. **Configure OpenAI API**
   - The app will prompt you to enter your OpenAI API key on first launch
   - Your key is stored securely in localStorage
   - Get your API key from: https://platform.openai.com/api-keys

## 🔮 BrickMatrix™ Engine

### Core Features
- **Multi-Platform Integration**: Real-time data from 4 major property portals
- **AI Scoring Algorithm**: Proprietary 10-point scoring system
- **Location Intelligence**: Connectivity, infrastructure, and hotspot analysis
- **Builder Credibility**: RERA verification, delivery scores, and market sentiment
- **Investment Analysis**: ROI projections, rental yields, and risk assessment

### Data Sources
- **Property Platforms**: MagicBricks, 99acres, Housing.com, NoBroker

## 🚀 Deployment

### Option 1: Vercel (Recommended)
1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel --prod
   ```

2. **Custom Domain Setup**
   - Add your domain in Vercel dashboard
   - Update DNS records:
     ```
     CNAME: www.propgyan.com -> your-app.vercel.app
     A: propgyan.com -> 76.76.19.61
     ```

### Option 2: Netlify
1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Drag and drop the `dist` folder to Netlify
   - Or connect your Git repository for automatic deployments

### Option 3: Firebase Hosting
1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize and deploy**
   ```bash
   firebase init hosting
   npm run build
   firebase deploy
   ```

## 🔑 Environment Configuration

### OpenAI API Key
- Required for AI chat functionality
- Entered through the app interface on first use
- Stored locally in browser's localStorage
- No server-side configuration needed

### Optional Enhancements
For production deployments, consider:
- Implementing API key validation
- Adding rate limiting
- Setting up error monitoring (Sentry)
- Configuring analytics (Google Analytics)

## 📱 Usage Guide

### Getting Started
1. **Launch the app** and enter your OpenAI API key
2. **Start chatting** with PropGyan about your property queries
3. **Use prompt suggestions** for common questions
4. **Explore different features**:
   - Ask about specific locations: "What's the market like in Bangalore?"
   - Compare builders: "How reliable is DLF vs Godrej?"
   - Get investment advice: "Should I buy now in Mumbai?"
   - Check price trends: "Show me 3-year trends for Pune"

### Sample Queries
- "Show me BrickMatrix™ top picks in Mumbai under ₹2 crores"
- "What's the builder credibility score for DLF in Gurgaon?"
- "Compare investment potential between Bangalore and Pune"
- "Find properties with swimming pool and gym in Bandra"

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── BrickMatrixRecommendations.tsx # Main recommendation component
│   ├── Navbar.tsx      # Navigation header
│   └── PremiumRecommendationCard.tsx # Property cards
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Chat.tsx        # Main chat interface
│   ├── Recommendations.tsx # Property listings
│   └── MarketPulse.tsx # Market insights
├── services/           # Business logic
│   ├── brickMatrixService.ts # Core BrickMatrix™ engine
│   ├── realTimePropertyService.ts # Multi-platform data fetching
│   ├── marketPulseService.ts # Live market data
│   └── builderSchemesService.ts # Builder analysis
├── schemas/            # Data schemas
│   └── brickmatrixSchema.json # Complete API schema
├── styles/             # Custom styling
│   └── brickMatrixTheme.css # Premium dark theme
├── types/              # TypeScript definitions
├── contexts/           # React contexts
└── hooks/              # Custom React hooks
```

### Key Services
- **BrickMatrix™ Service**: Core AI engine for property analysis and scoring
- **Real-time Property Service**: Multi-platform data aggregation and processing
- **Market Pulse Service**: Live market indicators and sentiment analysis
- **Builder Schemes Service**: Comprehensive builder credibility and project analysis

## 🔧 Customization

### Adding New Cities
Update `src/services/brickMatrixService.ts`:
```typescript
private getRandomLocality(city: string): string {
  const localities = {
    ...existingCities,
    'YourNewCity': ['Locality1', 'Locality2', 'Locality3']
  };
}
```

### Customizing BrickMatrix™ Scoring
Modify the scoring algorithm in `src/services/brickMatrixService.ts`:
```typescript
private calculateLocationScore(location: any): number {
  // Customize location scoring logic
  return Math.min(10, yourCustomLogic);
}
```

### Styling Adjustments
Update BrickMatrix™ theme in `src/styles/brickMatrixTheme.css`:
```css
:root {
  --bm-primary-purple: #6A0DAD;
  --bm-electric-violet: #8F00FF;
  --bm-gradient-primary: linear-gradient(135deg, #000000 0%, #4B0082 100%);
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For issues, questions, or feature requests:
- Create an issue on GitHub
- Check the documentation
- Review common troubleshooting steps

## 🔮 Roadmap

- [ ] Enhanced BrickMatrix™ scoring with machine learning
- [ ] Real-time property alerts and notifications
- [ ] Virtual property tours integration
- [ ] Blockchain-based property verification
- [ ] Advanced predictive analytics
- [ ] Mobile app with AR features
- [ ] Integration with more international markets

---

**BrickMatrix™** - Premium Real Estate Intelligence. Where data meets decisions. 🏠✨