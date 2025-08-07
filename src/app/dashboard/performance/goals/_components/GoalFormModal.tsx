import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Modal from "@/components/ui/modal";
import { useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { DateInput } from "@/components/ui/date-input";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import Loading from "@/components/ui/loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateMutation } from "@/hooks/useCreateMutation";
import { Goal } from "@/types/performance/goals.type";
import { useUpdateMutation } from "@/hooks/useUpdateMutation";

// Dynamic schema based on whether you're creating or editing
const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().min(1),
  startDate: z.string().min(1),
  cycleId: z.string().uuid(),
});

const editSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().min(1),
  startDate: z.string().min(1),
  cycleId: z.string().uuid(),
});

export type GoalInput = z.infer<typeof createSchema | typeof editSchema>;

type Props = {
  open: boolean;
  setOpen: (val: boolean) => void;
  initialData?: Goal | null;
};

export default function GoalModal({ open, setOpen, initialData }: Props) {
  const isEditing = !!initialData;
  const { data: session } = useSession();
  const axios = useAxiosAuth();

  // Use the appropriate schema based on whether we're editing or creating
  const formSchema = isEditing ? editSchema : createSchema;

  const form = useForm<GoalInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      dueDate: "",
      cycleId: "",
      ...initialData,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...form.getValues(),
        ...initialData,
      });
    }
  }, [initialData, form]);

  const createGoal = useCreateMutation({
    endpoint: "/api/performance-goals",
    successMessage: "Goal created successfully",
    refetchKey: "goals",
  });

  const updateGoal = useUpdateMutation({
    endpoint: `/api/performance-goals/${initialData?.id}`,
    successMessage: "Goal updated successfully",
    refetchKey: "goals",
  });

  const {
    data: cycles,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cycles"],
    queryFn: async () => {
      const res = await axios.get(`/api/performance-cycle`);
      return res.data.data;
    },
    enabled: !!session?.backendTokens.accessToken && open,
  });

  if (isLoading) return <Loading />;
  if (isError) {
    return <div>Error loading employees</div>;
  }

  const onSubmit = (data: GoalInput) => {
    if (isEditing) {
      updateGoal({
        ...data,
      });
    } else {
      createGoal({
        ...data,
        ownerIds: session?.user.id ? [session.user.id] : [],
      });
    }
    setOpen(false);
    form.reset();
  };

  console.log("Form values:", form.formState.errors);

  return (
    <Modal
      isOpen={open}
      onClose={() => setOpen(false)}
      title={isEditing ? "Edit Goal" : "Create Goal"}
      confirmText={isEditing ? "Update" : "Create"}
      cancelText="Cancel"
      onConfirm={form.handleSubmit(onSubmit)}
      isLoading={form.formState.isSubmitting}
    >
      <Form {...form}>
        <form className="space-y-6 ">
          <FormField
            name="title"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Name</FormLabel>
                <Input {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <Textarea {...field} className="resize-none" />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <DateInput value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="dueDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <DateInput value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              name="cycleId"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-3">
                  <FormLabel required>Performance Cycle</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a cycle" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {cycles.map((cycle: { id: string; name: string }) => (
                        <SelectItem key={cycle.id} value={cycle.id}>
                          {cycle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </Modal>
  );
}
