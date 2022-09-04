import Link from 'next/link';
import { useCallback, useState } from 'react';
import { getAllCourses } from '../lib/courses';
import { ICoursePartial } from '../types';
import { InferGetStaticPropsType } from 'next';
import { AiOutlineSearch } from 'react-icons/ai';
import Image from 'next/image';

const Courses = ({
  courses,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // We don't need all information about any particular course,
  // hence why we grab a partial representation
  const [results, setResults] = useState<ICoursePartial[]>(courses);

  // Update the course list when the text input is changed
  const onChange = useCallback(
    (event) => {
      const subjAbbreviations = new Map<string, string>([
        ['ANT', 'anthropology'],
        ['GRK', 'greek'],
        ['LAT', 'latin'],
        ['CSC', 'computer science'],
        ['ECO', 'economics'],
        ['ENG', 'english'],
        ['HHD', 'health'],
        ['HHD', 'health and human development'],
        ['HIS', 'history'],
        ['INT', 'integrated'],
        ['EXI', 'exeter innovation'],
        ['ARA', 'arabic'],
        ['CHI', 'chinese'],
        ['FRE', 'french'],
        ['GER', 'german'],
        ['ITA', 'italian'],
        ['JPN', 'japanese'],
        ['RUS', 'russian'],
        ['SPA', 'spanish'],
        ['MUS', 'music'],
        ['REL', 'religion'],
        ['PHY', 'physics'],
        ['BIO', 'biology'],
        ['CHE', 'chemistry'],
        ['THR', 'theater'],
      ]);

      const query: string = event.target.value;
      if (query.length) {
        setResults(
          courses.filter((course) => {
            const subject = subjAbbreviations.get(
              course.course_no.substring(0, 3)
            );
            return subject != undefined
              ? course.lt.toLowerCase().includes(query.toLowerCase()) ||
                  course.course_no
                    .toLowerCase()
                    .includes(query.toLowerCase()) ||
                  query.toLowerCase().startsWith(subject) ||
                  subject.startsWith(query.toLowerCase())
              : course.lt.toLowerCase().includes(query.toLowerCase()) ||
                  course.course_no.toLowerCase().includes(query.toLowerCase());
          })
        );
      } else {
        setResults(courses);
      }
    },
    [courses]
  );

  return (
    <div>
      <div className="bg-exeter py-16 px-8 dark:bg-neutral-800 lg:px-40">
        <h1 className="font-display text-4xl font-black text-white md:text-5xl ">
          Courses
        </h1>
      </div>
      <div className="px-8 pt-14 pb-20 lg:px-40">
        <div className="border-1 group relative mx-auto mb-8 flex h-14 w-full flex-row items-center justify-start gap-2 overflow-hidden rounded-xl border border-neutral-200 pl-5 font-display text-lg font-semibold shadow-sm dark:border-neutral-500">
          <AiOutlineSearch className="text-neutral-600 dark:text-white" />
          <input
            type="text"
            placeholder="Search for a course..."
            onChange={onChange}
            className="peer h-full w-full bg-transparent outline-none dark:text-white"
          />
          <div className="pointer-events-none absolute top-0 bottom-0 right-0 left-0 -z-10 bg-neutral-100 transition-all ease-out peer-hover:bg-neutral-50 peer-focus:bg-neutral-50 dark:bg-neutral-600 dark:peer-hover:bg-neutral-500 dark:peer-focus:bg-neutral-500"></div>
        </div>
        <div className="absolute top-24 -left-[200px] -z-20 -mt-12 rotate-[190deg] opacity-20 dark:opacity-80">
          <Image alt="Decal" src="/decal2.svg" width={3000} height={2000} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {results &&
            results.map((course) => {
              return (
                <Link
                  passHref={true}
                  href={`/course/${course.course_no}`}
                  key={course.course_no}
                >
                  <a>
                    <div className="border-1 group m-0 my-3 cursor-pointer rounded-lg border border-neutral-200 bg-neutral-50 p-4 shadow-md transition-all ease-out hover:bg-exeter hover:shadow-none dark:border-neutral-500 dark:bg-neutral-600 dark:hover:bg-neutral-500 md:m-4">
                      <h2 className="font-display font-bold text-gray-700 group-hover:text-neutral-100 dark:text-white">
                        {course.course_no}
                      </h2>
                      <h1 className="font-display text-lg group-hover:text-white dark:text-neutral-100">
                        {course.lt}
                      </h1>
                    </div>
                  </a>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Grab all courses at build-time; this cuts down on
// page load speeds
export async function getStaticProps() {
  const courses = getAllCourses();
  courses.shift(); // Don't include PEA000 (get into PEA)
  return {
    props: {
      courses: courses.map((course) => {
        return { course_no: course.course_no, lt: course.lt };
      }),
    },
  };
}

export default Courses;
