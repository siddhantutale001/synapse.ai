const STORAGE_KEY = 'synapse_plans';
const ROADMAP_CHECKS_KEY = 'synapse_roadmap_checks';

const FALLBACK_PLAN = {
  idea_summary:
    'A campus-focused platform that connects dining halls with students to redistribute surplus food before it is wasted.',
  problem_framing: {
    core_problem:
      'University dining services routinely discard unserved prepared food while nearby students face food insecurity and tight budgets.',
    target_users:
      'Campus dining staff, sustainability offices, student volunteers, and students seeking affordable meals.',
    why_it_matters:
      'Food waste drives unnecessary emissions and costs, while reducing waste aligns with campus sustainability goals and supports student wellbeing.',
  },
  deep_search_insights: [
    {
      angle: 'Existing approaches',
      insight:
      'Apps like Too Good To Go and Olio have proven demand for surplus-food redistribution in cities, but campus ecosystems need tighter integration with meal-plan systems and dining hall inventory workflows. Pilot programs at several universities use simple Slack or email alerts, suggesting low-friction notification is key to adoption.',
    },
    {
      angle: 'Technical challenges',
      insight:
        'Real-time inventory updates from dining halls are difficult without staff-friendly input tools, and food-safety regulations require clear pickup windows and temperature guidance. Building reliable push notifications and a simple verification flow for pickup will be essential to prevent no-shows and spoilage.',
    },
    {
      angle: 'Social and market context',
      insight:
        'Gen Z students strongly prefer sustainability-aligned brands, and campus ESG reporting creates institutional pressure to cut waste metrics. Partnering with existing sustainability clubs and dining services can accelerate trust and adoption without heavy marketing spend.',
    },
  ],
  recommended_tech_stack: {
    frontend: 'React or plain HTML/JS mobile-first web app with Tailwind CSS',
    backend_or_api: 'Node.js or Python FastAPI with REST endpoints for listings and notifications',
    data_storage: 'PostgreSQL for orders and inventory; Redis for short-lived pickup slots',
    justification:
      'A lightweight web stack lets dining staff use tablets without installing native apps, while PostgreSQL handles audit trails needed for food-safety compliance.',
  },
  related_work: [
    {
      name: 'Too Good To Go',
      relevance: 'Demonstrates consumer appetite for discounted surplus meals and provides UX patterns for time-limited pickup offers.',
    },
    {
      name: 'Food Recovery Network',
      relevance: 'Shows how student-led chapters partner with dining services to donate rather than discard surplus food on campuses.',
    },
    {
      name: 'Copia',
      relevance: 'Offers enterprise food-recovery logistics that campuses can study for inventory tracking and impact reporting features.',
    },
  ],
  action_roadmap: [
    {
      step_number: 1,
      title: 'Validate with dining services',
      description:
        'Interview one campus dining manager and one sustainability officer to confirm workflow constraints, pickup rules, and success metrics.',
    },
    {
      step_number: 2,
      title: 'Build a paper prototype',
      description:
        'Sketch staff posting flow and student notification flow; test with 5 students for clarity and willingness to pick up within 30 minutes.',
    },
    {
      step_number: 3,
      title: 'Ship an MVP alert system',
      description:
        'Launch a simple web form for staff to post surplus items and a student-facing list with email or SMS alerts for new postings.',
    },
    {
      step_number: 4,
      title: 'Pilot in one dining hall',
      description:
        'Run a two-week pilot measuring meals rescued, pickup rate, and staff time per posting; iterate on the posting form based on feedback.',
    },
    {
      step_number: 5,
      title: 'Report impact and expand',
      description:
        'Publish a brief impact report for the sustainability office and propose expansion to additional halls with automated inventory hooks.',
    },
  ],
  real_time_considerations:
    'Campus sustainability mandates and student cost-of-living pressures are both rising in 2025–2026, making food-waste reduction a timely pitch to administrators. Recent advances in low-cost IoT temperature sensors and push-notification APIs make real-time surplus alerts more feasible without custom hardware.',
};

async function callGemini(ideaText) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);

  try {
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({ idea: ideaText }),
    });

    if (!res.ok) {
      throw new Error(`API error ${res.status}`);
    }

    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

