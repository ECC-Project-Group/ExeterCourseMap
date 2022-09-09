import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import Footer from '../components/footer';
import Header from '../components/header';
import { pageview } from '../lib/gtag';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  // Google Tag Manager allows us to integrate with Google Analytics
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
      <ThemeProvider attribute="class">
        <div className="min-h-[calc(100vh-316px)]">
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
          `}
          </Script>
          <Head>
            <title>Exeter Course Map</title>
            <meta
              title="description"
              content="The better way to pick courses"
            />
          </Head>
          <Header />
          <Component {...pageProps} key={router.route} />
        </div>
        <Footer />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default MyApp;
