import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

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
  const { data: session, status } = useSession();

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
            <>
              <span>You are not signed in</span>
              <a
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault();
                  signIn();
                }}
              >
                Sign in
              </a>
            </>
          )}
          {session?.user && (
            <>
              {session.user.image && (
                <span
                  style={{ backgroundImage: `url('${session.user.image}')` }}
                />
              )}
              <span>
                <small>Signed in as</small>
                <br />
                <strong>{session.user.email ?? session.user.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </>
          )}
        </div>
      </ul>
    </header>
  );
};

export default Header;
