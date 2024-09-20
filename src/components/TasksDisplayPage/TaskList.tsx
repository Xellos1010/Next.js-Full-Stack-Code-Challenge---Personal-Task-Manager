// personal-task-manager/src/components/task-list.tsx

import { fetchTasks } from '@/api/tasks';
import { Task } from '@/db/schema';
import TaskDisplay from '../TaskDisplay';

async function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  // Fetch tasks on the server-side
  const tasks = await fetchTasks();

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Task List</h2>
      <div className="max-h-96 overflow-y-auto"> {/* Set max height and allow scrolling */}
        <ul className="space-y-4">
        {tasks.map((task) => (
            <TaskDisplay key={task.id} task={task} /> 
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TaskList;
