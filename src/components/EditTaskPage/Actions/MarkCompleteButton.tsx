"use client";

import { toggleTaskCompletionApi } from '@/api/tasks';
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
      const result = await toggleTaskCompletionApi(taskId);
      setCompleted(result.isCompleted);
      console.log('Task toggled:', result);

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
