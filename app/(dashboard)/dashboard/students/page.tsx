import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";

const breadcrumbItems = [{ title: "Students", link: "/dashboard/students" }];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        {"This is where teachers can manage students in the course. Work in progress, coming soon."}
      </div>
    </ScrollArea>
  );
}
