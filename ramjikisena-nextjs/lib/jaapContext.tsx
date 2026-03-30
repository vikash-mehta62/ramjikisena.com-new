'use client';

import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';

interface JaapContextType {
  hasUnsavedJaap: boolean;
  setHasUnsavedJaap: (v: boolean) => void;
  requestNavigation: (href: string, navigate: (href: string) => void) => void;
}

const JaapContext = createContext<JaapContextType | null>(null);

// Global ref — lives outside React, always fresh
let _hasUnsavedJaap = false;
let _showWarning: ((href: string, nav: (h: string) => void) => void) | null = null;

export function registerWarningHandler(fn: (href: string, nav: (h: string) => void) => void) {
  _showWarning = fn;
}

export function setGlobalUnsavedJaap(v: boolean) {
  _hasUnsavedJaap = v;
}

export function requestGlobalNavigation(href: string, navigate: (h: string) => void) {
  if (_hasUnsavedJaap && _showWarning) {
    _showWarning(href, navigate);
  } else {
    navigate(href);
  }
}

export function JaapProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useJaap() {
  return {
    setHasUnsavedJaap: setGlobalUnsavedJaap,
    requestNavigation: requestGlobalNavigation,
  };
}
