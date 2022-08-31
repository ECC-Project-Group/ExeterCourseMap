// Matches the schema Eric made
/**
 * dept: Course department
 * subj: Subject
 * lvl: Course level
 * course_no: Course ID
 * st: Shortened name
 * lt: Long name
 * desc: Description
 * eli: Eligibility requirements
 * pre: Prerequisite(s)
 */
interface ICourse {
  dept: string;
  subj: string;
  lvl: string;
  course_no: string;
  st: string;
  lt: string;
  desc: string;
  eli: string;
  pre: null | string;
  prereq_full: string;
}

// Used in the search page to free up memory
interface ICoursePartial {
  course_no: string;
  lt: string;
}

export type { ICourse, ICoursePartial };
