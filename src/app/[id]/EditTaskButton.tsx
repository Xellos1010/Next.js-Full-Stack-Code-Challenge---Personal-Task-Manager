// personal-task-manager/src/app/[id]/EditTaskButton.tsx
'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Task } from '@/db/schema';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

async function updateTaskApi(updatedTask: Task): Promise<Task> {
    const response = await fetch(`/api/tasks/${updatedTask.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
  
    if (!response.ok) {
      throw new Error('Failed to update task');
    }
  
    return response.json();
  }

type EditTaskButtonProps = {
    task: Task;
};

export default function EditTaskButton({ task }: EditTaskButtonProps) {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: updateTaskApi,
        onSuccess: () => {
            console.log('Task updated successfully.');
            setIsEditing(false);
            router.refresh();
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const updatedTask: Task = {
            ...task,
            title: String(formData.get('title')),
            description: String(formData.get('description')),
            dueDate: String(formData.get('dueDate')),
            priority: String(formData.get('priority')),
            updatedAt: new Date().toISOString(),
        };
        mutation.mutate(updatedTask);
    };

    if (!isEditing) {
        return <Button onClick={() => setIsEditing(true)}>Edit Task</Button>;
    }

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
                {mutation.isPending ? 'Updating...' : 'Save'}
            </Button>
            {mutation.isError && <p className="text-red-500">Error: {mutation.error.message}</p>}
            {mutation.isSuccess && <p className="text-green-500">Task updated successfully!</p>}
        </form>
    );
}
