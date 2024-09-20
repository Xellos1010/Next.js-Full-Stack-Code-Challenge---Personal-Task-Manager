// src/app/[id]/DeleteTaskButton.tsx
'use client';

import { useMutation } from '@tanstack/react-query';
import { deleteTask } from '@/db/actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

type DeleteTaskButtonProps = {
  taskId: number;
};

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => deleteTask(taskId),
    onSuccess: () => {
      console.log('Task deleted successfully.');
      router.push('/'); // Redirect to task list or another appropriate page
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? 'Deleting...' : 'Delete Task'}
    </Button>
  );
}
