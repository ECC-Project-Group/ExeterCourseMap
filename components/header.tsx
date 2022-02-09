import Link from 'next/link';

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
        <HeaderNavItem name="Login" href="/login" />
      </ul>
    </header>
  );
};

export default Header;
