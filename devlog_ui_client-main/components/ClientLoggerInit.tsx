"use client";

import { useEffect } from 'react';
import { initBrowserLogger } from '../lib/browserLogger';

export function ClientLoggerInit() {
  useEffect(() => {
    initBrowserLogger();
  }, []);

  // Render nothing. This is just for its side-effects.
  return null;
}
