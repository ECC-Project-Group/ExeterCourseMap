import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const HeaderNavItem = ({ name, href }: { name: string; href: string }) => {
  return (
    <li className="pl-4">
      <Link href={href}>
        <a>{name}</a>
      </Link>
    </li>
  );
};

const Header = () => {
  const { data: session } = useSession();
  const [accountVisible, setAccountVisibility] = useState(false);

  return (
    <header className="absolute flex w-full flex-row justify-between bg-none py-4 px-8 lg:px-40">
      <Link href="/" passHref={true}>
        <a className="font-display text-lg font-black text-white">
          EXETER COURSE MAP
        </a>
      </Link>

      <ul className="flex flex-row justify-start font-display text-white">
        <HeaderNavItem name="Courses" href="/courses" />
        <HeaderNavItem name="Map" href="/map" />
        <div>
          {!session && (
            <a
              className="ml-4 cursor-pointer rounded-lg bg-red-400 px-4 py-2 font-bold text-white"
              onClick={() => signIn('azure-ad')}
            >
              Sign in
            </a>
          )}
          {session?.user && (
            <div className="relative mx-4">
              <button
                className="text-right font-display font-bold"
                onClick={() => setAccountVisibility(!accountVisible)}
              >
                {session.user.name}
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
                    className="absolute right-0 top-8 z-20 flex h-32 w-80 flex-col bg-gray-200 p-4 shadow-lg"
                  >
                    <div className="mb-3 flex flex-row justify-between">
                      <a className="font-display text-sm font-black text-gray-700">
                        EXETER COURSE MAP
                      </a>
                      <Link href="/api/auth/signout">
                        <a
                          className="rounded-lg font-display text-sm text-slate-600"
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
                        className="aspect-square w-16 text-gray-700"
                        style={{
                          backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' stroke='%23707070'%3E%3Cg class='mectrl_stroke' fill='none'%3E%3Ccircle cx='32' cy='32' r='30.25' stroke-width='1.5'/%3E%3Cg transform='matrix(.9 0 0 .9 10.431 10.431)' stroke-width='2'%3E%3Ccircle cx='24.25' cy='18' r='9'/%3E%3Cpath d='M11.2 40a1 1 0 1126.1 0'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }}
                      />
                      <div className="ml-3">
                        <h1 className="font-display font-bold text-gray-700">
                          {session.user.name}
                        </h1>
                        <h2 className="font-display text-sm text-gray-500">
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
      </ul>
    </header>
  );
};

export default Header;
