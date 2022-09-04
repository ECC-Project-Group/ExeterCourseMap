import type { NextPage } from 'next';
import Image from 'next/image';
import { Suspense, useRef } from 'react';

import CTAButton from '../components/callToActionButton';
// Typing animation for tagline
import Typewriter from 'typewriter-effect';
// React implementation of three.js
import { Canvas } from '@react-three/fiber';
// Helper functions and abstractions built using fiber
import { OrbitControls, useGLTF } from '@react-three/drei';
// Classes directly imported from the original three library
import { Mesh } from 'three';
// Typedefs for the GLTF class are inconsistent across three and react-three-fiber
// Mainly used to prevent the TypeScript compiler from complaining about nonexistent props
// import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader';
import Link from 'next/link';
import { BsFillArrowRightSquareFill } from 'react-icons/bs';

// The campus three.js element
const Campus = () => {
  const group = useRef();
  const { nodes } = useGLTF('/models/campus.glb');
  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Campus as Mesh).geometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.06}
      >
        <meshPhongMaterial color="white" />
      </mesh>
    </group>
  );
};

const Home: NextPage = () => {
  // Load the model immediately
  useGLTF.preload('/models/campus.glb');
  return (
    <div className="overflow-x-hidden">
      <div className="flex-column flex h-[55vh] min-h-[200px] justify-center sm:h-[70vh]">
        <div className="absolute -z-10 h-[55vh] min-h-[200px] w-full bg-exeter dark:bg-neutral-800 sm:h-[70vh]">
          {/* Declarative representation of the campus model */}
          <Canvas
            camera={{ fov: 50, position: [0, 0, 10] }}
            className="opacity-20"
          >
            <pointLight
              intensity={1.5}
              castShadow={true}
              position={[0, 10, 0]}
            />
            {/* Does not render the campus model until it is completely loaded */}
            <Suspense fallback={null}>
              <Campus />
              <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={0.4}
                maxPolarAngle={Math.PI / 2.8}
                minPolarAngle={Math.PI / 2.8}
                enableZoom={false}
                enablePan={false}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="pointer-events-none my-auto w-full select-none px-8 lg:px-40">
          <h1 className="font-display text-4xl font-black text-white md:text-5xl">
            <Typewriter
              options={{
                autoStart: true,
                delay: 30,
                cursor: '',
              }}
              onInit={(typewriter) => {
                typewriter.typeString('Course planning, made simple.').start();
              }}
            />
          </h1>
        </div>
      </div>
      <div className="absolute -z-50 h-full w-screen overflow-hidden">
        <div className="absolute -right-[550px] -z-50 -mt-12 rotate-1 opacity-20">
          <Image alt="Decal" src="/decal.svg" width={2800} height={1400} />
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-20">
        <div className="relative p-6">
          <div className="absolute top-0 right-0 bottom-0 left-0 -z-20 bg-exeter">
            <div className="absolute top-1/2 right-12 bottom-0 h-3/4 w-2/3 -translate-y-1/2">
              <Image layout="fill" src="/graph.svg" alt="Course map graphic" />
            </div>
          </div>
          <div className="absolute top-0 bottom-0 left-1/4 -z-10 w-3/4 bg-gradient-to-r from-exeter to-transparent"></div>
          <div className="border-1 flex flex-col gap-6 border border-white px-16 py-32">
            <h1 className="w-1/2 font-display text-6xl font-black text-white">
              Find the perfect course.
            </h1>
            <p className="w-1/2 font-display text-2xl text-neutral-200">
              Easily search for courses based on your interests and criteria.
            </p>
            <Link href="/courses">
              <a className="group">
                <div className="flex flex-row items-center gap-3 px-1 py-4 text-white">
                  <div className="relative">
                    <BsFillArrowRightSquareFill className="absolute text-2xl group-hover:animate-ping" />
                    <BsFillArrowRightSquareFill className="text-2xl" />
                  </div>
                  <span className="relative flex flex-col items-start justify-start gap-1 font-display text-xl font-bold leading-none">
                    Browse courses
                    <div className="absolute top-full h-0.5 w-0 bg-white transition-all duration-300 ease-out group-hover:w-full"></div>
                  </span>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-40">
        <div className="w-full lg:w-3/5">
          <p className="bg-gradient-to-b from-red-500 to-exeter bg-clip-text font-display text-4xl font-black text-transparent dark:from-red-200 dark:to-exeter-100 md:text-6xl">
            Know your prereqs.
          </p>
          <p className="py-8 text-2xl font-semibold text-gray-700 dark:text-white md:text-3xl">
            <span className="text-gray-500 dark:text-neutral-200">
              Stop fiddling with LionLinks.
            </span>
            &nbsp;View maps of all course prerequisites and see what classes you
            can take.
          </p>
        </div>
        <CTAButton href="/maps">See the course maps</CTAButton>
      </div>
    </div>
  );
};

export default Home;
