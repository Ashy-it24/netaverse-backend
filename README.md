# Civic India - Political Information Assistant

A neutral, educational civic-tech platform for Indian citizens to understand laws, verify news, and engage with governance.

## 🎯 Purpose
- Understand laws, bills, and policies in simple language
- Verify political news and combat misinformation  
- Track and contact public representatives
- Draft formal civic grievances and complaints
- Access information in multiple Indian languages
- Get legal explanations in citizen-friendly terms

## 🏗️ Architecture

```
Frontend (React) → Firebase Hosting
     ↓
Cloud Functions (Node.js) → Google Gemini API
     ↓                           ↓
Firestore Database ← RAG Data Sources (Indian Govt)
```

## 🌟 Features

### 1. 📋 Civic Q&A
- Ask questions about Indian laws, representatives, policies
- Get neutral, fact-based answers with source citations
- Supports complex queries about governance and civic processes

### 2. 📄 Policy Summarizer
- Upload or paste policy documents, manifestos, bills
- Get bullet-point summaries in simple language
- Neutral presentation without political bias

### 3. ✅ Fact Checker
- Verify news claims against official government sources
- Check political statements and rumors
- Get verification status: True/False/Partially True/Unverifiable

### 4. ✍️ Grievance Drafter
- Generate formal complaint letters
- Proper government correspondence format
- Templates for different departments and issues

### 5. 🏛️ Representative Finder
- Find your MLA, MP, local representatives
- Get contact information and constituency details
- Understand their roles and responsibilities

### 6. ⚖️ Legal Explainer
- Understand Indian laws in simple terms
- Learn about citizen rights and legal procedures
- Get guidance on legal processes (with disclaimers)

## 🌐 Multilingual Support

- **English** - Primary language
- **Hindi** - हिंदी में उत्तर
- **Tamil** - தமிழில் பதில்
- **Malayalam** - മലയാളത്തിൽ ഉത്തരം
- **Telugu** - తెలుగులో సమాధానం

## 📊 Approved Data Sources

**Elections & Politicians**
- Election Commission of India (ECI)
- MyNeta (Association for Democratic Reforms)

**Laws & Parliament** 
- PRS Legislative Research
- India Code (indiacode.nic.in)

**News Verification**
- Google News RSS (India-focused)
- PIB Fact Check
- The Hindu, Indian Express, NDTV

**Government Schemes**
- data.gov.in
- MyGov India

**State Data**
- Tamil Nadu, Kerala, Karnataka Open Data portals

## 🛡️ Ethics & Safety Policy

This platform is for **civic education**, not political campaigning.

**AI Behavior Rules:**
- ✅ Stay completely neutral and unbiased
- ✅ Never recommend voting choices or support parties
- ✅ Always cite verified sources
- ✅ Use citizen-friendly language
- ✅ Provide factual information only
- ❌ No political persuasion or bias
- ❌ No unverified claims or speculation
- ❌ No personal opinions about leaders/parties

**Every response includes:**
> "This is an AI-generated civic explanation based on public information. Not political advice."

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase CLI
- Google Gemini API key

### Installation

```bash
# Clone and setup
git clone <repository>
cd civic-india
npm install

# Setup Firebase
firebase login
firebase init

# Configure environment
cp .env.example .env
# Edit .env with your Firebase config

# Set Gemini API key
firebase functions:config:set gemini.api_key="your_api_key"

# Deploy
npm run build
firebase deploy
```

### Development

```bash
# Start development server
npm start

# Test functions locally
firebase emulators:start
```

See [SETUP.md](SETUP.md) for detailed instructions.

## 🔧 Tech Stack

**Frontend:**
- React 18 with Hooks
- Responsive CSS with mobile-first design
- Progressive Web App (PWA) ready

**Backend:**
- Firebase Cloud Functions (Node.js 18)
- Google Gemini Pro API for AI responses
- Firestore for caching and analytics

**Data Sources:**
- Web scraping with Cheerio
- RSS feed parsing
- Government API integration

**Hosting:**
- Firebase Hosting (free tier)
- Global CDN distribution
- HTTPS by default

## 📈 Usage Analytics

**Tracked Metrics:**
- Feature usage (Q&A, fact-check, etc.)
- Language preferences
- Query types and patterns
- Response quality feedback

**Privacy:**
- No personal data stored
- Anonymous usage tracking
- GDPR compliant

## 🔒 Security Features

- **API Security:** Rate limiting, CORS protection
- **Data Privacy:** No PII storage, encrypted communications
- **Content Safety:** Bias detection, source verification
- **Access Control:** Firestore security rules

## 🌍 Accessibility

- **WCAG 2.1 AA** compliant
- Screen reader support
- Keyboard navigation
- High contrast mode
- Mobile responsive design

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

### Development Guidelines

1. **Neutrality First:** All features must maintain political neutrality
2. **Source Verification:** Only use approved Indian government sources
3. **Accessibility:** Follow WCAG guidelines
4. **Performance:** Optimize for mobile and slow connections
5. **Security:** Regular security audits and updates

### Code Standards

- ESLint + Prettier for code formatting
- React best practices and hooks
- Comprehensive error handling
- Unit tests for critical functions

## 📊 Performance Metrics

**Target Performance:**
- First Contentful Paint: < 2s
- Largest Contentful Paint: < 3s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 4s

**API Response Times:**
- Simple queries: < 3s
- Complex analysis: < 10s
- Fact-checking: < 15s

## 💰 Cost Estimation

**Firebase (Free Tier):**
- Hosting: Free for small apps
- Functions: 2M invocations/month
- Firestore: 50K reads/writes per day

**Gemini API:**
- Free tier: 60 requests/minute
- Cost: ~$0.001 per 1K characters
- Estimated: $10-50/month for moderate usage

## 🚨 Limitations

- **Data Freshness:** Depends on source update frequency
- **Language Coverage:** Limited to 5 Indian languages
- **API Quotas:** Rate limits may apply during high usage
- **Accuracy:** AI responses require human verification for critical decisions

## 🔄 Roadmap

### Phase 1 (Current)
- ✅ Core features implementation
- ✅ Multi-language support
- ✅ Basic RAG system

### Phase 2 (Next)
- 🔄 Enhanced data sources integration
- 🔄 Improved fact-checking accuracy
- 🔄 User feedback system
- 🔄 Performance optimizations

### Phase 3 (Future)
- 📋 Voice interface support
- 📋 Advanced analytics dashboard
- 📋 API for third-party integration
- 📋 Offline functionality

## 📞 Support

**For Technical Issues:**
- Check [SETUP.md](SETUP.md) for common problems
- Review Firebase Console logs
- Check Gemini API status

**For Content Issues:**
- Report inaccurate information
- Suggest new data sources
- Request feature improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Disclaimer

- This platform provides general civic information only
- Not a substitute for professional legal or political advice
- Information accuracy depends on source data quality
- Users should verify critical information independently
- Not affiliated with any political party or government entity

---

**Built with ❤️ for Indian democracy and civic engagement**

*"An informed citizenry is the only true repository of the public will." - Thomas Jefferson*# netaverse-backend
