const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use(limiter);

// Import RAG system
const RAGSystem = require('./ragSystem');
const rag = new RAGSystem();

// Intent Detection
function detectIntent(query) {
  const lower = query.toLowerCase();
  
  if (lower.match(/\b(law|act|bill|section|legal|court)\b/)) return 'law';
  if (lower.match(/\b(mla|mp|representative|minister|politician)\b/)) return 'representative';
  if (lower.match(/\b(fact|true|false|verify|check|claim|fake)\b/)) return 'fact-check';
  if (lower.match(/\b(complaint|grievance|problem|issue)\b/)) return 'grievance';
  
  return 'general';
}

// Language Detection
function detectLanguage(text) {
  const patterns = {
    hindi: /[\u0900-\u097F]/,
    tamil: /[\u0B80-\u0BFF]/,
    malayalam: /[\u0D00-\u0D7F]/,
    telugu: /[\u0C00-\u0C7F]/
  };
  
  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }
  
  return 'english';
}

// 1. POST /civicAI - Civic Q&A, Law, Representative
app.post('/civicAI', async (req, res) => {
  try {
    const { query, language } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required' });

    // Step 2: Detect Intent & Language
    const intent = detectIntent(query);
    const detectedLang = language || detectLanguage(query);

    // Step 3: RAG Pipeline
    const ragData = await rag.fetchRelevantData(query, intent);
    
    // Step 4: Send to Gemini
    const prompt = `You are a neutral civic assistant for Indian citizens.

CONTEXT: ${ragData.data}
QUERY: ${query}
LANGUAGE: ${detectedLang}

RULES:
- Stay completely neutral
- Never recommend who to vote for
- Use simple language
- Cite sources
- Respond in ${detectedLang}

Response:`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Step 6: Post-process
    response = response.replace(/\n+/g, '\n').trim();

    // Step 7: Return response
    res.json({
      response,
      intent,
      sources: ragData.sources,
      urls: ragData.urls,
      disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
    });

  } catch (error) {
    console.error('CivicAI error:', error);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

// 2. POST /factCheck - Political claim verification
app.post('/factCheck', async (req, res) => {
  try {
    const { claim, language } = req.body;
    if (!claim) return res.status(400).json({ error: 'Claim required' });

    // Step 2: Detect Language
    const detectedLang = language || detectLanguage(claim);

    // Step 3: RAG Pipeline - Fetch PIB + News data
    const ragData = await rag.fetchRelevantData(claim, 'fact-check');

    // Step 4: Send to Gemini
    const prompt = `You are fact-checking a claim using verified Indian sources.

CONTEXT: ${ragData.data}
CLAIM: ${claim}
LANGUAGE: ${detectedLang}

RULES:
- Only use verified sources
- Be neutral and factual
- Status: TRUE/FALSE/PARTIALLY TRUE/UNVERIFIABLE
- Explain reasoning
- Respond in ${detectedLang}

Fact-check:`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    let response = result.response.text();

    // Step 6: Post-process
    response = response.replace(/\n+/g, '\n').trim();

    // Step 7: Return
    res.json({
      result: response,
      sources: ragData.sources,
      urls: ragData.urls,
      disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
    });

  } catch (error) {
    console.error('FactCheck error:', error);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

// 3. POST /grievanceDraft - Formal complaint generation
app.post('/grievanceDraft', async (req, res) => {
  try {
    const { issue, department, language } = req.body;
    if (!issue || !department) {
      return res.status(400).json({ error: 'Issue and department required' });
    }

    // Step 2: Detect Language
    const detectedLang = language || detectLanguage(issue);

    // Step 4: Send to Gemini (no RAG needed for grievance drafting)
    const prompt = `Draft a formal grievance letter for an Indian citizen.

ISSUE: ${issue}
DEPARTMENT: ${department}
LANGUAGE: ${detectedLang}

RULES:
- Use proper Indian government letter format
- Be respectful and professional
- Include proper addressing
- Write in ${detectedLang}

Letter:`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    let letter = result.response.text();

    // Step 6: Post-process
    letter = letter.replace(/\n+/g, '\n').trim();

    // Step 7: Return
    res.json({
      letter,
      disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
    });

  } catch (error) {
    console.error('GrievanceDraft error:', error);
    res.status(500).json({ error: 'Service unavailable' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    endpoints: ['civicAI', 'factCheck', 'grievanceDraft'],
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🇮🇳 Civic India Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});