"use client";

import { useSocket, LogEntry } from '../hooks/useSocket';
import { useState, useMemo } from 'react';
import { LogViewer } from '../components/LogViewer';
import { FilterBar } from '../components/FilterBar';
import { ControlBar } from '../components/ControlBar';
import { ErrorSpotlight } from '../components/ErrorSpotlight';
import { StatsBar } from '../components/StatsBar';
import { LogModal } from '../components/LogModal';

export default function Home() {
  const { 
    isConnected, 
    logs, 
    emitLog, 
    clearLogs, 
    isPaused, 
    togglePause, 
    bufferSize,
    latestError
  } = useSocket(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000');
  
  const [filter, setFilter] = useState<'all' | 'info' | 'success' | 'warning' | 'error'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

  const filteredLogs = useMemo(() => {
    let result = logs;
    
    if (filter !== 'all') {
      result = result.filter((log) => log.type === filter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((log) => log.message.toLowerCase().includes(query));
    }
    
    return result;
  }, [logs, filter, searchQuery]);

  return (
    <main className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden selection:bg-blue-500/30">
      {/* Main Dashboard Container */}
      <div className="flex flex-col flex-1 max-w-7xl mx-auto border-x border-white/5 bg-zinc-950 shadow-2xl overflow-hidden relative">
        
        {/* Header Section */}
        <header className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-black tracking-tight leading-tight uppercase transform skew-x-[-2deg]">
                Devlog Stream <span className="text-blue-500">dashboard</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Buffer Utilization</span>
              <div className="w-24 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(logs.length / 100) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Real-time Stats Bar */}
        <StatsBar logs={logs} isConnected={isConnected} />

        {/* Filters Top Bar */}
        <FilterBar 
          filter={filter} 
          setFilter={setFilter} 
          count={filteredLogs.length} 
          total={logs.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Error Spotlight Banner */}
        <ErrorSpotlight errorLog={latestError} onSelect={setSelectedLog} />

        {/* Large Log Viewer Area */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)] overflow-hidden">
          <LogViewer 
            logs={filteredLogs} 
            searchQuery={searchQuery} 
            onLogSelect={setSelectedLog}
            selectedLogId={selectedLog?.id}
          />
          
          {/* Pause Overlay Indicator */}
          {isPaused && (
            <div className="absolute top-4 right-4 bg-yellow-500/10 border border-yellow-500/30 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 pointer-events-none animate-in fade-in zoom-in duration-300 z-30">
              <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">
                Updates Paused · Buffer: {bufferSize}
              </span>
            </div>
          )}
        </div>

        {/* Footer Section: Controls + Input */}
        <div className="flex flex-col shrink-0 relative z-40 bg-zinc-950">
          <ControlBar 
            isConnected={isConnected}
            isPaused={isPaused}
            togglePause={togglePause}
            clearLogs={clearLogs}
            bufferSize={bufferSize}
          />
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <LogModal 
          log={selectedLog} 
          onClose={() => setSelectedLog(null)} 
        />
      )}
    </main>
  );
}
