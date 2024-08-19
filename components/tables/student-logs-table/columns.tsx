"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import Link from "next/link";

export type InterviewHistory = {
  thread_id: string;
  agent_name: string;
  status: "Finished" | "In Progress";
  workspace_id: string;
  last_trial_timestamp: string;
};

type ContextAwareButtonProps = {
  workspace_id: string;
  thread_id: string;
  status: "Finished" | "In Progress";
  student_id: string;
  user_name: string;
};

const ContextAwareButtons = ({
  workspace_id,
  thread_id,
  status,
  student_id,
  user_name,
}: ContextAwareButtonProps) => {
  const { user } = usePrepitUserSession();
  const devMode =
    user?.system_admin || user?.workspace_role[workspace_id] === "teacher";
  return (
    <>
      <Link
        href={`/dashboard/student-logs/view/${thread_id}?studentName=${user_name}&studentID=${student_id}${devMode ? "&devMode=true" : ""}`}
      >
        <Button variant={status === "Finished" ? "default" : "outline"}>
          View
        </Button>
      </Link>
    </>
  );
};

export const columns: ColumnDef<InterviewHistory>[] = [
  {
    accessorKey: "thread_id",
    header: "Interview ID",
    cell: ({ row }) => {
      const thread_id = row.getValue("thread_id") as string;
      const short_thread_id = thread_id.slice(0, 8);
      return <span title={thread_id}>{short_thread_id}</span>;
    },
  },
  {
    accessorKey: "user_name",
    header: "Student Name",
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "agent_name",
    header: "Case Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    // show different colors for different status, as badge
    cell: ({ row }) => {
      const status = row.getValue("status") as "Finished" | "In Progress";
      return (
        <Badge
          className={`${status === "Finished" ? "bg-emerald-400" : "bg-orange-400"}`}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "workspace_id",
    header: "CaseBook",
    // show bold text for the workspace_id
    cell: ({ row }) => <b>{row.getValue("workspace_id")}</b>,
  },
  {
    accessorKey: "last_trial_timestamp",
    header: "Last Updated",
    cell: ({ row }) => {
      const utcTime = row.getValue("last_trial_timestamp") + "Z";
      const localTime = new Date(utcTime).toLocaleString();
      return <span title={`UTC: ${utcTime}`}>{localTime}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <ContextAwareButtons
            workspace_id={row.getValue("workspace_id")}
            thread_id={row.getValue("thread_id")}
            status={row.getValue("status")}
            student_id={row.getValue("student_id")}
            user_name={row.getValue("user_name")}
          />
        </div>
      );
    },
  },
];
