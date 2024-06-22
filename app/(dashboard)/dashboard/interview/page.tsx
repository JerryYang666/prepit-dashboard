import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import InterviewHistory from "@/components/tables/InterviewHistory";
import type { Metadata } from "next";

const breadcrumbItems = [{ title: "Interviews", link: "/dashboard/interview" }];

export const metadata: Metadata = {
  title: "prepit.ai - Interview History",
  description: "View all the interviews.",
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
            title={`Interview History`}
            description="View all the interviews."
          />
        </div>
        <Separator />

        <InterviewHistory />
      </div>
    </>
  );
}
