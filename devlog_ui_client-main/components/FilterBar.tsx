"use client";

import React, { useEffect, useRef } from 'react';

interface FilterBarProps {
  filter: 'all' | 'info' | 'success' | 'warning' | 'error';
  setFilter: (filter: 'all' | 'info' | 'success' | 'warning' | 'error') => void;
  count: number;
  total: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filter, setFilter, count, total, searchQuery, setSearchQuery }) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filters = [
    { id: 'all', label: 'All', color: 'bg-zinc-700 text-white', inactive: 'text-zinc-400 hover:text-white hover:bg-white/5' },
    { id: 'info', label: 'Info', color: 'bg-blue-500/20 text-blue-400 border border-blue-500/30', inactive: 'text-zinc-400 hover:text-blue-400 hover:bg-blue-500/5' },
    { id: 'success', label: 'Success', color: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30', inactive: 'text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/5' },
    { id: 'warning', label: 'Warning', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', inactive: 'text-zinc-400 hover:text-amber-400 hover:bg-amber-500/5' },
    { id: 'error', label: 'Error', color: 'bg-red-500/20 text-red-500 border border-red-500/30', inactive: 'text-zinc-400 hover:text-red-400 hover:bg-red-500/5' },
  ] as const;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex items-center gap-4 p-4 bg-zinc-900/50 border-b border-white/5 backdrop-blur-md sticky top-0 z-10 w-full">
      <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-xl border border-white/5 shrink-0 shadow-inner">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
              filter === f.id ? f.color : f.inactive
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      
      {/* Search Bar */}
      <div className="flex-1 relative max-w-md mx-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg 
            className="w-3.5 h-3.5 text-zinc-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          ref={searchInputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search logs... (Ctrl+K)"
          className="w-full bg-zinc-950/50 border border-white/10 rounded-md py-1.5 pl-9 pr-8 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 font-bold"
          >
            ×
          </button>
        )}
      </div>

      <div className="ml-auto text-xs font-mono text-zinc-500 shrink-0">
        Showing {count} / {total} logs
      </div>
    </div>
  );
};
