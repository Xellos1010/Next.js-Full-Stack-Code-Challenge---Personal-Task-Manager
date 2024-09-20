// personal-task-manager/src/components/TasksDisplayPage/index.tsx

import { fetchTasks } from '@/api/tasks';
import TaskList from './TaskList';
import { Task } from '@/db/schema';
import ActionBar from './ActionBar';

// This function will get the tasks on the server-side
export async function getServerSideProps() {
    const initialTasks = await fetchTasks();
    return {
        props: {
            initialTasks,
        },
    };
}

export default function TasksPage({ initialTasks }: { initialTasks: Task[] }) {
    return (
        <main className="p-10">
            <ActionBar />
            <TaskList initialTasks={initialTasks} />
        </main>
    );
}