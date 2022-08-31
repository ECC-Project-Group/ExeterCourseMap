import { useRouter } from 'next/router';
import { useEffect } from 'react';

const PEA000 = () => {
  const router = useRouter();

  useEffect(() => {
    // Come to P-E-A song
    router.push('https://www.youtube.com/watch?v=rsIHm8EgOvk');
  });

  return <></>;
};

export default PEA000;
