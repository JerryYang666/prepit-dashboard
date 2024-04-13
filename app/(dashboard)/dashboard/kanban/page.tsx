import BreadCrumb from "@/components/breadcrumb";
import { KanbanBoard } from "@/components/kanban/kanban-board";
import { ProductForm } from "@/components/forms/product-form";
import NewTaskDialog from "@/components/kanban/new-task-dialog";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const breadcrumbItems = [{ title: "Kanban", link: "/dashboard/kanban" }];
export default function page() {
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading title={`Case Editing`} description="Case Editing" />
          {/* <NewTaskDialog /> */}
          <Button
            variant="default"
            className="absolute right-12 top-32"
            // onClick={() => toast("Event has been created.")}
          >
            Save
          </Button>
        </div>
        <ProductForm
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
