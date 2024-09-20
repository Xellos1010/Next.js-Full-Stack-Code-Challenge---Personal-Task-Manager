'use client';

import { addTaskApi } from '@/api/tasks';
import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from '@tanstack/react-query';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';

const FormSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  dueDate: z.date().nullable().refine(val => val !== null, {
    message: "Due date is required."
  }),
  priority: z.string(),
});



export default function AddTaskForm() {
  const [popoverOpen, setPopoverOpen] = useState(false);

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (!data) throw new Error("Invalid data");
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

  const handleSubmit = (data: { title: string; description: string; dueDate: Date; priority: string; }) => {
    console.log('Handle submit triggered with data:', data);
    mutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset(); // Reset the form to its default values
    router.back(); // Navigate back to the previous page
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
                      selected={field.value || undefined}
                      onSelect={(date) => {
                        console.log('Date selected:', date);
                        field.onChange(date || undefined);
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
        <div className="flex space-x-2">
          <Button type="submit" disabled={mutation.isPending} className="flex-1">
            {mutation.isPending ? 'Adding...' : 'Add Task'}
          </Button>
          {/* Cancel Button */}
          <Button type="button" onClick={handleCancel} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
        {mutation.isError && <p className="text-red-500 mt-2">Error: {mutation.error?.message}</p>}
        {mutation.isSuccess && <p className="text-green-500 mt-2">Task added successfully!</p>}
      </form>
    </Form>
  );
}
