'use client';

import { deleteTaskApi } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type DeleteTaskButtonProps = {
  taskId: number;
};

export default function DeleteTaskButton({ taskId }: DeleteTaskButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  // Verbose logging for debugging
  console.log("[DeleteTaskButton] Component Rendered");
  console.log(`[DeleteTaskButton] isOpen State: ${isOpen}`);
  console.log(`[DeleteTaskButton] taskId: ${taskId}`);

  useEffect(() => {
    console.log(`[DeleteTaskButton] Modal isOpen state changed: ${isOpen}`);
  }, [isOpen]);

  const mutation = useMutation({
    mutationFn: () => deleteTaskApi(taskId),
    onSuccess: () => {
      console.log("[DeleteTaskButton] Task deleted successfully.");
      setIsOpen(false); // Close modal on success
      toast({
        title: "Task deleted successfully",
        description: `Task ID: ${taskId}`, //More task information can be added here
      });
      router.push('/');
    },
    onError: (error) => {
      console.error("[DeleteTaskButton] Error deleting task:", error);
    },
  });

  const handleDelete = () => {
    console.log("[DeleteTaskButton] handleDelete triggered.");
    mutation.mutate();
  };

  return (
    <>
      {/* Delete Task Button */}
      <Button
        onClick={() => {
          console.log("[DeleteTaskButton] Delete button clicked. Opening modal...");
          setIsOpen(true);
        }}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? 'Deleting...' : 'Delete Task'}
      </Button>

      {/* Modal Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {/* Trigger is here but hidden, handled by isOpen */}
          <span />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            Do you really want to delete this task? This action cannot be undone.
          </DialogDescription>
          <div className="flex justify-between space-x-4 mt-4">
            <Button
              onClick={handleDelete}
              disabled={mutation.isPending}
              className="flex-1"
            >
              {mutation.isPending ? 'Deleting...' : 'Yes'}
            </Button>
            <Button
              onClick={() => {
                console.log("[DeleteTaskButton] Cancel button clicked. Closing modal...");
                setIsOpen(false);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
