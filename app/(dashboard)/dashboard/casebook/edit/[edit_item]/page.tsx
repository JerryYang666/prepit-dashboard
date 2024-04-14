"use client";

import BreadCrumb from "@/components/breadcrumb";
import { CaseStepEditor } from "@/components/forms/case-step-editor";
import { CaseMetadataForm } from "@/components/forms/case-metadata-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, Suspense } from "react";
import { usePathname } from "next/navigation";

const breadcrumbItems = [
  { title: "Case Book", link: "/dashboard/casebook" },
  { title: "Edit", link: "/dashboard/casebook/edit" },
];

export default function CaseEdit() {
  const caseFormDataLocalStorageKey = "prepit-addCase-caseFormData";
  const caseStepsLocalStorageKey = "prepit-addCase-caseSteps";
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const currentMode =
    pathname.split("/").pop() === "new" ? "Adding" : "Editing";

  const loadInitialState = (key: string, defaultValue: any) => {
    if (typeof window === "undefined") return defaultValue;
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  };

  const [caseFormData, setCaseFormData] = useState(() =>
    loadInitialState(caseFormDataLocalStorageKey, {}),
  );
  const [caseSteps, setCaseSteps] = useState(() =>
    loadInitialState(caseStepsLocalStorageKey, {}),
  );

  useEffect(() => {
    let formDataLoaded = false;
    let stepsDataLoaded = false;

    const checkDataLoaded = () => {
      if (formDataLoaded && stepsDataLoaded) {
        setLoading(false);
      }
    };

    // Load existing data from local storage for case form data
    const storedCaseFormData = localStorage.getItem(
      caseFormDataLocalStorageKey,
    );
    if (storedCaseFormData) {
      setCaseFormData(JSON.parse(storedCaseFormData));
    }
    formDataLoaded = true;

    // Load existing data from local storage for case steps
    const storedCaseSteps = localStorage.getItem(caseStepsLocalStorageKey);
    if (storedCaseSteps) {
      setCaseSteps(JSON.parse(storedCaseSteps));
    }
    stepsDataLoaded = true;

    checkDataLoaded();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      caseFormDataLocalStorageKey,
      JSON.stringify(caseFormData),
    );
  }, [caseFormData]);

  useEffect(() => {
    localStorage.setItem(caseStepsLocalStorageKey, JSON.stringify(caseSteps));
  }, [caseSteps]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    console.log("Saving...");
    console.log(caseFormData);
    console.log(caseSteps);
  };

  return (
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
        <CaseMetadataForm
          initialData={caseFormData}
          onFormDataChange={setCaseFormData}
        />
        <Separator />
        <CaseStepEditor initialSteps={caseSteps} onStepsChange={setCaseSteps} />
      </Suspense>
    </div>
  );
}
