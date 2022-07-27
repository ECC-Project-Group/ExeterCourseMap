import fs from 'fs';
import path from 'path';
import { ICourse } from '../types';

// Grabs all courses
export function getAllCourses() {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  return courses;
}

// Gets a course by its course number / id
export function getCourse(courseNo: string) {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);
  return course;
}

// Returns all prerequisites of a given course.
// Return two arrays - first array is prerequisites, second array is corequisites
export function getCoursePrerequisites(courseNo: string) {
  const prereqs : ICourse[][] = [[], []];
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);

  // Empty prerequisites/corequisites
  if (!course?.pre) return prereqs;

  const str = course?.pre;
  let i = 0;
  // Get prerequisites
  while (str[i] != "/") {
    const prereqCourse = getCourse(str.substring(i, i + 6));
    if (prereqCourse) prereqs[0].push(prereqCourse);
    i += 7;
  }
  if (str[i] == "/") {
    i++;
    while (i < str.length) {
      const prereqCourse = getCourse(str.substring(i, i + 6));
      if (prereqCourse) prereqs[1].push(prereqCourse);
      i += 7;
    }
  }

  return prereqs;
}
