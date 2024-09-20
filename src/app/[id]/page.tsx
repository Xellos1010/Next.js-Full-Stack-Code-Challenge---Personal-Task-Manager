// personal-task-manager/src/app/[id]/page.tsx

import EditTaskActionBar from '@/components/EditTaskPage/EditTaskActionBar';
import EditTaskPageActionBar from '@/components/EditTaskPage/EditTaskPageActionBar';
import { fetchTask } from '@/db/actions';

export default async function TaskDetailPage({ params }: { params: { id: number } }) {
  const task = await fetchTask(Number(params.id));

  if (!task) {
    return <p>No task found!</p>;
  }

  return (
    <div className="p-10 bg-white shadow-md rounded-lg">
      <EditTaskPageActionBar />
      <h1 className="text-2xl font-bold mb-4 text-gray-800">{task.title}</h1>
      <p className="text-gray-700 mb-2"><strong>Description:</strong> {task.description}</p>
      <p className="text-gray-700 mb-2"><strong>Due Date:</strong> {task.dueDate}</p>
      <p className="text-gray-700 mb-4"><strong>Priority:</strong> {task.priority}</p>

      <EditTaskActionBar task={task} />
    </div>
  );
}