// ── Toast Notifications helper ────────────────────────────────────────
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  let bgClass = 'bg-slate-800 text-white dark:bg-slate-700';
  let icon = 'ℹ️';
  if (type === 'success') { bgClass = 'bg-emerald-600 text-white'; icon = '✅'; }
  if (type === 'error') { bgClass = 'bg-rose-600 text-white'; icon = '⚠️'; }

  toast.className = `pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl font-medium text-xs md:text-sm transition-all duration-300 transform translate-y-3 opacity-0 ${bgClass}`;
  toast.innerHTML = `<span class="text-base shrink-0">${icon}</span><span class="truncate">${escapeHtml(message)}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-3', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-3', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── LocalStorage & Roadmap Checks helpers ─────────────────────────────

function getSavedPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const plans = raw ? JSON.parse(raw) : [];
    return plans.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  } catch {
    return [];
  }
}

function savePlan(plan, ideaText) {
  const plans = getSavedPlans();
  const newEntry = {
    id: crypto.randomUUID(),
    createdAt: Date.now(),
    ideaText,
    plan,
  };
  plans.push(newEntry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  renderDashboard();
  showToast('Plan saved to dashboard!', 'success');
}

function deletePlan(id) {
  const plans = getSavedPlans().filter((entry) => entry.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  if (window.selectedCompareIds && window.selectedCompareIds.has(id)) {
    window.selectedCompareIds.delete(id);
    updateCompareButton();
  }
  renderDashboard();
  showToast('Plan removed from dashboard', 'info');
}

function clearDashboard() {
  if (confirm('Clear all saved plans from your dashboard?')) {
    localStorage.removeItem(STORAGE_KEY);
    if (window.selectedCompareIds) window.selectedCompareIds.clear();
    updateCompareButton();
    renderDashboard();
    showToast('Dashboard cleared', 'info');
  }
}

// Roadmap check persistence per plan
function getPlanKey(plan, explicitId) {
  if (explicitId) return String(explicitId);
  if (plan._id) return String(plan._id);
  const text = (plan.idea_summary || '') + (plan.problem_framing?.core_problem || '');
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash) + text.charCodeAt(i);
    hash |= 0;
  }
  return 'roadmap_' + Math.abs(hash);
}

function getRoadmapChecks(planKey) {
  try {
    const raw = localStorage.getItem(ROADMAP_CHECKS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[planKey] || [];
  } catch {
    return [];
  }
}

function saveRoadmapChecks(planKey, checks) {
  try {
    const raw = localStorage.getItem(ROADMAP_CHECKS_KEY);
    const data = raw ? JSON.parse(raw) : {};
    data[planKey] = checks;
    localStorage.setItem(ROADMAP_CHECKS_KEY, JSON.stringify(data));
  } catch {}
}

// ── Smarter Dashboard (Search, Sort, Tags, Compare Mode) ──────────────

function extractKeywords(text) {
  if (!text) return [];
  const stopwords = new Set(['build', 'develop', 'create', 'make', 'with', 'from', 'that', 'this', 'have', 'more', 'your', 'about', 'some', 'into', 'over', 'under', 'using', 'based', 'solution', 'system', 'project', 'platform', 'idea', 'app']);
  return text
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopwords.has(w.toLowerCase()))
    .slice(0, 3);
}

function updateCompareButton() {
  const count = window.selectedCompareIds ? window.selectedCompareIds.size : 0;
  const btn = document.getElementById('comparePlansBtn');
  const counter = document.getElementById('compareCount');
  if (counter) counter.textContent = count;
  if (btn) btn.disabled = count !== 2;
}

function openCompareModal() {
  const modal = document.getElementById('compareModal');
  const content = document.getElementById('compareModalContent');
  if (!modal || !content || !window.selectedCompareIds) return;

  const all = getSavedPlans();
  const selected = Array.from(window.selectedCompareIds)
    .map((id) => all.find((p) => p.id === id))
    .filter(Boolean);

  if (selected.length < 2) return;

  content.innerHTML = selected.map((entry, idx) => {
    const p = entry.plan || {};
    const tech = p.recommended_tech_stack || {};
    const roadmap = p.action_roadmap || [];
    return `
      <div class="flex flex-col gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
        <div class="pb-3 border-b border-slate-200 dark:border-slate-700">
          <span class="text-xs font-extrabold text-[#6366F1] dark:text-indigo-400 uppercase tracking-wider">Plan ${idx + 1}</span>
          <h4 class="font-bold text-base md:text-lg text-[#1E1B4B] dark:text-white mt-1 leading-snug">${escapeHtml(truncateText(entry.ideaText || p.idea_summary || 'Untitled Plan', 75))}</h4>
        </div>
        <div>
          <h5 class="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Recommended Tech Stack</h5>
          <div class="space-y-2 text-xs md:text-sm">
            <div class="p-2.5 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-slate-700 dark:text-slate-200 border border-blue-500/20">
              <span class="font-semibold text-blue-600 dark:text-blue-400">Frontend:</span> ${escapeHtml(tech.frontend || 'N/A')}
            </div>
            <div class="p-2.5 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 text-slate-700 dark:text-slate-200 border border-purple-500/20">
              <span class="font-semibold text-purple-600 dark:text-purple-400">Backend:</span> ${escapeHtml(tech.backend_or_api || 'N/A')}
            </div>
            <div class="p-2.5 rounded-xl bg-teal-500/10 dark:bg-teal-500/20 text-slate-700 dark:text-slate-200 border border-teal-500/20">
              <span class="font-semibold text-teal-600 dark:text-teal-400">Data Storage:</span> ${escapeHtml(tech.data_storage || 'N/A')}
            </div>
            ${tech.justification ? `<p class="text-xs text-slate-500 dark:text-slate-400 italic mt-2"><span class="font-semibold not-italic">Why:</span> ${escapeHtml(tech.justification)}</p>` : ''}
          </div>
        </div>
        <div>
          <h5 class="font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Action Roadmap (${roadmap.length} Steps)</h5>
          <ol class="space-y-2 text-xs md:text-sm">
            ${roadmap.map((s) => `
              <li class="flex gap-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span class="font-bold text-indigo-500 shrink-0">${s.step_number || '•'}.</span>
                <div>
                  <span class="font-bold text-[#1E1B4B] dark:text-slate-200">${escapeHtml(s.title || '')}</span>
                  <p class="text-slate-600 dark:text-slate-400 text-xs mt-0.5 leading-relaxed">${escapeHtml(s.description || '')}</p>
                </div>
              </li>
            `).join('')}
          </ol>
        </div>
      </div>
    `;
  }).join('');

  modal.classList.remove('hidden');
}

function renderDashboard() {
  const dashboardList = document.getElementById('dashboardList');
  if (!dashboardList) return;
  dashboardList.innerHTML = '';

  let plans = getSavedPlans();

  // Apply client-side search/filter
  const searchEl = document.getElementById('dashboardSearch');
  const sortEl = document.getElementById('dashboardSort');
  const query = searchEl ? searchEl.value.trim().toLowerCase() : '';
  if (query) {
    plans = plans.filter((p) => {
      const text = (p.ideaText || '') + ' ' + (p.plan?.idea_summary || '');
      return text.toLowerCase().includes(query);
    });
  }

  // Apply sort
  const sortType = sortEl ? sortEl.value : 'newest';
  if (sortType === 'oldest') {
    plans.sort((a, b) => (a.createdAt ?? 0) - (b.createdAt ?? 0));
  } else if (sortType === 'az') {
    plans.sort((a, b) => String(a.ideaText || '').localeCompare(String(b.ideaText || '')));
  } else {
    plans.sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  }

  if (plans.length === 0) {
    dashboardList.innerHTML = '<p class="text-sm text-gray-400 dark:text-slate-400 italic">No saved plans yet</p>';
    return;
  }

  if (!window.selectedCompareIds) window.selectedCompareIds = new Set();

  plans.forEach((entry) => {
    const card = document.createElement('div');
    card.className =
      'flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 mb-3 last:mb-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700';

    const isChecked = window.selectedCompareIds.has(entry.id);
    const keywords = extractKeywords(entry.ideaText || entry.plan?.idea_summary);
    const tagsHtml = keywords.map((kw) => `<span class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 mr-1 mt-1">#${escapeHtml(kw)}</span>`).join('');

    card.innerHTML = `
      <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
        <label class="cursor-pointer shrink-0 mt-1 sm:mt-0" title="Select to compare">
          <input type="checkbox" class="compare-cb w-4 h-4 rounded text-[#6366F1] focus:ring-[#6366F1] border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 cursor-pointer" ${isChecked ? 'checked' : ''}>
        </label>
        <div class="min-w-0 flex-1">
          <p class="font-medium text-[#1B1035] dark:text-slate-100 truncate">${escapeHtml(truncateText(entry.ideaText || 'Saved Plan', 70))}</p>
          <div class="flex flex-wrap items-center gap-x-2 text-xs text-gray-400 dark:text-slate-400 mt-0.5">
            <span>${formatRelativeTime(entry.createdAt)}</span>
            <div class="flex flex-wrap gap-1">${tagsHtml}</div>
          </div>
        </div>
      </div>
      <div class="flex gap-2 shrink-0 self-end sm:self-center">
        <button type="button" class="view-plan-btn text-xs font-medium px-3 py-1.5 rounded-md bg-[#7B5FFF] text-white hover:bg-[#6A4FE0] transition-colors">
          View
        </button>
        <button type="button" class="delete-plan-btn text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          Delete
        </button>
      </div>
    `;

    card.querySelector('.compare-cb').addEventListener('change', (e) => {
      if (e.target.checked) {
        if (window.selectedCompareIds.size >= 2) {
          e.target.checked = false;
          showToast('You can only compare 2 plans at a time!', 'error');
          return;
        }
        window.selectedCompareIds.add(entry.id);
      } else {
        window.selectedCompareIds.delete(entry.id);
      }
      updateCompareButton();
    });

    card.querySelector('.view-plan-btn').addEventListener('click', () => {
      renderPlan(entry.plan, { planId: entry.id });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    card.querySelector('.delete-plan-btn').addEventListener('click', () => {
      deletePlan(entry.id);
    });

    dashboardList.appendChild(card);
  });

  updateCompareButton();
}

