import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MdExpandMore } from 'react-icons/md';

const SubRequirement = ({
  description,
  numFulfilled,
  numRequired,
}: {
  description: string;
  numFulfilled: number;
  numRequired: number;
}) => {
  const [showFulfillments, setShowFulfillments] = useState(false);

  // testing xd
  const courses: { name: string; credits: number }[] = [
    { name: 'MUS093', credits: 0.33 },
    { name: 'MUS093', credits: 0.33 },
    { name: 'MUS093', credits: 0.33 },
    { name: 'MUS093', credits: 0.33 },
    { name: 'MUS093', credits: 0.33 },
    { name: 'MUS093', credits: 0.33 },
  ];

  return (
    <div key={description} className="flex flex-col items-start gap-1">
      <h1 className="font-display text-sm text-neutral-800">{description}</h1>
      <div className="mb-1 h-2 w-full rounded-full bg-neutral-200">
        <div
          style={{
            width: `calc(100%*(${numFulfilled}/${numRequired}))`,
          }}
          className={`h-full rounded-full bg-exeter-50`}
        ></div>
      </div>
      <span
        onMouseEnter={() => setShowFulfillments(true)}
        onClick={() => setShowFulfillments(true)}
        onMouseLeave={() => setShowFulfillments(false)}
        className="relative cursor-pointer font-mono text-xs text-neutral-400 underline underline-offset-2 hover:text-exeter-200"
      >
        {numFulfilled}/{numRequired} Fulfilled
        <AnimatePresence>
          {showFulfillments && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: '-50%' }}
              animate={{ scale: 1, opacity: 1, y: '-50%' }}
              exit={{ scale: 0.8, opacity: 0, y: '-50%' }}
              transition={{
                ease: 'circOut',
                duration: 0.2,
              }}
              style={{
                transformOrigin: '-10% 50%',
              }}
              className="absolute top-1/2 left-full z-10 ml-5 w-min cursor-default rounded-lg bg-white p-3 shadow-md drop-shadow-md"
            >
              <div className="absolute top-1/2 left-1/2 right-1/2 bottom-1/2 -z-10 h-full w-[124%] -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute -left-2 top-1/2 -z-10 h-8 w-8 -translate-y-1/2 rotate-45 bg-white"></div>
              {courses.length > 0 ? (
                <>
                  <p className="whitespace-nowrap font-display text-sm text-black">
                    Courses:
                  </p>
                  {courses.map((course) => (
                    <div
                      key={course.toString()}
                      className="flex flex-row items-center gap-1 whitespace-nowrap font-mono"
                    >
                      <Link href={`/course/${course.name}`}>
                        <a className="text-sm text-neutral-400 hover:text-blue-400 hover:underline">
                          {course.name}
                        </a>
                      </Link>
                      <span className="text-xs text-neutral-600">
                        ({course.credits} credits)
                      </span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <p className="whitespace-nowrap font-[Impact] text-sm font-thin text-neutral-300">
                    No courses?
                  </p>
                  <div className="relative aspect-square w-full opacity-40 contrast-200">
                    <Image
                      src="/megamind.png"
                      layout="fill"
                      alt="Megamind sad face"
                    />
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
};

const Requirement = ({
  name,
  emoji,
  requirements,
}: {
  name: string;
  emoji: string;
  requirements: {
    description: string;
    numFulfilled: number;
    numRequired: number;
  }[];
}) => {
  const [showMoreInformation, setShowMoreInformation] = useState(false);

  const totalFulfilled = requirements.reduce(
    (acc, curr) => acc + curr.numFulfilled,
    0
  );
  const totalRequired = requirements.reduce(
    (acc, curr) => acc + curr.numRequired,
    0
  );

  return (
    <div className="flex h-min flex-col gap-2 rounded-sm border border-neutral-200 bg-neutral-100 p-4 shadow-sm dark:border-neutral-600 dark:bg-neutral-500">
      <h1 className="font-mono text-xl text-neutral-800 dark:text-neutral-100">
        {emoji} {name.toUpperCase()}
      </h1>
      <div className="h-4 w-full rounded-full bg-neutral-200 dark:bg-neutral-600">
        <div
          style={{
            width: `calc(100%*(${totalFulfilled}/${totalRequired}))`,
          }}
          className={`h-full rounded-full bg-exeter-200 dark:bg-gradient-to-r dark:from-exeter-400 dark:to-exeter-200`}
        ></div>
      </div>
      <button
        onClick={() => setShowMoreInformation(!showMoreInformation)}
        className="flex flex-row items-center gap-1 font-display text-neutral-500"
      >
        <MdExpandMore
          className={`${
            showMoreInformation ? 'rotate-0' : '-rotate-90'
          } transition-all ease-out`}
        />{' '}
        {totalFulfilled}/{totalRequired} Fulfilled
      </button>
      {showMoreInformation && (
        <>
          <div className="mx-auto my-1 h-px w-full bg-neutral-200"></div>
          <div className="flex flex-col gap-4">
            {requirements.map((requirement) => (
              <SubRequirement key={requirement.toString()} {...requirement} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Profile = () => {
  return (
    <div>
      <div className="w-full border-b border-neutral-200 bg-neutral-100 px-8 py-12 dark:border-none dark:bg-neutral-800 sm:py-20 lg:px-40">
        <div className="flex flex-row gap-4">
          <div className="aspect-square w-20 rounded-full border-2 border-black dark:border-neutral-100"></div>
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-2xl font-bold text-black dark:text-white">
              Knoddy
            </h1>
            <h2 className="font-display text-xl text-neutral-600 dark:text-neutral-400">
              knoddy@exeter.edu
            </h2>
            <h3 className="text-md font-display text-neutral-400 dark:text-neutral-500">
              4-year senior
            </h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-20 px-8 py-12 sm:py-20 lg:px-40">
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-3xl font-bold">Diploma</h1>
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <Requirement
              name="Art"
              emoji="🎨"
              requirements={[
                {
                  description: '2 credits from studio or performance courses',
                  numFulfilled: 2,
                  numRequired: 2,
                },
                {
                  description:
                    '1 additional credit & verification of at least 2 subject areas',
                  numFulfilled: 1,
                  numRequired: 1,
                },
              ]}
            />
            <Requirement
              name="Language"
              emoji="🗣️"
              requirements={[
                {
                  description: 'Language 400 or higher',
                  numFulfilled: 1,
                  numRequired: 1,
                },
              ]}
            />
            <Requirement
              name="Computer Science"
              emoji="💻"
              requirements={[
                {
                  description: 'One term credit in computer science',
                  numFulfilled: 1,
                  numRequired: 1,
                },
              ]}
            />
            <Requirement
              name="History"
              emoji="📜"
              requirements={[
                {
                  description: '3 credits from the U.S. History sequence',
                  numFulfilled: 0,
                  numRequired: 3,
                },
                {
                  description:
                    '1 credit from courses outside the western tradition',
                  numFulfilled: 1,
                  numRequired: 1,
                },
                {
                  description: '2 credits from non-U.S. History courses',
                  numFulfilled: 2,
                  numRequired: 2,
                },
              ]}
            />
            <Requirement
              name="Math"
              emoji="🧮"
              requirements={[
                {
                  description: 'Complete 1 Math course numbered 330 or higher',
                  numFulfilled: 1,
                  numRequired: 1,
                },
              ]}
            />
            <Requirement
              name="Religion"
              emoji="💭"
              requirements={[
                {
                  description: 'Complete 2 credits in Religion',
                  numFulfilled: 2,
                  numRequired: 2,
                },
              ]}
            />
            <Requirement
              name="Biology"
              emoji="🧬"
              requirements={[
                {
                  description: 'Complete 3 credits in Biology',
                  numFulfilled: 3,
                  numRequired: 3,
                },
              ]}
            />
            <Requirement
              name="Physical Science"
              emoji="🔬"
              requirements={[
                {
                  description: 'Complete 3 credits in Physics or Chemistry',
                  numFulfilled: 3,
                  numRequired: 3,
                },
              ]}
            />
            <Requirement
              name="Physical Education"
              emoji="🏃"
              requirements={[
                {
                  description: '3 credits in 9th grade',
                  numFulfilled: 3,
                  numRequired: 3,
                },
                {
                  description: '2 credits in 10th grade',
                  numFulfilled: 2,
                  numRequired: 2,
                },
                {
                  description: '2 credits in 11th grade',
                  numFulfilled: 2,
                  numRequired: 2,
                },
                {
                  description: '2 credits in 12th grade',
                  numFulfilled: 0,
                  numRequired: 2,
                },
              ]}
            />
            <Requirement
              name="English"
              emoji="📖"
              requirements={[
                {
                  description: '9 credits from the regular English sequence',
                  numFulfilled: 9,
                  numRequired: 9,
                },
                {
                  description: 'English 500 in fall term of senior year',
                  numFulfilled: 0,
                  numRequired: 1,
                },
                {
                  description: '1 additional credit from English level 500',
                  numFulfilled: 0,
                  numRequired: 1,
                },
              ]}
            />
            <Requirement
              name="Health"
              emoji="🍎"
              requirements={[
                {
                  description:
                    'Complete HHD110, HHD120, HHD240, HHD340, and HHD490',
                  numFulfilled: 4,
                  numRequired: 5,
                },
              ]}
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          <h1 className="font-display text-3xl font-bold">Courses</h1>
          <div className="flex w-full flex-row gap-4">
            <div className="flex flex-col gap-2 rounded-sm bg-neutral-100 p-4 shadow-sm dark:bg-neutral-800">
              <h1 className="font-display text-lg font-bold text-neutral-500">
                PREP YEAR
              </h1>
              <div className="flex flex-col gap-1 font-display text-lg">
                <p>CSC405 Algorithms and Software</p>
                <p>ENG100 9th grade english</p>
                <p>REL240 Among Us and Society</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-sm bg-neutral-100 p-4 shadow-sm dark:bg-neutral-800">
              <h1 className="font-display text-lg font-bold text-neutral-500">
                LOWER YEAR
              </h1>
              <div className="flex flex-col gap-1 font-display text-lg">
                <p>CSC405 Algorithms and Software</p>
                <p>ENG100 9th grade english</p>
                <p>REL240 Among Us and Society</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-sm bg-neutral-100 p-4 shadow-sm dark:bg-neutral-800">
              <h1 className="font-display text-lg font-bold text-neutral-500">
                UPPER YEAR
              </h1>
              <div className="flex flex-col gap-1 font-display text-lg">
                <p>CSC405 Algorithms and Software</p>
                <p>ENG100 9th grade english</p>
                <p>REL240 Among Us and Society</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 rounded-sm bg-neutral-100 p-4 shadow-sm dark:bg-neutral-800">
              <h1 className="font-display text-lg font-bold text-neutral-500">
                SENIOR YEAR
              </h1>
              <div className="flex flex-col gap-1 font-display text-lg">
                <p>CSC405 Algorithms and Software</p>
                <p>ENG100 9th grade english</p>
                <p>REL240 Among Us and Society</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
