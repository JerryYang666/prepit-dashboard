"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prepitInterviewPageUrl } from "@/constants/constants";
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
};

const ContextAwareButtons = ({
  workspace_id,
  thread_id,
  status,
}: ContextAwareButtonProps) => {
  const { user } = usePrepitUserSession();
  const devMode =
    user?.system_admin || user?.workspace_role[workspace_id] === "teacher";
  return (
    <>
      {status === "In Progress" && (
        <Button
          onClick={() => {
            window.open(
              `${prepitInterviewPageUrl}/${thread_id}${
                devMode ? "?devMode=true" : ""
              }`,
              "_blank",
            );
          }}
          variant={"default"}
        >
          {"Continue"}
        </Button>
      )}
      <Link
        href={`/dashboard/interview/view/${thread_id}${devMode ? "?devMode=true" : ""}`}
      >
        <Button variant={status === "Finished" ? "default" : "outline"}>
          {status === "Finished" ? "View Feedback" : "View"}
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
          />
        </div>
      );
    },
  },
];
