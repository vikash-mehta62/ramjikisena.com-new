'use client';

import { useEffect, useRef, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function getAuthToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || null;
}

function AnalyticsTrackerContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentVisitIdRef = useRef<string | null>(null);
  const activeSecondsRef = useRef<number>(0);
  const heartbeatTimerRef = useRef<any>(null);
  const lastTickTimeRef = useRef<number>(Date.now());

  // Initialize or get Visitor ID & UTM Attribution
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Persistent Visitor ID (Unique Device/Browser)
    let visitorId = localStorage.getItem('rjs_visitor_id');
    if (!visitorId) {
      visitorId = `vtr_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      localStorage.setItem('rjs_visitor_id', visitorId);
    }

    // 2. Parse UTM Parameters from URL
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmContent = urlParams.get('utm_content');
    const utmTerm = urlParams.get('utm_term');

    if (utmSource || utmCampaign) {
      const utmObj = {
        source: utmSource,
        medium: utmMedium,
        campaign: utmCampaign,
        content: utmContent,
        term: utmTerm
      };

      if (!localStorage.getItem('rjs_first_touch_utm')) {
        localStorage.setItem('rjs_first_touch_utm', JSON.stringify(utmObj));
      }
      sessionStorage.setItem('rjs_last_touch_utm', JSON.stringify(utmObj));
    }
  }, []);

  // Send duration update via Beacon or Fetch
  const sendDurationBeacon = (visitId: string, activeSec: number) => {
    if (!visitId || activeSec <= 0) return;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
    const payload = JSON.stringify({ visitId, activeSeconds: activeSec });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon(`${apiUrl}/api/analytics/track-duration`, blob);
    } else {
      fetch(`${apiUrl}/api/analytics/track-duration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  };

  // Main Tracking Effect on Route Change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Send final duration for previous visit if switching pages
    if (currentVisitIdRef.current) {
      sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
    }

    // Reset active timer for new page load
    activeSecondsRef.current = 0;
    lastTickTimeRef.current = Date.now();

    // Generate unique Session ID per session storage
    let sessionId = sessionStorage.getItem('rjs_session_id');
    if (!sessionId) {
      sessionId = `ses_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
      sessionStorage.setItem('rjs_session_id', sessionId);
    }

    const visitorId = localStorage.getItem('rjs_visitor_id') || `vtr_${Date.now()}`;
    const visitId = `vst_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    currentVisitIdRef.current = visitId;

    let firstTouch = null;
    let lastTouch = null;
    try {
      firstTouch = JSON.parse(localStorage.getItem('rjs_first_touch_utm') || 'null');
      lastTouch = JSON.parse(sessionStorage.getItem('rjs_last_touch_utm') || 'null');
    } catch (e) {}

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3101';
    const token = getAuthToken();

    const payload = {
      visitId,
      sessionId,
      visitorId,
      path: pathname || '/',
      pageTitle: typeof document !== 'undefined' ? document.title : '',
      referrer: typeof document !== 'undefined' && document.referrer ? document.referrer : 'Direct',
      firstTouch,
      lastTouch
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    fetch(`${apiUrl}/api/analytics/track-visit`, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .catch(() => {});

    // Active Tab Heartbeat: Increment duration while user is active
    if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);

    heartbeatTimerRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.round((now - lastTickTimeRef.current) / 1000);
      lastTickTimeRef.current = now;

      // Only count active duration if tab is visible and elapsed is reasonable (< 30s)
      if (typeof document !== 'undefined' && !document.hidden && elapsed > 0 && elapsed < 30) {
        activeSecondsRef.current += elapsed;

        // Periodic flush every 30 seconds
        if (activeSecondsRef.current > 0 && activeSecondsRef.current % 30 === 0) {
          sendDurationBeacon(visitId, activeSecondsRef.current);
        }
      }
    }, 5000);

    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
    };
  }, [pathname, searchParams]);

  // Window Unload Listener
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeUnload = () => {
      if (currentVisitIdRef.current && activeSecondsRef.current > 0) {
        sendDurationBeacon(currentVisitIdRef.current, activeSecondsRef.current);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <AnalyticsTrackerContent />
    </Suspense>
  );
}
