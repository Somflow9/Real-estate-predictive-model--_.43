
# PropGyan - AI-Powered Real Estate Assistant

PropGyan is an intelligent real estate consultation platform that provides data-driven property insights for Indian markets. Built with React, TypeScript, and powered by OpenAI's GPT-4, it offers comprehensive property analysis, market trends, and investment recommendations.

## 🚀 Features

### Core AI Capabilities
- **Conversational AI Chat**: Powered by GPT-4 for natural property consultations
- **Real-time Price Estimation**: Dynamic pricing based on location, property type, and market conditions
- **Builder Credibility Scores**: Trust ratings for major developers across Indian cities
- **Neighborhood Insights**: Comprehensive area analysis including amenities, connectivity, and safety
- **3-Year Market Analysis**: Historical price trends and seasonal patterns
- **Smart Investment Recommendations**: AI-driven buy/sell/wait advice with detailed reasoning

### Advanced Features
- **Temporal Analysis**: 36-month price history with seasonal variations
- **Dynamic Prompt Suggestions**: Context-aware query recommendations
- **Flash Cards**: Visual data presentation for key metrics
- **Property Listings**: Comprehensive database covering Tier-1 and Tier-2 Indian cities
- **Real-time Market Pulse**: Current trends and market indicators

### Supported Cities
**Tier-1 Cities**: Mumbai, Delhi, Bangalore, Pune, Hyderabad, Chennai, Kolkata, Gurgaon
**Tier-2 Cities**: Ahmedabad, Surat, Jaipur, Lucknow, Kanpur, Nagpur, Indore, Thane, Bhopal, and more

## 🎨 Design System

### Theme
- **Background**: Pure black (#0d0d0d) with charcoal accents (#121212)
- **Primary**: Rich gold (#FFD700) for highlights and CTAs
- **Secondary**: Warm gold (#e4b343) for accents
- **Typography**: Poppins and Inter fonts for modern readability
- **Effects**: Glassmorphism, soft shadows, and animated hover states

### UI Components
- Rounded corners (2xl) for soft, approachable design
- Animated flash cards for data visualization
- Glowing input elements with gold accents
- Responsive layout for desktop and mobile
- Dynamic prompt bubbles with contextual suggestions

## 🛠️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui library
- **State Management**: React Query for API state
- **Routing**: React Router v6
- **AI Integration**: OpenAI GPT-4 API
- **Icons**: Lucide React
- **Charts**: Recharts for data visualization

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key

### Quick Start
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd propgyan
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
- "What's the price trend in Gurgaon for 2BHK apartments?"
- "Is Sobha a reliable builder for projects in Bangalore?"
- "Compare property prices between Delhi and Noida"
- "Should I invest in real estate in Hyderabad right now?"
- "What are the best localities in Mumbai under ₹1 crore?"

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── ApiKeyInput.tsx # API key configuration
│   ├── Navbar.tsx      # Navigation header
│   └── PromptBubbles.tsx # Dynamic suggestions
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── Chat.tsx        # Main chat interface
│   ├── Recommendations.tsx # Property listings
│   └── MarketPulse.tsx # Market insights
├── services/           # Business logic
│   ├── openaiService.ts # AI chat integration
│   ├── propertyDataService.ts # Property data
│   ├── temporalAnalysisService.ts # Market analysis
│   └── promptSuggestionsService.ts # Dynamic prompts
├── types/              # TypeScript definitions
├── contexts/           # React contexts
└── hooks/              # Custom React hooks
```

### Key Services
- **OpenAI Service**: Manages GPT-4 API interactions
- **Property Data Service**: Handles property listings and filters
- **Temporal Analysis Service**: Generates market trends and recommendations
- **Prompt Suggestions Service**: Provides contextual query suggestions

## 🔧 Customization

### Adding New Cities
Update `src/services/propertyDataService.ts`:
```typescript
private tier2Cities = [...existingCities, 'YourNewCity'];
```

### Modifying AI Prompts
Edit the system message in `src/pages/Chat.tsx`:
```typescript
const systemMessage = {
  role: 'system',
  content: `Your custom PropGyan instructions...`
};
```

### Styling Adjustments
Update design tokens in `src/index.css`:
```css
:root {
  --primary: 45 100% 50%; /* Gold */
  --background: 210 11% 5%; /* Black */
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

- [ ] Integration with real property APIs
- [ ] User authentication and saved searches
- [ ] Property comparison tools
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Multi-language support

---

**PropGyan** - Where you live is your story — make sure the first chapter isn't a mistake. 🏠✨
