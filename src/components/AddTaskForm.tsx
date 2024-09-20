// personal-task-manager/src/components/AddTaskForm.tsx
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { addTaskApi } from '@/api/tasks';

export default function AddTaskForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: addTaskApi,
    onSuccess: () => {
      router.push('/');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      priority: formData.get('priority') as string,
    };
    mutation.mutate(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input name="title" placeholder="Task Title" required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea name="description" placeholder="Task Description" required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <Input type="date" name="dueDate" required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <Select name="priority" defaultValue="Medium">
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={mutation.isPending} className="w-full mt-4">
        {mutation.isPending ? 'Adding...' : 'Add Task'}
      </Button>
      {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
      {mutation.isSuccess && <p className="text-green-500 mt-2">Task added successfully!</p>}
    </form>
  );
}
