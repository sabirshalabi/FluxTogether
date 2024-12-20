"use client";

import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import toast, { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      try {
        // Try to parse the error message as JSON
        const errorData = JSON.parse(error.message);
        if (errorData.error) {
          toast.error(errorData.error, {
            style: {
              background: '#222222',
              color: '#F3F3F3',
              borderRadius: '8px',
              border: '1px solid #898989',
            },
            duration: 5000,
          });
        } else {
          throw new Error('Not a JSON error');
        }
      } catch {
        // If not JSON, clean up the raw error message
        const cleanError = error.message
          .replace(/[{}"\\]/g, '')
          .replace(/error:/gi, '')
          .replace(/Error: /g, '')
          .trim();
          
        toast.error(cleanError, {
          style: {
            background: '#222222',
            color: '#F3F3F3',
            borderRadius: '8px',
            border: '1px solid #898989',
          },
          duration: 5000,
        });
      }
    },
  }),
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            icon: '⚠️',
          },
        }}
      />
    </QueryClientProvider>
  );
}
