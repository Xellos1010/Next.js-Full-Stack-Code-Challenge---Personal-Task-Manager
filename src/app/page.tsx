// personal-task-manager/src/app/page.tsx 
import AddTaskButton from '@/components/AddTaskButton';
import RefreshTasksButton from '@/components/RefreshTasksButton';
import TaskList from '@/components/TaskList';

import { db } from '@/db/client';
import { tasks } from '@/db/schema';

// This runs on the server 
export default async function Home() {
  const taskList = await db.select().from(tasks);

  return (
    < main className="flex flex-col gap-10 p-10" >
      < div className="flex justify-between items-center" >
        < h1 className="text-xl font-bold" > Task List </ h1 >
        < div className="flex gap-2" >
          < AddTaskButton />
          < RefreshTasksButton />
        </ div >
      </ div >
      < TaskList initialTasks={taskList} />
    </ main >
  );
}
