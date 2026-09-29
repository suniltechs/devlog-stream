"use client";

import React, { useState } from 'react';

export default function TestLoggerPage() {
  const [clickCount, setClickCount] = useState(0);

  const testInfo = () => {
    console.log(`[Browser Info] Button clicked ${clickCount} times`);
    setClickCount((c) => c + 1);
  };

  const testWarning = () => {
    console.warn("[Browser Warning] This API is deprecated and will be removed in v2.0.");
  };

  const testError = () => {
    console.error("[Browser Error] Failed to fetch user profile data. Token expired.");
  };

  const testComplexObject = () => {
    const obj: any = { a: 1, b: "hello", user: { id: 42, active: true } };
    obj.circular = obj; // Create circular reference to test safeStringify
    console.log("[Browser Object Dump]", obj);
  };

  const testRuntimeThrow = () => {
    throw new Error("[Browser Fatal] Uncaught exception triggered by user action!");
  };

  const testUnhandledPromise = () => {
    Promise.reject(new Error("[Browser Promise] Failed to resolve transaction endpoint"));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10 font-sans">
      <div className="max-w-2xl mx-auto space-y-8 border border-white/10 p-8 rounded-xl bg-zinc-900/50">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Browser Logger Testing</h1>
          <p className="text-zinc-400">
            Use the buttons below to generate client-side errors and warnings. Watch your DevLog Dashboard.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={testInfo} 
            className="p-4 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-left transition-colors border border-white/5 shadow-sm"
          >
            <div className="font-mono text-sm text-zinc-300">console.log(...)</div>
            <div className="text-xs text-zinc-500 mt-1">Basic info message</div>
          </button>

          <button 
            onClick={testWarning} 
            className="p-4 rounded-lg bg-yellow-900/20 hover:bg-yellow-900/40 text-left transition-colors border border-yellow-500/20 shadow-sm"
          >
            <div className="font-mono text-sm text-yellow-300">console.warn(...)</div>
            <div className="text-xs text-yellow-500/70 mt-1">Emit a yellow warning</div>
          </button>

          <button 
            onClick={testError} 
            className="p-4 rounded-lg bg-red-900/20 hover:bg-red-900/40 text-left transition-colors border border-red-500/20 shadow-sm"
          >
            <div className="font-mono text-sm text-red-300">console.error(...)</div>
            <div className="text-xs text-red-500/70 mt-1">Emit a red error</div>
          </button>

          <button 
            onClick={testComplexObject} 
            className="p-4 rounded-lg bg-blue-900/20 hover:bg-blue-900/40 text-left transition-colors border border-blue-500/20 shadow-sm"
          >
            <div className="font-mono text-sm text-blue-300">console.log(object)</div>
            <div className="text-xs text-blue-500/70 mt-1">Test circular JSON stringification</div>
          </button>

          <button 
            onClick={testRuntimeThrow} 
            className="p-4 rounded-lg bg-rose-900/40 hover:bg-rose-900/60 text-left transition-colors border border-rose-500/40 shadow-sm col-span-2"
          >
            <div className="font-mono text-sm text-rose-300">throw new Error(...)</div>
            <div className="text-xs text-rose-500/70 mt-1">Testing window.onerror handler and stack traces</div>
          </button>

          <button 
            onClick={testUnhandledPromise} 
            className="p-4 rounded-lg bg-purple-900/20 hover:bg-purple-900/40 text-left transition-colors border border-purple-500/20 shadow-sm col-span-2"
          >
            <div className="font-mono text-sm text-purple-300">Promise.reject(...)</div>
            <div className="text-xs text-purple-500/70 mt-1">Testing window.onunhandledrejection handler</div>
          </button>
        </div>
      </div>
    </div>
  );
}
