// personal-task-manager/src/components/EditTaskActionBar.tsx
import { Task } from '@/db/schema';
import DeleteTaskButton from './Actions/DeleteTaskButton';
import EditTaskButton from './Actions/EditTaskButton';
import MarkCompleteButton from './Actions/MarkCompleteButton';

type EditTaskActionBarProps = {
  task: Task;
};

export default function EditTaskActionBar({ task }: EditTaskActionBarProps) {
  return (
    <div className={`flex justify-left gap-x-4`}>
      <DeleteTaskButton taskId={task.id} />
      <EditTaskButton task={task} />
      <MarkCompleteButton taskId={task.id} isCompleted={task.isCompleted} />
    </div>
  );
}
