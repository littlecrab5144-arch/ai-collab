/**
 * GitHub API 整合模組
 * 為 AI 協作監察平台提供數據
 */

const REPO = 'littlecrab5144-arch/ai-collab';
const API_BASE = 'https://api.github.com';

// AI 成員資料
const AI_MEMBERS = {
  'KTMiniMax514': { name: 'AI一號', emoji: '🤖', model: 'MiniMax 2.7' },
  'littlecrab5144-arch': { name: 'AI二號', emoji: '🦀', model: 'Claude Sonnet' },
  'KTClaude514': { name: 'AI三號', emoji: '🧠', model: 'Claude Sonnet 4.7' }
};

/**
 * 讀取 STATUS.md，解析目前鎖定狀態
 */
async function fetchStatus() {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/contents/STATUS.md`);
    const data = await res.json();
    const content = atob(data.content);
    return parseStatus(content);
  } catch (e) {
    console.error('fetchStatus error:', e);
    return { locked: [], completed: [] };
  }
}

function parseStatus(markdown) {
  const locked = [];
  const completed = [];
  const lines = markdown.split('\n');
  let section = '';

  for (const line of lines) {
    if (line.includes('🔒') || line.includes('鎖定中')) section = 'locked';
    if (line.includes('✅') || line.includes('今日完成')) section = 'completed';

    if (line.startsWith('|') && !line.includes('---') && !line.includes('文件')) {
      const cols = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cols.length >= 3 && cols[0] !== '*(空)*') {
        const item = { file: cols[0], ai: cols[1], time: cols[2], note: cols[3] || '' };
        if (section === 'locked') locked.push(item);
        if (section === 'completed') completed.push(item);
      }
    }
  }
  return { locked, completed };
}

/**
 * 讀取最近 commit 活動
 */
async function fetchRecentActivity(limit = 10) {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/commits?per_page=${limit}`);
    const commits = await res.json();
    return commits.map(c => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      author: c.commit.author.name,
      time: c.commit.author.date,
      url: c.html_url
    }));
  } catch (e) {
    console.error('fetchRecentActivity error:', e);
    return [];
  }
}

/**
 * 讀取 Issues（任務狀態）
 */
async function fetchTasks(state = 'all') {
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/issues?state=${state}&per_page=20`);
    const issues = await res.json();
    return issues.map(i => ({
      number: i.number,
      title: i.title,
      state: i.state,
      labels: i.labels.map(l => l.name),
      assignee: i.assignee?.login || null,
      url: i.html_url,
      updatedAt: i.updated_at
    }));
  } catch (e) {
    console.error('fetchTasks error:', e);
    return [];
  }
}

/**
 * 判斷 AI 目前狀態
 */
async function fetchAIStatus() {
  const [status, commits] = await Promise.all([fetchStatus(), fetchRecentActivity(5)]);
  const now = Date.now();

  return Object.entries(AI_MEMBERS).map(([username, info]) => {
    // 係咪有文件鎖定中
    const isLocked = status.locked.some(l => l.ai.includes(info.emoji) || l.ai.includes(info.name));
    // 最近30分鐘有冇 commit
    const recentCommit = commits.find(c => {
      const commitTime = new Date(c.time).getTime();
      return c.author.includes(info.name) && (now - commitTime) < 30 * 60 * 1000;
    });

    let state = 'idle'; // 閒置
    if (isLocked) state = 'busy'; // 忙碌
    if (recentCommit) state = 'active'; // 剛有活動

    return {
      username,
      ...info,
      state,
      lastActivity: recentCommit?.time || null
    };
  });
}

/**
 * 一次過讀取所有數據
 */
async function fetchDashboardData() {
  const [status, activity, tasks, aiStatus] = await Promise.all([
    fetchStatus(),
    fetchRecentActivity(10),
    fetchTasks('all'),
    fetchAIStatus()
  ]);

  return {
    status,
    activity,
    tasks,
    aiStatus,
    updatedAt: new Date().toISOString()
  };
}

// Export
window.GitHubAPI = {
  fetchDashboardData,
  fetchStatus,
  fetchRecentActivity,
  fetchTasks,
  fetchAIStatus,
  AI_MEMBERS,
  REPO
};
