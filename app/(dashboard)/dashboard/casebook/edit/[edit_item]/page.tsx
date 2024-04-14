"use client";

import BreadCrumb from "@/components/breadcrumb";
import { CaseStepEditor } from "@/components/forms/case-step-editor";
import { CaseMetadataForm } from "@/components/forms/case-metadata-form";
import NewTaskDialog from "@/components/kanban/new-task-dialog";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { usePathname } from "next/navigation";
import { useEffect, useState, Suspense, lazy } from "react";
import { Separator } from "@/components/ui/separator";

const breadcrumbItems = [
  { title: "Case Book", link: "/dashboard/casebook" },
  { title: "Edit", link: "/dashboard/casebook/edit" },
];

export default function CaseEdit() {
  const caseFormDataLocalStroageKey = "prepit-addCase-caseFormData";
  const caseStepsLocalStroageKey = "prepit-addCase-caseSteps";

  // Initialize state directly with local storage data or default values
  const loadInitialState = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue;
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  };

  const [caseFormData, setCaseFormData] = useState(() =>
    loadInitialState(caseFormDataLocalStroageKey, {}),
  );
  const [caseSteps, setCaseSteps] = useState(() =>
    loadInitialState(caseStepsLocalStroageKey, {}),
  );

  const pathname = usePathname();
  const currentMode =
    pathname.split("/").pop() === "new" ? "Adding" : "Editing";

  const handleSave = () => {
    // Combine data or send them separately to an API endpoint
    console.log("Saving case form data: ", caseFormData);
    console.log("Saving case steps: ", caseSteps);
  };

  useEffect(() => {
    // Load existing data from local storage for case form data
    const storedCaseFormData = localStorage.getItem(
      caseFormDataLocalStroageKey,
    );
    if (storedCaseFormData) {
      setCaseFormData(JSON.parse(storedCaseFormData));
    }

    // Load existing data from local storage for case steps
    const storedCaseSteps = localStorage.getItem(caseStepsLocalStroageKey);
    if (storedCaseSteps) {
      setCaseSteps(JSON.parse(storedCaseSteps));
    }
  }, []);

  // persist data to local storage upon change
  useEffect(() => {
    if (!caseFormData) return;
    localStorage.setItem(
      caseFormDataLocalStroageKey,
      JSON.stringify(caseFormData),
    );
  }, [caseFormData]);

  useEffect(() => {
    if (!caseSteps) return;
    localStorage.setItem(caseStepsLocalStroageKey, JSON.stringify(caseSteps));
  }, [caseSteps]);

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`${currentMode} Case`}
            description={`Case ${currentMode}`}
          />
          <Button
            variant="default"
            className="absolute right-12 top-32 z-10"
            onClick={() => handleSave()}
          >
            Save
          </Button>
        </div>
        <Separator />
        <Suspense fallback={<div>Loading...</div>}>
          {caseFormData && (
            <CaseMetadataForm
              initialData={caseFormData}
              onFormDataChange={setCaseFormData}
            />
          )}
          <Separator />
          {caseSteps && (
            <CaseStepEditor
              initialSteps={caseSteps}
              onStepsChange={setCaseSteps}
            />
          )}
        </Suspense>
      </div>
    </>
  );
}
