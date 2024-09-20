// personal-task-manager/src/components/TasksDisplayPage/TaskManager.tsx
'use client';

import { fetchTasks } from "@/api/tasks";
import { Task } from "@/db/schema";
import { useEffect, useState } from "react";
import ActionBar from "./ActionBar";
import TaskList from "./TaskList";

interface TaskManagerProps {
  initialTasks: Task[];
}

export default function TaskManager({ initialTasks }: TaskManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const refreshTasks = async () => {
    const updatedTasks = await fetchTasks();
    setTasks(updatedTasks);
  };

  useEffect(() => {
    // Optionally, you can fetch and set tasks on component mount. Comment out so that the refresh button functionality can be tested.
    refreshTasks();
  }, []);

  return (
    <main className="p-10">
      <ActionBar onRefresh={refreshTasks} />
      <TaskList tasks={tasks} />
    </main>
  );
}
