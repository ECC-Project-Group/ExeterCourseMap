import Link from 'next/link';
import { useCallback, useState } from 'react';
import { getAllCourses } from '../lib/courses';
import { ICoursePartial } from '../types';
import { InferGetStaticPropsType } from 'next';

const Courses = ({
  courses,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // We don't need all information about any particular course,
  // hence why we grab a partial representation
  const [results, setResults] = useState<ICoursePartial[]>(courses);

  // Update the course list when the text input is changed
  const onChange = useCallback(
    (event) => {
      const query: string = event.target.value;
      if (query.length) {
        setResults(
          courses.filter((course) => {
            return (
              course.lt.toLowerCase().includes(query.toLowerCase()) ||
              course.course_no.toLowerCase().includes(query.toLowerCase())
            );
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
        <input
          type="text"
          placeholder="Find a course..."
          onChange={onChange}
          className="mx-auto mb-8 h-14 w-full rounded-lg bg-gray-100 p-4 font-display shadow-sm"
        />
        <div className="grid grid-cols-1 md:grid-cols-2">
          {results &&
            results.map((course) => {
              return (
                <Link
                  passHref={true}
                  href={`/course/${course.course_no}`}
                  key={course.course_no}
                >
                  <div className="m-0 my-3 cursor-pointer rounded-lg bg-gray-100 p-4 shadow-md transition-all hover:-translate-y-1 md:m-4">
                    <h2 className="font-display font-bold text-gray-700">
                      {course.course_no}
                    </h2>
                    <h1 className="font-display text-lg">{course.lt}</h1>
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
