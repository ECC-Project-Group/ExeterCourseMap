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

export function getCoursePrerequisites(courseNo: string) {
  const courses: ICourse[] = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), '/data/courses.json'), 'utf-8')
  );
  const course = courses.find((course) => course.course_no == courseNo);
  if (!course?.pre) return [[], []];
  const prereqCourse = getCourse(course.pre);
  if (!prereqCourse) return [];

  return [prereqCourse];
}
