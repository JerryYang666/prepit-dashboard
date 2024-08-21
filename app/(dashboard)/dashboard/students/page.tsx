import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";
import Students from "@/components/tables/Students";
import { Card } from "@/components/ui/card";

const breadcrumbItems = [{ title: "Students", link: "/dashboard/students" }];

export const metadata: Metadata = {
  title: "prepit.ai admin - Students",
  description: "Manage students in the course.",
};

export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Students`}
            description="Manage students in the course."
          />
        </div>
        <Separator />

        <Card className="w-1/2 p-2">
          {
            "This is where teachers can manage students in the course. Work in progress, coming soon."
          }
        </Card>

        {/* <Students /> */}
      </div>
    </ScrollArea>
  );
}
