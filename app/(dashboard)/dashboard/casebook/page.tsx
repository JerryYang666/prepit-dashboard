import BreadCrumb from "@/components/breadcrumb";
import CaseBook from "@/components/tables/CaseBook";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import type { Metadata } from "next";

const breadcrumbItems = [{ title: "Case Books", link: "/dashboard/casebook" }];

export const metadata: Metadata = {
  title: "prepit.ai - Case Books",
  description: "Access your cases",
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
          <Heading title={`Case Books`} description="Manage your cases" />
        </div>
        <Separator />

        <CaseBook />
      </div>
    </>
  );
}
