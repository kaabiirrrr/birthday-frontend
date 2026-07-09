// ── Birthday Visit & Response Tracker ─────────────────────────────────────────

const DEFAULT_BACKEND_URL = 'https://birthday-backend-1ftg.onrender.com';

// Detect local vs production
const isLocal = (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.protocol === 'file:'
);
const backendUrl = localStorage.getItem('birthday_api_url') ||
  (isLocal ? 'http://localhost:3000' : DEFAULT_BACKEND_URL);

// Get or generate a persistent sessionId for this browser session
let sessionId = sessionStorage.getItem('birthday_session_id');
if (!sessionId) {
  sessionId = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  sessionStorage.setItem('birthday_session_id', sessionId);
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function _post(payload) {
  fetch(`${backendUrl}/api/response`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(r => r.json())
    .then(d => console.log('✅ Tracker:', d))
    .catch(e => console.warn('⚠️ Tracker offline:', e));
}

// Track a page visit (and optionally a Yes/No answer from question.html)
function trackVisit(pageName, answer, answerRaw) {
  const payload = { sessionId, pageName };
  if (answer) payload.answer = answer;
  if (answerRaw) payload.answerRaw = answerRaw;
  _post(payload);
}

// Save opinion text + best-friend answer from index.html
function sendOpinionAndFriend(opinion, isBestFriend) {
  _post({
    sessionId,
    opinion,
    isBestFriend,
    pageName: 'login_questions'
  });
}
