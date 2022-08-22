import ELK, { ElkNode, ElkPrimitiveEdge } from 'elkjs/lib/elk.bundled.js';
import { Elements, Position } from 'react-flow-renderer';
import { ICourse } from '../types';
import { getCourseColor, getCourseImage } from './course_colors';

const elk = new ELK();
// Automatically finds the best layout for the prerequisite tree.
export const layoutElements = async (
  prereqs: Record<string, ICourse[]>,
  coreqs: Record<string, ICourse[]>,
  hidePea000 = false
) => {
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
  for (const [base] of Object.entries(prereqs).concat(Object.entries(coreqs))) {
    if (hidePea000 && base == 'PEA000') continue;
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
      if (hidePea000 && prereqs[index].course_no == 'PEA000') continue;
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
      if (hidePea000 && coreqs[index].course_no == 'PEA000') continue;
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
            <h1
              className="font-display font-black text-white"
              style={{
                textShadow:
                  '0.5px 0.5px black, -0.5px -0.5px black, 0.5px -0.5px black, -0.5px 0.5px black',
              }}
            >
              {node.id}
            </h1>
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
          strokeWidth: edge.id.startsWith('ce') ? 1 : 2.5,
          stroke: edge.id.startsWith('ce') ? 'rgb(50, 50, 50)' : 'black',
        },
      });
    });
  }
  return elements;
};
