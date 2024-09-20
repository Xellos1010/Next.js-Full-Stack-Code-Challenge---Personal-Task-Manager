// src/components/AddTaskForm.tsx (Client-Side)
'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

async function addTaskApi(newTask: any): Promise<any> {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
    });

    if (!response.ok) {
        throw new Error('Failed to add task');
    }

    return response.json();
}

export default function AddTaskForm() {
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: addTaskApi,
        onSuccess: () => {
            console.log('Task added successfully.');
            router.push('/'); // Redirect to task list or appropriate page
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
            {mutation.isError && <p className="text-red-500">Error: {mutation.error?.message}</p>}
            {mutation.isSuccess && <p className="text-green-500">Task added successfully!</p>}
        </form>
    );
}
