import type { NextPage, InferGetStaticPropsType } from 'next';
import React, { Children, useEffect, useState } from 'react';
import ReactFlow, { Background, Elements, FlowElement, Position } from 'react-flow-renderer';
import {
  getAllCourses,
  getAllCoursesFrom,
  getCourse,
  getCourseRequirements,
} from '../../lib/courses';
import { ICourse } from '../../types';
import ELK, { ElkNode, ElkPrimitiveEdge } from 'elkjs/lib/elk.bundled.js';
  import { getCourseColor, getCourseImage } from '../../lib/course_colors';

const elk = new ELK();
// Automatically find the best layout for the map - copied from courses/[id].tsx
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
    // if (base == 'PEA000') continue;
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 120,
        height: 60,
        });
    }
  }
  for (const [base] of Object.entries(coreqs)) {
    // if (base === 'PEA000') continue;
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 120,
        height: 60,
        });
    }
  }

  // Add edges
  // .map() isn't really the best solution here
  Object.entries(prereqs).map(([base, prereqs]) => {
    if (prereqs.length === 0) return;
    for (const index of prereqs.keys()) {
      // if (prereqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `pe-${base}-${prereqs[index].course_no}`, // pe = "prereq edge"
        target: base,
        source: prereqs[index].course_no,
      });
    }
  });
  Object.entries(coreqs).map(([base, coreqs]) => {
    if (coreqs.length === 0) return;
    for (const index of coreqs.keys()) {
      // if (coreqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkPrimitiveEdge[]).push({
        id: `ce-${base}-${coreqs[index].course_no}`, // ce = "coreq edge"
        target: base,
        source: coreqs[index].course_no,
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
        sourcePosition: Position.Top,
        targetPosition: Position.Bottom,
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

const Submap = ({ params }: InferGetStaticPropsType<typeof getStaticProps>) => {

  const { courses, prereqs, coreqs, descriptions, titles, eli } = params;

  // Remember courses whose requirements have already been loaded - avoid re-loading to be more efficient
  const initialReqsLoaded = new Set<string>();
  const [reqsLoaded, setReqsLoaded] = useState<Set<string>>(initialReqsLoaded);  

  const [elements, setElements] = useState<Elements>([]);
  // Compute layout of chart
  useEffect(() => {
    async function main() {
      const elements = await layoutElements(prereqs, coreqs);
      setElements(elements);
    } main();
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
    longTitle: "",
    desc: "",
    eli: ""
  } as CourseInfoPopupParams;
  const [courseInfoPopupParams, setCourseInfoPopupParams] = useState<CourseInfoPopupParams>(initialPopupParams);
  // Mouse coordinates - used to determine where to open popup
  const [coords, setCoords] = useState({x: 0, y: 0});
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
 
  // Open the course page associated with this course when it's clicked
  const nodeClickCallback = (event: React.MouseEvent, element: flowNode) => {
    // check if element is an edge
    if (element.id.startsWith('e')) return;
    window.open(`/course/${element.id}`, '_self');
  }

  return (
    <div>
      <div className="bg-exeter px-8 pt-16 pb-0 lg:px-40"></div>
      <div className="w-screen h-screen overflow-x-contain">
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
        
      >
      </ReactFlow>
      </div>
      <CourseInfoPopup/>
    </div>
  );
};

export async function getStaticPaths() {
  return {
    paths: [
      {params: {id: 'stem'}},
      {params: {id: 'art'}},
      {params: {id: 'music'}},
      {params: {id: 'theater'}},
      {params: {id: 'history'}},
      {params: {id: 'classics'}},
      {params: {id: 'arabic'}},
      {params: {id: 'chinese'}},
      {params: {id: 'french'}},
      {params: {id: 'german'}},
      {params: {id: 'italian'}},
      {params: {id: 'japanese'}},
      {params: {id: 'russian'}},
      {params: {id: 'spanish'}},
      {params: {id: 'religion'}},
      {params: {id: 'english'}},
    ],
    fallback: false,
  }
}

// Grab all necessary information for every course
export async function getStaticProps({ params } : { params: { id: string }}) {
  let subjects : Set<string>;
  switch (params.id) {
    case 'stem': subjects = new Set<string>(["CHE", "BIO", "PHY", "MAT", "CSC"]); break;
    case 'art': subjects = new Set<string>(["ART"]); break;
    case 'music': subjects = new Set<string>(["MUS"]); break;
    case 'theater': subjects = new Set<string>(["THR"]); break;
    case 'history': subjects = new Set<string>(["HIS"]); break;
    case 'classics': subjects = new Set<string>(["LAT", "GRK"]); break;
    case 'english': subjects = new Set<string>(["ENG"]); break;
    case 'religion': subjects = new Set<string>(["REL"]); break;
    case 'arabic': subjects = new Set<string>(["ARA"]); break;
    case 'chinese': subjects = new Set<string>(["CHI"]); break;
    case 'french': subjects = new Set<string>(["FRE"]); break;
    case 'german': subjects = new Set<string>(["GER"]); break;
    case 'italian': subjects = new Set<string>(["ITA"]); break;
    case 'japanese': subjects = new Set<string>(["JPN"]); break;
    case 'russian': subjects = new Set<string>(["RUS"]); break;
    case 'spanish': subjects = new Set<string>(["SPA"]); break;
    
    default: subjects = new Set<string>();
  }
  const courses = getAllCoursesFrom(subjects);

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
      params : {
        courses: courses,
        prereqs: prereqs,
        coreqs: coreqs,
        descriptions: descriptions,
        titles: titles,
        eli: eli,
      }
    },
  };
}

export default Submap;
