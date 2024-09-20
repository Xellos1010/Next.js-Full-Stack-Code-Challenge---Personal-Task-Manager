// src/components/EditTaskPage/Actions/MarkCompleteButton.tsx
"use client";

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface MarkCompleteButtonProps {
  taskId: number;
  isCompleted: boolean;  // Add a new prop to track the task's completion status
}

const MarkCompleteButton: React.FC<MarkCompleteButtonProps> = ({ taskId, isCompleted }) => {
  const [completed, setCompleted] = useState(isCompleted); // Track completion status
  const router = useRouter();

  useEffect(() => {
    setCompleted(isCompleted);
  }, [isCompleted]);

  const handleToggleCompletion = async () => {
    try {
      const response = await fetch('/api/toggleTaskCompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle task completion status');
      }

      const result = await response.json();
      setCompleted(result.task.isCompleted);
      console.log('Task toggled:', result.task);

      // Optionally refresh or notify the user
      router.push('/');

    } catch (error) {
      const err = error as Error;
      console.error(err.message);
    }
  };

  return (
    <Button onClick={handleToggleCompletion}>
      {completed ? 'Mark as Incomplete' : 'Mark as Completed'}
    </Button>
  );
};

export default MarkCompleteButton;
