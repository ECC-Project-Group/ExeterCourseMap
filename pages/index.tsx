import type { NextPage } from 'next';
import Image from 'next/image';
import { Suspense, useRef } from 'react';

import CTAButton from '../components/callToActionButton';
// Typing animation for tagline
import Typewriter from 'typewriter-effect';
// React implementation of three.js
import { Canvas } from '@react-three/fiber';
// Helper functions and abstractions built using fiber
import {
  BakeShadows,
  MeshReflectorMaterial,
  OrbitControls,
  useGLTF,
} from '@react-three/drei';
// Classes directly imported from the original three library
import { Mesh, PCFSoftShadowMap } from 'three';
// Typedefs for the GLTF class are inconsistent across three and react-three-fiber
// Mainly used to prevent the TypeScript compiler from complaining about nonexistent props
// import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader';
import Link from 'next/link';
import { BsFillArrowRightSquareFill } from 'react-icons/bs';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// The campus three.js element
const Campus = () => {
  const group = useRef();
  const { nodes } = useGLTF('/models/campus.glb') as unknown as GLTF & {
    nodes: {
      Campus166: THREE.Mesh;
    };
  };

  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={(nodes.Campus166 as Mesh).geometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={1}
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
      <div className="flex-column relative flex h-[65vh] min-h-[200px] justify-center sm:h-[80vh]">
        <div className="absolute -z-10 h-[65vh] min-h-[200px] w-full bg-exeter dark:bg-neutral-800 sm:h-[80vh]">
          {/* Declarative representation of the campus model */}
          <Canvas
            camera={{ fov: 50, position: [0, 0, 180] }}
            dpr={[1.5, 1]}
            shadows={{ type: PCFSoftShadowMap }}
            gl={{ antialias: true }}
            className="opacity-20"
          >
            <pointLight
              intensity={1.5}
              castShadow={true}
              shadow-mapSize={[1024, 2048]}
              position={[0, 200, 0]}
            />
            <ambientLight intensity={0.15} />
            <mesh
              position={[0, -0.15, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              receiveShadow
            >
              <planeGeometry args={[1200, 1200]} />
              <MeshReflectorMaterial
                blur={[400, 100]}
                resolution={1024}
                mixBlur={1}
                mixStrength={15}
                depthScale={1}
                minDepthThreshold={0.85}
                color="#1f1f1f"
                metalness={0.6}
                roughness={1}
                refractionRatio={0.95}
                mirror={1}
                alphaWrite={false}
              />
            </mesh>
            <fog attach="fog" args={['#9A1D2E', 100, 500]} />
            {/* Does not render the campus model until it is completely loaded */}
            <Suspense fallback={null}>
              <Campus />
              <BakeShadows />
              <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={0.4}
                maxPolarAngle={Math.PI / 2.8}
                minPolarAngle={Math.PI / 2.8}
                // position={[0, 0, 200]}
                enableZoom={false}
                enablePan={false}
              />
            </Suspense>
          </Canvas>
        </div>
        <div className="pointer-events-none my-auto w-full select-none px-8 pb-40 sm:pb-0 lg:px-40">
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
        <div className="absolute bottom-0 flex w-full flex-col gap-8 overflow-hidden bg-gradient-to-b from-transparent to-exeter/30 px-8 py-8 lg:px-40">
          <div className="absolute top-0 bottom-0 left-0 right-0 -z-10 backdrop-blur-3xl backdrop-brightness-90 gradient-mask-t-0"></div>
          <div className="top-0 h-[0.05rem] w-full place-self-start bg-white bg-opacity-50"></div>
          <div className="absolute right-8 top-12 hidden aspect-[857/928] w-60 sm:block lg:right-40">
            <Image src="/lion.png" layout="fill" alt="Exeter lion" />
          </div>
          <div className="flex flex-row gap-8 md:gap-24">
            <div className="flex flex-col items-start">
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                450<span className="text-neutral-400">+</span>
              </h1>
              <p className="font-mono text-lg text-neutral-300">Courses</p>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                19
              </h1>
              <p className="font-mono text-lg text-neutral-300">Sub-maps</p>
            </div>
            <div className="flex flex-col items-start">
              <h1 className="font-display text-2xl font-bold text-white md:text-3xl">
                1000<span className="text-neutral-400">%</span>
              </h1>
              <p className="font-mono text-lg text-neutral-300">Awesome</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -z-50 h-full w-screen overflow-hidden">
        <div className="absolute -right-[550px] -z-50 -mt-12 rotate-1 opacity-20 dark:opacity-80">
          <Image alt="Decal" src="/decal.svg" width={2800} height={1400} />
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-20">
        <div className="relative p-4 md:p-6">
          <div className="absolute top-0 right-0 bottom-0 left-0 -z-20 bg-exeter">
            <div className="absolute top-0 left-1/2 right-12 bottom-0 h-1/2 w-2/3 -translate-x-1/2 md:left-auto md:top-1/2 md:h-3/4 md:translate-x-0 md:-translate-y-1/2">
              <Image layout="fill" src="/graph.svg" alt="Course map graphic" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 -z-10 h-1/2 w-full bg-gradient-to-t from-exeter to-transparent md:top-0 md:left-1/4 md:right-auto md:h-auto md:w-3/4 md:bg-gradient-to-r"></div>
          <div className="border-1 flex flex-col justify-end gap-3 border border-white px-8 pb-8 pt-48 md:h-auto md:justify-center md:gap-6 md:px-16 md:py-32">
            <h1 className="font-display text-4xl font-black text-white md:w-1/2 md:text-5xl">
              Find the perfect course.
            </h1>
            <p className="font-display text-2xl text-neutral-200 md:w-1/2">
              Easily search for courses based on your interests and criteria.
            </p>
            <Link href="/courses">
              <a className="group">
                <div className="flex flex-row items-center gap-3 text-white">
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
