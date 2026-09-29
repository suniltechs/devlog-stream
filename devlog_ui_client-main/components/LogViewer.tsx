"use client";

import React, { useRef, useEffect } from 'react';
import { LogEntry } from '../hooks/useSocket';
import { LogItem } from './LogItem';

interface LogViewerProps {
  logs: LogEntry[];
  searchQuery?: string;
  onLogSelect?: (log: LogEntry) => void;
  selectedLogId?: string;
}

export const LogViewer: React.FC<LogViewerProps> = ({ logs, searchQuery, onLogSelect, selectedLogId }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-zinc-500 font-mono">
        <div className="animate-pulse mb-2">_</div>
        <p>Waiting for incoming logs...</p>
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
    >
      <div className="flex flex-col">
        {logs.map((log) => (
          <LogItem 
            key={log.id} 
            log={log} 
            searchQuery={searchQuery} 
            onSelect={onLogSelect}
            isExpanded={selectedLogId === log.id}
          />
        ))}
      </div>
    </div>
  );
};
