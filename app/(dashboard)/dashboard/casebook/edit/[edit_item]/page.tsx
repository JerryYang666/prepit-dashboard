"use client";

import BreadCrumb from "@/components/breadcrumb";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { CaseMetadataForm } from "@/components/forms/case-metadata-form";
import NewTaskDialog from "@/components/kanban/new-task-dialog";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Case Book", link: "/dashboard/casebook" },
  { title: "Edit", link: "/dashboard/casebook/edit" },
];
export default function page() {
  const pathname = usePathname();
  const currentMode =
    pathname.split("/").pop() === "new" ? "Adding" : "Editing";

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`${currentMode} Case`}
            description={`Case ${currentMode}`}
          />
          {/* <NewTaskDialog /> */}
          <Button
            variant="default"
            className="absolute right-12 top-32"
            // onClick={() => toast("Event has been created.")}
          >
            Save
          </Button>
        </div>
        <CaseMetadataForm
          categories={[
            { _id: "shirts", name: "shirts" },
            { _id: "pants", name: "pants" },
          ]}
          initialData={null}
          key={null}
        />
        <KanbanBoard />
      </div>
    </>
  );
}
