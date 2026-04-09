'use client';

import UnsavedJaapWarning from './UnsavedJaapWarning';
import BirthdayPopup from './BirthdayPopup';
import { ToastProvider } from './Toast';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UnsavedJaapWarning />
      <BirthdayPopup />
      {children}
    </ToastProvider>
  );
}
