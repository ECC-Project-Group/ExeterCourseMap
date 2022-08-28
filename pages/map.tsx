import type { InferGetStaticPropsType } from 'next';
import React, { useEffect, useState } from 'react';
import ReactFlow, { Elements } from 'react-flow-renderer';
import { getAllCourses, getCourseRequirements } from '../lib/courses';
import { layoutElements } from '../lib/generateLayout';
import { ICourse } from '../types';

const Map = ({ params }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { prereqs, coreqs, descriptions, titles, eli } = params;

  // Remember courses whose requirements have already been loaded - avoid re-loading to be more efficient
  const initialReqsLoaded = new Set<string>();
  useState<Set<string>>(initialReqsLoaded);

  const [elements, setElements] = useState<Elements>([]);
  // Compute layout of chart
  useEffect(() => {
    async function main() {
      const parsedGraph = await layoutElements(prereqs, coreqs, true);
    }
    main();
  }, [prereqs, coreqs]);

  // Parameters for course info popup (opened when mouse hovers over node)
  interface CourseInfoPopupParams {
    active: boolean; // whether the popup is currently active
    longTitle: string;
    desc: string;
    eli: string;
  }
  const initialPopupParams = {
    active: false,
    longTitle: '',
    desc: '',
    eli: '',
  } as CourseInfoPopupParams;
  const [courseInfoPopupParams, setCourseInfoPopupParams] =
    useState<CourseInfoPopupParams>(initialPopupParams);
  // Mouse coordinates - used to determine where to open popup
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.pageX, y: e.pageY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [coords]);
  function CourseInfoPopup() {
    const cipp = courseInfoPopupParams;
    return (
      <div
        className="m-5 rounded-lg bg-gray-900/80 text-white backdrop-blur"
        style={{
          display: cipp.active ? 'block' : 'none',
          position: 'absolute',
          left: coords.x, // If there isn't enough margin/offset, nodeUnhoverCallback will trigger once this opens because the cursor will be over this popup instead of  the node
          top: coords.y,
          zIndex: 100,
        }}
      >
        <p className="ml-2 mr-2 mt-2 text-xl font-bold">{cipp.longTitle}</p>
        <p className="ml-2 mr-2 text-sm">{cipp.desc}</p>
        <p className="ml-2 mr-2 mb-2 text-sm italic">{cipp.eli}</p>
      </div>
    );
  }
  // Callbacks for when user moves cursors on/off nodes or clicks on nodes
  interface flowNode {
    id: string;
  }
  const nodeHoverCallback = (event: React.MouseEvent, node: flowNode) => {
    const popupParams = {
      active: true,
      longTitle: titles[node.id],
      desc: descriptions[node.id],
      eli: eli[node.id],
    } as CourseInfoPopupParams;
    setCourseInfoPopupParams(popupParams);
  };
  const nodeUnhoverCallback = () => {
    const popupParams = {
      active: false,
      longTitle: '',
      desc: '',
      eli: '',
    } as CourseInfoPopupParams;
    setCourseInfoPopupParams(popupParams);
  };

  // Open the course page associated with this course when it's clicked
  const nodeClickCallback = (event: React.MouseEvent, element: flowNode) => {
    // check if element is an edge
    if (element.id.startsWith('e')) return;
    window.open(`/course/${element.id}`, '_self');
  };

  return (
    <div>
      <div className="bg-exeter px-8 pt-16 pb-0 lg:px-40"></div>
      <div className="h-screen w-screen">
        <ReactFlow
          className="shadow-md"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          selectNodesOnDrag={false}
          elements={elements}
          onNodeMouseEnter={nodeHoverCallback}
          onNodeMouseLeave={nodeUnhoverCallback}
          onElementClick={nodeClickCallback}
          zoomOnPinch={true}
          zoomOnDoubleClick={true}
          zoomOnScroll={false}
          panOnScroll={true}
        ></ReactFlow>
      </div>
      <CourseInfoPopup />
    </div>
  );
};

// Grab all necessary information for every course
export async function getStaticProps() {
  const courses = getAllCourses();

  // Load prereqs/coreqs and detailed info for for each course
  const prereqs: Record<string, ICourse[]> = {};
  const coreqs: Record<string, ICourse[]> = {};
  const titles: Record<string, string | undefined> = {}; // Long titles
  const descriptions: Record<string, string | undefined> = {}; // Descriptions
  const eli: Record<string, string | undefined> = {}; // Eligibility requirements
  for (const course of courses) {
    const reqs = getCourseRequirements(course.course_no);
    prereqs[course.course_no] = reqs[0];
    coreqs[course.course_no] = reqs[1];
    descriptions[course.course_no] = course.desc;
    titles[course.course_no] = course.lt;
    eli[course.course_no] = course.eli;
  }

  return {
    props: {
      params: {
        courses: courses,
        prereqs: prereqs,
        coreqs: coreqs,
        descriptions: descriptions,
        titles: titles,
        eli: eli,
      },
    },
  };
}

export default Map;
