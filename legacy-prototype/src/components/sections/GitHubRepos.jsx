import React from 'react';
import { Code, ExternalLink, Star } from 'lucide-react';

export default function GitHubRepos({ data }) {
  const repos = data?.github_repositories || [];

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Code className="w-4 h-4 text-indigo-600 dark:text-cyan-400" />
          <span>GitHub Repositories</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repos.map((repo, idx) => (
          <div
            key={idx}
            className={`ios-glass glass-shimmer p-4 rounded-2xl space-y-2 flex flex-col justify-between shadow-sm card-hover animate-slide-up ${
              idx % 2 === 1 ? 'delay-75' : ''
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-xs font-mono">{repo.name}</span>
                <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  {repo.stars || '1.2k★'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{repo.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 relative z-10">
              <a
                href={repo.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-cyan-400 hover:underline transition"
              >
                <span>View Repository</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
