"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";

const formSchema = z.object({
  agent_name: z.string().max(255, "Agent name must be at most 255 characters"),
  agent_description: z.string(),
  agent_cover: z.string().url("Must be a valid URL"),
  creator: z.string(),
  workspace_id: z
    .string({
      required_error: "Please select a casebook",
    })
    .min(1, "Please select which casebook this case belongs to"),
});

type CaseMetadataFormValues = z.infer<typeof formSchema>;

interface CaseMetadataFormProps {
  initialData: CaseMetadataFormValues | null;
  onFormDataChange: (data: CaseMetadataFormValues) => void; // Callback to update parent state
}

export const CaseMetadataForm: React.FC<CaseMetadataFormProps> = ({
  initialData,
  onFormDataChange,
}) => {
  const defaultValues = initialData || {
    agent_name: "",
    agent_description: "",
    agent_cover: "",
    creator: "",
    workspace_id: "",
  };
  const { user } = usePrepitUserSession();
  const userWorkspaces = Object.entries(user?.workspace_role || {});

  const form = useForm<CaseMetadataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  // Ensure initial data is also lifted to the parent
  useEffect(() => {
    onFormDataChange(defaultValues);
  }, []);

  // Use effect to update parent state whenever the form state changes
  form.watch((data) => {
    onFormDataChange(data as CaseMetadataFormValues);
  });

  return (
    <Form {...form}>
      <div className="space-y-8 w-full">
        <div className="md:grid md:grid-cols-3 gap-8">
          <FormField
            control={form.control}
            name="agent_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter case name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agent_description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Description</FormLabel>
                <FormControl>
                  <Input placeholder="Describe the case" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="agent_cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Case Cover Image URL</FormLabel>
                <FormControl>
                  <Input
                    type="url"
                    placeholder="Enter URL of the cover image"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="creator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Creator</FormLabel>
                <FormControl>
                  <Input placeholder="Enter creator's name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="workspace_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Casebook</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a casebook" />
                    </SelectTrigger>
                    <SelectContent>
                      {userWorkspaces.map(
                        ([workspace, role]) =>
                          // only show workspaces where the user is a "teacher"
                          role === "teacher" && (
                            <SelectItem key={workspace} value={workspace}>
                              {workspace}
                            </SelectItem>
                          ),
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </Form>
  );
};
