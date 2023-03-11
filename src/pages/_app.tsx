import EmotionCacheProvider from '@/components/EmotionCacheProvider';
import '@/styles/globals.css';
import { PrimaryThemeProvider } from '@/styles/theme';
import { trpc } from '@/trpc';
import { EmotionCache } from '@emotion/cache';
import { CssBaseline } from '@mui/material';
import { Session } from 'next-auth';
import { SessionProvider } from "next-auth/react";
import type { AppProps } from 'next/app';

interface SotsukenAppProps extends AppProps {
  emotionCache?: EmotionCache;
  session?: Session | null
}
function App({ Component, emotionCache, session, pageProps }: SotsukenAppProps) {
  return (
    <SessionProvider session={session}>
      <CssBaseline />
      <PrimaryThemeProvider>
        <EmotionCacheProvider emotionCache={emotionCache}>
          <Component {...pageProps} />
        </EmotionCacheProvider>
      </PrimaryThemeProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(App)
