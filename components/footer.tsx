import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="w-full">
      <div className="flex w-full items-start justify-between bg-neutral-800 px-8 py-12 lg:px-40">
        <div className="flex flex-col justify-start gap-2">
          <h1 className="font-display text-2xl font-black text-white">
            EXETER COURSE MAP
          </h1>
          <p className="flex flex-row items-center justify-start gap-2 font-display text-neutral-300">
            Powered by{' '}
            <Image
              alt="Vercel"
              src="/vercel-logotype-light.svg"
              width={80}
              height={20}
            />
          </p>
        </div>
        <div className="flex flex-col justify-start gap-2 text-right">
          <Link href="/">
            <a className="font-display text-xl text-neutral-300">Home</a>
          </Link>
          <Link href="/courses">
            <a className="font-display text-xl text-neutral-300">Courses</a>
          </Link>
          <Link href="/maps">
            <a className="font-display text-xl text-neutral-300">Maps</a>
          </Link>
        </div>
      </div>
      <div className="flex w-full items-center justify-between bg-neutral-700 px-8 py-6 lg:px-40">
        <p className="font-display text-sm text-white">
          © Exeter Computing Club
        </p>
        <div className="flex flex-row justify-start gap-2">
          <Link href="https://github.com/ECC-Project-Group">
            <a>
              <Image
                alt="GitHub"
                src="/github-mark.svg"
                width={30}
                height={30}
              />
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
