'use client';

import UnsavedJaapWarning from './UnsavedJaapWarning';

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UnsavedJaapWarning />
      {children}
    </>
  );
}
