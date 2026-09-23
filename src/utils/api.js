const BASE_URL = 'https://forum-api.dicoding.dev/v1';

function putAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

function getAccessToken() {
  return localStorage.getItem('accessToken');
}

function removeAccessToken() {
  localStorage.removeItem('accessToken');
}

async function fetchWithAuth(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });
}

async function unwrap(response) {
  const json = await response.json();
  const { status, message } = json;

  if (status !== 'success') {
    throw new Error(message);
  }

  return json.data;
}

async function register({ name, email, password }) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });

  const { user } = await unwrap(response);
  return user;
}

async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const { token } = await unwrap(response);
  return token;
}

async function getOwnProfile() {
  const response = await fetchWithAuth(`${BASE_URL}/users/me`);
  const { user } = await unwrap(response);
  return user;
}

async function getAllUsers() {
  const response = await fetch(`${BASE_URL}/users`);
  const { users } = await unwrap(response);
  return users;
}

async function getAllThreads() {
  const response = await fetch(`${BASE_URL}/threads`);
  const { threads } = await unwrap(response);
  return threads;
}

async function getThreadDetail(threadId) {
  const response = await fetch(`${BASE_URL}/threads/${threadId}`);
  const { detailThread } = await unwrap(response);
  return detailThread;
}

async function createThread({ title, body, category }) {
  const response = await fetchWithAuth(`${BASE_URL}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body, category }),
  });

  const { thread } = await unwrap(response);
  return thread;
}

async function createComment({ threadId, content }) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/comments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });

  const { comment } = await unwrap(response);
  return comment;
}

async function upVoteThread(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/up-vote`, {
    method: 'POST',
  });
  return unwrap(response);
}

async function downVoteThread(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/down-vote`, {
    method: 'POST',
  });
  return unwrap(response);
}

async function neutralVoteThread(threadId) {
  const response = await fetchWithAuth(`${BASE_URL}/threads/${threadId}/neutral-vote`, {
    method: 'POST',
  });
  return unwrap(response);
}

async function upVoteComment({ threadId, commentId }) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/up-vote`,
    { method: 'POST' },
  );
  return unwrap(response);
}

async function downVoteComment({ threadId, commentId }) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/down-vote`,
    { method: 'POST' },
  );
  return unwrap(response);
}

async function neutralVoteComment({ threadId, commentId }) {
  const response = await fetchWithAuth(
    `${BASE_URL}/threads/${threadId}/comments/${commentId}/neutral-vote`,
    { method: 'POST' },
  );
  return unwrap(response);
}

async function getLeaderboards() {
  const response = await fetch(`${BASE_URL}/leaderboards`);
  const { leaderboards } = await unwrap(response);
  return leaderboards;
}

const api = {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  register,
  login,
  getOwnProfile,
  getAllUsers,
  getAllThreads,
  getThreadDetail,
  createThread,
  createComment,
  upVoteThread,
  downVoteThread,
  neutralVoteThread,
  upVoteComment,
  downVoteComment,
  neutralVoteComment,
  getLeaderboards,
};

export default api;
