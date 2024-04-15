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

interface Step {
  title: string;
  instruction: string;
  information: string;
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
        .filter(key => parseInt(key) !== index)
        .reduce((result, current, i) => {
            result[i] = steps[parseInt(current)]; // Cast 'current' to number
            return result;
        }, {} as { [key: number]: Step });
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  const addNewStep = (title: string) => {
    const newIndex = Object.keys(steps).length;
    const newStep: Step = { title, instruction: "", information: "" };
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
                <Button variant="secondary" size={'sm'} className="ml-1">
                  •••
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onSelect={() => deleteStep(Number(index))} className="text-red-600">
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
          <Badge className="font-bold w-fit size-8 text-sm" variant={'secondary'}>Instruction</Badge>
          <Textarea
            value={step.instruction}
            onChange={(e) =>
              handleStepChange(Number(index), "instruction", e.target.value)
            }
            className="h-32"
          />
          <Badge className="font-bold w-fit size-8 text-sm" variant={'secondary'}>Information</Badge>
          <Textarea
            value={step.information}
            onChange={(e) =>
              handleStepChange(Number(index), "information", e.target.value)
            }
            className="h-32"
          />
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
