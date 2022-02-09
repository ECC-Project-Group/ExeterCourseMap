import { NextApiRequest, NextApiResponse } from 'next';
import { getCoursePrerequisites } from '../../../lib/courses';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const prereqs = getCoursePrerequisites(id as string);

  res.status(200).send(prereqs);
}
