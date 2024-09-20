// personal-task-manager/src/components/EditTaskActionBar.tsx
import DeleteTaskButton from '@/components/TaskPage/Actions/DeleteTaskButton';
import EditTaskButton from '@/components/TaskPage/Actions/EditTaskButton';
import { Task } from '@/db/schema';

type EditTaskActionBarProps = {
  task: Task;
};

export default function AddTaskActionBar({ task }: EditTaskActionBarProps) {
  return (
    <div className="flex space-x-4">
      <DeleteTaskButton taskId={task.id} />
      <EditTaskButton task={task} />
    </div>
  );
}
