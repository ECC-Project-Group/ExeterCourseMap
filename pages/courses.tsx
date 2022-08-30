import Link from 'next/link';
import { useCallback, useState } from 'react';
import { getAllCourses } from '../lib/courses';
import { ICoursePartial } from '../types';
import { InferGetStaticPropsType } from 'next';
import { AiOutlineSearch } from 'react-icons/ai';

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
                  query.toLowerCase().startsWith(subject)
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
      <div className="bg-exeter px-8 pt-24 pb-14 lg:px-40">
        <h1 className="font-display text-4xl font-black text-white md:text-5xl ">
          Courses
        </h1>
      </div>
      <div className="px-8 pt-14 pb-20 lg:px-40">
        <div className="mx-auto mb-8 flex h-14 w-full flex-row items-center justify-start gap-2 rounded-xl bg-neutral-100 pl-5 font-display text-lg font-semibold outline outline-1 outline-neutral-200 transition-all ease-out hover:bg-neutral-50 focus:bg-neutral-50">
          <AiOutlineSearch className="text-neutral-600" />
          <input
            type="text"
            placeholder="Search for a course..."
            onChange={onChange}
            className="h-full w-full bg-transparent outline-none"
          />
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
                  <div className="group m-0 my-3 cursor-pointer rounded-lg bg-gray-100 p-4 outline outline-1 outline-neutral-200 transition-all ease-out hover:bg-exeter md:m-4">
                    <h2 className="font-display font-bold text-gray-700 group-hover:text-neutral-100">
                      {course.course_no}
                    </h2>
                    <h1 className="font-display text-lg group-hover:text-white">
                      {course.lt}
                    </h1>
                  </div>
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
