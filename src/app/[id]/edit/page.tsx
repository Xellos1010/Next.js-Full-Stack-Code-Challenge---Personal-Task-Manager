// src / app / [id] / edit / page.tsx

import EditTaskForm from '@/components/Forms/EditTaskForm';
import { fetchTask } from '@/db/actions';

export default async function EditTaskPage({ params }: { params: { id: number } }) {
  const task = await fetchTask(Number(params.id));

  if (!task) {
    return <p>No task found!</p>;
  }

  return (
    <div className="p-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Edit Task</h1>
      <EditTaskForm task={task} />
    </div>
  );
}
