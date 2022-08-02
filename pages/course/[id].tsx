import React, { useEffect, useState } from 'react';
import ReactFlow, { Background, Elements, FlowElement, Position } from 'react-flow-renderer';
import {
  getAllCourses,
  getCourse,
  getCoursePrerequisites,
} from '../../lib/courses';
import { ICourse } from '../../types';
import ELK, { ElkNode, ElkPrimitiveEdge } from 'elkjs/lib/elk.bundled.js';
import { InferGetStaticPropsType } from "next";
import { getCourseColor, getCourseImage } from '../../lib/course_colors';

const elk = new ELK();
// Automatically finds the best layout for the prerequisite tree.
const layoutElements = async (prereqs: Record<string, ICourse[]>) => {
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: { 
      'elk.algorithm': 'layered',
    },
    children: [
      ...Object.entries(prereqs).map(([base]) => {
        console.log("base: " + base);
        return {
          id: base,
          width: 130,
          height: 36,
        };
      }),
    ],
    edges: [],
  };

  // .map() isn't really the best solution here
  Object.entries(prereqs).map(([base, prereqs]) => {
    if (prereqs.length === 0) return;
    for (const index of prereqs.keys()) {
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `e-${base}`,
        source: prereqs[index].course_no,
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
        // style: {
        //   strokeWidth: 2,
        //   stroke: 'black'
        // }
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
  
  const [prereqs, setPrereqs] =
    useState<Record<string, ICourse[]>>(initialPrereqs);

  const [elements, setElements] = useState<Elements>([]);

  // Relayout the chart when prereqs changes
  useEffect(() => {
    async function main() {
      const elements = await layoutElements(prereqs);
      setElements(elements);
    }
    main();
  }, [prereqs]);

  // Advances to the next level of prerequisites.
  const getMorePrereqs = async () => {
    console.log("Called getMorePrereqs");
    const prereqsToWrite = { ...prereqs };
    console.log(prereqsToWrite);
    for (const [base, currPrereqs] of Object.entries(prereqs)) {
      if (currPrereqs.length !== 0) continue;
      const res = await fetch(`http://localhost:3000/api/prereqs/${base}`);
      const newPrereqs: ICourse[][] = await res.json();
      console.log("newPrereqs:");
      console.log(newPrereqs);
      if (newPrereqs[0].length > 0) {
        prereqsToWrite[base] = newPrereqs[0];
        for (const newPrereq of newPrereqs[0]) {
          prereqsToWrite[newPrereq.course_no] = [];
        }
      }
    }
    setPrereqs(prereqsToWrite);
  };

  // Style for ReactFlow component
  const reactFlowStyle = {
    // background: 'rgb(35, 35, 35)'
  }

  // Callbacks for when user moves cursors on/off nodes or clicks on nodes
  interface flowNode { id: string; }
  const nodeHoverCallback = 
  (event: React.MouseEvent, node: flowNode) => {
    console.log(initialDescriptions[node.id]);
  };
  const nodeUnhoverCallback =
  (event: React.MouseEvent, node: flowNode) => {
    console.log("Exited");
  };
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
              onClick={getMorePrereqs}
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
  const firstPrereqs = getCoursePrerequisites(params.id);
  const initialPrereqs: Record<string, ICourse[]> = {};
  const initialCoreqs: Record<string, ICourse[]> = {};
  // Janky naming - firstPrereqs[0] is first prereqs, firstPrereqs[1] is first coreqs
  initialPrereqs[params.id] = firstPrereqs[0];
  initialCoreqs[params.id] = firstPrereqs[1];
  for (const prereq of firstPrereqs[0]) {
    initialPrereqs[prereq.course_no] = [];
  }
  for (const coreq of firstPrereqs[1]) {
    initialPrereqs[coreq.course_no] = [];
  }

  // Load detailed course info
  const initialTitles: Record<string, string | undefined> = {}; // Long titles
  const initialDescriptions: Record<string, string | undefined> = {}; // Descriptions
  initialDescriptions[params.id] = course?.desc;
  initialTitles[params.id] = course?.lt;
  for (const prereq of firstPrereqs[0]) { // Load this data for each prereq
    initialDescriptions[prereq.st] = prereq.desc;
    initialTitles[prereq.st] = prereq.lt;
  }
  for (const coreq of firstPrereqs[1]) { // Load this data for each coreq
    initialDescriptions[coreq.st] = coreq.desc;
    initialTitles[coreq.st] = coreq.lt;
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
