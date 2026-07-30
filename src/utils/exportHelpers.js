// Helper functions to compile and download multi-format reports (.md, .txt, .pdf)
export { exportProjectToPDF } from './pdfExportHelper';

export const downloadBlob = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (workspace) => {
  if (!workspace) return;
  const title = workspace.title || 'Synapse_Research_Plan';
  const cleanTitle = title.replace(/[^a-z0-9A-Z_]/gi, '_');

  let md = `# ${workspace.title}\n\n`;
  md += `**Share Code**: \`${workspace.shareCode || 'SYNC-7788'}\`  \n`;
  md += `**Generated Date**: ${new Date(workspace.createdAt || Date.now()).toLocaleDateString()}  \n\n`;
  md += `> **Raw Idea**: ${workspace.rawIdea || 'N/A'}\n\n`;
  md += `---\n\n`;

  // 01. Problem Validation
  md += `## 01. Problem Validation & Scope\n\n`;
  md += `- **Core Problem**: ${workspace.problem_framing?.core_problem || 'N/A'}\n`;
  md += `- **Target Users**: ${workspace.problem_framing?.target_users || 'N/A'}\n`;
  md += `- **Why It Matters**: ${workspace.problem_framing?.why_it_matters || 'N/A'}\n\n`;

  // 02. DeepSearch & Literature
  md += `## 02. DeepSearch & Literature Research\n\n`;
  (workspace.deep_search_insights || []).forEach((item, idx) => {
    md += `### ${idx + 1}. ${item.angle}\n`;
    md += `${item.insight}\n\n`;
    md += `**Citations**: ${(item.citations || []).join(', ')}\n\n`;
  });

  // 03. Existing Solution Matrix
  md += `## 03. Existing Solution Comparison Matrix\n\n`;
  md += `| Competitor | Approach | Limitations | Our Advantage |\n`;
  md += `| :--- | :--- | :--- | :--- |\n`;
  (workspace.comparison_matrix || []).forEach((row) => {
    md += `| ${row.competitor} | ${row.approach} | ${row.limitations} | ${row.our_advantage} |\n`;
  });
  md += `\n`;

  // 04. Innovation Gaps
  md += `## 04. Innovation Opportunities & Gaps\n\n`;
  (workspace.innovation_gaps || []).forEach((gap, idx) => {
    md += `### Gap ${idx + 1}: ${gap.gap_title}\n`;
    md += `${gap.description}\n\n`;
    md += `**Impact**: ${gap.impact}\n\n`;
  });

  // 05. Project Architecture
  md += `## 05. Project Architecture\n\n`;
  md += `**Overview**: ${workspace.project_architecture?.overview || 'N/A'}\n\n`;
  md += `| Layer | Components | Protocol |\n`;
  md += `| :--- | :--- | :--- |\n`;
  (workspace.project_architecture?.layers || []).forEach((l) => {
    md += `| ${l.name} | ${l.components} | ${l.protocol} |\n`;
  });
  md += `\n`;

  // 06. Development Roadmap
  md += `## 06. Development Roadmap\n\n`;
  (workspace.action_roadmap || []).forEach((s) => {
    const status = s.completed ? '[x]' : '[ ]';
    md += `- ${status} **Step ${s.step_number}**: ${s.title} — ${s.description}\n`;
  });
  md += `\n`;

  // 07. Recommended Tech Stack
  md += `## 07. Recommended Tech Stack\n\n`;
  md += `- **Frontend**: ${workspace.recommended_tech_stack?.frontend || 'N/A'}\n`;
  md += `- **Backend**: ${workspace.recommended_tech_stack?.backend_or_api || 'N/A'}\n`;
  md += `- **Storage**: ${workspace.recommended_tech_stack?.data_storage || 'N/A'}\n`;
  md += `- **APIs & AI**: ${workspace.recommended_tech_stack?.cloud_and_apis || 'N/A'}\n`;
  md += `- **Justification**: ${workspace.recommended_tech_stack?.justification || 'N/A'}\n\n`;

  // 08. GitHub Repositories
  md += `## 08. GitHub Repositories\n\n`;
  (workspace.github_repositories || []).forEach((repo) => {
    md += `- [${repo.name}](${repo.url}) (${repo.stars}) — ${repo.description}\n`;
  });
  md += `\n`;

  // 09. APIs & Datasets
  md += `## 09. Recommended APIs & Datasets\n\n`;
  (workspace.apis_and_datasets || []).forEach((item) => {
    md += `- **${item.name}** (${item.type} • ${item.provider}): ${item.description} ([Link](${item.url}))\n`;
  });
  md += `\n`;

  // 10. Implementation Timeline
  md += `## 10. Implementation Timeline\n\n`;
  (workspace.implementation_timeline || []).forEach((t) => {
    md += `- **${t.phase}** (${t.duration}): Milestone — ${t.milestone} | Deliverables — ${t.deliverables}\n`;
  });
  md += `\n`;

  // 11. Pitch Deck Outline
  md += `## 11. Pitch Deck Outline\n\n`;
  (workspace.pitch_deck_outline || []).forEach((slide) => {
    md += `### Slide ${slide.slide_number}: ${slide.title}\n`;
    (slide.bullet_points || []).forEach((pt) => {
      md += `- ${pt}\n`;
    });
    md += `\n`;
  });

  downloadBlob(md, `${cleanTitle}_Report.md`, 'text/markdown;charset=utf-8');
};

