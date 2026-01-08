# Civic India Backend - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: Render (Recommended)
1. Push code to GitHub
2. Connect to [Render.com](https://render.com)
3. Create new Web Service
4. Set environment variables:
   - `GEMINI_API_KEY=your_key`
   - `CORS_ORIGIN=https://your-frontend-domain.com`
5. Deploy automatically

### Option 2: Railway
1. Push code to GitHub  
2. Connect to [Railway.app](https://railway.app)
3. Deploy from GitHub repo
4. Set environment variables in dashboard
5. Get deployment URL

### Option 3: Replit
1. Import GitHub repo to [Replit.com](https://replit.com)
2. Set secrets in environment
3. Run with `npm start`
4. Get public URL

## 🔧 Local Development

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your Gemini API key
# GEMINI_API_KEY=your_actual_key

# Start development server
npm run dev

# Test endpoints
curl http://localhost:3001/health
```

## 📊 API Endpoints

### POST /civicAI
**Purpose:** Civic Q&A, law explanation, representative info
**Body:**
```json
{
  "query": "Who is my MLA?",
  "language": "english"
}
```

### POST /factCheck  
**Purpose:** Verify political claims
**Body:**
```json
{
  "claim": "Government announced new scheme",
  "language": "hindi"
}
```

### POST /grievanceDraft
**Purpose:** Generate complaint letters
**Body:**
```json
{
  "issue": "Road repair needed",
  "department": "Municipal Corporation", 
  "language": "tamil"
}
```

### GET /health
**Purpose:** Health check
**Response:**
```json
{
  "status": "healthy",
  "endpoints": ["civicAI", "factCheck", "grievanceDraft"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🔒 Environment Variables

**Required:**
- `GEMINI_API_KEY` - Google Gemini API key
- `CORS_ORIGIN` - Frontend domain(s)

**Optional:**
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (production/development)
- `NEWS_API_KEY` - For enhanced fact-checking
- `GOOGLE_SEARCH_API_KEY` - For enhanced data fetching

## 🛡️ Security Features

- **Rate Limiting:** 100 requests per 15 minutes per IP
- **CORS Protection:** Only allowed origins can access
- **Helmet.js:** Security headers
- **Input Validation:** Required fields checked
- **Error Handling:** No sensitive data exposed

## 📈 Monitoring

- Health check endpoint: `/health`
- Console logging for errors
- Request/response tracking
- Cache performance metrics

## 🔄 Frontend Integration

Update your React app's backend URL:

```javascript
// In your React app
const BACKEND_URL = 'https://your-backend-url.onrender.com';
```

Or set environment variable:
```bash
REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
```

## 🇮🇳 Data Sources Integration

Current status: **Mock implementations**

To integrate real data sources:

1. **PRS Legislative Research**
   - Replace mock in `ragSystem.js`
   - Add actual API calls

2. **MyNeta (ADR)**
   - Implement web scraping
   - Parse representative data

3. **PIB Fact Check**
   - Scrape fact-check pages
   - Parse verification status

4. **India Code**
   - Connect to legal database API
   - Parse legal documents

5. **Data.gov.in**
   - Use government data APIs
   - Parse scheme information

## 🚨 Important Notes

- **Free Tier Limits:** Monitor usage on hosting platforms
- **API Quotas:** Watch Gemini API usage
- **Caching:** 30-minute cache reduces API calls
- **Neutrality:** All responses include mandatory disclaimer
- **Ethics:** No political recommendations or bias

---

**Ready to deploy!** 🚀

Choose your hosting platform and follow the deployment steps above.