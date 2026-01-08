# Civic India Backend - Technical Documentation

## 🏗️ Architecture Overview

```
React Frontend → Firebase Cloud Functions → Gemini AI
                      ↓
                 RAG Data Fetcher → Indian Govt Sources
                      ↓
                 Firestore Database (Caching & Analytics)
```

## 🔧 Backend Components

### 1. Cloud Functions (`functions/index.js`)
**Main API endpoints:**
- `civicQA` - General civic questions with RAG
- `policySummarizer` - Policy document analysis
- `factCheck` - News verification using PIB sources
- `grievanceDrafter` - Formal complaint letter generation
- `representativeFinder` - MLA/MP lookup
- `schemeInfo` - Government scheme information
- `healthCheck` - System status monitoring
- `analytics` - Usage statistics
- `clearCache` - Cache management

### 2. RAG System (`functions/ragFetcher.js`)
**Data Sources Integration:**
- PRS Legislative Research - Bills and policy analysis
- MyNeta (ADR) - Politician profiles and backgrounds
- India Code - Legal acts and amendments
- PIB Fact Check - Official government fact-checking
- Data.gov.in - Government schemes and statistics
- Election Commission - Electoral data
- State Portals - Regional information

**Features:**
- Intelligent caching (30-minute timeout)
- Query type detection
- State extraction from queries
- Source reliability scoring
- Fallback handling for unavailable data

### 3. Prompt Engineering (`functions/promptTemplates.js`)
**Structured Prompts:**
- Neutrality enforcement rules
- Language-specific instructions
- Context-aware formatting
- Bias detection and prevention
- Source citation requirements

## 🛡️ Security & Safety

### Rate Limiting
- 10 requests per minute per IP
- Automatic blocking for excessive usage
- Graceful error handling

### Data Privacy
- No personal information stored
- Anonymous usage analytics only
- GDPR-compliant logging
- Secure API key management

### Content Safety
- Strict neutrality enforcement
- Political bias prevention
- Source verification requirements
- Disclaimer on all responses

## 📊 API Endpoints

### POST /civicQA
**Purpose:** Answer general civic questions
**Request:**
```json
{
  "question": "Who is my MLA?",
  "language": "english"
}
```
**Response:**
```json
{
  "response": "AI-generated answer",
  "sources": ["MyNeta", "ECI"],
  "urls": ["https://myneta.info"],
  "hasVerifiedData": true,
  "reliability": "high",
  "disclaimer": "..."
}
```

### POST /factCheck
**Purpose:** Verify news claims and statements
**Request:**
```json
{
  "claim": "Government announced new scheme",
  "language": "hindi"
}
```
**Response:**
```json
{
  "result": "VERIFICATION: TRUE/FALSE/PARTIALLY TRUE",
  "sources": ["PIB Fact Check"],
  "hasVerifiedData": true,
  "disclaimer": "..."
}
```

### POST /policySummarizer
**Purpose:** Summarize policy documents
**Request:**
```json
{
  "text": "Long policy document text...",
  "language": "tamil"
}
```
**Response:**
```json
{
  "summary": "• Key Point 1\n• Key Point 2",
  "disclaimer": "..."
}
```

### POST /grievanceDrafter
**Purpose:** Generate formal complaint letters
**Request:**
```json
{
  "issue": "Road repair needed",
  "department": "Municipal Corporation",
  "language": "english"
}
```
**Response:**
```json
{
  "letter": "Formal letter content",
  "disclaimer": "..."
}
```

### POST /representativeFinder
**Purpose:** Find political representatives
**Request:**
```json
{
  "location": "Mumbai South",
  "language": "marathi"
}
```
**Response:**
```json
{
  "response": "Representative information",
  "sources": ["MyNeta", "ECI"],
  "hasVerifiedData": true,
  "disclaimer": "..."
}
```

