// personal-task-manager/src/app/[id]/DeleteTaskButton.tsx
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

async function deleteTaskApi(taskId: number): Promise<void> {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }
}

type DeleteTaskButtonProps = {
  taskId: number;
};

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: () => deleteTaskApi(taskId),
    onSuccess: () => {
      console.log('Task deleted successfully.');
      router.push('/');
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
      {mutation.isPending ? 'Deleting...' : 'Delete Task'}
    </Button>
  );
}