export const exportToTxt = (workspace) => {
  if (!workspace) return;
  const title = workspace.title || 'Synapse_Research_Plan';
  const cleanTitle = title.replace(/[^a-z0-9A-Z_]/gi, '_');

  let txt = `===================================================\n`;
  txt += `SYNAPSE.AI RESEARCH REPORT\n`;
  txt += `Title: ${workspace.title}\n`;
  txt += `Share Code: ${workspace.shareCode || 'SYNC-7788'}\n`;
  txt += `Date: ${new Date(workspace.createdAt || Date.now()).toLocaleDateString()}\n`;
  txt += `===================================================\n\n`;

  txt += `RAW IDEA:\n${workspace.rawIdea || 'N/A'}\n\n`;

  txt += `PROBLEM VALIDATION:\n`;
  txt += `- Core Problem: ${workspace.problem_framing?.core_problem || 'N/A'}\n`;
  txt += `- Target Users: ${workspace.problem_framing?.target_users || 'N/A'}\n`;
  txt += `- Why It Matters: ${workspace.problem_framing?.why_it_matters || 'N/A'}\n\n`;

  txt += `RECOMMENDED TECH STACK:\n`;
  txt += `- Frontend: ${workspace.recommended_tech_stack?.frontend || 'N/A'}\n`;
  txt += `- Backend: ${workspace.recommended_tech_stack?.backend_or_api || 'N/A'}\n`;
  txt += `- Storage: ${workspace.recommended_tech_stack?.data_storage || 'N/A'}\n`;
  txt += `- AI Engine: ${workspace.recommended_tech_stack?.cloud_and_apis || 'N/A'}\n\n`;

  txt += `INNOVATION GAPS:\n`;
  (workspace.innovation_gaps || []).forEach((g, idx) => {
    txt += `${idx + 1}. ${g.gap_title}: ${g.description} (Impact: ${g.impact})\n`;
  });
  txt += `\n`;

  txt += `ROADMAP STEPS:\n`;
  (workspace.action_roadmap || []).forEach((s) => {
    txt += `[${s.completed ? 'DONE' : 'PENDING'}] Step ${s.step_number}: ${s.title} - ${s.description}\n`;
  });

  downloadBlob(txt, `${cleanTitle}_Summary.txt`, 'text/plain;charset=utf-8');
};