// ── Plan rendering with Presentation-Layer Enhancements ───────────────

function renderPlan(plan, { isFallback = false, planId = null } = {}) {
  const planOutput = document.getElementById('planOutput');
  const actionsBar = document.getElementById('planActionsBar');
  if (!planOutput) return;

  planOutput.innerHTML = '';
  window.currentRenderedPlan = plan;

  if (actionsBar) actionsBar.classList.remove('hidden');

  if (isFallback) {
    const notice = document.createElement('p');
    notice.className = 'text-xs text-amber-600 dark:text-amber-400 font-medium italic mb-4 bg-amber-500/10 dark:bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/20';
    notice.textContent = '⚠️ (showing a cached example — live connection unavailable)';
    planOutput.appendChild(notice);
  }

  const container = document.createElement('div');
  container.className = 'space-y-4 text-sm not-italic text-gray-700 dark:text-slate-300';

  // 1. Idea Card
  const ideaHtml = `<p class="leading-relaxed text-slate-700 dark:text-slate-300">${escapeHtml(plan.idea_summary || '')}</p>`;

  // 2. Problem Card
  const problemHtml = `
    <div class="space-y-2.5">
      <div><span class="font-semibold text-[#7B5FFF] dark:text-indigo-400">Core Problem:</span> ${escapeHtml(plan.problem_framing?.core_problem || '')}</div>
      <div><span class="font-semibold text-[#7B5FFF] dark:text-indigo-400">Target Users:</span> ${escapeHtml(plan.problem_framing?.target_users || '')}</div>
      <div><span class="font-semibold text-[#7B5FFF] dark:text-indigo-400">Why It Matters:</span> ${escapeHtml(plan.problem_framing?.why_it_matters || '')}</div>
    </div>
  `;

  // 3. DeepSearch Insights with Signal Tags
  const insightsHtml = (plan.deep_search_insights || [])
    .map((item) => {
      const text = `${item.angle || ''} ${item.insight || ''}`.toLowerCase();
      let badge = { text: 'Established', class: 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-500/20', icon: '⚓' };
      
      const contestedWords = ['however', 'debate', 'risk', 'challenge', 'difficult', 'concern', 'barrier', 'controversial', 'issue', 'limitation', 'unlike', 'but', 'trade-off'];
      const emergingWords = ['recent', 'growing', 'emerging', 'new', 'modern', 'future', 'trend', 'advance', 'novel', '2024', '2025', '2026', 'ai', 'iot', 'pilot', 'llm'];
      
      if (contestedWords.some((w) => text.includes(w))) {
        badge = { text: 'Contested', class: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/20', icon: '⚡' };
      } else if (emergingWords.some((w) => text.includes(w))) {
        badge = { text: 'Emerging', class: 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300 border-teal-500/20', icon: '🚀' };
      }

      return `
        <div class="mb-4 last:mb-0 pb-3 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
          <div class="flex items-center flex-wrap gap-2 mb-1">
            <span class="font-bold text-[#1B1035] dark:text-slate-100">${escapeHtml(item.angle || 'Insight')}</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${badge.class}">${badge.icon} ${badge.text}</span>
          </div>
          <p class="mt-1 leading-relaxed text-slate-600 dark:text-slate-300">${escapeHtml(item.insight || '')}</p>
        </div>
      `;
    })
    .join('');

  // 4. Tech Stack Diagram View + Expandable Justification
  const tech = plan.recommended_tech_stack || {};
  const techHtml = `
    <div class="space-y-2 py-1">
      <div class="p-3 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/20 dark:border-blue-500/30 shadow-2xs">
        <div class="text-xs font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Frontend Layer</div>
        <div class="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">${escapeHtml(tech.frontend || 'Web Application')}</div>
      </div>
      <div class="flex justify-center my-0.5 text-indigo-400 dark:text-indigo-500 text-xs font-bold" aria-hidden="true">↓</div>
      <div class="p-3 rounded-2xl bg-gradient-to-r from-purple-500/10 via-pink-500/5 to-transparent border border-purple-500/20 dark:border-purple-500/30 shadow-2xs">
        <div class="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Backend & API Layer</div>
        <div class="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">${escapeHtml(tech.backend_or_api || 'REST API & Logic')}</div>
      </div>
      <div class="flex justify-center my-0.5 text-indigo-400 dark:text-indigo-500 text-xs font-bold" aria-hidden="true">↓</div>
      <div class="p-3 rounded-2xl bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-500/20 dark:border-teal-500/30 shadow-2xs">
        <div class="text-xs font-extrabold text-teal-600 dark:text-teal-400 uppercase tracking-wider">Data & Storage Layer</div>
        <div class="text-xs md:text-sm font-semibold text-slate-800 dark:text-slate-200 mt-1">${escapeHtml(tech.data_storage || 'Database & Caching')}</div>
      </div>
      ${tech.justification ? `
        <details class="mt-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200/70 dark:border-slate-700 group transition-all">
          <summary class="font-bold text-xs uppercase tracking-wider text-indigo-600 dark:text-indigo-400 cursor-pointer list-none flex items-center justify-between">
            <span>Why this stack?</span>
            <span class="group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <p class="mt-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${escapeHtml(tech.justification)}</p>
        </details>
      ` : ''}
    </div>
  `;

  // 5. Related Work with One-Click Research Links
  const relatedHtml = `
    <div class="space-y-3.5">
      ${(plan.related_work || [])
        .map((item) => {
          const q = encodeURIComponent(item.name || 'AI project');
          const googleUrl = `https://www.google.com/search?q=${q}`;
          const scholarUrl = `https://scholar.google.com/scholar?q=${q}`;
          return `
            <div class="p-3 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="min-w-0 flex-1">
                <span class="font-bold text-[#1B1035] dark:text-slate-100 block">${escapeHtml(item.name || 'Project Reference')}</span>
                <span class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5 block">${escapeHtml(item.relevance || '')}</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0 self-start sm:self-center">
                <a href="${googleUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/20 transition-colors">🔍 Google</a>
                <a href="${scholarUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 transition-colors">🎓 Scholar</a>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;

  // 6. Interactive Roadmap Tracker (Checklists & Progress Bar)
  const planKey = getPlanKey(plan, planId);
  const roadmapSteps = plan.action_roadmap || [];
  const checkedIndices = new Set(getRoadmapChecks(planKey));

  const roadmapHtml = `
    <div>
      <div class="mb-3.5 bg-slate-50 dark:bg-slate-800/70 rounded-2xl p-3.5 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between gap-3 shadow-inner-sm">
        <span class="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-300">Roadmap Tracker</span>
        <span class="roadmap-counter font-extrabold text-xs text-[#6366F1] dark:text-indigo-300">${checkedIndices.size}/${roadmapSteps.length} steps complete</span>
      </div>
      <div class="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-4 shadow-inner-sm">
        <div class="roadmap-bar bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#06B6D4] h-full transition-all duration-500 ease-out" style="width: ${roadmapSteps.length > 0 ? Math.round((checkedIndices.size / roadmapSteps.length) * 100) : 0}%"></div>
      </div>
      <div class="space-y-2.5 roadmap-list" data-plan-key="${escapeHtml(planKey)}" data-total="${roadmapSteps.length}">
        ${roadmapSteps.map((step, idx) => {
          const isDone = checkedIndices.has(idx);
          return `
            <label class="flex items-start gap-3 p-3.5 rounded-2xl bg-white/60 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-800 cursor-pointer transition-all">
              <input type="checkbox" class="roadmap-step-cb mt-1 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 cursor-pointer shrink-0" data-idx="${idx}" ${isDone ? 'checked' : ''}>
              <div class="flex-1 min-w-0 transition-all duration-200 ${isDone ? 'opacity-50 line-through' : ''}">
                <span class="font-bold text-sm text-[#1B1035] dark:text-slate-100 block">${step.step_number || idx + 1}. ${escapeHtml(step.title || '')}</span>
                <p class="mt-1 text-xs text-slate-600 dark:text-slate-400 font-normal no-underline">${escapeHtml(step.description || '')}</p>
              </div>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // 7. Live/Trending Indicator on Real-Time Considerations
  const liveConsiderationsHtml = `
    <div class="p-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent dark:from-emerald-500/15 dark:via-teal-500/10 border-2 border-emerald-500/30 hover:border-emerald-500/60 dark:border-emerald-500/40 transition-all duration-300 relative">
      <div class="flex items-center gap-2 mb-3">
        <span class="relative flex h-2.5 w-2.5">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span class="font-bold text-sm md:text-base text-[#1E1B4B] dark:text-slate-100">Real-Time Considerations</span>
        <span class="ml-auto text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/20">Live Trends</span>
      </div>
      <p class="text-slate-700 dark:text-slate-300 leading-relaxed text-xs md:text-sm">${escapeHtml(plan.real_time_considerations || '')}</p>
    </div>
  `;

  container.innerHTML = `
    ${renderCard('Idea', ideaHtml)}
    ${renderCard('Problem', problemHtml)}
    ${renderCard('DeepSearch Insights', insightsHtml)}
    ${renderCard('Recommended Tech Stack', techHtml)}
    ${renderCard('Related Work', relatedHtml)}
    ${renderCard('Action Roadmap', roadmapHtml)}
    ${liveConsiderationsHtml}
  `;

  planOutput.appendChild(container);

  // Bind interactive roadmap checkboxes
  container.querySelectorAll('.roadmap-step-cb').forEach((cb) => {
    cb.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.idx);
      const listEl = cb.closest('.roadmap-list');
      const key = listEl?.dataset.planKey || planKey;
      const total = Number(listEl?.dataset.total || roadmapSteps.length || 1);

      let checks = getRoadmapChecks(key);
      const targetDiv = cb.nextElementSibling;
      if (e.target.checked) {
        if (!checks.includes(idx)) checks.push(idx);
        if (targetDiv) targetDiv.classList.add('opacity-50', 'line-through');
        showToast(`Step ${idx + 1} marked as complete!`, 'success');
      } else {
        checks = checks.filter((i) => i !== idx);
        if (targetDiv) targetDiv.classList.remove('opacity-50', 'line-through');
      }
      saveRoadmapChecks(key, checks);

      const counterEl = container.querySelector('.roadmap-counter');
      const barEl = container.querySelector('.roadmap-bar');
      if (counterEl) counterEl.textContent = `${checks.length}/${total} steps complete`;
      if (barEl) barEl.style.width = `${Math.round((checks.length / total) * 100)}%`;
    });
  });
}

function renderCard(title, body) {
  return `
    <div class="bg-white dark:bg-slate-800/80 rounded-lg shadow-md p-4">
      <h3 class="font-semibold text-[#1B1035] dark:text-slate-100 mb-2">${escapeHtml(title)}</h3>
      ${body}
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncateText(text, maxLength) {
  const str = String(text);
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

function formatRelativeTime(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 10) return 'just now';
  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`;

  const years = Math.floor(months / 12);
  return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

// ── Generate plan & Duplicate idea check ──────────────────────────────

function setLoading(isLoading) {
  const loadingState = document.getElementById('loadingState');
  const generateBtn = document.getElementById('generateBtn');
  if (!loadingState || !generateBtn) return;

  loadingState.classList.toggle('hidden', !isLoading);
  generateBtn.disabled = isLoading;
  generateBtn.classList.toggle('opacity-50', isLoading);
  generateBtn.classList.toggle('cursor-not-allowed', isLoading);
}

function showIdeaError(message) {
  const ideaError = document.getElementById('ideaError');
  if (!ideaError) return;
  if (message) {
    ideaError.textContent = message;
    ideaError.classList.remove('hidden');
    showToast(message, 'error');
  } else {
    ideaError.textContent = '';
    ideaError.classList.add('hidden');
  }
}

function showDuplicateBanner(msg) {
  const banner = document.getElementById('duplicateBanner');
  const text = document.getElementById('duplicateText');
  if (banner && text) {
    text.innerHTML = `<span class="text-base">⚠️</span><span>${escapeHtml(msg)}</span>`;
    banner.classList.remove('hidden');
  }
}

function hideDuplicateBanner() {
  const banner = document.getElementById('duplicateBanner');
  if (banner) banner.classList.add('hidden');
}

async function generatePlan() {
  const ideaInput = document.getElementById('ideaInput');
  if (!ideaInput) return;
  const ideaText = ideaInput.value.trim();

  showIdeaError('');
  hideDuplicateBanner();

  if (!ideaText || ideaText.length < 8) {
    showIdeaError('Give me a bit more detail on your idea (at least 8 characters)');
    return;
  }

  // Duplicate-idea check (string similarity heuristic against existing ideas)
  const saved = getSavedPlans();
  const isSimilar = saved.some((entry) => {
    const existing = (entry.ideaText || '') + ' ' + (entry.plan?.idea_summary || '');
    const wordsInput = new Set(ideaText.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    const wordsExisting = new Set(existing.toLowerCase().split(/\s+/).filter((w) => w.length > 3));
    if (wordsInput.size === 0) return false;
    let matchCount = 0;
    wordsInput.forEach((w) => { if (wordsExisting.has(w)) matchCount++; });
    const ratio = matchCount / wordsInput.size;
    return ratio >= 0.6 || existing.toLowerCase().includes(ideaText.toLowerCase());
  });

  if (isSimilar) {
    showDuplicateBanner('This looks similar to a saved plan — check your dashboard first?');
  }

  setLoading(true);

  try {
    const parsedPlan = await callGemini(ideaText);
    setLoading(false);
    renderPlan(parsedPlan);
    savePlan(parsedPlan, ideaText);
  } catch {
    setLoading(false);
    renderPlan(FALLBACK_PLAN, { isFallback: true });
    showToast('Offline mode: Showing cached example plan', 'info');
  }
}

// ── Export helpers (Markdown & JSON) ──────────────────────────────────

function formatPlanAsMarkdown(plan) {
  if (!plan) return '';
  const p = plan.problem_framing || {};
  const t = plan.recommended_tech_stack || {};
  const insights = (plan.deep_search_insights || []).map((i) => `### ${i.angle}\n${i.insight}`).join('\n\n');
  const related = (plan.related_work || []).map((r) => `- **${r.name}**: ${r.relevance}`).join('\n');
  const roadmap = (plan.action_roadmap || []).map((s) => `${s.step_number || '1'}. **${s.title}**: ${s.description}`).join('\n');

  return `# ${plan.idea_summary || 'Synapse.ai Project Plan'}\n\n## Problem Framing\n- **Core Problem**: ${p.core_problem || 'N/A'}\n- **Target Users**: ${p.target_users || 'N/A'}\n- **Why It Matters**: ${p.why_it_matters || 'N/A'}\n\n## DeepSearch Insights\n${insights}\n\n## Recommended Tech Stack\n- **Frontend**: ${t.frontend || 'N/A'}\n- **Backend/API**: ${t.backend_or_api || 'N/A'}\n- **Data Storage**: ${t.data_storage || 'N/A'}\n- **Justification**: ${t.justification || 'N/A'}\n\n## Related Work\n${related}\n\n## Action Roadmap\n${roadmap}\n\n## Real-Time Considerations\n${plan.real_time_considerations || 'N/A'}\n`;
}

// ── Init ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  const generateBtn = document.getElementById('generateBtn');
  const ideaInput = document.getElementById('ideaInput');
  const clearDashboardBtn = document.getElementById('clearDashboardBtn');
  const charCounter = document.getElementById('charCounter');

  if (generateBtn) generateBtn.addEventListener('click', generatePlan);
  if (clearDashboardBtn) clearDashboardBtn.addEventListener('click', clearDashboard);

  if (ideaInput) {
    ideaInput.addEventListener('input', () => {
      showIdeaError('');
      if (charCounter) {
        const len = ideaInput.value.trim().length;
        charCounter.textContent = `${len} ${len === 1 ? 'character' : 'characters'}`;
      }
    });

    // Keyboard shortcut handler (Cmd/Ctrl + Enter)
    ideaInput.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (generateBtn) generateBtn.click();
      }
    });
  }

  // Example chips click handlers
  document.querySelectorAll('.idea-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (ideaInput) {
        ideaInput.value = chip.dataset.idea || '';
        ideaInput.dispatchEvent(new Event('input'));
        ideaInput.focus();
        showToast('Idea populated! Press Generate or ⌘+Enter', 'info');
      }
    });
  });

  // Duplicate banner dismiss button
  const closeDup = document.getElementById('closeDuplicateBtn');
  if (closeDup) closeDup.addEventListener('click', hideDuplicateBanner);

  // Theme toggle button
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      localStorage.setItem('synapse_theme', isDark ? 'dark' : 'light');
      showToast(isDark ? 'Switched to Dark Mode 🌙' : 'Switched to Light Mode ☀️', 'info');
    });
  }

  // Dashboard search and sort listeners
  const dashSearch = document.getElementById('dashboardSearch');
  const dashSort = document.getElementById('dashboardSort');
  if (dashSearch) dashSearch.addEventListener('input', () => renderDashboard());
  if (dashSort) dashSort.addEventListener('change', () => renderDashboard());

  // Compare mode modal buttons
  const compareBtn = document.getElementById('comparePlansBtn');
  const closeCompareBtn = document.getElementById('closeCompareBtn');
  const compareModal = document.getElementById('compareModal');
  if (compareBtn) compareBtn.addEventListener('click', openCompareModal);
  if (closeCompareBtn && compareModal) {
    closeCompareBtn.addEventListener('click', () => compareModal.classList.add('hidden'));
    compareModal.addEventListener('click', (e) => {
      if (e.target === compareModal) compareModal.classList.add('hidden');
    });
  }

  // Project HUB export buttons
  const copyMdBtn = document.getElementById('copyMdBtn');
  const copyJsonBtn = document.getElementById('copyJsonBtn');
  const printPdfBtn = document.getElementById('printPdfBtn');

  if (copyMdBtn) {
    copyMdBtn.addEventListener('click', () => {
      if (window.currentRenderedPlan) {
        navigator.clipboard.writeText(formatPlanAsMarkdown(window.currentRenderedPlan)).then(() => {
          showToast('Copied to clipboard as Markdown! 📋', 'success');
        }).catch(() => showToast('Failed to copy to clipboard', 'error'));
      }
    });
  }

  if (copyJsonBtn) {
    copyJsonBtn.addEventListener('click', () => {
      if (window.currentRenderedPlan) {
        navigator.clipboard.writeText(JSON.stringify(window.currentRenderedPlan, null, 2)).then(() => {
          showToast('Copied raw JSON to clipboard! { }', 'success');
        }).catch(() => showToast('Failed to copy to clipboard', 'error'));
      }
    });
  }

  if (printPdfBtn) {
    printPdfBtn.addEventListener('click', () => {
      window.print();
    });
  }

  renderDashboard();
});
