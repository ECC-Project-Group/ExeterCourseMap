import type { NextPage } from 'next';
import { Suspense, useRef } from 'react';

import CTAButton from '../components/callToActionButton';
// Typing animation for tagline
import Typewriter from 'typewriter-effect';
// React implementation of three.js
import { Canvas } from '@react-three/fiber';
// Helper functions and abstractions built using fiber
import { OrbitControls, useGLTF } from '@react-three/drei';
// Classes directly imported from the original three library
import { Material, Mesh } from 'three';
// Typedefs for the GLTF class are inconsistent across three and react-three-fiber
// Mainly used to prevent the TypeScript compiler from complaining about nonexistent props
import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader';
declare module 'three-stdlib' {
  export interface GLTF extends GLTFThree {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  }
}

// One of these strings will be placed onto the homepage
const challengingThings = [
  'landing a rover on Mars',
  'writing an eighty page essay',
  'solving a Millennium problem',
  " solving a 10x10 Rubik's cube",
];

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
  const challengingThing =
    challengingThings[Math.floor(Math.random() * challengingThings.length)];
  return (
    <div className="overflow-x-hidden">
      <div className="flex-column flex h-[70vh] min-h-[500px] justify-center">
        <div className="absolute -z-10 h-[70vh] min-h-[500px] w-full bg-exeter">
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
                delay: 70,
              }}
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "Course planning shouldn't be like " +
                      challengingThing +
                      '.'
                  )
                  .start();
              }}
            />
          </h1>
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-40">
        <div className="w-full lg:w-3/5">
          <p className="bg-gradient-to-b from-red-500 to-exeter bg-clip-text font-display text-4xl font-black text-transparent md:text-6xl">
            Find the perfect course.
          </p>
          <div className="absolute -right-[600px] -z-20 hidden h-[1000px] w-[1000px] rounded-full bg-gradient-to-bl from-red-500 to-exeter lg:block" />
          <p className="py-8 text-2xl font-semibold text-gray-700 md:text-3xl">
            <span className="text-gray-500">
              No more scrolling through the Courses of Instruction PDF.
            </span>{' '}
            &nbsp;Easily find the information and requirements on any PEA
            course.
          </p>
          <CTAButton href="/courses">Find a course</CTAButton>
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-40">
        <div className="w-full lg:w-3/5">
          <p className="bg-gradient-to-b from-red-500 to-exeter bg-clip-text pb-1 font-display text-4xl font-black text-transparent md:text-6xl">
            Know your prereqs.
          </p>
          <p className="py-8 text-2xl font-semibold text-gray-700 md:text-3xl">
            <span className="text-gray-500">Stop fiddling with LionLinks.</span>
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
