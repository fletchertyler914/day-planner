'use client';

import { ThemeProvider } from 'next-themes';
import { createContext, useContext, useState, useEffect } from 'react';
import { getOpenAIKey, setOpenAIKey, initializeSettings } from '@/lib/db';

type OpenAIContextType = {
  apiKey: string;
  setApiKey: (key: string) => void;
};

export const OpenAIContext = createContext<OpenAIContextType>({
  apiKey: '',
  setApiKey: () => {},
});

export function useOpenAI() {
  return useContext(OpenAIContext);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeSettings();
      const storedKey = await getOpenAIKey();
      setApiKeyState(storedKey);
      setMounted(true);
    };
    init();
  }, []);

  const setApiKey = async (key: string) => {
    setApiKeyState(key);
    await setOpenAIKey(key);
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='dark'
      enableSystem={true}
      disableTransitionOnChange
    >
      <OpenAIContext.Provider value={{ apiKey, setApiKey }}>
        {children}
      </OpenAIContext.Provider>
    </ThemeProvider>
  );
}
