// Standalone Document PDF Export Helper for Synapse.ai
// Generates a clean, multi-page HTML print document avoiding dark-mode & blank-page print bugs.

export function exportProjectToPDF(workspace) {
  if (!workspace) return;

  const title = workspace.title || 'Synapse_Research_Report';
  const shareCode = workspace.shareCode || 'SYNC-7788';
  const createdDate = new Date(workspace.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate the PDF report.');
    return;
  }

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title} — PDF Report</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 15mm 15mm;
    }
    *, *:before, *:after {
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff !important;
      margin: 0;
      padding: 0;
      line-height: 1.5;
      font-size: 13px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .header-cover {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 24px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .brand-title span {
      color: #4f46e5;
    }
    .meta-badge {
      display: inline-block;
      padding: 3px 8px;
      background: #e0e7ff;
      color: #3730a3;
      border-radius: 6px;
      font-family: monospace;
      font-weight: 700;
      font-size: 11px;
    }
    .raw-idea-box {
      background: #f8fafc;
      border-left: 4px solid #4f46e5;
      padding: 12px 16px;
      margin-top: 14px;
      border-radius: 0 8px 8px 0;
      font-style: italic;
      color: #334155;
    }
    .section-block {
      page-break-inside: avoid;
      margin-bottom: 24px;
    }
    .section-header {
      font-size: 15px;
      font-weight: 700;
      color: #1e1b4b;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 6px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-badge {
      background: #4f46e5;
      color: #ffffff;
      font-family: monospace;
      font-size: 10px;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
    }
    .card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 14px;
      border-radius: 10px;
      margin-bottom: 12px;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 12px;
    }
    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
    }
    th {
      background: #e2e8f0;
      font-weight: 700;
      color: #0f172a;
    }
    tr:nth-child(even) {
      background: #f8fafc;
    }
    .tag {
      display: inline-block;
      padding: 2px 6px;
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
    }
    .footer-stamp {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10px;
      color: #94a3b8;
      font-family: monospace;
    }
  </style>