### POST /schemeInfo
**Purpose:** Government scheme information
**Request:**
```json
{
  "query": "PM Kisan Yojana",
  "state": "tamil nadu",
  "language": "tamil"
}
```
**Response:**
```json
{
  "response": "Scheme details and application process",
  "sources": ["Data.gov.in"],
  "hasVerifiedData": true,
  "disclaimer": "..."
}
```

### GET /healthCheck
**Purpose:** System status monitoring
**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "version": "1.0.0",
  "cache": {
    "size": 150,
    "timeout": 1800000
  },
  "endpoints": ["civicQA", "factCheck", ...]
}
```

### GET /analytics
**Purpose:** Usage statistics (anonymous)
**Response:**
```json
{
  "totalInteractions": 1500,
  "byType": {
    "qa": 600,
    "factcheck": 400,
    "policy": 300
  },
  "byLanguage": {
    "english": 800,
    "hindi": 400,
    "tamil": 300
  }
}
```

## 🚀 Deployment

### Prerequisites
1. Firebase CLI installed
2. Google Gemini API key
3. Firebase project created

### Setup Commands
```bash
# Install dependencies
npm install
cd functions && npm install && cd ..

# Configure Gemini API
firebase functions:config:set gemini.api_key="your_key"

# Deploy
./deploy.sh
```

### Environment Variables
```bash
# Required in .env
GEMINI_API_KEY=your_gemini_api_key
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_API_KEY=your_api_key
```

## 📈 Performance Optimization

### Caching Strategy
- RAG data cached for 30 minutes
- Firestore query optimization
- Response compression
- CDN distribution via Firebase Hosting

### Cost Management
- Firebase free tier optimization
- Gemini API usage monitoring
- Efficient prompt design
- Request batching where possible

### Monitoring
- Cloud Functions logs
- Error tracking
- Performance metrics
- Usage analytics

## 🔍 Data Sources Implementation

### Current Status
- **Mock Implementation:** All data sources currently return mock data
- **Production Ready:** Infrastructure and caching systems
- **Integration Points:** Clearly defined for each source

### Next Steps for Production
1. **PRS Integration:** Implement actual API calls to PRS Legislative Research
2. **MyNeta Scraping:** Build web scraping for representative data
3. **PIB Integration:** Connect to PIB fact-check feeds
4. **India Code API:** Integrate with legal database
5. **Data.gov.in:** Connect to government data portal

### Sample Integration (PRS)
```javascript
async fetchPRSData(query) {
  try {
    const response = await axios.get(`https://prsindia.org/api/search`, {
      params: { q: query, format: 'json' }
    });
    
    return {
      source: 'PRS Legislative Research',
      data: response.data.results,
      url: response.data.url,
      reliability: 'high'
    };
  } catch (error) {
    console.error('PRS API error:', error);
    return null;
  }
}
```

## 🛠️ Development Guidelines

### Code Standards
- ESLint configuration for consistency
- Error handling for all API calls
- Comprehensive logging
- Input validation and sanitization

### Testing Strategy
- Unit tests for core functions
- Integration tests for API endpoints
- Load testing for performance
- Security testing for vulnerabilities

### Maintenance
- Regular dependency updates
- Security patch management
- Performance monitoring
- Cache optimization

## 🚨 Error Handling

### Common Errors
- **Rate Limit Exceeded (429):** Client making too many requests
- **Invalid Input (400):** Missing or malformed request data
- **Service Unavailable (500):** Gemini API or data source issues
- **No Data Available:** When verified sources don't have information

### Error Response Format
```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 📋 Compliance & Ethics

### Political Neutrality
- No endorsements or recommendations
- Balanced information presentation
- Source transparency
- Bias detection mechanisms

### Data Handling
- No personal data collection
- Anonymous analytics only
- Secure API communications
- Regular security audits

### Legal Compliance
- Indian IT Act compliance
- Data protection regulations
- Government API usage terms
- Intellectual property respect

---

**Built for Indian democracy and civic engagement** 🇮🇳