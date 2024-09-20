// src/components/AddTaskButton.tsx 
'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AddTaskButton() {
  const router = useRouter();

  const handleAddTask = () => {
    router.push('/add');
  };

  return (
    < Button onClick={handleAddTask} >
      Add Task
    </ Button >
  );
}
