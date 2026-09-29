"use client";

import React, { useState } from 'react';

interface LogInputProps {
  emitLog: (type: 'info' | 'success' | 'warning' | 'error', message: string) => void;
}

export const LogInput: React.FC<LogInputProps> = ({ emitLog }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    emitLog('info', message);
    setMessage('');
  };

  return (
    <div className="flex gap-2 p-4 bg-zinc-950/80 border-t border-white/5">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        placeholder="Send a manual log message..."
        className="flex-1 bg-zinc-900 border border-white/10 rounded-md px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
      />
      <button
        onClick={handleSend}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-bold transition-all shadow-lg active:scale-95"
      >
        SEND
      </button>
    </div>
  );
};
