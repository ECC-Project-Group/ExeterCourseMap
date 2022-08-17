import { NextApiRequest, NextApiResponse } from 'next';
import { getCourse } from '../../../lib/courses';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const course = getCourse(id as string);

  res.status(200).send(course);
}
