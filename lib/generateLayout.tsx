import ELK, { ElkNode, ElkExtendedEdge } from 'elkjs/lib/main';
import { Edge, Node, Position } from 'react-flow-renderer';
import { ICourse } from '../types';
import { getCourseColor, getCourseImage } from './course_colors';

const elk = new ELK();
// Automatically finds the best layout for the prerequisite tree - returns an ElkNode
export const layoutElements = async (
  prereqs: Record<string, ICourse[]>,
  coreqs: Record<string, ICourse[]>,
  isMap: boolean
) => {
  const graph: ElkNode = {
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'mrtree',
    },
    children: [],
    edges: [],
  };

  // Only show PEA000 on the map
  const hidePea000 = !isMap;

  // Add nodes
  // Keep track of nodes that've already been added so we don't get duplicates
  const nodeIds = new Set<string>();
  for (const [base] of Object.entries(prereqs).concat(Object.entries(coreqs))) {
    if (hidePea000 && base == 'PEA000') continue;
    if (!nodeIds.has(base)) {
      nodeIds.add(base);
      (graph.children as ElkNode[]).push({
        id: base,
        width: 130,
        height: 70,
      });
    }
  }

  // Add edges
  // .map() isn't really the best solution here
  Object.entries(prereqs).map(([base, prereqs]) => {
    if (prereqs.length === 0) return;
    for (const index of prereqs.keys()) {
      if (hidePea000 && prereqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkExtendedEdge[]).push({
        id: `pe-${base}-${prereqs[index].course_no}`, // pe = "prereq edge"
        targets: [isMap ? base : prereqs[index].course_no],
        sources: [isMap ? prereqs[index].course_no : base],
      });
    }
  });
  Object.entries(coreqs).map(([base, coreqs]) => {
    if (coreqs.length === 0) return;
    for (const index of coreqs.keys()) {
      if (hidePea000 && coreqs[index].course_no == 'PEA000') continue;
      (graph.edges as ElkExtendedEdge[]).push({
        id: `ce-${base}-${coreqs[index].course_no}`, // ce = "coreq edge"
        targets: [isMap ? base : coreqs[index].course_no],
        sources: [isMap ? coreqs[index].course_no : base],
      });
    }
  });

  const parsedGraph = await elk.layout(graph);
  return parsedGraph;
};

// Render the elements laid out in an ElkNode on a ReactFlow graph
// When the user hovers over the node with id currentlyHoveredId, all the node's prereq edges get highlighted in the node's color
// Add edges before nodes - we learn which prereq nodes to highlight by running through each edge
export const renderElements = (
  parsedGraph: ElkNode,
  isMap: boolean,
  currentlyHoveredId?: string
) => {
  // Add everything to a React Flow graph
  // const elements: Element[] = [];
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const prereqs: Set<string> = new Set<string>();

  // Add non-prereq edges first so they'll appear behind prereq edges
  if (parsedGraph.edges) {
    (parsedGraph.edges as ElkExtendedEdge[]).forEach((edge) => {
      if (edge.id.substring(3, 9) != currentlyHoveredId) {
        edges.push({
          id: edge.id,
          // Flip tree direction for courses page because for some reason bottom-up layout is worse than top-down layout when one course is at root (ex: PHY640)
          source: edge.sources[0],
          target: edge.targets[0],
          sourceHandle: Position.Top,
          targetHandle: Position.Bottom,
          type: 'smoothstep',
          animated: false,
          style: {
            strokeWidth: edge.id.startsWith('ce') ? 0.5 : 1,
            strokeDasharray: edge.id.startsWith('ce') ? '10, 6' : '', // Make coreq edges dashed - dash length 10, space between dashes 6
            stroke: 'white',
          },
        });
      }
    });
    (parsedGraph.edges as ElkExtendedEdge[]).forEach((edge) => {
      if (edge.id.substring(3, 9) == currentlyHoveredId) {
        prereqs.add(edge.id.substring(10, 16));
        edges.push({
          id: edge.id,
          source: edge.sources[0],
          target: edge.targets[0],
          sourceHandle: Position.Top,
          targetHandle: Position.Bottom,
          type: 'smoothstep',
          animated: false,
          style: {
            strokeWidth: edge.id.startsWith('ce') ? 4.5 : 5, // Increasing this number doesn't seem to thicken the line up to a certain point - not sure how to increase edge thickness
            strokeDasharray: edge.id.startsWith('ce') ? '10, 6' : '',
            stroke: getCourseColor(currentlyHoveredId),
          },
        });
      }
    });
  }

  // Add nodes
  if (parsedGraph.children) {
    parsedGraph.children.forEach((node) => {
      let boxShadow = '';
      let borderColor = '';
      if (
        currentlyHoveredId != null &&
        (prereqs.has(node.id) || currentlyHoveredId == node.id)
      ) {
        boxShadow = '0 0 25px ' + getCourseColor(currentlyHoveredId);
        borderColor = 'white';
      }
      nodes.push({
        id: node.id,
        type: 'default',
        data: {
          label: (
            <h1
              className="font-display text-lg font-black text-white"
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
          width: 100,
          boxShadow: boxShadow,
          borderColor: borderColor,
          transitionDuration: '0.2s',
          transitionTimingFunction: 'ease-out',
          cursor: 'pointer',
        },
      });
    });
  }
  return { nodes, edges };
};
