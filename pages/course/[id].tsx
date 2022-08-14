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
      'elk.algorithm': 'mrtree',
    },
    children: [],
    edges: [],
  };

  // Add nodes
  // Keep track of nodes that've already been added so we don't get duplicates
  const nodeIds = new Set<string>();
  for (const [base] of Object.entries(prereqs)) {
    if (base == 'PEA000') continue;
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 100,
        height: 60,
        });
    }
  }
  for (const [base] of Object.entries(coreqs)) {
    if (base === 'PEA000') continue;
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 100,
        height: 60,
        });
    }
  }

  // Add edges
  // .map() isn't really the best solution here
  Object.entries(prereqs).map(([base, prereqs]) => {
    if (prereqs.length === 0) return;
    for (const index of prereqs.keys()) {
      if (prereqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `pe-${base}-${prereqs[index].course_no}`, // pe = "prereq edge"
        target: prereqs[index].course_no,
        source: base,
      });
    }
  });
  Object.entries(coreqs).map(([base, coreqs]) => {
    if (coreqs.length === 0) return;
    for (const index of coreqs.keys()) {
      if (coreqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `ce-${base}-${coreqs[index].course_no}`, // ce = "coreq edge"
        target: coreqs[index].course_no,
        source: base,
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
        style: {
          backgroundColor: getCourseColor(node.id),
          backgroundImage: getCourseImage(node.id),
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          borderRadius: 10,
          borderWidth: 2,
          width: 90,
        },
      });
    });
  }

  if (parsedGraph.edges) {
    (parsedGraph.edges as ElkPrimitiveEdge[]).forEach((edge) => {
      elements.push({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
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
  // initialEli maps each course id to its eligibility requirements
  const { course, initialPrereqs, initialCoreqs, initialDescriptions, initialTitles, initialEli } = params;
  interface CourseInfoPopupParams {
    active: boolean; // whether the popup is currently active
    longTitle: string;
    desc: string;
    eli: string;
  }

  // Courses whose requirements have already been loaded
  const initialReqsLoaded = new Set<string>();
  initialReqsLoaded.add(course.course_no);
  const [reqsLoaded, setReqsLoaded] = useState<Set<string>>(initialReqsLoaded);

  const [prereqs, setPrereqs] =
    useState<Record<string, ICourse[]>>(initialPrereqs);
  const [coreqs, setCoreqs] =
    useState<Record<string, ICourse[]>>(initialCoreqs);
  const [titles, setTitles] = useState<Record<string, string | undefined>>(initialTitles);
  const [descriptions, setDescriptions] = useState<Record<string, string | undefined>>(initialDescriptions);
  const [eli, setEli] = useState<Record<string, string | undefined>>(initialEli);
  

  const [elements, setElements] = useState<Elements>([]);

  // Mouse coordinates
  const [coords, setCoords] = useState({x: 0, y:0});
  
  // Parameters for course info popup (opened when mouse hovers over node)
  const initialPopupParams = {
    active: false,
    longTitle: "",
    desc: "",
    eli: ""
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
    return <div className='text-white bg-gray-900/80 backdrop-blur rounded-lg m-5' style = {{
      display: cipp.active ? 'block' : 'none',
      position: 'absolute',
      left: coords.x, // If there isn't enough margin/offset, nodeUnhoverCallback will trigger once this opens because the cursor will be over this popup instead of  the node
      top: coords.y,
      zIndex: 100,
    }}>
      <p className='text-xl ml-2 mr-2 mt-2 font-bold'>
        {cipp.longTitle}
      </p>
      <p className='ml-2 mr-2 text-sm'>
        {cipp.desc}
      </p>
      <p className='ml-2 mr-2 mb-2 text-sm italic'>
        {cipp.eli}
      </p>
    </div>
  }

  // Advances to the next level of requirements - called when "More Prereqs" is clicked
  const getMoreReqs = async () => {
    // Get the requirements for the last layers of prereqs and coreqs
    const prereqsToWrite : Record<string, ICourse[]> = { ...prereqs };
    const coreqsToWrite : Record<string, ICourse[]> = { ...coreqs };

    // Don't load requirements for courses whose requirements have already been loaded
    const currReqsLoaded = reqsLoaded;

    // Keep track of newly-added courses
    const newCourses : Set<string> = new Set<string>();

    // Add both the prereqs and coreqs of the last layer of prereqs
    for (const [base, currPrereqs] of Object.entries(prereqs)) {
      if (currReqsLoaded.has(base)) continue; // That means base isn't in the last layer of prereqs
      const res = await fetch(`http://localhost:3000/api/prereqs/${base}`);
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
    for (const [base, currCoreqs] of Object.entries(coreqs)) {
      if (currReqsLoaded.has(base)) continue;
      const res = await fetch(`http://localhost:3000/api/prereqs/${base}`);
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
    const titlesToWrite : Record<string, string | undefined> = { ...titles };
    const descriptionsToWrite : Record<string, string | undefined> = { ...descriptions };
    const eliToWrite : Record<string, string | undefined> = { ...eli };
    
    for (const courseNo of newCourses) {
      console.log("Adding info for " + courseNo);
      const res = await fetch(`http://localhost:3000/api/course_info/${courseNo}`);
      const course : ICourse = await res.json();
      titlesToWrite[courseNo] = course.lt;
      descriptionsToWrite[courseNo] = course.desc;
      eliToWrite[courseNo] = course.eli;
    }
    setTitles(titlesToWrite);
    setDescriptions(descriptionsToWrite);
    setEli(eliToWrite);
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
    longTitle: titles[node.id],
    desc: descriptions[node.id],
    eli: eli[node.id]
  } as CourseInfoPopupParams;
  setCourseInfoPopupParams(popupParams);
  };
  const nodeUnhoverCallback =(event: React.MouseEvent, node: flowNode) => {
    const popupParams = {
    active: false,
    longTitle: "",
    desc: "",
    eli: ""
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
      <div className="bg-exeter px-8 pt-20 pb-20 lg:px-40">
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
            Requirements
          </h1>
          <div className="h-full">
            <button
              className="absolute z-10 m-2 rounded-md bg-gray-700 p-2 font-display text-sm font-bold text-white shadow-lg transition duration-150 ease-out active:translate-y-1"
              onClick={getMoreReqs}
            >
              More Requirements
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
  const initialEli: Record<string, string | undefined> = {}; // Eligibility requirements
  initialDescriptions[params.id] = course?.desc;
  initialTitles[params.id] = course?.lt;
  initialEli[params.id] = course?.eli;
  for (const prereq of firstReqs[0]) { // Load this data for each prereq
    initialDescriptions[prereq.course_no] = prereq.desc;
    initialTitles[prereq.course_no] = prereq.lt;
    initialEli[prereq.course_no] = prereq.eli;
  }
  for (const coreq of firstReqs[1]) { // Load this data for each coreq
    initialDescriptions[coreq.course_no] = coreq.desc;
    initialTitles[coreq.course_no] = coreq.lt;
    initialEli[coreq.course_no] = coreq.eli
  }

  return {
    props: {
      params : {
        course: course,
        initialPrereqs: initialPrereqs,
        initialCoreqs: initialCoreqs,
        initialDescriptions: initialDescriptions,
        initialTitles: initialTitles,
        initialEli: initialEli,
      }
    },
  };
}

export default CoursePage;
