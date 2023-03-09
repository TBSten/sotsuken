import EmotionCacheProvider from '@/components/EmotionCacheProvider';
import '@/styles/globals.css';
import { SotsukenThemeProvider } from '@/styles/theme';
import { EmotionCache } from '@emotion/cache';
import { CssBaseline } from '@mui/material';
import { Session } from 'next-auth';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';

interface SotsukenAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session?: Session | null
}
export default function App({ Component, emotionCache, session, ...pageProps }: SotsukenAppProps) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <SotsukenThemeProvider>
        <EmotionCacheProvider emotionCache={emotionCache}>
          <Component {...pageProps} />
        </EmotionCacheProvider>
      </SotsukenThemeProvider>
    </SessionProvider>
  )
}
