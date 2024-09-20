'use client';

import { addTaskApi } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from './ui/form';

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  priority: z.string(),
});

export default function AddTaskForm() {
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const formattedData = {
        ...data,
        dueDate: data.dueDate.toISOString()
      };
      console.log('Submitting task with data:', formattedData);
      return await addTaskApi(formattedData);
    },
    onSuccess: () => {
      console.log('Task added successfully!');
      router.push('/');
    },
    onError: (error) => {
      console.error('Error adding task:', error);
    },
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: { // Ensure initial state has valid values to avoid undefined errors.
      title: '',
      description: '',
      dueDate: null,
      priority: 'Medium'
    }
  });

  const handleSubmit = (data) => {
    console.log('Handle submit triggered with data:', data);
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <Input {...form.register('title')} placeholder="Task Title" required className="mt-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Textarea {...form.register('description')} placeholder="Task Description" required className="mt-1 w-full" />
        </div>
        <div>
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-[240px] pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={date => {
                        console.log('Date selected:', date);
                        field.onChange(date);
                      }}
                      disabled={(date) => {
                        const todayTimestamp = new Date().setHours(0, 0, 0, 0);
                        return date && date.getTime() < todayTimestamp;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Your due date helps you keep track of deadlines.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <Controller
            name="priority"
            control={form.control}
            render={({ field }) => (
              <Select {...field} defaultValue="Medium">
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <Button type="submit" disabled={mutation.isPending} className="w-full mt-4">
          {mutation.isPending ? 'Adding...' : 'Add Task'}
        </Button>
        {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
        {mutation.isSuccess && <p className="text-green-500 mt-2">Task added successfully!</p>}
      </form>
    </Form>
  );
}
