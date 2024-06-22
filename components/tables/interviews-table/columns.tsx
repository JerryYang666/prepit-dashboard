"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export type InterviewHistory = {
  thread_id: string;
  agent_name: string;
  status: "Finished" | "In Progress";
  workspace_id: string;
  last_trial_timestamp: string;
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
          <Button
            variant={
              row.getValue("status") === "Finished" ? "outline" : "default"
            }
          >
            {row.getValue("status") === "Finished" ? "Feedback" : "Continue"}
          </Button>
          <Button
            variant={
              row.getValue("status") === "Finished" ? "default" : "outline"
            }
          >
            View
          </Button>
        </div>
      );
    },
  },
];
