'use client'; // Mark this component as a client component

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Task } from '@/db/schema';
import { fetchTask } from '@/db/actions';

async function fetchTasks(): Promise<Task[]> {
  // Fetch logic if you want to use client-side fetching
  const res = await fetch('/api/tasks');
  return res.json();
}

export default function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const { data: taskList = initialTasks, isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    initialData: initialTasks,
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Task List</h2>
      <ul>
        {taskList.map((task) => (
          <li key={task.id} className="flex justify-between">
            <div>
              <span className="font-semibold">{task.title}</span>
              <span className="text-gray-500"> - {task.dueDate}</span>
              <span
                className={`ml-2 ${
                  task.priority === 'High'
                    ? 'text-red-500'
                    : task.priority === 'Medium'
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                {task.priority}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
