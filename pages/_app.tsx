import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header';
import { SessionProvider } from 'next-auth/react';
import TagManager from 'react-gtm-module';


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
