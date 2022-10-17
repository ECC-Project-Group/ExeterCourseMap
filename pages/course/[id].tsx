import { ElkNode } from 'elkjs/lib/main';
import { InferGetStaticPropsType } from 'next';
import { useEffect, useState } from 'react';
import ReactFlow, { Background, Edge, Node } from 'react-flow-renderer';
import { BsPerson } from 'react-icons/bs';
import { MdChecklist } from 'react-icons/md';
import {
  CourseInfoPopupObject,
  TransitionWrapper,
} from '../../components/courseInfoPopup';
import ExpandableText from '../../components/expandableText';
import {
  getAllCourses,
  getCourse,
  getCourseRequirements,
} from '../../lib/courses';
import { layoutElements, renderElements } from '../../lib/generateLayout';
import { event } from '../../lib/gtag';
import { ICourse } from '../../types';

const CoursePage = ({
      params,
    }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // prereqs maps each course id to its prereqs
  // descriptions maps each course id to its description
  // titles maps each course id to its full title
  // eliReqs maps each course id to its eligibility requirements
  // prereqsFull maps each course id to its COI prereq description
  const {
    course,
    prereqs,
    coreqs,
    descriptions,
    titles,
    eliReqs,
    prereqsFull,
  }: {
    course: ICourse;
    prereqs: Record<string, ICourse[]>;
    coreqs: Record<string, ICourse[]>;
    descriptions: Record<string, string | undefined>;
    titles: Record<string, string | undefined>;
    eliReqs: Record<string, string | undefined>;
    prereqsFull: Record<string, string | undefined>;
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

  const [graph, setGraph] = useState<ElkNode>();
  // const [elements, setElements] = useState<Elements>([]);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Relayout the chart when prereqs changes
  useEffect(() => {
    async function main() {
      const parsedGraph = await layoutElements(prereqs, coreqs, false);
      const { nodes, edges } = await renderElements(parsedGraph, true);
      setGraph(parsedGraph);
      // setElements(newElements);
      setNodes(nodes);
      setEdges(edges);
    }
    main();
  }, [prereqs, coreqs]);

  const [currentlyHoveredId, setCurrentlyHoveredId] = useState<string>('');
  // Re-render chart
  useEffect(() => {
    if (graph) {
      const { nodes, edges } = renderElements(graph, true, currentlyHoveredId);
      // setElements(newElements);
      setNodes(nodes);
      setEdges(edges);
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
    eliReqs,
    prereqsFull,
  });

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
            <div className="text-md border-1 grid grid-cols-2 border border-neutral-300 dark:border-exeter-400 dark:bg-exeter dark:text-neutral-100 [&>*]:p-3 [&>div>p:nth-child(1)]:font-bold [&>*:nth-child(even)]:bg-neutral-100 dark:[&>*:nth-child(even)]:bg-exeter-600">
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
          </div>
          <div className="h-full">
            <ReactFlow
              className="mt-4 cursor-move rounded-lg shadow-md"
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              selectNodesOnDrag={false}
              // elements={elements}
              nodes={nodes}
              edges={edges}
              style={reactFlowStyle}
              onNodeMouseEnter={nodeHoverCallback}
              onNodeMouseLeave={nodeUnhoverCallback}
              onNodeContextMenu={nodeRightClickCallback}
              onNodeClick={nodeClickCallback}
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
  /*
  Load all prereqs/coreqs via recursive depth-first-search
  Start by fetching all prereqs/coreqs for the root course
  Recursively fetch all prereqs/coreqs for the latest layer of prereqs/coreqs
  Keep track of all courses whose requirements we've fetched in a Set
  */
  const visited = new Set<string>(); // Courses whose reqs we've loaded (AKA courses we've visited in the DFS)
  const prereqs: Record<string, ICourse[]> = {};
  const coreqs: Record<string, ICourse[]> = {};
  const titles: Record<string, string | undefined> = {}; // Long titles
  const descriptions: Record<string, string | undefined> = {}; // Descriptions
  const eliReqs: Record<string, string | undefined> = {}; // Eligibility requirements
  const prereqsFull: Record<string, string | undefined> = {}; // Full prereq desc. as in COI

  // DFS loop which fetches all info (including prereqs/coreqs for a course)
  function DFS(courseId: string) {
    if (visited.has(courseId)) return; // Don't fetch information on a course we've already visited
    visited.add(courseId);
    const course = getCourse(courseId);
    if (course == undefined) return;
    // Load popup information for this course
    titles[courseId] = course.lt;
    descriptions[courseId] = course.desc;
    eliReqs[courseId] = course.eli;
    prereqsFull[courseId] = course.prereq_full;
    // Load prereqs/coreqs
    const reqs = getCourseRequirements(courseId);
    prereqs[courseId] = reqs[0];
    coreqs[courseId] = reqs[1];
    // Base case: if the only requirement for this course is PEA000 prereq, we've reached the bottom
    if (reqs[0].length == 1 && reqs[0][0].course_no == 'PEA000') return;
    // Run DFS on the prereqs/coreqs
    for (const reqCourse of reqs[0].concat(reqs[1])) {
      DFS(reqCourse.course_no);
    }
  }
  DFS(params.id);

  const course = getCourse(params.id);

  return {
    props: {
      params: {
        course: course,
        prereqs: prereqs,
        coreqs: coreqs,
        descriptions: descriptions,
        titles: titles,
        eliReqs: eliReqs,
        prereqsFull: prereqsFull,
      },
    },
  };
}

export default CoursePage;
