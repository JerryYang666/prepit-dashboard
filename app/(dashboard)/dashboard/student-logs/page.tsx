import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import StudentLogs from "@/components/tables/StudentLogs";
import type { Metadata } from "next";

const breadcrumbItems = [{ title: "Student Logs", link: "/dashboard/student-logs" }];

export const metadata: Metadata = {
  title: "prepit.ai admin - Student Logs",
  description: "View logs of all students' interviews.",
};

type paramsProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function page({ searchParams }: paramsProps) {
  return (
    <>
      <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="flex items-start justify-between">
          <Heading
            title={`Student Interview Logs`}
            description="View logs of all students' interviews."
          />
        </div>
        <Separator />

        <StudentLogs />
      </div>
    </>
  );
}
