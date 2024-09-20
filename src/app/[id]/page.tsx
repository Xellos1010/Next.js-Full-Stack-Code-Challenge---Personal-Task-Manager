// personal-task-manager/src/app/[id]/page.tsx
import { db } from '@/db/client';
import { tasks, Task } from '@/db/schema';
import { eq } from 'drizzle-orm';
import EditTaskButton from './EditTaskButton'; // Client component to trigger edit modal/form
import DeleteTaskButton from './DeleteTaskButton'; // Client component for task deletion

// Fetch task details from the database (Server Component)
async function fetchTask(id: number): Promise<Task | null> {
  const task = await db.select().from(tasks).where(eq(tasks.id, id)).execute();
  return task[0] || null;  // Ensure to handle no task found
}

// Server component to render task details
export default async function TaskDetailPage({ params }: { params: { id: number } }) {
  const task = await fetchTask(Number(params.id));

  if (!task) {
    return <p>No task found!</p>;
  }

  return (
    <div>
      <h1>{task.title}</h1>
      <p>Description: {task.description}</p>
      <p>Due Date: {task.dueDate}</p>
      <p>Priority: {task.priority}</p>

      {/* Client components for interactivity */}
      <EditTaskButton task={task} />
      <DeleteTaskButton taskId={task.id} />
    </div>
  );
}
