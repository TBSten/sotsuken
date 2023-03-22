import { FC, ReactNode } from "react";

import createCache, { EmotionCache } from '@emotion/cache';
import { CacheProvider } from "@emotion/react";

function createEmotionCache(): EmotionCache {
    return createCache({ key: 'css' });
}

const clientSideEmotionCache = createEmotionCache();
interface EmotionCacheProviderProps {
    emotionCache?: EmotionCache
    children: ReactNode
}
const EmotionCacheProvider: FC<EmotionCacheProviderProps> = ({
    emotionCache = clientSideEmotionCache,
    children,
}) => {
    return (
        <CacheProvider value={emotionCache}>
            {children}
        </CacheProvider>
    );
}

export default EmotionCacheProvider;