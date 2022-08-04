import { NextApiRequest, NextApiResponse } from 'next';
import { getCourseRequirements } from '../../../lib/courses';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const reqs = getCourseRequirements(id as string);

  res.status(200).send(reqs);
}
