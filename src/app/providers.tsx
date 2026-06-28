'use client'

import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-jakarta), system-ui, sans-serif',
            fontSize: '13.5px',
            fontWeight: 500,
          },
        }}
      />
    </SessionProvider>
  )
}
