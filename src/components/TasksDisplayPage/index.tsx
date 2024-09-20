// personal-task-manager/src/components/TasksDisplayPage/index.tsx
import dynamic from "next/dynamic";
import { fetchTasks } from "@/api/tasks";
import { Task } from "@/db/schema";

// Dynamically import the TaskManager with no SSR
const TaskManager = dynamic(() => import("./TaskManager"), { ssr: false });

export async function getServerSideProps() {
  const initialTasks = await fetchTasks();
  return {
    props: {
      initialTasks,
    },
  };
}

export default function TasksPage({ initialTasks }: { initialTasks: Task[] }) {
  return <TaskManager initialTasks={initialTasks} />;
}
