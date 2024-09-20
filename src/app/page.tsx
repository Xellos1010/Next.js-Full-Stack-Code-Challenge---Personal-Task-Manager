// personal-task-manager/src/app/page.tsx 
import TasksPage from '@/components/TasksDisplayPage';

import { db } from '@/db/client';
import { tasks } from '@/db/schema';

// This runs on the server 
export default async function Home() {
  const taskList = await db.select().from(tasks);

  return (
    < main className="flex flex-col gap-10 p-10" >
      < div className="flex justify-between items-center" >
        < h1 className="text-xl font-bold" > Simple Task Management </ h1 >
      </ div >
      < TasksPage initialTasks={taskList} />
    </ main >
  );
}
