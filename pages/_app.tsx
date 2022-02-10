import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header';
import { SessionProvider } from 'next-auth/react';

function MyApp({ Component, pageProps, router }: AppProps) {
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
