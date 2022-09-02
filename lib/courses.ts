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

// Grabs all courses from these subjects - pass in a set of three-character subject strings
export function getAllCoursesFrom(subjects: Set<string>) {
  const allCourses = getAllCourses();
  const subjCourses: ICourse[] = Array<ICourse>();
  for (const course of allCourses) {
    if (subjects.has(course.subj) || course.course_no == 'PEA000') {
      subjCourses.push(course);
    }
    // Exception - history 314 requires Latin 220, so we include all Latin courses 220 and under
    else if (subjects.has('HIS')) {
      if (
        [
          'LAT110',
          'LAT120',
          'LAT130',
          'LATTR1',
          'LATTR2',
          'LAT210',
          'LAT220',
        ].includes(course.course_no)
      )
        subjCourses.push(course);
    }
    // Exception - CS 405 and 205 require math 12T
    else if (subjects.has('CSC')) {
      if (course.course_no == 'MAT12T') subjCourses.push(course);
    }
    // Exception - PHY 440 requires BIO 230, PHY 470 requires one year of chem
    else if (subjects.has('PHY')) {
      if (
        [
          'BIO230',
          'BIO220',
          'BIO210',
          'CHE310',
          'CHE320',
          'CHE330',
          'CHE411',
          'CHE421',
          'CHE431',
        ].includes(course.course_no)
      )
        subjCourses.push(course);
    }
  }
  return subjCourses;
}

// Gets a course by its course number / id
export function getCourse(courseNo: string) {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);
  return course;
}

// Returns all prerequisites and corequisites of a given course.
// Return two arrays - first array is prerequisites, second array is corequisites
export function getCourseRequirements(courseNo: string) {
  const reqs: ICourse[][] = [[], []];
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);

  // Empty prerequisites/corequisites
  if (!course?.pre) return reqs;
  const str = course?.pre;
  let i = 0;
  // Get prerequisites
  while (i < str.length && str[i] != '/') {
    const prereqCourse = getCourse(str.substring(i, i + 6));
    if (prereqCourse) reqs[0].push(prereqCourse);
    i += 6;
    if (str[i] == '|') i++;
    if (str[i] == '/') break;
  }
  // Get corequisites
  if (i < str.length && str[i] == '/') {
    i++;
    while (i < str.length) {
      const coreqCourse = getCourse(str.substring(i, i + 6));
      if (coreqCourse) reqs[1].push(coreqCourse);
      i += 7;
    }
  }

  return reqs;
}
