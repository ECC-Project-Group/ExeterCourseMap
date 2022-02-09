import fs from 'fs';
import path from 'path';
import { ICourse } from '../types';

export function getAllCourses() {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  return courses;
}

export function getCourse(courseNo: string) {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);
  return course;
}

// NOTE: This function will always return an array with a length of 1 due to courses.json course shape.
export function getCoursePrerequisites(courseNo: string) {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);
  if (!course?.pre) return [];
  const prereqCourse = getCourse(course.pre);
  if (!prereqCourse) return [];

  return [prereqCourse];
}
