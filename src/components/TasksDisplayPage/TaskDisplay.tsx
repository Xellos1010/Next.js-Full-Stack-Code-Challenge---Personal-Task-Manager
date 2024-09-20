// personal-task-manager/src/components/Task.tsx

import { Task } from '@/db/schema';

interface TaskProps {
  task: Task;
}

export default function TaskDisplay({ task }: TaskProps) {
  return (
    <li>
      <a href={`/${task.id}`} className="block">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 transition">
          <div>
            <span className="font-semibold text-lg text-gray-900">
              {task.title}
            </span>
            <span className="text-gray-500 ml-2">
              - Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
            {task.isCompleted && <span className="ml-2 text-green-700">[Completed]</span>}
          </div>
          <div
            className={`text-sm font-medium ${task.priority === 'High'
              ? 'text-red-600 bg-red-100 px-2 py-1 rounded'
              : task.priority === 'Medium'
                ? 'text-yellow-600 bg-yellow-100 px-2 py-1 rounded'
                : 'text-green-600 bg-green-100 px-2 py-1 rounded'
              }`}
          >
            {task.priority}
          </div>
        </div>
      </a>
    </li>
  );
}
