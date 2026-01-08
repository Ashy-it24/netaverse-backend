const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors')({ origin: true });
const IndianCivicRAG = require('./ragFetcher');

admin.initializeApp();
const db = admin.firestore();
const genAI = new GoogleGenerativeAI(functions.config().gemini?.api_key || process.env.GEMINI_API_KEY);
const rag = new IndianCivicRAG();

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

// RAG Pipeline Integration
async function runRAGPipeline(query, intent) {
  // Step 3: Run RAG Pipeline
  const rawData = await rag.fetchRelevantData(query, intent);
  
  // Normalize and build context
  const normalizedData = rawData.data.replace(/\s+/g, ' ').trim();
  const context = `INTENT: ${intent}\nSOURCE: ${rawData.source}\nDATA: ${normalizedData}`;
  
  return { context, source: rawData.source, urls: rawData.urls };
}

// 1. /civicAI - Handles Q&A, Law, Representative
exports.civicAI = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { query, language } = req.body;
      if (!query) return res.status(400).json({ error: 'Query required' });

      // Step 2: Detect Intent & Language
      const intent = detectIntent(query);
      const detectedLang = language || detectLanguage(query);

      // Step 3: RAG Pipeline
      const ragResult = await runRAGPipeline(query, intent);

      // Step 4: Send to Gemini
      const prompt = `You are a neutral civic assistant for Indian citizens.

${ragResult.context}
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
      
      // Step 7: Store in Firestore
      await db.collection('queries').add({
        query,
        intent,
        language: detectedLang,
        response,
        source: ragResult.source,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Step 8: Return response
      res.json({
        response,
        intent,
        source: ragResult.source,
        urls: ragResult.urls,
        disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
      });

    } catch (error) {
      console.error('CivicAI error:', error);
      res.status(500).json({ error: 'Service unavailable' });
    }
  });
});

// 2. /factCheck - Political claim verification
exports.factCheck = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { claim, language } = req.body;
      if (!claim) return res.status(400).json({ error: 'Claim required' });

      // Step 2: Detect Language
      const detectedLang = language || detectLanguage(claim);

      // Step 3: RAG Pipeline - Fetch PIB + News data
      const ragResult = await runRAGPipeline(claim, 'fact-check');

      // Step 4: Send to Gemini
      const prompt = `You are fact-checking a claim using verified Indian sources.

${ragResult.context}
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
      
      // Step 7: Store
      await db.collection('factchecks').add({
        claim,
        language: detectedLang,
        response,
        source: ragResult.source,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Step 8: Return
      res.json({
        result: response,
        source: ragResult.source,
        urls: ragResult.urls,
        disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
      });

    } catch (error) {
      console.error('FactCheck error:', error);
      res.status(500).json({ error: 'Service unavailable' });
    }
  });
});

// 3. /grievanceDraft - Formal complaint generation
exports.grievanceDraft = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

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
      
      // Step 7: Store
      await db.collection('grievances').add({
        issue,
        department,
        language: detectedLang,
        letter,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });

      // Step 8: Return
      res.json({
        letter,
        disclaimer: "This is an AI-generated civic explanation based on public information. Not political advice."
      });

    } catch (error) {
      console.error('GrievanceDraft error:', error);
      res.status(500).json({ error: 'Service unavailable' });
    }
  });
});

// Health check
exports.healthCheck = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    res.json({
      status: 'healthy',
      endpoints: ['civicAI', 'factCheck', 'grievanceDraft'],
      timestamp: new Date().toISOString()
    });
  });
});