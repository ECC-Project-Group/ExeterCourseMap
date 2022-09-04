import { ElkNode } from 'elkjs';
import type { InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import ReactFlow, { Elements } from 'react-flow-renderer';
import { getAllCoursesFrom, getCourseRequirements } from '../../lib/courses';
import { layoutElements, renderElements } from '../../lib/generateLayout';
import { event } from '../../lib/gtag';
import { ICourse } from '../../types';
import {
  CourseInfoPopupObject,
  TransitionWrapper,
} from '../../components/courseInfoPopup';

const Submap = ({ params }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { name, prereqs, coreqs, descriptions, titles, eli, prereqFull } =
    params;

  // GA event for when a map is viewed
  useEffect(() => {
    event({
      action: 'view_map',
      category: 'general',
      label: name,
      value: 1,
    });
  }, [name]);

  const [graph, setGraph] = useState<ElkNode>();
  const [elements, setElements] = useState<Elements>([]);

  // Compute layout of chart
  useEffect(() => {
    async function main() {
      const parsedGraph = await layoutElements(prereqs, coreqs, true);
      const newElements = await renderElements(parsedGraph, true);
      setGraph(parsedGraph);
      setElements(newElements);
    }
    main();
  }, [prereqs, coreqs]);

  const [currentlyHoveredId, setCurrentlyHoveredId] = useState<string>('');
  // Re-render chart
  useEffect(() => {
    if (graph) {
      const newElements = renderElements(graph, true, currentlyHoveredId);
      setElements(newElements);
    }
  }, [graph, currentlyHoveredId]);

  const reactFlowStyle = {
    background: `rgb(35, 35, 35)`,
  };

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
    eliReqs: eli,
    prereqsFull: prereqFull,
  });

  return (
    <div>
      <div className="overflow-x-contain h-screen w-screen">
        <ReactFlow
          className="cursor-move shadow-md"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          selectNodesOnDrag={false}
          elements={elements}
          onNodeMouseEnter={nodeHoverCallback}
          onNodeMouseLeave={nodeUnhoverCallback}
          onElementClick={nodeClickCallback}
          onNodeContextMenu={nodeRightClickCallback}
          onPaneClick={paneClickCallback}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          zoomOnScroll={false}
          panOnScroll={true}
          style={reactFlowStyle}
          defaultZoom={0.7}
        ></ReactFlow>
      </div>
      <TransitionWrapper
        courseInfoPopupParams={courseInfoPopupParams}
        coords={coords}
      >
        <CourseInfoPopup />
      </TransitionWrapper>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: 'stemwithoutcs' } },
      { params: { id: 'cs' } },
      { params: { id: 'math' } },
      { params: { id: 'mathphysics' } },
      { params: { id: 'art' } },
      { params: { id: 'music' } },
      { params: { id: 'theater' } },
      { params: { id: 'history' } },
      { params: { id: 'classics' } },
      { params: { id: 'arabic' } },
      { params: { id: 'chinese' } },
      { params: { id: 'french' } },
      { params: { id: 'german' } },
      { params: { id: 'italian' } },
      { params: { id: 'japanese' } },
      { params: { id: 'russian' } },
      { params: { id: 'spanish' } },
      { params: { id: 'religion' } },
      { params: { id: 'english' } },
    ],
    fallback: false,
  };
}

// Grab all necessary information for every course
export async function getStaticProps({ params }: { params: { id: string } }) {
  let subjects: Set<string>;
  const name = params.id;
  switch (name) {
    case 'art':
      subjects = new Set<string>(['ART']);
      break;
    case 'music':
      subjects = new Set<string>(['MUS']);
      break;
    case 'theater':
      subjects = new Set<string>(['THR']);
      break;
    case 'history':
      subjects = new Set<string>(['HIS']);
      break;
    case 'classics':
      subjects = new Set<string>(['LAT', 'GRK']);
      break;
    case 'english':
      subjects = new Set<string>(['ENG']);
      break;
    case 'religion':
      subjects = new Set<string>(['REL']);
      break;
    case 'arabic':
      subjects = new Set<string>(['ARA']);
      break;
    case 'chinese':
      subjects = new Set<string>(['CHI']);
      break;
    case 'french':
      subjects = new Set<string>(['FRE']);
      break;
    case 'german':
      subjects = new Set<string>(['GER']);
      break;
    case 'italian':
      subjects = new Set<string>(['ITA']);
      break;
    case 'japanese':
      subjects = new Set<string>(['JPN']);
      break;
    case 'russian':
      subjects = new Set<string>(['RUS']);
      break;
    case 'spanish':
      subjects = new Set<string>(['SPA']);
      break;
    case 'stemwithoutcs':
      subjects = new Set<string>(['CHE', 'BIO', 'PHY', 'MAT']);
      break;
    case 'cs':
      subjects = new Set<string>(['CSC']);
      break;
    case 'math':
      subjects = new Set<string>(['MAT']);
      break;
    case 'mathphysics':
      subjects = new Set<string>(['MAT', 'PHY']);
      break;
    default:
      subjects = new Set<string>();
  }
  const courses = getAllCoursesFrom(subjects);

  // Load prereqs/coreqs and detailed info for for each course
  const prereqs: Record<string, ICourse[]> = {};
  const coreqs: Record<string, ICourse[]> = {};
  const titles: Record<string, string | undefined> = {}; // Long titles
  const descriptions: Record<string, string | undefined> = {}; // Descriptions
  const eli: Record<string, string | undefined> = {}; // Eligibility requirements
  const prereqFull: Record<string, string> = {}; // COI course string
  for (const course of courses) {
    const reqs = getCourseRequirements(course.course_no);
    prereqs[course.course_no] = reqs[0];
    coreqs[course.course_no] = reqs[1];
    descriptions[course.course_no] = course.desc;
    titles[course.course_no] = course.lt;
    eli[course.course_no] = course.eli;
    prereqFull[course.course_no] = course.prereq_full;
  }

  return {
    props: {
      params: {
        name: name,
        courses: courses,
        prereqs: prereqs,
        coreqs: coreqs,
        descriptions: descriptions,
        titles: titles,
        eli: eli,
        prereqFull: prereqFull,
      },
    },
  };
}

export default Submap;
