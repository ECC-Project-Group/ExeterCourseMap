import { AnimatePresence, motion } from 'framer-motion';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useEffect,
  useState,
} from 'react';

interface CourseInfoPopupParams {
  active: boolean; // whether the popup is currently active
  longTitle: string;
  course_no: string;
  desc: string;
  eli: string;
  locked: boolean;
  prereqFull: string;
}

// Track mouse position
const CourseInfoPopupObject = ({
  setCurrentlyHoveredId,
  titles,
  descriptions,
  eliReqs,
  prereqsFull,
}: {
  setCurrentlyHoveredId: Dispatch<SetStateAction<string>>;
  titles: Record<string, string | undefined>;
  descriptions: Record<string, string | undefined>;
  eliReqs: Record<string, string | undefined>;
  prereqsFull: Record<string, string | undefined>;
}) => {
  // Mouse coordinates - determines where to display popup
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const getEmptyPopupParams = () =>
    ({
      active: false,
      longTitle: '',
      course_no: '',
      desc: '',
      eli: '',
      locked: false,
      prereqFull: '',
    } as CourseInfoPopupParams);
  const [courseInfoPopupParams, setCourseInfoPopupParams] =
    useState<CourseInfoPopupParams>(getEmptyPopupParams());

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (courseInfoPopupParams.locked) return;
      setCoords({ x: e.pageX, y: e.pageY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [coords, courseInfoPopupParams.locked]);

  // Callbacks for when user moves cursors on/off nodes or clicks on nodes
  const nodeHoverCallback = (event: React.MouseEvent, node: { id: string }) => {
    setCurrentlyHoveredId(node.id);
    if (courseInfoPopupParams.locked) return;
    const popupParams = {
      active: true,
      longTitle: titles[node.id],
      course_no: node.id,
      desc: descriptions[node.id],
      eli: eliReqs[node.id],
      locked: false,
      prereqFull: prereqsFull[node.id],
    } as CourseInfoPopupParams;
    setCourseInfoPopupParams(popupParams);
  };
  const nodeUnhoverCallback = () => {
    setCurrentlyHoveredId('');
    if (courseInfoPopupParams.locked) return;
    setCourseInfoPopupParams(getEmptyPopupParams());
  };
  // Lock/unlock course info popup when right click on popup
  const nodeRightClickCallback = (event: React.MouseEvent) => {
    event.preventDefault();
    const popupParams = courseInfoPopupParams;
    popupParams.locked = !popupParams.locked;
    setCourseInfoPopupParams(popupParams);
  };
  // Unlock course info popup when click on canvas
  const paneClickCallback = () => {
    setCourseInfoPopupParams(getEmptyPopupParams());
  };
  // Open the course page associated with this course
  const nodeClickCallback = (
    event: React.MouseEvent,
    element: { id: string }
  ) => {
    event.preventDefault();
    // check if element is an edge
    if (element.id.startsWith('pe') || element.id.startsWith('ce')) return;
    if (event.metaKey || event.ctrlKey) {
      window.open(`/course/${element.id}`);
    } else window.open(`/course/${element.id}`, '_self');
  };

  const cipp = courseInfoPopupParams;

  return {
    nodeHoverCallback,
    nodeUnhoverCallback,
    nodeRightClickCallback,
    paneClickCallback,
    nodeClickCallback,
    courseInfoPopupParams,
    coords,
    CourseInfoPopup: () => (
      <div
        className="dark:border-1 m-5 max-w-lg rounded-lg bg-white/80 backdrop-blur-lg backdrop-brightness-200 dark:border dark:border-neutral-400 dark:bg-neutral-700/80"
        style={{
          display: cipp.active ? 'block' : 'none',
          position: 'absolute',
          left: coords.x, // If there isn't enough margin/offset, nodeUnhoverCallback will trigger once this opens because the cursor will be over this popup instead of  the node
          top: coords.y,
          zIndex: 100,
        }}
      >
        <p className="ml-2 mr-2 mt-2 text-xl font-bold text-black dark:text-white">
          {cipp.longTitle} · {cipp.course_no}
        </p>
        <p className="ml-2 mr-2 text-sm text-neutral-800 dark:text-neutral-300">
          {cipp.desc}
        </p>
        <p className="ml-2 mr-2 text-sm italic dark:text-neutral-300">
          {cipp.eli}
        </p>
        <p className="ml-2 mr-2 mb-2 text-sm italic dark:text-neutral-300">
          {cipp.prereqFull == '' || cipp.course_no == 'PEA000'
            ? ''
            : `Prerequisite(s): ${cipp.prereqFull}`}
        </p>
      </div>
    ),
  };
};

const TransitionWrapper = ({
  children,
  courseInfoPopupParams,
  coords,
}: PropsWithChildren<{
  courseInfoPopupParams: CourseInfoPopupParams;
  coords: { x: number; y: number };
}>) => (
  <AnimatePresence>
    {courseInfoPopupParams.active && (
      <motion.div
        className="pointer-events-none absolute top-0 left-0 z-50 h-screen w-screen bg-none"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          transformOrigin: `${coords.x - 100}px ${coords.y - 100}px`,
        }}
        transition={{ duration: 0.2, ease: 'circOut' }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export { CourseInfoPopupObject, TransitionWrapper };
