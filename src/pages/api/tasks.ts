// src/pages/api/tasks.ts (Server-Side API Route) 
import { addTask, getTasks } from '@/db/actions';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const newTask = req.body;  // No need to destructure, since the entire object is being sent 
            const task = await addTask(newTask);  // Pass the newTask object directly 
            return res.status(200).json({ message: 'Task added successfully', task });
        } catch (error) {
            const err = error as Error;  // Type assertion to Error 
            return res.status(500).json({ message: 'Failed to add task', error: err.message });
        }
    } else if (req.method === 'GET') {
        try {
            const tasks = await getTasks();
            return res.status(200).json(tasks);
        } catch (error) {
            const err = error as Error;  // Type assertion to Error 
            return res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
        }
    } else {
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method  ${req.method}  Not Allowed`);
    }
}
