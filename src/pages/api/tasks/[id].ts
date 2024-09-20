// src/pages/api/tasks/[id].ts 
import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteTask, updateTask } from '@/db/actions';
import { Task } from '@/db/schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const taskId = Number(req.query.id);  // Extract task ID from the URL 

    if (!taskId) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    try {
        if (req.method === 'DELETE') {
            await deleteTask(taskId);
            return res.status(200).json({ message: 'Task deleted successfully' });
        } else if (req.method === 'PATCH') {
            const updatedTask: Task = req.body;
            const task = await updateTask(updatedTask);
            return res.status(200).json({ message: 'Task updated successfully', task });
        } else {
            res.setHeader('Allow', ['DELETE', 'PATCH']);
            res.status(405).end(`Method  ${req.method}  Not Allowed`);
        }
    } catch (error) {
        const err = error as Error;  // Type assertion to Error
        res.status(500).json({ message: 'Failed to process task', error: err.message });
    }
}
