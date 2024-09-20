// personal-task-manager/src/components/ActionBar.tsx
import AddTaskButton from './Actions/AddTaskButton';
import RefreshTasksButton from './Actions/RefreshTasksButton';

type ActionBarProps = {
  onRefresh: () => void;
};

export default function ActionBar({ onRefresh }: ActionBarProps) {
  return (
    <div className="flex gap-2 items-center bg-gray-100 p-4 rounded-md shadow-sm">
      <AddTaskButton />
      <RefreshTasksButton onClick={onRefresh} />
    </div>
  );
}
