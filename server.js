require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.5-flash';

const MASTER_PROMPT =
  'You are Synapse.ai, a research and innovation copilot for student ' +
  'engineering projects. Given a raw project idea, respond with ONLY a single ' +
  'valid JSON object — no markdown fences, no commentary, no text outside the ' +
  'JSON — matching exactly this schema:\n\n' +
  '{\n' +
  '  "idea_summary": "one sentence restating the idea clearly",\n' +
  '  "problem_framing": { "core_problem": "string", "target_users": "string", "why_it_matters": "string" },\n' +
  '  "deep_search_insights": [ { "angle": "string", "insight": "string, 2-3 sentences" } ],\n' +
  '  "recommended_tech_stack": { "frontend": "string", "backend_or_api": "string", "data_storage": "string", "justification": "string" },\n' +
  '  "related_work": [ { "name": "string", "relevance": "string, 1 sentence" } ],\n' +
  '  "action_roadmap": [ { "step_number": 1, "title": "string", "description": "string" } ],\n' +
  '  "real_time_considerations": "string, 2-3 sentences on current trends or recent developments relevant to this idea"\n' +
  '}\n\n' +
  'deep_search_insights must contain exactly 3 items, each a different angle ' +
  '(e.g. existing approaches, technical challenges, social/market context). ' +
  'related_work must contain exactly 3 items. action_roadmap must contain ' +
  'exactly 5 steps, in order. Never omit a key — if uncertain, make a ' +
  'reasonable, clearly-labeled assumption inside the relevant string field ' +
  'rather than leaving it blank. Here is the idea: ';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

async function callGemini(ideaText) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: MASTER_PROMPT + ideaText }] }],
        }),
      }
    );

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errorBody}`);
    }

    const data = await res.json();
    const raw = data.candidates[0].content.parts[0].text;
    const cleaned = raw.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  } finally {
    clearTimeout(timeout);
  }
}

app.post('/api/generate', async (req, res) => {
  if (!GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Server misconfiguration: GEMINI_API_KEY is not set.' });
  }

  const ideaText = typeof req.body?.idea === 'string' ? req.body.idea.trim() : '';

  if (!ideaText || ideaText.length < 8) {
    return res.status(400).json({ error: 'Idea must be at least 8 characters.' });
  }

  try {
    const plan = await callGemini(ideaText);
    res.json(plan);
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(502).json({ error: 'Failed to generate plan.' });
  }
});

app.listen(PORT, () => {
  console.log(`Synapse.ai server running at http://localhost:${PORT}`);
});
