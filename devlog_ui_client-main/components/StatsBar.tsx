"use client";

import React, { useMemo, useEffect, useState } from 'react';
import { LogEntry } from '../hooks/useSocket';

interface StatsBarProps {
  logs: LogEntry[];
  isConnected: boolean;
}

export const StatsBar: React.FC<StatsBarProps> = ({ logs, isConnected }) => {
  const [now, setNow] = useState(Date.now());

  // Update 'now' every second for the 'logs per minute' calculation
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const minuteAgo = now - 60 * 1000;
    
    // Calculate total count (including repeats if applicable)
    const recentLogs = logs.filter(log => new Date(log.timestamp).getTime() > minuteAgo);
    const logsPerMin = recentLogs.reduce((acc, log) => acc + (log.count || 1), 0);
    
    const errorCount = logs.filter(log => log.type === 'error').length;
    const warningCount = logs.filter(log => log.type === 'warning').length;
    const successCount = logs.filter(log => log.type === 'success').length;

    return {
      logsPerMin,
      errorCount,
      warningCount,
      successCount,
      totalCount: logs.length
    };
  }, [logs, now]);

  return (
    <div className="flex items-center gap-6 px-6 py-2 bg-zinc-900/30 border-b border-white/5 backdrop-blur-sm overflow-x-auto no-scrollbar">
      {/* Stream Status Pulse */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-950 border border-white/5 shadow-inner shrink-0">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-[pulse_1.5s_infinite]' : 'bg-red-500'} shadow-[0_0_8px_rgba(16,185,129,0.5)]`} />
        <span className={`text-[10px] font-black tracking-tighter uppercase ${isConnected ? 'text-emerald-400' : 'text-red-400'}`}>
          {isConnected ? 'Stream Active' : 'Offline'}
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="h-4 w-px bg-white/10 shrink-0" />

      {/* Metrics Grid */}
      <div className="flex items-center gap-8">
        {/* Logs Per Minute */}
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">Velocity</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black font-mono text-zinc-100 tabular-nums">{stats.logsPerMin}</span>
            <span className="text-[10px] font-mono text-zinc-600">L/min</span>
          </div>
        </div>

        {/* Error Count */}
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">Critical</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-black font-mono tabular-nums ${stats.errorCount > 0 ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'text-zinc-500'}`}>
              {stats.errorCount}
            </span>
            <span className="text-[10px] font-mono text-zinc-600">Errors</span>
          </div>
        </div>

        {/* Success Count */}
        <div className="flex flex-col">
          <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-none mb-1">Stability</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-sm font-black font-mono tabular-nums ${stats.successCount > 0 ? 'text-emerald-500' : 'text-zinc-500'}`}>
              {stats.successCount}
            </span>
            <span className="text-[10px] font-mono text-zinc-600">Success</span>
          </div>
        </div>
      </div>

      {/* Health Bar Visualization */}
      <div className="ml-auto min-w-[120px] flex flex-col gap-1.5 shrink-0 pr-2">
        <div className="flex justify-between items-center px-1">
           <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">Current Health</span>
           <span className="text-[10px] font-mono font-bold text-zinc-400">
             {stats.totalCount > 0 ? Math.round(((stats.totalCount - stats.errorCount) / stats.totalCount) * 100) : 100}%
           </span>
        </div>
        <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-white/5 shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ${
              stats.errorCount > 0 ? 'bg-gradient-to-r from-red-500 to-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${stats.totalCount > 0 ? ((stats.totalCount - stats.errorCount) / stats.totalCount) * 100 : 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
