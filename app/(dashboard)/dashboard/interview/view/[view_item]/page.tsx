"use client";

import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";

const breadcrumbItems = [
  { title: "Interviews", link: "/dashboard/interview" },
  { title: "View", link: "/dashboard/interview/view" },
];

export default function ViewInterview() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title="Your Interview"
          description="View your interview here"
        />
      </div>
    </div>
  );
}
