// src/app/add/page.tsx (Server-Side)
import React from 'react';
import AddTaskForm from '@/components/AddTaskForm';

export default function AddTaskPage() {
  return (
    <main className="p-10">
      <h1 className="text-xl font-bold mb-4">Add a New Task</h1>
      <AddTaskForm />
    </main>
  );
}
