import Link from 'next/link';
import { BsChevronRight } from 'react-icons/bs';

// This button is used only in index.tsx
const CTAButton = ({
  href,
  children,
}: {
  href: string;
  children: JSX.Element | string;
}) => {
  return (
    <Link href={href} passHref={true}>
      <button className="group flex flex-row rounded-md bg-exeter p-3 font-display text-xl font-semibold text-white transition-all hover:bg-red-700 ">
        {children}{' '}
        <BsChevronRight className="my-auto mx-2 transition-all group-hover:translate-x-2" />
      </button>
    </Link>
  );
};

export default CTAButton;
