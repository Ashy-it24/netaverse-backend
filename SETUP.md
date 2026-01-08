# 🚀 Civic India - Complete Setup Guide

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed: `npm install -g firebase-tools`
- Google Cloud account with billing enabled (for Gemini API)
- Basic knowledge of React and Firebase

## 📋 Step-by-Step Setup

### 1. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase in your project directory
firebase init

# Select these services:
# ✅ Firestore
# ✅ Functions
# ✅ Hosting
```

**During initialization:**
- Choose "Create a new project" or select existing project
- Use default Firestore rules for now
- Choose TypeScript or JavaScript for Functions (we used JavaScript)
- Install dependencies: Yes
- Use default public directory: `build`
- Configure as single-page app: Yes
- Set up automatic builds: No

### 2. Environment Configuration

Create `.env` file in root directory:
```env
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 3. Google Gemini API Setup

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Set the API key in Firebase Functions:

```bash
firebase functions:config:set gemini.api_key="your_gemini_api_key"
```

### 4. Install Dependencies

**Root directory:**
```bash
npm install
```

**Functions directory:**
```bash
cd functions
npm install
cd ..
```

### 5. Firestore Security Rules

Update `firestore.rules`:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for responses (for caching)
    match /responses/{document} {
      allow read, write: if true;
    }
    
    // Allow read/write for factchecks
    match /factchecks/{document} {
      allow read, write: if true;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 6. Update Firebase Configuration

Update `src/App.js` with your Firebase Functions URL:
```javascript
// Replace this line:
const FUNCTIONS_BASE_URL = 'https://your-project-region-your-project-id.cloudfunctions.net';

// With your actual URL (find it after deployment)
const FUNCTIONS_BASE_URL = 'https://us-central1-civic-india-12345.cloudfunctions.net';
```

### 7. Build and Deploy

```bash
# Build the React app
npm run build

# Deploy everything to Firebase
firebase deploy

# Or deploy specific services:
firebase deploy --only functions
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

## 🔧 Configuration Details

### Firebase Functions Configuration

The following Cloud Functions are deployed:

1. **civicQA** - General civic Q&A with RAG
2. **policySummarizer** - Policy document summarization
3. **factCheck** - News and claim verification
4. **grievanceDrafter** - Formal complaint letter generation
5. **representativeInfo** - Find elected representatives
6. **legalExplainer** - Legal information in simple language

### Data Sources Integration

The RAG system fetches data from:

- **PRS Legislative Research** - Bills and policy analysis
- **MyNeta (ADR)** - Candidate and representative information
- **India Code** - Legal acts and sections
- **PIB Fact Check** - Government fact-checking
- **Data.gov.in** - Government schemes and datasets
- **Google News RSS** - Current news (India-focused)

### API Rate Limits & Costs

**Gemini API:**
- Free tier: 60 requests per minute
- Paid tier: Higher limits available
- Cost: ~$0.001 per 1K characters

**Firebase:**
- Hosting: Free for small apps
- Functions: 2M invocations/month free
- Firestore: 50K reads/writes per day free

## 🛠️ Development Workflow

### Local Development

```bash
# Start React development server
npm start

# Start Firebase Functions emulator (optional)
firebase emulators:start --only functions

# Start Firestore emulator (optional)
firebase emulators:start --only firestore
```

### Testing Functions Locally

```bash
# Test a function locally
curl -X POST http://localhost:5001/your-project/us-central1/civicQA \
  -H "Content-Type: application/json" \
  -d '{"question": "Who is the Prime Minister of India?", "language": "english"}'
```

### Monitoring and Logs

```bash
# View function logs
firebase functions:log

# View specific function logs
firebase functions:log --only civicQA
```

## 🔒 Security Best Practices

### 1. API Key Security
- Never commit API keys to version control
- Use Firebase Functions config for sensitive data
- Rotate API keys regularly

### 2. CORS Configuration
- Functions already include CORS headers
- Restrict origins in production if needed

### 3. Rate Limiting
- Implement rate limiting for production
- Monitor API usage and costs

### 4. Data Privacy
- No personal data is stored permanently
- Responses are cached anonymously
- Clear cache periodically

## 📊 Monitoring & Analytics

### Firebase Analytics Setup

Add to `src/index.js`:
```javascript
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(app);
```

### Custom Events Tracking

```javascript
// Track feature usage
import { logEvent } from "firebase/analytics";

logEvent(analytics, 'civic_qa_used', {
  query_type: 'representative',
  language: 'english'
});
```

## 🚨 Troubleshooting

### Common Issues

**1. Functions not deploying:**
```bash
# Check Node.js version
node --version  # Should be 18+

# Clear cache and reinstall
rm -rf node_modules functions/node_modules
npm install
cd functions && npm install
```

**2. CORS errors:**
- Ensure functions include CORS headers
- Check if Firebase project is properly configured

**3. Gemini API errors:**
- Verify API key is set correctly
- Check API quotas and billing

**4. Build failures:**
```bash
# Clear React build cache
rm -rf build
npm run build
```

### Debug Mode

Enable debug logging:
```bash
# For Firebase CLI
export DEBUG=*

# For Functions
firebase functions:config:set debug.enabled=true
```

## 📈 Scaling Considerations

### Performance Optimization

1. **Caching Strategy:**
   - Cache common queries in Firestore
   - Implement client-side caching
   - Use CDN for static assets

2. **Function Optimization:**
   - Minimize cold starts
   - Optimize data fetching
   - Implement request batching

3. **Database Optimization:**
   - Create proper Firestore indexes
   - Implement data pagination
   - Regular cleanup of old data

### Cost Management

1. **Monitor Usage:**
   - Set up billing alerts
   - Track API call patterns
   - Optimize expensive operations

2. **Implement Quotas:**
   - Rate limit per user
   - Cache frequently requested data
   - Optimize prompt lengths

## 🌐 Multi-language Support

The app supports:
- English
- Hindi
- Tamil
- Malayalam
- Telugu

To add more languages:
1. Update language options in React components
2. Test Gemini API responses in new languages
3. Update prompt templates if needed

## 📱 Mobile Optimization

The app is responsive and works on:
- Desktop browsers
- Mobile browsers
- Progressive Web App (PWA) ready

To enable PWA:
1. Add service worker
2. Create manifest.json
3. Add offline functionality

## 🔄 Updates and Maintenance

### Regular Tasks

1. **Weekly:**
   - Monitor API usage and costs
   - Check error logs
   - Update cached data

2. **Monthly:**
   - Review and update data sources
   - Security audit
   - Performance optimization

3. **Quarterly:**
   - Update dependencies
   - Review and improve prompts
   - User feedback integration

### Version Control

```bash
# Tag releases
git tag -a v1.0.0 -m "Initial release"
git push origin v1.0.0

# Deploy specific version
firebase deploy --message "Version 1.0.0 deployment"
```

## 📞 Support

For issues and questions:
1. Check Firebase Console logs
2. Review Gemini API documentation
3. Check GitHub issues (if open source)
4. Contact development team

---

**Remember:** This is a civic education platform, not a political campaigning tool. Always maintain neutrality and cite verified sources.