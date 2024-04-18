"use client";

import BreadCrumb from "@/components/breadcrumb";
import { CaseStepEditor } from "@/components/forms/case-step-editor";
import { CaseMetadataForm } from "@/components/forms/case-metadata-form";
import { FileUploadForm } from "@/components/forms/file-upload";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  addAgent,
  updateAgent,
  deleteAgent,
  getAgentbyID,
} from "@/app/api/agent/agent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const breadcrumbItems = [
  { title: "Case Book", link: "/dashboard/casebook" },
  { title: "Edit", link: "/dashboard/casebook/edit" },
];

export default function CaseEdit() {
  const caseFormDataLocalStorageKey = "prepit-addCase-caseFormData";
  const caseStepsLocalStorageKey = "prepit-addCase-caseSteps";
  const fileUploadsLocalStorageKey = "prepit-addCase-fileUploads";
  const [loading, setLoading] = useState(true);
  // State to track if there are unsaved changes
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathEnding = pathname.split("/").pop();
  const currentMode = pathEnding === "new" ? "Adding" : "Editing";

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
  const [fileUploads, setFileUploads] = useState(() =>
    loadInitialState(fileUploadsLocalStorageKey, {}),
  );

  const checkUUID = (uuid: string) => {
    return uuid.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
    );
  };

  useEffect(() => {
    let formDataLoaded = false;
    let stepsDataLoaded = false;

    const checkDataLoaded = () => {
      if (formDataLoaded && stepsDataLoaded) {
        setLoading(false);
      }
    };

    if (currentMode === "Adding") {
      formDataLoaded = true;
      stepsDataLoaded = true;
      checkDataLoaded();
    } else if (currentMode === "Editing") {
      if (pathEnding && checkUUID(pathEnding)) {
        getAgentbyID({ agent_id: pathEnding }).then((data) => {
          // parse each value in the system_prompt object as a string
          let sys_prompt = data.system_prompt;
          for (const key in sys_prompt) {
            sys_prompt[key] = JSON.parse(sys_prompt[key]);
          }
          setCaseSteps(sys_prompt);
          setCaseFormData({
            agent_name: data.agent_name,
            agent_description: data.agent_description,
            agent_cover: data.agent_cover,
            creator: data.creator,
          });
          setFileUploads(data.files);
          formDataLoaded = true;
          stepsDataLoaded = true;
          checkDataLoaded();
        });
      } else {
        toast.error("No case ID provided");
        router.push("/dashboard/casebook");
      }
    }
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

  useEffect(() => {
    localStorage.setItem(
      fileUploadsLocalStorageKey,
      JSON.stringify(fileUploads),
    );
  }, [fileUploads]);

  // Set isDirty to true whenever any of the form data changes
  useEffect(() => {
    setIsDirty(true);
  }, [caseFormData, caseSteps, fileUploads]);

  // Effect to handle the beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        // Standard for most browsers + IE
        const message = "You have unsaved changes. Are you sure you want to leave?";
        event.returnValue = message; // Gecko + IE
        return message; // Gecko + Webkit, Safari, Chrome etc.
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]); // This effect depends on the isDirty state

  if (loading) {
    return <div>Loading...</div>;
  }

  const postSaveCleanup = () => {
    toast.success("Case saved successfully");
    setIsDirty(false); // Reset isDirty state after saving
    localStorage.removeItem(caseFormDataLocalStorageKey);
    localStorage.removeItem(caseStepsLocalStorageKey);
    localStorage.removeItem(fileUploadsLocalStorageKey);
    router.push("/dashboard/casebook");
  };

  const handleSave = () => {
    if (currentMode === "Editing" && pathEnding && checkUUID(pathEnding)) {
      // update case
      updateAgent({
        agent_id: pathEnding,
        agent_name: caseFormData.agent_name,
        agent_description: caseFormData.agent_description,
        agent_cover: caseFormData.agent_cover,
        creator: caseFormData.creator,
        status: 1,
        allow_model_choice: true,
        system_prompt: caseSteps,
        files: fileUploads,
      }).then(() => {
        postSaveCleanup();
      });
      return;
    } else if (currentMode === "Adding") {
      addAgent({
        agent_name: caseFormData.agent_name,
        agent_description: caseFormData.agent_description,
        agent_cover: caseFormData.agent_cover,
        creator: caseFormData.creator,
        status: 1,
        allow_model_choice: true,
        system_prompt: caseSteps,
        files: fileUploads,
      }).then(() => {
        postSaveCleanup();
      });
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title={`${currentMode} Case`}
          description={`Case ${currentMode}`}
        />
        {currentMode === "Editing" && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 mr-24">
                Delete Case
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  case and all of its data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    if (!pathEnding || !checkUUID(pathEnding)) {
                      toast.error("No case ID provided");
                      return;
                    }
                    deleteAgent({ agent_id: pathEnding }).then(() => {
                      toast.success("Case deleted successfully");
                      localStorage.removeItem(caseFormDataLocalStorageKey);
                      localStorage.removeItem(caseStepsLocalStorageKey);
                      router.push("/dashboard/casebook");
                    });
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
        <FileUploadForm uploads={fileUploads} setUploads={setFileUploads} />
        <Separator />
        <CaseStepEditor initialSteps={caseSteps} onStepsChange={setCaseSteps} />
      </Suspense>
    </div>
  );
}