</head>
<body>

  <!-- Cover & Header -->
  <div class="header-cover">
    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
      <div>
        <h1 class="brand-title">${workspace.title || 'Untitled Project'} <span>.ai</span></h1>
        <span class="meta-badge">Code: ${shareCode}</span>
      </div>
      <div style="text-align: right; font-size: 11px; color: #64748b;">
        <p style="margin:0;"><strong>Report Type:</strong> Project Analysis</p>
        <p style="margin:0;"><strong>Generated:</strong> ${createdDate}</p>
      </div>
    </div>
    <div class="raw-idea-box">
      <strong>Core Concept:</strong> "${workspace.rawIdea || 'N/A'}"
    </div>
  </div>

  <!-- 01. Problem Validation -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">01</span>
      <span>Problem Validation & Scope</span>
    </div>
    <div class="grid-3">
      <div class="card">
        <strong style="color: #e11d48; font-size: 11px; text-transform: uppercase;">Core Problem</strong>
        <p style="margin: 6px 0 0 0; font-size: 12px;">${workspace.problem_framing?.core_problem || 'N/A'}</p>
      </div>
      <div class="card">
        <strong style="color: #4f46e5; font-size: 11px; text-transform: uppercase;">Target Users</strong>
        <p style="margin: 6px 0 0 0; font-size: 12px;">${workspace.problem_framing?.target_users || 'N/A'}</p>
      </div>
      <div class="card">
        <strong style="color: #059669; font-size: 11px; text-transform: uppercase;">Why It Matters</strong>
        <p style="margin: 6px 0 0 0; font-size: 12px;">${workspace.problem_framing?.why_it_matters || 'N/A'}</p>
      </div>
    </div>
  </div>

  <!-- 02. Market Research -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">02</span>
      <span>DeepSearch & Literature Research</span>
    </div>
    <div class="grid-3">
      ${(workspace.deep_search_insights || []).map((item) => `
        <div class="card">
          <strong style="color: #7c3aed; font-size: 12px;">${item.angle}</strong>
          <p style="margin: 6px 0 8px 0; font-size: 11px;">${item.insight}</p>
          <div style="font-size: 10px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 6px;">
            <strong>Citations:</strong> ${(item.citations || []).join(', ')}
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- 03. Comparison Matrix -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">03</span>
      <span>Existing Solution Comparison Matrix</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Competitor</th>
          <th>Approach</th>
          <th>Limitations</th>
          <th>Our Advantage</th>
        </tr>
      </thead>
      <tbody>
        ${(workspace.comparison_matrix || []).map((row) => `
          <tr>
            <td><strong>${row.competitor}</strong></td>
            <td>${row.approach}</td>
            <td style="color: #b91c1c;">${row.limitations}</td>
            <td style="color: #047857; font-weight: 600;">${row.our_advantage}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- 04. Innovation Gaps -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">04</span>
      <span>Innovation Opportunities & Gaps</span>
    </div>
    <div class="grid-3">
      ${(workspace.innovation_gaps || []).map((gap) => `
        <div class="card">
          <strong style="color: #0284c7; font-size: 12px;">${gap.gap_title}</strong>
          <p style="margin: 6px 0 6px 0; font-size: 11px;">${gap.description}</p>
          <span class="tag">Impact: ${gap.impact}</span>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- 05. System Architecture -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">05</span>
      <span>System Architecture & Data Flow</span>
    </div>
    <p style="margin-top:0;"><strong>Architecture Overview:</strong> ${workspace.project_architecture?.overview || 'N/A'}</p>
    <table>
      <thead>
        <tr>
          <th>Layer</th>
          <th>Components</th>
          <th>Protocol</th>
        </tr>
      </thead>
      <tbody>
        ${(workspace.project_architecture?.layers || []).map((l) => `
          <tr>
            <td><strong>${l.name}</strong></td>
            <td>${l.components}</td>
            <td><code style="background:#e0e7ff; padding:2px 6px; border-radius:4px; font-size:10px;">${l.protocol}</code></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- 06. Development Roadmap -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">06</span>
      <span>Development Roadmap</span>
    </div>
    ${(workspace.action_roadmap || []).map((s) => `
      <div class="card" style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <strong>Step ${s.step_number}: ${s.title}</strong>
          <p style="margin:4px 0 0 0; color:#475569; font-size:11px;">${s.description}</p>
        </div>
        <span class="tag" style="${s.completed ? 'background:#ecfdf5; color:#047857;' : 'background:#fff7ed; color:#c2410c; border-color:#fed7aa;'}">
          ${s.completed ? 'Completed' : 'Planned'}
        </span>
      </div>
    `).join('')}
  </div>

  <!-- 07. Tech Stack -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">07</span>
      <span>Recommended Tech Stack</span>
    </div>
    <div class="grid-2">
      <div class="card">
        <strong>Frontend:</strong> ${workspace.recommended_tech_stack?.frontend || 'N/A'}<br>
        <strong>Backend:</strong> ${workspace.recommended_tech_stack?.backend_or_api || 'N/A'}
      </div>
      <div class="card">
        <strong>Storage:</strong> ${workspace.recommended_tech_stack?.data_storage || 'N/A'}<br>
        <strong>AI / Cloud:</strong> ${workspace.recommended_tech_stack?.cloud_and_apis || 'N/A'}
      </div>
    </div>
    <p style="font-size:11px; color:#475569; margin-top:4px;"><strong>Justification:</strong> ${workspace.recommended_tech_stack?.justification || 'N/A'}</p>
  </div>

  <!-- 08. GitHub Repositories -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">08</span>
      <span>Open-Source GitHub Repositories</span>
    </div>
    <div class="grid-2">
      ${(workspace.github_repositories || []).map((repo) => `
        <div class="card">
          <div style="display:flex; justify-content:space-between;">
            <strong>${repo.name}</strong>
            <span style="font-family:monospace; font-weight:bold; color:#eab308;">★ ${repo.stars}</span>
          </div>
          <p style="margin:4px 0 0 0; font-size:11px; color:#475569;">${repo.description}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- 09. APIs & Datasets -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">09</span>
      <span>APIs & Public Datasets</span>
    </div>
    <div class="grid-2">
      ${(workspace.apis_and_datasets || []).map((item) => `
        <div class="card">
          <strong>${item.name}</strong> <span style="font-size:10px; color:#64748b;">(${item.type} • ${item.provider})</span>
          <p style="margin:4px 0 0 0; font-size:11px; color:#475569;">${item.description}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- 10. Implementation Timeline -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">10</span>
      <span>Implementation Timeline & Milestones</span>
    </div>
    <table>
      <thead>
        <tr>
          <th>Phase</th>
          <th>Duration</th>
          <th>Milestone</th>
          <th>Deliverables</th>
        </tr>
      </thead>
      <tbody>
        ${(workspace.implementation_timeline || []).map((t) => `
          <tr>
            <td><strong>${t.phase}</strong></td>
            <td style="font-family:monospace;">${t.duration}</td>
            <td style="color:#047857; font-weight:600;">${t.milestone}</td>
            <td>${t.deliverables}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>

  <!-- 11. Pitch Deck Outline -->
  <div class="section-block">
    <div class="section-header">
      <span class="section-badge">11</span>
      <span>Pitch Deck Outline</span>
    </div>
    <div class="grid-2">
      ${(workspace.pitch_deck_outline || []).map((slide) => `
        <div class="card">
          <strong style="color:#4f46e5;">Slide ${slide.slide_number}: ${slide.title}</strong>
          <ul style="margin:6px 0 0 0; padding-left:16px; font-size:11px; color:#334155;">
            ${(slide.bullet_points || []).map((pt) => `<li>${pt}</li>`).join('')}
          </ul>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="footer-stamp">
    Generated via Synapse.ai — Intelligent AI Research & Innovation Copilot
  </div>

</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Trigger print after resources load
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };

  // Fallback trigger if onload fired immediately
  setTimeout(() => {
    try {
      printWindow.focus();
      printWindow.print();
    } catch (e) {}
  }, 400);
}
