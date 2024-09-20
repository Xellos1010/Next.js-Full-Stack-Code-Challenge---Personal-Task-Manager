import { Button } from '@/components/ui/button';
import { Task } from '@/db/schema';
import Link from 'next/link';

type EditTaskButtonProps = {
    task: Task;
};

export default function EditTaskButton({ task }: EditTaskButtonProps) {
    return (
        <Link href={`${task.id}/edit`}>
            <Button>Edit Task</Button>
        </Link>
    );
}
