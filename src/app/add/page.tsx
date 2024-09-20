// src/app/add/page.tsx
'use client';

import { useMutation } from '@tanstack/react-query';
import { addTask } from '@/db/actions';
import { NewTask, Task } from '@/db/schema';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function AddTask() {
  const router = useRouter();

  const mutation = useMutation<Task, Error, NewTask>({
    mutationFn: addTask,
    onSuccess: () => {
      console.log('Task added successfully.');
      router.push('/'); // Redirect to task list or appropriate page
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTask: NewTask = {
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      dueDate: String(formData.get('dueDate')),
      priority: String(formData.get('priority')),
    };
    mutation.mutate(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input name="title" placeholder="Task Title" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea name="description" placeholder="Task Description" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <Input type="date" name="dueDate" required />
      </div>
      <div>
        <label className="block text-sm font-medium">Priority</label>
        <Select name="priority" defaultValue="Medium">
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="High">High</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Adding...' : 'Add Task'}
      </Button>
      {mutation.isError && <p className="text-red-500">Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p className="text-green-500">Task added successfully!</p>}
    </form>
  );
}
