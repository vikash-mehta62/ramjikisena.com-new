'use client';

import { useRouter } from 'next/navigation';
import { requestGlobalNavigation } from './jaapContext';
import { useCallback } from 'react';

export function useJaapNavigate() {
  const router = useRouter();
  return useCallback((href: string) => {
    requestGlobalNavigation(href, (h) => router.push(h));
  }, [router]);
}
