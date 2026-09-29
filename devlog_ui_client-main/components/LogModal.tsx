"use client";

import React, { useEffect, useState } from 'react';
import { LogEntry } from '../hooks/useSocket';
import { X, Copy, Check, Clock, Info, CheckCircle, AlertTriangle, AlertCircle, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface LogModalProps {
  log: LogEntry;
  onClose: () => void;
}

const typeIcons = {
  info: <Info className="w-5 h-5 text-blue-400" />,
  success: <CheckCircle className="w-5 h-5 text-green-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
};

const typeColors = {
  info: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
  success: 'text-green-400 border-green-500/30 bg-green-500/10',
  warning: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
  error: 'text-red-400 border-red-500/30 bg-red-500/10',
};

export const LogModal: React.FC<LogModalProps> = ({ log, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleExplain = async () => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:4000/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: log.message,
          type: log.type,
          source: log.source
        })
      });
      const data = await response.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation("Failed to generate explanation. " + (data.error || ''));
      }
    } catch (e) {
      console.error(e);
      setAiExplanation("Error connecting to the AI endpoint.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(log.message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFullTime = (ts: string) => {
    return new Date(ts).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const maybeFormatJson = (msg: string) => {
    try {
      if (msg.trim().startsWith('{') || msg.trim().startsWith('[')) {
        const obj = JSON.parse(msg);
        return JSON.stringify(obj, null, 2);
      }
    } catch (e) {
      // Not JSON, return as is
    }
    return msg;
  };

  const formattedMessage = maybeFormatJson(log.message);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 transition-all duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl max-h-[85vh] bg-zinc-950/90 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 transition-all ${isClosing ? 'scale-95' : 'scale-100'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg border ${typeColors[log.type]}`}>
              {typeIcons[log.type]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">
                  Log Detail
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase border ${typeColors[log.type]}`}>
                  {log.type}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                ID: {log.id || 'N/A'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExplain}
              disabled={isAnalyzing}
              className="px-3 py-1.5 flex items-center gap-2 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 rounded-lg transition-colors border border-purple-500/30 bg-purple-500/10 text-xs font-bold disabled:opacity-50"
              title="Explain with AI"
            >
              <Sparkles className="w-4 h-4" />
              {isAnalyzing ? 'Analyzing...' : 'Ask AI'}
            </button>
            <button 
              onClick={copyToClipboard}
              className="p-2 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg transition-colors group relative"
              title="Copy Message"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  Copied!
                </span>
              )}
            </button>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">
                <Clock className="w-3 h-3" /> Timestamp
              </div>
              <div className="font-mono text-xs text-zinc-200">
                {formatFullTime(log.timestamp)}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1.5">
                <Info className="w-3 h-3" /> Source
              </div>
              <div className="font-mono text-xs text-zinc-200">
                {log.source || 'Standard Stream'}
              </div>
            </div>
          </div>

          {/* Log Message Board */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                Message Body
              </label>
              {log.count && log.count > 1 && (
                <span className="text-[10px] text-blue-400 font-mono">
                  Captured {log.count} total occurrences
                </span>
              )}
            </div>
            <div className="bg-black/40 rounded-xl border border-white/5 p-4 font-mono text-[13px] leading-relaxed relative group">
              <pre className="text-zinc-200 whitespace-pre-wrap break-all overflow-x-auto">
                {formattedMessage}
              </pre>
            </div>
          </div>

          {/* AI Explanation Section */}
          {(isAnalyzing || aiExplanation) && (
            <div className="space-y-2 mt-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <label className="text-purple-400 text-[10px] uppercase font-bold tracking-widest">
                  AI Analysis
                </label>
              </div>
              <div className="bg-purple-950/20 rounded-xl border border-purple-500/20 p-5 text-[14px] leading-relaxed text-zinc-300">
                {isAnalyzing ? (
                  <div className="flex items-center gap-3 text-purple-400/70 font-mono text-sm animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="ml-2">Analyzing log context...</span>
                  </div>
                ) : (
                  <div className="prose prose-invert prose-purple max-w-none prose-sm [&>p]:mb-4 [&>pre]:bg-black/50 [&>pre]:p-3 [&>pre]:rounded-lg [&>pre]:border [&>pre]:border-white/10 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:text-base [&>h2]:font-bold [&>h3]:text-sm [&>h3]:font-bold [&>code]:text-purple-300 [&>code]:bg-purple-500/20 [&>code]:px-1 [&>code]:rounded">
                    <ReactMarkdown>{aiExplanation!}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History / Occurrences */}
          {log.occurrences && log.occurrences.length > 1 && (
            <div className="space-y-3">
              <label className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">
                Occurrences History
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {log.occurrences.map((ts, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-lg border border-white/5 text-[11px] font-mono text-zinc-400">
                    <span className="w-1 h-1 bg-blue-500/50 rounded-full" />
                    {new Date(ts).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 2 })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-white/5 shrink-0 flex justify-end">
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition-all uppercase tracking-widest"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
