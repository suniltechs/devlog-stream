import { io, Socket } from 'socket.io-client';

let isInitialized = false;
let socket: Socket | null = null;
let isLogging = false;

// Safe stringify for objects (handles circular references)
function safeStringify(obj: any): string {
  const cache = new Set();
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) {
          return '[Circular]';
        }
        cache.add(value);
      }
      return value;
    }, 2);
  } catch (err) {
    return '[Unserializable Object]';
  }
}

function processArgs(args: any[]): string {
  return args.map(arg => {
    if (arg instanceof Error) {
      return arg.stack || arg.message;
    }
    if (typeof arg === 'object') {
      return safeStringify(arg);
    }
    return String(arg);
  }).join(' ');
}

export function initBrowserLogger(serverUrl = process.env.NEXT_PUBLIC_DEVLOG_URL || 'http://localhost:4000') {
  if (typeof window === 'undefined' || isInitialized) return;
  isInitialized = true;

  try {
    socket = io(serverUrl, {
      reconnectionAttempts: 5,
      timeout: 2000,
      autoConnect: true,
    });
  } catch (err) {
    // Fail silently so as not to break the host app
    console.warn("DevLog: Failed to initialize socket connection");
    return;
  }

  const emitLog = (type: 'info' | 'warn' | 'error', message: string, details?: string) => {
    // Prevent recursion if socket/network tries to log back to console
    if (isLogging || !socket?.connected) return;
    
    isLogging = true;
    try {
      socket.emit('log', {
        type,
        message,
        timestamp: new Date().toISOString(),
        source: 'browser',
        details
      });
    } catch (e) {
      // Ignore emit errors to avoid crashing app
    } finally {
      isLogging = false;
    }
  };

  // 1. Intercept console methods
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = function (...args: any[]) {
    originalLog.apply(console, args);
    emitLog('info', processArgs(args));
  };

  console.warn = function (...args: any[]) {
    originalWarn.apply(console, args);
    emitLog('warn', processArgs(args));
  };

  console.error = function (...args: any[]) {
    originalError.apply(console, args);
    emitLog('error', processArgs(args));
  };

  // 2. Intercept unhandled errors
  window.onerror = function (message, source, lineno, colno, error) {
    const errorDetails = error?.stack || `${source}:${lineno}:${colno}`;
    emitLog('error', `Global Error: ${message}`, errorDetails);
    return false; // Let default browser handler also run
  };

  // 3. Intercept unhandled promise rejections
  window.addEventListener('unhandledrejection', function (event) {
    const reason = event.reason;
    let message = 'Unhandled Promise Rejection';
    let details = '';

    if (reason instanceof Error) {
      message += `: ${reason.message}`;
      details = reason.stack || '';
    } else {
      message += `: ${typeof reason === 'string' ? reason : safeStringify(reason)}`;
    }

    emitLog('error', message, details);
  });

  // Log successful injection visually in the actual console but don't re-emit this initial log
  originalLog.call(console, '%c [DevLog] Browser Logger Initialized ', 'background: #222; color: #bada55');
}
