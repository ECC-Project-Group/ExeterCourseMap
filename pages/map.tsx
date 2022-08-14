import type { NextPage } from 'next';
import React, { Children, useEffect, useState } from 'react';
import ReactFlow, { Background, Elements, FlowElement, Position } from 'react-flow-renderer';
import {
  getAllCourses,
  getCourse,
  getCourseRequirements,
} from '../lib/courses';
import { ICourse } from '../types';
import ELK, { ElkNode, ElkPrimitiveEdge } from 'elkjs/lib/elk.bundled.js';
import { InferGetStaticPropsType } from 'next';
import { getCourseColor, getCourseImage } from '../lib/course_colors';

const elk = new ELK();
// Automatically find the best layout for the map

const Map: NextPage = (props) => {
  return (
    <div className="h-screen">
      <div className="bg-exeter px-8 pt-16 pb-0 lg:px-40"></div>
      </div>
  );
};

export default Map;
