/* eslint-disable @next/next/no-script-in-document */
import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';
import useDarkMode from '../hooks/toggleDarkMode';
import { FaMoon, FaSun } from 'react-icons/fa';

const DarkThemeToggleIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);
  return (
    <span onClick={handleMode}>
      {darkTheme ? (
        <FaSun size="24" className="top-navigation-icon" />
      ) : (
        <FaMoon size="24" className="top-navigation-icon" />
      )}
    </span>
  );
};

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        {/* <Script strategy="beforeInteractive" id="dark-mode-checker">
          {`
            console.log("dark mode selector up and running");
            // initial check to see if there is a config for dark-theme
            // if not, it will match the variable to the configuration theme.
            if (window.localStorage.getItem('dark-theme') == null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                console.log("dark mode detected at first launch, no previously saved profiles");
                window.localStorage.setItem('dark-theme', true);
            }
            else if (window.localStorage.getItem('dark-theme') == null && !window.matchMedia('(prefers-color-scheme: dark)').matches) {
                console.log("light mode detected at first launch, no previously saved profiles");
                window.localStorage.setItem('dark-theme', false);
            }
            else {
                console.log("previously saved theme");
            }
            `}
        </Script> */}
      </body>
    </Html>
  );
}
