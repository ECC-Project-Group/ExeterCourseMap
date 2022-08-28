import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header';
import { SessionProvider } from 'next-auth/react';
import TagManager from 'react-gtm-module';
import Script from 'next/script';

function MyApp({ Component, pageProps, router }) {
  // Google Tag Manager allows us to integrate with Google Analytics
  const tagManagerArgs = {
    gtmId: 'GTM-879S67FV90'
  };
  if (typeof window !== 'undefined') {
    TagManager.initialize(tagManagerArgs);
  }

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
