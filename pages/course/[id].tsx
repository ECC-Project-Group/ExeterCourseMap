import { InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Elements } from 'react-flow-renderer';
import { ElkNode } from 'elkjs';
import {
  getAllCourses,
  getCourse,
  getCourseRequirements,
} from '../../lib/courses';
import { layoutElements, renderElements } from '../../lib/generateLayout';
import { event } from '../../lib/gtag';
import { ICourse } from '../../types';
import { server } from '../../lib/server';
import { MdChecklist } from 'react-icons/md';
import { BsPerson } from 'react-icons/bs';
import ExpandableText from '../../components/expandableText';
import {
  CourseInfoPopupObject,
  TransitionWrapper,
} from '../../components/courseInfoPopup';

const CoursePage = ({
  params,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  // initialPrereqs maps each course id to its prereqs
  // initialDescriptions maps each course id to its description
  // initialTitles maps each course id to its full title
  // initialEli maps each course id to its eligibility requirements
  // initialPrereqFull maps each course id to its COI description
  const {
    course,
    initialPrereqs,
    initialCoreqs,
    initialDescriptions,
    initialTitles,
    initialEli,
    initialPrereqFull,
  }: {
    course: ICourse;
    initialPrereqs: Record<string, ICourse[]>;
    initialCoreqs: Record<string, ICourse[]>;
    initialDescriptions: Record<string, string | undefined>;
    initialTitles: Record<string, string | undefined>;
    initialEli: Record<string, string | undefined>;
    initialPrereqFull: Record<string, string | undefined>;
  } = params;

  // GA event for when a course is viewed
  useEffect(() => {
    event({
      action: 'view_course',
      category: 'general',
      label: course.course_no,
      value: 1,
    });
  }, [course.course_no]);

  // Courses whose requirements have already been loaded
  const initialReqsLoaded = new Set<string>();
  initialReqsLoaded.add(course.course_no);
  const [reqsLoaded, setReqsLoaded] = useState<Set<string>>(initialReqsLoaded);

  const [prereqs, setPrereqs] =
    useState<Record<string, ICourse[]>>(initialPrereqs);
  const [coreqs, setCoreqs] =
    useState<Record<string, ICourse[]>>(initialCoreqs);
  const [titles, setTitles] =
    useState<Record<string, string | undefined>>(initialTitles);
  const [descriptions, setDescriptions] =
    useState<Record<string, string | undefined>>(initialDescriptions);
  const [eli, setEli] =
    useState<Record<string, string | undefined>>(initialEli);
  const [prereqFull, setPrereqFull] =
    useState<Record<string, string | undefined>>(initialPrereqFull);

  const [graph, setGraph] = useState<ElkNode>();
  const [elements, setElements] = useState<Elements>([]);

  // Relayout the chart when prereqs changes
  useEffect(() => {
    async function main() {
      const parsedGraph = await layoutElements(prereqs, coreqs, false);
      const elements = renderElements(parsedGraph, false);
      setGraph(parsedGraph);
      setElements(elements);
    }
    main();
  }, [prereqs, coreqs]);

  const [currentlyHoveredId, setCurrentlyHoveredId] = useState<string>('');
  // Re-render chart
  useEffect(() => {
    if (graph) {
      const elements = renderElements(graph, false, currentlyHoveredId);
      setElements(elements);
    }
  }, [graph, currentlyHoveredId]);

  const {
    nodeHoverCallback,
    nodeUnhoverCallback,
    nodeRightClickCallback,
    paneClickCallback,
    nodeClickCallback,
    courseInfoPopupParams,
    coords,
    CourseInfoPopup,
  } = CourseInfoPopupObject({
    setCurrentlyHoveredId,
    titles,
    descriptions,
    eli,
    prereqFull,
  });

  // Advances to the next level of requirements - called when "More Prereqs" is clicked
  const getMoreReqs = async () => {
    // Get the requirements for the last layers of prereqs and coreqs
    const prereqsToWrite: Record<string, ICourse[]> = { ...prereqs };
    const coreqsToWrite: Record<string, ICourse[]> = { ...coreqs };

    // Don't load requirements for courses whose requirements have already been loaded
    const currReqsLoaded = reqsLoaded;

    // Keep track of newly-added courses
    const newCourses: Set<string> = new Set<string>();

    // Add both the prereqs and coreqs of the last layer of prereqs
    for (const [base] of Object.entries(prereqs)) {
      if (currReqsLoaded.has(base)) continue; // That means base isn't in the last layer of prereqs
      const res = await fetch(`${server}/api/prereqs/${base}`);
      const newReqs: ICourse[][] = await res.json();
      prereqsToWrite[base] = newReqs[0]; // Prereqs of prereqs

      for (const newPrereq of newReqs[0]) {
        // Avoids issues when two branches lead to the same requirements
        if (!(newPrereq.course_no in prereqsToWrite)) {
          prereqsToWrite[newPrereq.course_no] = [];
          newCourses.add(newPrereq.course_no);
        }
      }
      coreqsToWrite[base] = newReqs[1]; // Coreqs of prereqs
      for (const newCoreq of newReqs[1]) {
        if (!(newCoreq.course_no in coreqsToWrite)) {
          coreqsToWrite[newCoreq.course_no] = [];
          newCourses.add(newCoreq.course_no);
        }
      }
      currReqsLoaded.add(base);
    }
    // Do the same for the coreqs
    for (const [base] of Object.entries(coreqs)) {
      if (currReqsLoaded.has(base)) continue;
      const res = await fetch(`${server}/api/prereqs/${base}`);
      const newReqs: ICourse[][] = await res.json();
      prereqsToWrite[base] = newReqs[0]; // Prereqs of coreqs
      for (const newPrereq of newReqs[0]) {
        if (!(newPrereq.course_no in prereqsToWrite)) {
          prereqsToWrite[newPrereq.course_no] = [];
          newCourses.add(newPrereq.course_no);
        }
      }
      coreqsToWrite[base] = newReqs[1]; // Coreqs of coreqs
      for (const newCoreq of newReqs[1]) {
        if (!(newCoreq.course_no in coreqsToWrite)) {
          coreqsToWrite[newCoreq.course_no] = [];
          newCourses.add(newCoreq.course_no);
        }
      }
      currReqsLoaded.add(base);
    }
    setPrereqs(prereqsToWrite);
    setCoreqs(coreqsToWrite);
    setReqsLoaded(currReqsLoaded);

    // Load course info for all new courses
    const titlesToWrite: Record<string, string | undefined> = { ...titles };
    const descriptionsToWrite: Record<string, string | undefined> = {
      ...descriptions,
    };
    const eliToWrite: Record<string, string | undefined> = { ...eli };
    const prereqFullToWrite: Record<string, string | undefined> = {
      ...prereqFull,
    };

    for (const courseNo of newCourses) {
      const res = await fetch(`${server}/api/course_info/${courseNo}`);
      const course: ICourse = await res.json();
      titlesToWrite[courseNo] = course.lt;
      descriptionsToWrite[courseNo] = course.desc;
      eliToWrite[courseNo] = course.eli;
      prereqFullToWrite[courseNo] = course.prereq_full;
    }
    setTitles(titlesToWrite);
    setDescriptions(descriptionsToWrite);
    setEli(eliToWrite);
    setPrereqFull(prereqFullToWrite);
  };

  // Style for ReactFlow component
  const reactFlowStyle = {
    background: 'rgb(35, 35, 35)',
    minHeight: '400px',
  };

  return (
    <div>
      <div className="bg-exeter px-8 pt-20 pb-20 dark:bg-neutral-800 lg:px-40">
        <h1 className="font-display text-2xl text-gray-300 md:text-3xl">
          {course.course_no}
        </h1>
        <h1 className="mt-2 font-display text-4xl font-black text-white md:text-5xl ">
          {course.lt}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-16 px-8 pt-14 pb-20 md:grid-cols-5 lg:px-40">
        <div className="flex flex-col gap-8 md:col-span-2">
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-black text-gray-700 dark:text-white">
              Information
            </h1>
            <div className="text-md grid grid-cols-2 outline outline-1 outline-neutral-300 dark:bg-exeter dark:text-neutral-100 dark:outline-exeter-400 [&>*]:p-3 [&>div>p:nth-child(1)]:font-bold [&>*:nth-child(even)]:bg-neutral-100 dark:[&>*:nth-child(even)]:bg-exeter-600">
              <div className="col-span-2 grid grid-cols-2">
                <p className="flex flex-row items-center gap-2 font-mono">
                  <BsPerson />
                  ELIGIBILITY
                </p>
                <p>{course.eli || 'All students'}</p>
              </div>
              <div className="col-span-2 grid grid-cols-2">
                <p className="flex flex-row items-center gap-2 font-mono">
                  <MdChecklist />
                  PRE/CO-REQUISITES
                </p>
                <p>{course.prereq_full || 'None'}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="font-display text-3xl font-black text-gray-700 dark:text-white">
              Description
            </h1>
            <ExpandableText
              className="font-display text-lg leading-8 text-gray-900 dark:text-neutral-100"
              text={course.desc}
            />
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="flex justify-between">
            <h1 className="font-display text-3xl font-black text-gray-700 dark:text-white">
              Requirements
            </h1>
            <button
              className="z-10 m-2 rounded-md bg-gray-700 p-2 font-display text-sm font-bold text-white shadow-lg transition duration-150 ease-out hover:bg-gray-600 active:translate-y-1 dark:bg-exeter-500 dark:outline dark:outline-1 dark:outline-exeter-300 dark:hover:bg-exeter-400"
              onClick={getMoreReqs}
            >
              More Requirements
            </button>
          </div>
          <div className="h-full">
            <ReactFlow
              className="mt-4 cursor-move rounded-lg shadow-md"
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              selectNodesOnDrag={false}
              elements={elements}
              style={reactFlowStyle}
              onNodeMouseEnter={nodeHoverCallback}
              onNodeMouseLeave={nodeUnhoverCallback}
              onNodeContextMenu={nodeRightClickCallback}
              onElementClick={nodeClickCallback}
              onPaneClick={paneClickCallback}
              panOnScroll={true}
            >
              <Background color="#858585" />
            </ReactFlow>
          </div>
          <TransitionWrapper
            courseInfoPopupParams={courseInfoPopupParams}
            coords={coords}
          >
            <CourseInfoPopup />
          </TransitionWrapper>
        </div>
      </div>
    </div>
  );
};

// Generate routes for each course at build-time
export async function getStaticPaths() {
  const courses = getAllCourses();

  const paths = courses
    .filter((course) => course.course_no !== 'PEA000')
    .map((course) => {
      return {
        params: { id: course.course_no },
      };
    });

  return { paths, fallback: false };
}

// Grab all necessary information for each course page at build-time
// (Eliminates the need for doing a database lookup on page load)
export async function getStaticProps({ params }: { params: { id: string } }) {
  const course = getCourse(params.id);

  // Load prereqs/coreqs
  const firstReqs = getCourseRequirements(params.id);
  const initialPrereqs: Record<string, ICourse[]> = {};
  const initialCoreqs: Record<string, ICourse[]> = {};

  initialPrereqs[params.id] = firstReqs[0];
  initialCoreqs[params.id] = firstReqs[1];

  for (const prereq of firstReqs[0]) {
    initialPrereqs[prereq.course_no] = [];
    initialCoreqs[prereq.course_no] = [];
  }
  for (const coreq of firstReqs[1]) {
    initialPrereqs[coreq.course_no] = [];
    initialCoreqs[coreq.course_no] = [];
  }

  // Load detailed course info
  const initialTitles: Record<string, string | undefined> = {}; // Long titles
  const initialDescriptions: Record<string, string | undefined> = {}; // Descriptions
  const initialEli: Record<string, string | undefined> = {}; // Eligibility requirements
  const initialPrereqFull: Record<string, string | undefined> = {}; // COI description
  initialDescriptions[params.id] = course?.desc;
  initialTitles[params.id] = course?.lt;
  initialEli[params.id] = course?.eli;
  initialPrereqFull[params.id] = course?.prereq_full;
  for (const prereq of firstReqs[0]) {
    // Load this data for each prereq
    initialDescriptions[prereq.course_no] = prereq.desc;
    initialTitles[prereq.course_no] = prereq.lt;
    initialEli[prereq.course_no] = prereq.eli;
    initialPrereqFull[prereq.course_no] = prereq.prereq_full;
  }
  for (const coreq of firstReqs[1]) {
    // Load this data for each coreq
    initialDescriptions[coreq.course_no] = coreq.desc;
    initialTitles[coreq.course_no] = coreq.lt;
    initialEli[coreq.course_no] = coreq.eli;
    initialPrereqFull[coreq.course_no] = coreq.prereq_full;
  }

  return {
    props: {
      params: {
        course: course,
        initialPrereqs: initialPrereqs,
        initialCoreqs: initialCoreqs,
        initialDescriptions: initialDescriptions,
        initialTitles: initialTitles,
        initialEli: initialEli,
        initialPrereqFull: initialPrereqFull,
      },
    },
  };
}

export default CoursePage;
