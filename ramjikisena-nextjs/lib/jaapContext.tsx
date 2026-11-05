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

// A "/#section" link while already on that page only needs a scroll. Going through the
// router re-runs the whole page navigation first, which delayed the scroll by seconds.
function scrollToSamePageHash(href: string): boolean {
  if (typeof window === 'undefined') return false;
  const hashAt = href.indexOf('#');
  if (hashAt === -1) return false;
  const path = href.slice(0, hashAt) || window.location.pathname;
  if (path !== window.location.pathname) return false;
  const target = document.getElementById(href.slice(hashAt + 1));
  if (!target) return false;
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  window.history.pushState(window.history.state, '', href);
  return true;
}

export function requestGlobalNavigation(href: string, navigate: (h: string) => void) {
  // Scrolling within the page never leaves unsaved jaap behind, so no warning is needed
  if (scrollToSamePageHash(href)) return;
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
