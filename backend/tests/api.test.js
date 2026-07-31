import test from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

process.env.NODE_ENV = 'test';

const { default: app } = await import('../src/server.js');

let server;
const PORT = 5099;
const BASE_URL = `http://localhost:${PORT}`;
const AUTH_HEADER = {
  'Authorization': 'Bearer mock_clerk_jwt_token_sample',
  'Content-Type': 'application/json'
};

const makeRequest = (path, method = 'GET', body = null, headers = AUTH_HEADER) => {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + path);
    const isUrlEncoded = headers['Content-Type'] === 'application/x-www-form-urlencoded';
    
    let payload = '';
    if (body) {
      payload = isUrlEncoded ? new URLSearchParams(body).toString() : JSON.stringify(body);
    }

    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        ...headers,
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed, raw: data });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

test.before(() => {
  return new Promise((resolve) => {
    server = app.listen(PORT, resolve);
  });
});

test.after(() => {
  return new Promise((resolve) => {
    server.close(resolve);
  });
});

test('0. GET /health should return status: healthy', async () => {
  const res = await makeRequest('/health', 'GET', null, {});
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'healthy');
});

test('1. GET /api/v1/user/profile should return 200 with user profile structure', async () => {
  const res = await makeRequest('/api/v1/user/profile');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.data);
  assert.ok(res.body.data.uid);
  assert.ok(res.body.data.academic);
  assert.ok(res.body.data.geminiAiPreferences);
});

test('2. PUT /api/v1/user/profile/ai-preferences should update preferences', async () => {
  const payload = {
    aboutUser: "I am a 3rd-year CS student. I prefer Python FastAPI backends and React frontends.",
    personaMode: "HACKATHON_SPRINT",
    preferredLanguages: ["Python", "TypeScript"],
    preferredFrontend: "React",
    preferredBackend: "Express",
    preferredDatabase: "Firebase"
  };

  const res = await makeRequest('/api/v1/user/profile/ai-preferences', 'PUT', payload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, 'Gemini AI preferences saved successfully');
});

test('2b. PUT /api/v1/user/profile/academic should update academic profile', async () => {
  const payload = {
    college: "JSPM's RSCOE",
    major: "Computer Engineering",
    yearOfStudy: "3rd Year",
    developerRole: "Full-Stack Lead",
    githubUrl: "https://github.com/alexchen",
    linkedinUrl: "https://linkedin.com/in/alexchen"
  };

  const res = await makeRequest('/api/v1/user/profile/academic', 'PUT', payload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.message, 'Academic profile saved successfully');
});

test('3. POST /api/v1/workspaces should create a workspace and return 202 Accepted', async () => {
  const payload = {
    title: "AI Food Waste Reduction in Hostels",
    rawIdea: "Build an AI solution to reduce food waste in college hostels"
  };

  const res = await makeRequest('/api/v1/workspaces', 'POST', payload);
  assert.strictEqual(res.status, 202);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.workspaceId);
  assert.strictEqual(res.body.status, 'RESEARCHING');
});

test('4. GET /api/v1/workspaces should list workspaces', async () => {
  const res = await makeRequest('/api/v1/workspaces');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(Array.isArray(res.body.data));
  assert.ok(res.body.data.length > 0);
});

test('5. GET /api/v1/workspaces/:workspaceId should return detailed workspace info', async () => {
  const res = await makeRequest('/api/v1/workspaces/ws_8f92a10b');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.data.workspaceId, 'ws_8f92a10b');
  assert.ok(res.body.data.deepsearch);
  assert.ok(res.body.data.clustering);
  assert.ok(res.body.data.projectHub);
});

test('6. PATCH /api/v1/workspaces/:workspaceId/milestones/:milestoneId should update status', async () => {
  const payload = { status: 'COMPLETED' };
  const res = await makeRequest('/api/v1/workspaces/ws_8f92a10b/milestones/m_2', 'PATCH', payload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.workspaceId, 'ws_8f92a10b');
  assert.strictEqual(res.body.milestoneId, 'm_2');
  assert.strictEqual(res.body.updatedStatus, 'COMPLETED');
});

test('7. POST /api/v1/bot/generate-pairing-code should return code and deep link', async () => {
  const res = await makeRequest('/api/v1/bot/generate-pairing-code', 'POST', {});
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.ok(res.body.pairingCode);
  assert.ok(res.body.telegramDeepLink);
});

test('8. POST /api/v1/bot/send-nudge should send nudge message', async () => {
  const payload = {
    workspaceId: "ws_8f92a10b",
    message: "🚀 Reminder: Milestone 'Phase 2: Demand Prediction Engine' is due today!"
  };

  const res = await makeRequest('/api/v1/bot/send-nudge', 'POST', payload);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.success, true);
  assert.strictEqual(res.body.delivered, true);
});

test('Error Envelope Test: Request without Authorization header should return 401 error envelope', async () => {
  const res = await makeRequest('/api/v1/user/profile', 'GET', null, { 'Content-Type': 'application/json' });
  assert.strictEqual(res.status, 401);
  assert.strictEqual(res.body.success, false);
  assert.strictEqual(res.body.error.code, 'UNAUTHORIZED');
  assert.ok(res.body.error.message);
});
