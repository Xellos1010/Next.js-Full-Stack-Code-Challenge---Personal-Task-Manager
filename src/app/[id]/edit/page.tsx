// src/app/[id]/edit/page.tsx
'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { Task } from '@/db/schema';
import { fetchTask, updateTask } from '@/db/actions';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function EditTaskPage({ params }: { params: { id: number } }) {
  const router = useRouter();

  const { data: task, isLoading, isError } = useQuery<Task>({
    queryKey: ['task', params.id],
    queryFn: () => fetchTask(Number(params.id)),
  });

  const mutation = useMutation<Task, Error, Task>({
    mutationFn: updateTask,
    onSuccess: () => {
      console.log('Task updated successfully.');
      router.push('/'); // Redirect to task list or appropriate page
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedTask: Task = {
      ...task!,
      title: String(formData.get('title')),
      description: String(formData.get('description')),
      dueDate: String(formData.get('dueDate')),
      priority: String(formData.get('priority')),
      updatedAt: new Date().toISOString(), // Optionally handle timestamp
    };
    mutation.mutate(updatedTask);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !task) return <p>Error fetching task or no task found.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input name="title" defaultValue={task.title} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea name="description" defaultValue={task.description} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Due Date</label>
        <Input type="date" name="dueDate" defaultValue={task.dueDate} required />
      </div>
      <div>
        <label className="block text-sm font-medium">Priority</label>
        <Select name="priority" defaultValue={task.priority}>
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
        {mutation.isPending ? 'Updating...' : 'Update Task'}
      </Button>
      {mutation.isError && <p className="text-red-500">Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p className="text-green-500">Task updated successfully!</p>}
    </form>
  );
}
