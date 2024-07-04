import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { CircleHelp } from "lucide-react";

interface Step {
  title: string;
  instruction: string;
  information: string;
  answer?: string;
}

interface Steps {
  [key: number]: Step;
}

interface CaseStepEditorProps {
  initialSteps: Steps;
  onStepsChange: (steps: Steps) => void;
}

export const CaseStepEditor: React.FC<CaseStepEditorProps> = ({
  initialSteps,
  onStepsChange,
}) => {
  const [steps, setSteps] = useState<Steps>(initialSteps);
  const [newSectionTitle, setNewSectionTitle] = useState("");

  const handleStepChange = (
    index: number,
    field: keyof Step,
    value: string,
  ) => {
    const updatedSteps = {
      ...steps,
      [index]: { ...steps[index], [field]: value },
    };
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const deleteStep = (index: number) => {
    const updatedSteps = Object.keys(steps)
      .filter((key) => parseInt(key) !== index)
      .reduce(
        (result, current, i) => {
          result[i] = steps[parseInt(current)]; // Cast 'current' to number
          return result;
        },
        {} as { [key: number]: Step },
      );
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const addNewStep = (title: string) => {
    const newIndex = Object.keys(steps).length;
    const newStep: Step = {
      title,
      instruction: "",
      information: "",
      answer: "",
    };
    const updatedSteps = { ...steps, [newIndex]: newStep };
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    setNewSectionTitle("");
  };

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(steps).map(([index, step]) => (
        <Card key={index} className="flex flex-col gap-4 p-4 relative">
          <div className="absolute top-0 right-0 p-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" size={"sm"} className="ml-1">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => deleteStep(Number(index))}
                  className="text-red-600"
                >
                  Delete Section
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Label className="mt-2 text-lg font-bold">Section {index}</Label>
          <Input
            value={step.title}
            onChange={(e) =>
              handleStepChange(Number(index), "title", e.target.value)
            }
          />
          <TooltipProvider delayDuration={0} skipDelayDuration={50}>
            <div className="flex items-center gap-2">
              <Badge
                className="font-bold w-fit size-8 text-sm"
                variant={"secondary"}
              >
                Instruction
              </Badge>
              <Tooltip>
                <TooltipTrigger className="w-fit h-fit">
                  <CircleHelp className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Put instructions for the interviewer AI here.</p>
                  <p>Organize the instructions into actionable steps.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              value={step.instruction}
              onChange={(e) =>
                handleStepChange(Number(index), "instruction", e.target.value)
              }
              className="h-32"
            />
            <div className="flex items-center gap-2">
              <Badge
                className="font-bold w-fit size-8 text-sm"
                variant={"secondary"}
              >
                Information
              </Badge>
              <Tooltip>
                <TooltipTrigger className="w-fit h-fit">
                  <CircleHelp className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Put information about this section here.</p>
                  <p>Include any context or background information</p>
                  <p> that the interviewer should know.</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              value={step.information}
              onChange={(e) =>
                handleStepChange(Number(index), "information", e.target.value)
              }
              className="h-32"
            />
            <div className="flex items-center gap-2">
              <Badge
                className="font-bold w-fit size-8 text-sm"
                variant={"secondary"}
              >
                Answer
              </Badge>
              <Tooltip>
                <TooltipTrigger className="w-fit h-fit">
                  <CircleHelp className="size-5" />
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Put recommended answers here.</p>
                  <p>
                    You can also include any additional instruction for the
                    feedback provider.
                  </p>
                  <p className="font-bold">
                    The content here will NOT be provided during the interview
                  </p>
                  <p className="font-bold">
                    and will ONLY be visible to the feedback provider AI.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Textarea
              value={step.answer}
              onChange={(e) =>
                handleStepChange(Number(index), "answer", e.target.value)
              }
              className="h-32"
            />
          </TooltipProvider>
        </Card>
      ))}
      <Dialog>
        <DialogTrigger asChild>
          <Button>+ Add New Section</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Step</DialogTitle>
            <DialogDescription>
              Enter the title for the new step.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              placeholder="Enter step title"
            />
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button
                color="primary"
                onClick={() => addNewStep(newSectionTitle)}
              >
                Add Section
              </Button>
            </DialogTrigger>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
