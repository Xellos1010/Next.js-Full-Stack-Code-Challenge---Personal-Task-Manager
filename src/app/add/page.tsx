// personal-task-manager/src/app/add/page.tsx
import AddTaskForm from '@/components/Forms/AddTaskForm';

export default function AddTaskPage() {
  return (
    <main className="p-10 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add a New Task</h1>
      <AddTaskForm />
    </main>
  );
}
