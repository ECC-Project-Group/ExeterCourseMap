import React, { Children, useEffect, useState } from 'react';
import ReactFlow, { Background, Elements, FlowElement, Position } from 'react-flow-renderer';
import {
  getAllCourses,
  getCourse,
  getCourseRequirements,
} from '../../lib/courses';
import { ICourse } from '../../types';
import ELK, { ElkNode, ElkPrimitiveEdge } from 'elkjs/lib/elk.bundled.js';
import { InferGetStaticPropsType } from "next";
import { getCourseColor, getCourseImage } from '../../lib/course_colors';

const elk = new ELK();
// Automatically finds the best layout for the prerequisite tree.
const layoutElements = async (prereqs: Record<string, ICourse[]>, coreqs: Record<string, ICourse[]>) => {

  const graph: ElkNode = {
    id: 'root',
    layoutOptions: { 
      'elk.algorithm': 'layered',
    },
    children: [],
    edges: [],
  };

  // Add nodes
  // Keep track of nodes that've already been added so we don't get duplicates
  const nodeIds = new Set<string>();
  for (const [base] of Object.entries(prereqs)) {
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 130,
        height: 36,
        });
    }
  }
  for (const [base] of Object.entries(coreqs)) {
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 130,
        height: 36,
        });
    }
  }

  // Add edges
  // .map() isn't really the best solution here
  Object.entries(prereqs).map(([base, prereqs]) => {
    if (prereqs.length === 0) return;
    for (const index of prereqs.keys()) {
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `pe-${base}-${prereqs[index].course_no}`, // pe = "prereq edge"
        source: prereqs[index].course_no,
        target: base,
      });
    }
  });
  Object.entries(coreqs).map(([base, coreqs]) => {
    if (coreqs.length === 0) return;
    for (const index of coreqs.keys()) {
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `ce-${base}-${coreqs[index].course_no}`, // ce = "coreq edge"
        source: coreqs[index].course_no,
        target: base,
      });
    }
  });

  const parsedGraph = await elk.layout(graph);
  
  // Add everything to a React Flow graph
  const elements: Elements = [];
  if (parsedGraph.children) {
    parsedGraph.children.forEach((node) => {
      elements.push({
        id: node.id,
        type: 'default',
        data: {
          label: (
            <h1 className="font-display font-black text-white"
            style={{textShadow: 
              '0.5px 0.5px black, -0.5px -0.5px black, 0.5px -0.5px black, -0.5px 0.5px black'
            }}>{node.id}</h1>
          ),
        },
        position: { x: node.x ?? 0, y: node.y ?? 0 },
        sourcePosition: Position.Left,
        targetPosition: Position.Right,
        style: {
          backgroundColor: getCourseColor(node.id),
          backgroundImage: getCourseImage(node.id),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 10,
          borderWidth: 2,
          width: 90,
        }
        
      });
    });
  }

  if (parsedGraph.edges) {
    (parsedGraph.edges as ElkPrimitiveEdge[]).forEach((edge) => {
      elements.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'smoothstep',
        animated: false,
        style: {
          strokeWidth: edge.id.startsWith("ce") ? 1 : 2.5,
          stroke: edge.id.startsWith("ce") ? 'rgb(50, 50, 50)' : 'black',
        }
      });
    });
  }
  return elements;
};

