interface ICourse {
  dept: string;
  subj: string;
  lvl: string;
  course_no: string;
  st: string;
  lt: string;
  desc: string;
  eli: null | string;
  pre: null | string;
}

interface ICoursePartial {
  course_no: string;
  lt: string;
}

export type { ICourse, ICoursePartial };
