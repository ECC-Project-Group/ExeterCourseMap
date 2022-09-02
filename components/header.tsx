import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { FaMoon, FaSun } from 'react-icons/fa';
import { HiSun, HiMoon } from 'react-icons/hi';

const HeaderNavItem = ({ name, href }: { name: string; href: string }) => {
  return (
    <li className="pl-4">
      <Link href={href}>
        <a>{name}</a>
      </Link>
    </li>
  );
};

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      className="group relative h-6 w-12 rounded-full border-2 border-white bg-white transition-all duration-500 ease-out dark:bg-neutral-600"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <div className="absolute top-0 left-0 h-full w-1/2 origin-left p-0.5 transition-all duration-500 ease-out group-active:scale-x-[1.3] dark:left-1/2 dark:origin-right">
        <div className="flex h-full w-full flex-row items-center justify-center rounded-full bg-neutral-600/30 text-black duration-500 dark:bg-neutral-800/40 dark:text-white">
          {
            {
              dark: <HiMoon className="text-lg group-active:scale-x-[0.769]" />,
              light: (
                <HiSun className="text-xl text-neutral-600 group-active:scale-x-[0.769]" />
              ),
            }[(theme === 'system' ? systemTheme : theme) ?? 'light']
          }
        </div>
      </div>
    </button>
  );
};

const Header = () => {
  // Holds information for the login state
  const { data: session } = useSession();
  const [accountVisible, setAccountVisibility] = useState(false);
  const [signInVisible, setSignInVisibility] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <header className="relative flex w-full flex-row justify-between overflow-visible bg-gradient-to-b from-exeter-400 to-exeter py-4 px-8 dark:from-transparent dark:to-transparent lg:px-40">
      <div className="absolute top-0 bottom-0 left-0 right-0 hidden origin-top scale-y-150 bg-gradient-to-b from-exeter to-neutral-800 dark:block"></div>
      <Link href="/" passHref={true}>
        <a className="z-10 font-display text-lg font-black text-white">
          EXETER COURSE MAP
        </a>
      </Link>

      <ul className="z-10 flex flex-row justify-start font-display text-white">
        <HeaderNavItem name="Courses" href="/courses" />
        <HeaderNavItem name="Maps" href="/maps" />
        <HeaderNavItem name="About" href="/about" />
        <div>
          {!session && (
            <div className="relative mx-4">
              <a
                className="cursor-pointer text-right font-display font-bold"
                onClick={() => setSignInVisibility(!signInVisible)}
              >
                Sign in
              </a>
              {signInVisible && (
                <>
                  <div
                    className="fixed top-0 left-0 z-10 h-screen w-screen bg-none"
                    onClick={() => setSignInVisibility(false)}
                  />
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'circOut', duration: 0.2 }}
                    className="absolute right-0 top-8 z-20 flex w-80 flex-col rounded-md bg-gray-200 py-2 px-3 shadow-lg dark:bg-neutral-600"
                  >
                    <p className="py-1 font-display text-gray-500 dark:text-neutral-300">
                      Sign in with...
                    </p>
                    <a
                      onClick={() => signIn('azure-ad')}
                      className="my-1 cursor-pointer rounded-md bg-slate-100 p-2 text-center font-display font-bold text-gray-600 shadow-sm transition-all hover:bg-exeter hover:text-white hover:shadow-md dark:bg-neutral-500 dark:text-white dark:hover:bg-exeter"
                    >
                      Exeter
                    </a>
                    <a
                      onClick={() => signIn('google')}
                      className="my-1 cursor-pointer rounded-md bg-slate-100 p-2 text-center font-display font-bold text-gray-600 shadow-sm transition-all hover:bg-blue-600 hover:text-white hover:shadow-md dark:bg-neutral-500 dark:text-white dark:hover:bg-blue-600"
                    >
                      Google
                    </a>
                    <div className="my-4 h-px w-full bg-gray-400" />
                    <input
                      type="text"
                      placeholder="email@example.com"
                      className="my-1 rounded-md p-2 font-display text-gray-800"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    {(!sent && (
                      <a
                        onClick={async () => {
                          setSent(true);
                          signIn('email', { email, redirect: false });
                        }}
                        className="my-1 cursor-pointer rounded-md bg-slate-100 p-2 text-center font-display font-bold text-gray-600 shadow-sm transition-all hover:bg-gray-600 hover:text-white hover:shadow-md dark:bg-neutral-500 dark:text-white dark:hover:bg-neutral-700"
                      >
                        Email
                      </a>
                    )) || (
                      <p className="my-2 text-center font-display text-sm text-gray-500">
                        Check your email for a sign in link.
                      </p>
                    )}
                  </motion.div>
                </>
              )}
            </div>
          )}
          {session?.user && (
            <div className="relative mx-4">
              <button
                className="text-right font-display font-bold"
                onClick={() => setAccountVisibility(!accountVisible)}
              >
                {session.user.name ?? session.user.email}
              </button>
              {accountVisible && (
                <>
                  <div
                    className="fixed top-0 left-0 z-10 h-screen w-screen bg-none"
                    onClick={() => setAccountVisibility(false)}
                  />
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ ease: 'circOut', duration: 0.2 }}
                    className="absolute right-0 top-8 z-20 flex h-32 w-80 flex-col rounded-md bg-gray-200 p-4 shadow-lg dark:bg-neutral-600"
                  >
                    <div className="mb-3 flex flex-row justify-between">
                      <a className="font-display text-sm font-black text-gray-700 dark:text-neutral-300">
                        EXETER COURSE MAP
                      </a>
                      <Link href="/api/auth/signout">
                        <a
                          className="rounded-lg font-display text-sm text-gray-600 dark:text-neutral-200"
                          onClick={(e) => {
                            e.preventDefault();
                            signOut();
                          }}
                        >
                          Sign out
                        </a>
                      </Link>
                    </div>
                    <div className="flex flex-row items-center">
                      <div
                        className="aspect-square w-16 text-gray-700 dark:brightness-150"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' stroke='%23707070'%3E%3Cg class='mectrl_stroke' fill='none'%3E%3Ccircle cx='32' cy='32' r='30.25' stroke-width='1.5'/%3E%3Cg transform='matrix(.9 0 0 .9 10.431 10.431)' stroke-width='2'%3E%3Ccircle cx='24.25' cy='18' r='9'/%3E%3Cpath d='M11.2 40a1 1 0 1126.1 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <div className="ml-3">
                        <h1 className="font-display font-bold text-gray-700 dark:text-white">
                          {session.user.name}
                        </h1>
                        <h2 className="font-display text-sm text-gray-500 dark:text-neutral-300">
                          {session.user.email}
                        </h2>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </div>
        <ThemeSwitch />
      </ul>
    </header>
  );
};

export default Header;
