import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('civic');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  // Backend URL - update this after deployment
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

  const handleSubmit = async (endpoint, data) => {
    setLoading(true);
    setResponse('');
    
    try {
      const res = await fetch(`${BACKEND_URL}/${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const result = await res.json();
      setResponse(result);
    } catch (error) {
      console.error('Request failed:', error);
      setResponse({ 
        error: 'Failed to get response. Please check your connection and try again.' 
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🇮🇳 Civic India</h1>
        <p>Your neutral civic information assistant</p>
        <div className="header-disclaimer">
          For civic education, not political campaigning
        </div>
      </header>

      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'civic' ? 'active' : ''}`}
          onClick={() => setActiveTab('civic')}
        >
          Civic Q&A
        </button>
        <button 
          className={`nav-btn ${activeTab === 'factcheck' ? 'active' : ''}`}
          onClick={() => setActiveTab('factcheck')}
        >
          Fact Check
        </button>
        <button 
          className={`nav-btn ${activeTab === 'grievance' ? 'active' : ''}`}
          onClick={() => setActiveTab('grievance')}
        >
          Draft Grievance
        </button>
      </nav>

      <main className="app-main">
        {activeTab === 'civic' && <CivicAI onSubmit={handleSubmit} />}
        {activeTab === 'factcheck' && <FactCheck onSubmit={handleSubmit} />}
        {activeTab === 'grievance' && <GrievanceDraft onSubmit={handleSubmit} />}

        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}
        
        {response && !loading && (
          <div className="response">
            <h3>Response:</h3>
            <div className="response-content">
              {response.response || response.result || response.letter || response.error}
            </div>
            
            {response.intent && (
              <div className="response-metadata">
                <strong>Intent:</strong> {response.intent}
              </div>
            )}
            
            {response.sources && response.sources.length > 0 && (
              <div className="response-metadata">
                <strong>Sources:</strong> {response.sources.join(', ')}
              </div>
            )}
            
            {response.urls && response.urls.length > 0 && (
              <div className="response-metadata">
                <strong>References:</strong>
                {response.urls.map((url, index) => (
                  <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                    {url}
                  </a>
                ))}
              </div>
            )}
            
            {response.disclaimer && (
              <div className="disclaimer">{response.disclaimer}</div>
            )}
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Built with ❤️ for Indian democracy and civic engagement</p>
        <p>"An informed citizenry is the only true repository of the public will."</p>
      </footer>
    </div>
  );
}

// Civic Q&A Component
function CivicAI({ onSubmit }) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('english');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit('civicAI', { query, language });
  };

  return (
    <div className="feature-section">
      <h2>Ask about Indian Laws & Representatives</h2>
      <p>Get neutral, factual information about civic matters</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Question:</label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Examples:
• Who is my MLA in Mumbai South?
• What is the Right to Information Act?
• How do I contact my MP?
• What are the voting procedures?
• Explain the Goods and Services Tax"
            required
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>Response Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="tamil">Tamil (தமிழ்)</option>
            <option value="malayalam">Malayalam (മലയാളം)</option>
            <option value="telugu">Telugu (తెలుగు)</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Ask Question</button>
      </form>
    </div>
  );
}

// Fact Check Component
function FactCheck({ onSubmit }) {
  const [claim, setClaim] = useState('');
  const [language, setLanguage] = useState('english');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!claim.trim()) return;
    onSubmit('factCheck', { claim, language });
  };

  return (
    <div className="feature-section">
      <h2>Verify Political Claims & News</h2>
      <p>Check facts using official government sources</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Claim to Verify:</label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            placeholder="Examples:
• Government announced new farmer scheme worth ₹10,000 crore
• Election results were manipulated in XYZ constituency
• New law requires Aadhaar for voting
• PM announced free laptops for all students
• Petrol prices increased by ₹5 per liter"
            required
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>Response Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="tamil">Tamil (தமிழ்)</option>
            <option value="malayalam">Malayalam (മലയാളം)</option>
            <option value="telugu">Telugu (తెలుగు)</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Verify Claim</button>
      </form>
    </div>
  );
}

// Grievance Draft Component
function GrievanceDraft({ onSubmit }) {
  const [issue, setIssue] = useState('');
  const [department, setDepartment] = useState('');
  const [language, setLanguage] = useState('english');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue.trim() || !department.trim()) return;
    onSubmit('grievanceDraft', { issue, department, language });
  };

  return (
    <div className="feature-section">
      <h2>Draft Formal Grievance Letter</h2>
      <p>Generate professional complaint letters to government departments</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Describe Your Issue:</label>
          <textarea
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Examples:
• Road repair needed on Main Street, potholes causing accidents
• Water supply problem in my area for past 2 weeks
• Garbage collection not happening regularly in our locality
• Street lights not working, causing safety concerns
• Drainage system blocked, causing waterlogging during rains"
            required
            rows={5}
          />
        </div>
        
        <div className="form-group">
          <label>Target Department:</label>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            placeholder="e.g., Municipal Corporation, PWD, Water Board, Electricity Board"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Letter Language:</label>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="tamil">Tamil (தமிழ்)</option>
            <option value="malayalam">Malayalam (മലയാളം)</option>
            <option value="telugu">Telugu (తెలుగు)</option>
          </select>
        </div>
        
        <button type="submit" className="submit-btn">Draft Letter</button>
      </form>
    </div>
  );
}

export default App;