import type { EmotionCache } from '@emotion/react';
import { CacheProvider } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalBaseline from 'components/GlobalBaseline';
import SplashScreen from 'components/SplashScreen';
import { AuthConsumer, AuthProvider } from 'contexts/Auth';
import { NotificationProvider } from 'contexts/Notification';
import { SettingsProvider } from 'contexts/Settings';
import { AddressProvider } from 'contexts/Address';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import { Provider as ReduxProvider } from 'react-redux';
import store from 'store';
import createEmotionCache from 'utils/createEmotionCache';
import { ShoppingCartProvider } from 'contexts/ShoppingCart';
import 'swiper/css/bundle';
import '../i18n';
import 'pages/term-of-service/index.css';
import { CategoryProvider } from 'contexts/Category';

Router.events.on('routeChangeStart', nProgress.start);
Router.events.on('routeChangeError', nProgress.done);
Router.events.on('routeChangeComplete', nProgress.done);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: Props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>VSHIP</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <AuthProvider>
          <SettingsProvider>
            <ShoppingCartProvider>
              <AddressProvider>
                <CategoryProvider>
                  <NotificationProvider>
                    <CssBaseline />
                    <GlobalBaseline />
                    <AuthConsumer>
                      {(auth) =>
                        !auth || !auth.isInitialized ? (
                          <SplashScreen />
                        ) : (
                          <Component {...pageProps} />
                        )
                      }
                    </AuthConsumer>
                  </NotificationProvider>
                </CategoryProvider>
              </AddressProvider>
            </ShoppingCartProvider>
          </SettingsProvider>
        </AuthProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default App;
