// src/components/RefreshTasksButton.tsx 
import { Button } from '@/components/ui/button';

type RefreshTasksButtonProps = {
  onClick: () => void;
};

export default function RefreshTasksButton({ onClick }: RefreshTasksButtonProps) {
  return (
    <Button onClick={onClick}>
      Refresh Tasks
    </Button>
  );
}
