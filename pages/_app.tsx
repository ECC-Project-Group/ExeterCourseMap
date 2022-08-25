import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header';
import { SessionProvider } from 'next-auth/react';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { pageview } from '../lib/gtag';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('hashChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('hashChangeComplete', handleRouteChange);
    };
  }, [router.events]);
  // Providers allow any child component to gain access
  // to NextAuth-related variables anywhere in the hierarchy

  // We define the header here to eliminate the need for
  // putting <Header /> at the top of every page

  // <Component /> represents the actual page content
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.GA_TRACKING_ID}');
        `}
      </Script>
      <Head>
        <title>Exeter Course Map</title>
        <meta title="description" content="The better way to pick courses" />
      </Head>
      <Header />
      <Component {...pageProps} key={router.route} />
    </SessionProvider>
  );
}

export default MyApp;
