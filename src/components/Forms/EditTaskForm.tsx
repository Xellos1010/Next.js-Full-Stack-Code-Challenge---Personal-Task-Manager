'use client';

import { updateTaskApi } from '@/api/tasks'; // API call for updating task
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Task } from '@/db/schema';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

// Update the schema to include 'id'
const EditTaskSchema = z.object({
  id: z.number(), // Task ID is required
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  priority: z.enum(["High", "Medium", "Low"]),
});

type EditTaskFormProps = {
  task: Task;
};

export default function EditTaskForm({ task }: EditTaskFormProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: Task) => {
      console.log("Submitting updated task:", data);  // Logging task data before API call
      const formattedData = {
        ...data,
        dueDate: data.dueDate.toISOString(),  // Convert date to string for API
      };
      console.log("Formatted task data:", formattedData);  // Logging formatted data
      return await updateTaskApi(formattedData);
    },
    onSuccess: () => {
      console.log("Task updated successfully");  // Logging success
      router.push('/');
    },
    onError: (error) => {
      console.error('Error updating task:', error);  // Logging error
    },
  });

  const form = useForm({
    resolver: zodResolver(EditTaskSchema),
    defaultValues: {
      id: task.id,  // Pass task ID as part of the form values
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate),
      priority: task.priority || 'Medium',
    },
  });

  const handleSubmit = (data: Task) => {
    console.log("Form submitted with data:", data);  // Logging form submission data
    mutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset(); // Reset the form to its default values
    router.back(); // Navigate back to the previous page
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* The task ID is included in form data but not displayed to the user */}
        <input type="hidden" {...form.register('id')} />

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
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                        console.log("Date selected:", date);  // Logging selected date
                        field.onChange(date);
                        setPopoverOpen(false); // Close the calendar on date selection
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
              <Select onValueChange={field.onChange} value={field.value}>
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

        <div className="flex space-x-2">
          {/* Update Button */}
          <Button type="submit" disabled={mutation.isPending} className="flex-1">
            {mutation.isPending ? 'Updating...' : 'Update Task'}
          </Button>

          {/* Cancel Button */}
          <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>

        {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
        {mutation.isSuccess && <p className="text-green-500 mt-2">Task updated successfully!</p>}
      </form>
    </Form>
  );
}