// TODO: Add a button inside the react-flow chart
// to load + render all prerequisites for courses that have an
// empty array as a prerequisite in the prereqs variable
const CoursePage = ({ params }: InferGetStaticPropsType<typeof getStaticProps> ) => {
  // initialPrereqs maps each course id to its prereqs
  // initialDescriptions maps each course id to its description
  // initialTitles maps each course id to its full title
  const { course, initialPrereqs, initialCoreqs, initialDescriptions, initialTitles } = params;
  interface CourseInfoPopupParams {
    active: boolean; // whether the popup is currently active
    longTitle: string;
    desc: string;
  }

  const [prereqs, setPrereqs] =
    useState<Record<string, ICourse[]>>(initialPrereqs);
  const [coreqs, setCoreqs] =
    useState<Record<string, ICourse[]>>(initialCoreqs);
  
  const [elements, setElements] = useState<Elements>([]);

  // Mouse coordinates
  const [coords, setCoords] = useState({x: 0, y:0});
  
  // Parameters for course info popup (opened when mouse hovers over node)
  const initialPopupParams = {
    active: false,
    longTitle: "",
    desc: ""
  } as CourseInfoPopupParams;
  const [courseInfoPopupParams, setCourseInfoPopupParams] = useState<CourseInfoPopupParams>(initialPopupParams);

  // Relayout the chart when prereqs changes
  useEffect(() => {
    async function main() {
      const elements = await layoutElements(prereqs, coreqs);
      setElements(elements);
    }
    main();
  }, [prereqs, coreqs]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent)  => {
      setCoords({x: e.pageX, y: e.pageY});
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [coords]);
  function CourseInfoPopup() {
    const cipp = courseInfoPopupParams;
    return <div style = {{
      display: cipp.active ? 'block' : 'none',
      position: 'absolute',
      left: coords.x + 10, // If there isn't enough offset, nodeUnhoverCallback will trigger once this opens
      top: coords.y + 10,
      zIndex: 100,
    }}>
      {cipp.longTitle}
      {cipp.desc}
    </div>
  }

  // Advances to the next level of requirements - called when "More Prereqs" is clicked
  const getMoreReqs = async () => {
    // Get the requirements for the last layer in prereqs (courses without set prereqs)
    const prereqsToWrite : Record<string, ICourse[]> = { ...prereqs };
    const coreqsToWrite : Record<string, ICourse[]> = { ...coreqs };

    // Keep track of which courses we've updated, since we don't want to update a class in prereqs then update it again in coreqs
    const updatedCourses : Set<string> = new Set<string>();

    // Add both the prereqs and coreqs of the last layer of prereqs
    for (const [base, currPrereqs] of Object.entries(prereqs)) {
      if (currPrereqs.length !== 0) continue; // That means base isn't in the last layer of prereqs
      const res = await fetch(`http://localhost:3000/api/prereqs/${base}`);
      const newReqs: ICourse[][] = await res.json();
      prereqsToWrite[base] = newReqs[0]; // Prereqs of prereqs
      for (const newPrereq of newReqs[0]) {
        prereqsToWrite[newPrereq.course_no] = [];
      }
      coreqsToWrite[base] = newReqs[1]; // Coreqs of prereqs
      for (const newCoreq of newReqs[1]) {
        coreqsToWrite[newCoreq.course_no] = [];
      }
      updatedCourses.add(base);
    }
    
    // TODO: FIX THIS WITHOUT BREAKING THE PREREQ LINKS - TEST ON PHYSICS 530
    // Do the same for the coreqs
    // for (const [base, currCoreqs] of Object.entries(coreqs)) {
    //   if (currCoreqs.length !== 0) continue; // That means base isn't in the last layer of prereqs
    //   const res = await fetch(`http://localhost:3000/api/prereqs/${base}`);
    //   const newReqs: ICourse[][] = await res.json();
    //   prereqsToWrite[base] = newReqs[0]; // Prereqs of coreqs
    //   for (const newPrereq of newReqs[0]) {
    //     prereqsToWrite[newPrereq.course_no] = [];
    //   }
    //   coreqsToWrite[base] = newReqs[1]; // Coreqs of coreqs
    //   for (const newCoreq of newReqs[1]) {
    //     coreqsToWrite[newCoreq.course_no] = [];
    //   }
    // }
    // setPrereqs(prereqsToWrite);
    // setCoreqs(coreqsToWrite);
  };

  // Style for ReactFlow component
  const reactFlowStyle = {
    // background: 'rgb(35, 35, 35)'
  }
  
  // This doesn't work for some reason
  // Callbacks for when user moves cursors on/off nodes or clicks on nodes
  interface flowNode { id: string; }
  const nodeHoverCallback = (event: React.MouseEvent, node: flowNode) => {
  const popupParams = {
    active: true,
    longTitle: initialTitles[node.id],
    desc: initialDescriptions[node.id]
  } as CourseInfoPopupParams;
  setCourseInfoPopupParams(popupParams);
  };
  const nodeUnhoverCallback =(event: React.MouseEvent, node: flowNode) => {
    const popupParams = {
    active: false,
    longTitle: "",
    desc: ""
  } as CourseInfoPopupParams;
  setCourseInfoPopupParams(popupParams);
  };
  
  // Open the course page associated with this course
  const nodeClickCallback = (event: React.MouseEvent, element: flowNode) => {
    // check if element is an edge
    if (element.id.startsWith('e')) return;
    window.open(`/course/${element.id}`, '_self');
  }

  return (
    <div>
      <div className="bg-exeter px-8 pt-28 pb-20 lg:px-40">
        <h1 className="font-display text-2xl text-gray-300 md:text-3xl">
          {course.course_no}
        </h1>
        <h1 className="mt-2 font-display text-4xl font-black text-white md:text-5xl ">
          {course.lt}
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-16 px-8 pt-14 pb-20 md:grid-cols-5 lg:px-40">
        <div className="md:col-span-2">
          <h1 className="font-display text-3xl font-black text-gray-700">
            Description
          </h1>
          <h1 className="mt-4 font-display text-lg leading-8 text-gray-900">
            {course.desc}
          </h1>
        </div>
        <div className="md:col-span-3">
          <h1 className="font-display text-3xl font-black text-gray-700">
            Prerequisites
          </h1>
          <div className="h-full">
            <button
              className="absolute z-10 m-2 rounded-md bg-gray-700 p-2 font-display text-sm font-bold text-white shadow-lg transition duration-150 ease-out active:translate-y-1"
              onClick={getMoreReqs}
            >
              More Prereqs
            </button>
            <ReactFlow
              className="mt-4 shadow-md"
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
              selectNodesOnDrag={false}
              elements={elements}
              style={reactFlowStyle}
              onNodeMouseEnter={nodeHoverCallback}
              onNodeMouseLeave={nodeUnhoverCallback}
              onElementClick={nodeClickCallback}
            >
              <Background color="#858585" />
            </ReactFlow>
          </div>
          <CourseInfoPopup/>
        </div>
      </div>
    </div>
  );
};

// Generate routes for each course at build-time
export async function getStaticPaths() {
  const courses = getAllCourses();

  const paths = courses.map((course) => ({
    params: { id: course.course_no },
  }));

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
  // Janky naming - firstPrereqs[0] is first prereqs, firstPrereqs[1] is first coreqs
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
  initialDescriptions[params.id] = course?.desc;
  initialTitles[params.id] = course?.lt;
  for (const prereq of firstReqs[0]) { // Load this data for each prereq
    initialDescriptions[prereq.course_no] = prereq.desc;
    initialTitles[prereq.course_no] = prereq.lt;
  }
  for (const coreq of firstReqs[1]) { // Load this data for each coreq
    initialDescriptions[coreq.course_no] = coreq.desc;
    initialTitles[coreq.course_no] = coreq.lt;
  }

  return {
    props: {
      params : {
        course: course,
        initialPrereqs: initialPrereqs,
        initialCoreqs: initialCoreqs,
        initialDescriptions: initialDescriptions,
        initialTitles: initialTitles,
      }
    },
  };
}

export default CoursePage;
