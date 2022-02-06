import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from '../components/header';

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <title>Exeter Course Map</title>
        <meta title="description" content="The better way to pick courses" />
      </Head>
      <Header />
      <Component {...pageProps} key={router.route} />
    </>
  );
}

export default MyApp;
