// personal-task-manager/src/app/add/page.tsx
import React from 'react';
import AddTaskForm from '@/components/AddTaskForm';
import AddTaskPageActionBar from '@/components/AddTaskPageActionBar';

export default function AddTaskPage() {
  return (
    <main className="p-10 bg-white shadow-md rounded-lg">
      <AddTaskPageActionBar/>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add a New Task</h1>
      <AddTaskForm />
    </main>
  );
}
