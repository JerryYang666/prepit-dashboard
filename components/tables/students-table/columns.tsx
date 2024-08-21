"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  WorkspaceUser,
  removeStudentFromWorkspace,
  RemoveStudentFromWorkspaceRequest,
} from "@/app/api/workspace/workspace";
import { toast } from "sonner";

type ContextAwareButtonProps = {
  user_id: number;
  student_id: string;
  workspace_id: string;
  role: "teacher" | "student" | "pending";
};

const ContextAwareButtons = ({
  user_id,
  student_id,
  workspace_id,
  role,
}: ContextAwareButtonProps) => {
  const removeUserFromWorkspace = () => {
    let removeRequest: RemoveStudentFromWorkspaceRequest = {
      workspace_id: workspace_id,
      student_id: student_id,
    };
    if (user_id) {
      removeRequest.user_id = user_id;
    }
    removeStudentFromWorkspace(removeRequest).then(() => {
      toast.success("User removed successfully");
      window.location.reload();
    });
  };
  return (
    <>
      {role !== "teacher" && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="text-red-600" size={"sm"}>
              Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this
                user from this workspace. After deletion, please re-select casebook 
                to see the updated list of students.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={removeUserFromWorkspace} className="bg-red-600">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export const columns: ColumnDef<WorkspaceUser>[] = [
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "user_name",
    header: "Student Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    // show different colors for different status, as badge
    cell: ({ row }) => {
      const role = row.getValue("role") as "student" | "teacher" | "pending";
      return (
        <Badge
          className={`${
            role === "student"
              ? "bg-teal-500 text-gray-100"
              : role === "teacher"
                ? "bg-sky-700 text-gray-100"
                : "bg-gray-500 text-gray-100"
          }`}
        >
          {role}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <ContextAwareButtons
            workspace_id={row.original.workspace_id}
            student_id={row.getValue("student_id")}
            user_id={row.original.user_id}
            role={row.getValue("role") as "teacher" | "student" | "pending"}
          />
        </div>
      );
    },
  },
];
