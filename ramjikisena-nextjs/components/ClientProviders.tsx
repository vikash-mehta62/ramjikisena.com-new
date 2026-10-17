'use client';

import UnsavedJaapWarning from './UnsavedJaapWarning';
import BirthdayPopup from './BirthdayPopup';
import AnalyticsTracker from './AnalyticsTracker';
import { ToastProvider } from './Toast';
import MobileBottomNav from './MobileBottomNav';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AnalyticsTracker />
      <UnsavedJaapWarning />
      <BirthdayPopup />
      {children}
      <MobileBottomNav />
    </ToastProvider>
  );
}
