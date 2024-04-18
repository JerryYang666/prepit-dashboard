import React, { useState } from "react";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { fileUpload } from "@/app/api/agent/agent";
import { Icons } from "@/components/icons";

interface ImageData {
  name: string;
  url: string;
}

interface FileUploadFormProps {
  uploads: { [key: number]: ImageData }; // Initial data to populate the form
  setUploads: (uploads: { [key: number]: ImageData }) => void; // Function to update the form data
}

export const FileUploadForm: React.FC<FileUploadFormProps> = ({
  uploads,
  setUploads,
}) => {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadCount, setUploadCount] = useState(Object.keys(uploads).length);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      if (selectedFile.size > 5242880) {
        toast.error("File size should be less than 5MB.");
        return;
      }
      if (!selectedFile.type.match(/image\/(png|jpeg)/)) {
        toast.error("Please select a valid image file (PNG or JPEG).");
        return;
      }
      setFile(selectedFile);
    }
  };

  const deleteUpload = (key: string) => {
    const updatedUploads = Object.keys(uploads)
      .filter((uploadKey) => uploadKey !== key)
      .reduce(
        (result, current, i) => {
          result[i] = uploads[parseInt(current)]; // Cast 'current' to number
          return result;
        },
        {} as { [key: number]: ImageData },
      );
    setUploads(updatedUploads);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }
    if (!fileName) {
      toast.error("Please enter a name for the file.");
      return;
    }
    if (file && fileName) {
      if (file.size > 5242880) {
        alert("File size should be less than 5MB.");
        return;
      }
      if (!file.type.match(/image\/(png|jpeg)/)) {
        alert("Please select a valid image file (PNG or JPEG).");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("file_name", fileName);

      fileUpload(formData)
        .then((response) => {
          const newUploads = {
            ...uploads,
            [uploadCount]: { name: fileName, url: response.file_url },
          };
          setUploads(newUploads);
          setUploadCount(uploadCount + 1);
          setOpen(false);
          setFileName("");
          setFile(null);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          toast.error("Error uploading file. Please try again.");
        });
    }
  };

  return (
    <div>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Object.entries(uploads).map(([key, data]: [string, ImageData]) => (
          <Card key={key}>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>{data.name}</CardTitle>
              <div className="flex flex-row items-center">
                <Button
                  size={"sm"}
                  className="p-2"
                  onClick={() => {
                    navigator.clipboard.writeText(`{${data.url}}`);
                    toast.success("Link copied to clipboard");
                  }}
                >
                  <Icons.copy />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      size={"sm"}
                      className="p-2 ml-2"
                    >
                      •••
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onSelect={() => deleteUpload(key)}
                      className="text-red-600"
                    >
                      Delete Section
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <img src={data.url} alt={data.name} />
            </CardContent>
            <CardFooter>
              <CardDescription>{data.url}</CardDescription>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="mt-2">+ Add New Picture</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Picture</DialogTitle>
            <DialogDescription>
              Enter the name for the picture and select the file. The file
              should be in PNG or JPEG format and less than 5MB in size.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              value={fileName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFileName(e.target.value)
              }
              placeholder="Enter file name"
              required
            />
            <Label>Click the box below or drag and drop a file into it</Label>
            <Input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleFileChange(e)
              }
              className="border border-gray-400 rounded-md p-2 w-full h-24 hover:bg-gray-100 hover:cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button color="primary" onClick={handleUpload}>
              Confirm Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
