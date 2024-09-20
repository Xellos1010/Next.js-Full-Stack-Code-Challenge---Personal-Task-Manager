// src/components/RefreshTasksButton.tsx 
'use client';

import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

export default function RefreshTasksButton() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    // Invalidate the query to refetch the tasks 
    queryClient.invalidateQueries({ queryKey: ['tasks'], refetchType: 'active' });
  };

  return (
    <Button onClick={handleRefresh}>
      Refresh Tasks
    </Button>
  );
}