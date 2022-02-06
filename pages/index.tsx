import type { NextPage } from 'next';
import { Suspense, useRef } from 'react';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Material, Mesh } from 'three';
import { GLTF as GLTFThree } from 'three/examples/jsm/loaders/GLTFLoader';
import CTAButton from '../components/callToActionButton';
declare module 'three-stdlib' {
  export interface GLTF extends GLTFThree {
    nodes: Record<string, Mesh>;
    materials: Record<string, Material>;
  }
}

const Campus = () => {
  const group = useRef();
  const { nodes } = useGLTF('/models/campus.glb');
  return (
    <group ref={group} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Campus.geometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.06}
      >
        <meshPhongMaterial color="white" />
      </mesh>
    </group>
  );
};

const Home: NextPage = () => {
  useGLTF.preload('/models/campus.glb');

  return (
    <div className="overflow-x-hidden">
      <div className="flex-column flex h-[70vh] min-h-[500px] justify-center">
        <div className="absolute -z-10 h-[70vh] min-h-[500px] w-full bg-exeter">
          <Canvas
            camera={{ fov: 50, position: [0, 0, 10] }}
            className="opacity-20"
          >
            <pointLight
              intensity={1.5}
              castShadow={true}
              position={[0, 10, 0]}
            />
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
            Course planning shouldn{"'"}t be like
            <br />
            <div className="flex h-full overflow-clip">
              <span className="box-content py-2">landing a rover on Mars.</span>
            </div>
          </h1>
        </div>
      </div>
      <div className="min-h-[70vh] px-8 py-12 lg:py-36 lg:px-40">
        <div className="w-full lg:w-3/5">
          <p className="bg-gradient-to-b from-red-500 to-exeter bg-clip-text font-display text-4xl font-black text-transparent md:text-6xl">
            Find the perfect course.
          </p>
          <p className="py-8 text-2xl font-semibold text-gray-700 md:text-3xl">
            <span className="text-gray-500">
              No more scrolling through the Courses of Instruction PDF.
            </span>{' '}
            Find information about any Exeter course with close to no effort.
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
            <span className="text-gray-500">Stop fiddling with LionLinks.</span>{' '}
            View a map of all course prerequisites and see what classes you are
            eligible for.
          </p>
        </div>
        <CTAButton href="/map">See the course map</CTAButton>
      </div>
    </div>
  );
};

export default Home;
