// personal-task-manager/src/app/[id]/edit/page.tsx
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
      router.push('/');
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
      updatedAt: new Date().toISOString(),
    };
    mutation.mutate(updatedTask);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError || !task) return <p>Error fetching task or no task found.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-10 bg-white shadow-md rounded-lg">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <Input name="title" defaultValue={task.title} required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea name="description" defaultValue={task.description} required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <Input type="date" name="dueDate" defaultValue={task.dueDate} required className="mt-1 w-full" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <Select name="priority" defaultValue={task.priority}>
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
        {mutation.isPending ? 'Updating...' : 'Update Task'}
      </Button>
      {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p className="text-green-500 mt-2">Task updated successfully!</p>}
    </form>
  );
}
