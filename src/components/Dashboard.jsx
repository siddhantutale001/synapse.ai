import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Search, ArrowUpDown, Trash2, Eye, GitCompare, PlusCircle, CheckSquare, Square, AlertTriangle } from 'lucide-react';

export default function Dashboard({
  workspaces,
  onSelectWorkspace,
  onDeleteWorkspace,
  onNewIdeaClick,
}) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('newest');
  const [compareIds, setCompareIds] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const allTags = ['ALL', ...new Set(workspaces.flatMap((w) => w.tags || []))];

  const filteredWorkspaces = workspaces
    .filter((w) => {
      const matchSearch =
        w.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.rawIdea?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchTag = selectedTag === 'ALL' || (w.tags && w.tags.includes(selectedTag));
      return matchSearch && matchTag;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt);
      if (sortOrder === 'oldest') return new Date(a.createdAt || a.updatedAt) - new Date(b.createdAt || b.updatedAt);
      if (sortOrder === 'title') return a.title.localeCompare(b.title);
      return 0;
    });

  const toggleCompare = (id) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((i) => i !== id));
    } else {
      if (compareIds.length >= 2) {
        setCompareIds([compareIds[1], id]);
      } else {
        setCompareIds([...compareIds, id]);
      }
    }
  };

  const handleDelete = (id) => {
    onDeleteWorkspace(id);
    setDeleteConfirmId(null);
  };

  const compareWorkspaces = workspaces.filter((w) => compareIds.includes(w._id || w.id));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ios-glass p-5 rounded-3xl">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">Workspaces</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            {workspaces.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {compareIds.length === 2 && (
            <button
              onClick={() => setIsComparing(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md transition btn-interactive"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Compare (2)</span>
            </button>
          )}

          <button
            onClick={onNewIdeaClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition btn-interactive"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{t('newIdea')}</span>
          </button>
        </div>
      </div>

      {/* Search, Tag Filter & Sort Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Keyword Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search workspaces..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {allTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap btn-interactive ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Sort Order */}
        <div className="flex items-center justify-end gap-2 text-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl px-3 py-2 text-xs focus:outline-none"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title">Sort: Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Workspace Grid */}
      {filteredWorkspaces.length === 0 ? (
        <div className="text-center py-12 ios-glass rounded-3xl space-y-3">
          <p className="text-slate-500 dark:text-slate-400 text-xs">No matching workspaces found.</p>
          <button
            onClick={onNewIdeaClick}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow hover:bg-indigo-500 btn-interactive"
          >
            Create Research Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredWorkspaces.map((ws) => {
            const isCheckedForCompare = compareIds.includes(ws._id || ws.id);
            return (
              <div
                key={ws._id || ws.id}
                className="group relative rounded-3xl ios-glass p-5 transition flex flex-col justify-between space-y-3 shadow-sm hover:shadow-xl card-hover"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {ws.shareCode || 'SYNC-0000'}
                    </span>
                    <button
                      onClick={() => toggleCompare(ws._id || ws.id)}
                      className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-lg transition ${
                        isCheckedForCompare
                          ? 'bg-purple-600 text-white font-bold'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {isCheckedForCompare ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                      <span>Compare</span>
                    </button>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition">
                    {ws.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {ws.rawIdea}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {(ws.tags || []).map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-cyan-400 border border-slate-200 dark:border-slate-700 font-mono"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[10px]">
                    {new Date(ws.createdAt || Date.now()).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDeleteConfirmId(ws._id || ws.id)}
                      className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-900/40 transition btn-interactive"
                      title="Delete Workspace"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onSelectWorkspace(ws)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow transition btn-interactive"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Open</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-sm ios-glass p-5 rounded-3xl shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Delete Workspace?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">This action cannot be undone.</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold btn-interactive"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow btn-interactive"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Plan Comparison Modal */}
      {isComparing && compareWorkspaces.length === 2 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto ios-glass p-6 rounded-3xl shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Plan Comparison</h3>
              </div>
              <button
                onClick={() => setIsComparing(false)}
                className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:text-white text-xs font-bold btn-interactive"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compareWorkspaces.map((ws, index) => (
                <div key={index} className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="border-b border-slate-200 dark:border-slate-800 pb-2">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase font-mono">Plan 0{index + 1}</span>
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">{ws.title}</h4>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Problem Framing</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{ws.problem_framing?.core_problem || 'N/A'}</p>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tech Stack</h5>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">{ws.recommended_tech_stack?.frontend || 'N/A'} + {ws.recommended_tech_stack?.backend_or_api || 'N/A'}</p>
                  </div>

                  <div>
                    <h5 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Innovation Gaps</h5>
                    <ul className="text-xs text-indigo-600 dark:text-cyan-400 list-disc list-inside mt-1 space-y-1">
                      {(ws.innovation_gaps || []).map((g, i) => (
                        <li key={i}>{g.gap_title}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
