import React from 'react';
import { db } from '@/db/client';
import { tasks } from '@/db/schema';
import TaskList from '@/components/task-list';

// This runs on the server
export default async function Home() {
  const taskList = await db.select().from(tasks);

  return (
    <main className="flex flex-col gap-10 p-10">
      <TaskList initialTasks={taskList} />
    </main>
  );
}
