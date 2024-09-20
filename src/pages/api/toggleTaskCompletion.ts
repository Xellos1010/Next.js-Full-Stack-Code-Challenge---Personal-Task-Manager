import { toggleTaskCompletion } from '@/db/actions'; // You need to implement this function in your DB actions
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { taskId } = req.body;
    try {
      const task = await toggleTaskCompletion(taskId);
      res.status(200).json({ success: true, task });
    } catch (error) {
      const err = error as Error;
      res.status(500).json({ success: false, error: err.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
