"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface LogEntry {
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  source?: string;
  id?: string; // Add ID for better identification
  count?: number; // Track occurrences of consecutive identical logs
  occurrences?: string[]; // Store timestamps of repeated logs
}

export const useSocket = (url: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [latestError, setLatestError] = useState<LogEntry | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const bufferRef = useRef<LogEntry[]>([]);

  useEffect(() => {
    const socketInstance = io(url);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to socket server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from socket server');
    });

    socketInstance.on('new-log', (newLog: LogEntry) => {
      const logWithId = { 
        ...newLog, 
        id: Math.random().toString(36).substr(2, 9), 
        count: 1,
        occurrences: [newLog.timestamp]
      };
      
      if (logWithId.type === 'error') {
        setLatestError(logWithId);
      }
      
      if (isPaused) {
        // Collect into buffer if paused
        const buffer = bufferRef.current;
        const lastBufferLog = buffer.length > 0 ? buffer[buffer.length - 1] : null;
        
        if (lastBufferLog && lastBufferLog.message === logWithId.message && lastBufferLog.type === logWithId.type) {
          lastBufferLog.count = (lastBufferLog.count || 1) + 1;
          lastBufferLog.occurrences = [...(lastBufferLog.occurrences || []), logWithId.timestamp];
        } else {
          buffer.push(logWithId);
          if (buffer.length > 100) buffer.shift();
        }
      } else {
        // Append to logs if active
        setLogs((prevLogs) => {
          const lastLog = prevLogs.length > 0 ? prevLogs[prevLogs.length - 1] : null;
          
          if (lastLog && lastLog.message === logWithId.message && lastLog.type === logWithId.type) {
            const updatedLastLog = { 
              ...lastLog, 
              count: (lastLog.count || 1) + 1,
              occurrences: [...(lastLog.occurrences || []), logWithId.timestamp]
            };
            return [...prevLogs.slice(0, -1), updatedLastLog];
          }
          
          const nextLogs = [...prevLogs, logWithId];
          return nextLogs.length > 100 ? nextLogs.slice(-100) : nextLogs;
        });
      }
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url, isPaused]); // Added isPaused to deps to correctly capture the current state in listener

  const emitLog = useCallback((type: 'info' | 'success' | 'warning' | 'error', message: string) => {
    if (socket) {
      socket.emit('log', { type, message });
    }
  }, [socket]);

  const clearLogs = useCallback(() => {
    setLogs([]);
    bufferRef.current = [];
    setLatestError(null);
  }, []);

  const togglePause = useCallback(() => {
    if (isPaused) {
      // Flushed buffer on resume
      setLogs((prevLogs) => {
        const nextLogs = [...prevLogs, ...bufferRef.current];
        bufferRef.current = [];
        return nextLogs.length > 100 ? nextLogs.slice(-100) : nextLogs;
      });
    }
    setIsPaused(!isPaused);
  }, [isPaused]);

  return { isConnected, logs, emitLog, clearLogs, isPaused, togglePause, bufferSize: bufferRef.current.length, latestError, setLatestError };
};
