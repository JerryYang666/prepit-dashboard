"use client";

import { useState, useEffect, use } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomPagination from "./CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  WorkspaceUser,
  listWorkspaceUsers,
  addStudentsToWorkspace,
} from "@/app/api/workspace/workspace";
import { Button } from "@/components/ui/button";
import { columns } from "./students-table/columns";
import { DataTable } from "./students-table/students-table";
import { Icons } from "@/components/icons";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Students() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>(
    "Please select a casebook",
  );
  const [students, setStudents] = useState<WorkspaceUser[]>([]);
  const [studentsToAdd, setStudentsToAdd] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);
  const { user } = usePrepitUserSession();
  const pageSize = 30;
  const router = useRouter();

  const fetchStudents = (page: number, workspace_id: string) => {
    if (workspace_id === "Please select a casebook") {
      toast.error("Please select a casebook");
      return;
    }
    listWorkspaceUsers({
      workspace_id,
      page,
      page_size: pageSize,
      search: searchTerm,
    }).then((response) => {
      setStudents(response.users);
      // response.total is the total number of agents, calculate the total number of pages
      setTotalPages(Math.ceil(response.total / pageSize));
      setTotalStudents(response.total);
    });
  };

  useEffect(() => {
    // get all keys in user.workspace_roles where the value is "teacher"
    const userWorkspaces = Object.keys(user?.workspace_role || {}).filter(
      (key) => user?.workspace_role[key] === "teacher",
    );
    // if user is not a teacher in any workspace, redirect to the home page
    if (userWorkspaces.length === 0) {
      toast.error("You do not have access to admin pages");
      router.push("/dashboard");
    }
    setWorkspaces(["Please select a casebook", ...userWorkspaces]);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchStudents(1, selectedWorkspace);
  };

  const handleWorkspaceChange = (
    workspace: string,
    fromAddStudentsPopup = false,
  ) => {
    setSelectedWorkspace(workspace);
    if (!fromAddStudentsPopup) {
      setCurrentPage(1);
      fetchStudents(1, workspace);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const processStudentsToAdd = (students: string) => {
    const studentsArray = students.split("\n");
    // remove empty strings
    const filteredStudents = studentsArray.filter((student) => student !== "");
    // trim whitespace
    const trimmedStudents = filteredStudents.map((student) => student.trim());
    // remove "@case.edu"
    const removedCaseEdu = trimmedStudents.map((student) =>
      student.replace("@case.edu", ""),
    );
    // remove duplicates
    const uniqueStudents = [...new Set(removedCaseEdu)];
    setStudentsToAdd(uniqueStudents);
  };

  const addStudents = (workspace_id: string, students: string[]) => {
    if (workspace_id === "Please select a casebook") {
      toast.error("Please select a casebook");
      return;
    }
    addStudentsToWorkspace({ workspace_id, students }).then(() => {
      setStudentsToAdd([]);
      toast.success("Students added successfully");
      fetchStudents(currentPage, workspace_id);
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm font-semibold hidden sm:block">
            CaseBook:
          </span>
          <Select
            onValueChange={handleWorkspaceChange}
            defaultValue={selectedWorkspace}
          >
            <SelectTrigger className="w-1/3 mr-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {workspaces.map((workspace) => (
                <SelectItem key={workspace} value={workspace}>
                  {workspace}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="w-1/2 max-w-lg justify-self-start">
            <form
              onSubmit={handleSearch}
              className="flex flex-row justify-center items-center gap-2"
            >
              <Input
                className="w-3/4 border-gray-300"
                placeholder="Search for student"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch(event);
                  }
                }}
              />
              <Button type="submit">
                <Icons.search />
              </Button>
            </form>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="whitespace-nowrap">+ Students</Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col lg:max-w-[45vw]">
              <DialogHeader>
                <DialogTitle>Add Students</DialogTitle>
                <DialogDescription>
                  Authorize students to access this casebook:
                </DialogDescription>
                <Select
                  onValueChange={(workspace) =>
                    handleWorkspaceChange(workspace, true)
                  }
                  defaultValue={selectedWorkspace}
                >
                  <SelectTrigger className="w-1/2 mr-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace} value={workspace}>
                        {workspace}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogHeader>
              <div className="flex flex-row gap-4">
                <Textarea
                  onChange={(e) => processStudentsToAdd(e.target.value)}
                  placeholder="Enter student IDs, one per line"
                  className="w-1/2 border"
                />
                <ScrollArea className="h-[50vh] w-1/2 rounded-md border">
                  <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium leading-none">
                      Student IDs to add:
                    </h4>
                    {studentsToAdd.map((stu) => (
                      <>
                        <div key={stu} className="text-sm">
                          {stu}
                        </div>
                        <Separator className="my-2" />
                      </>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              <DialogFooter>
                <DialogTrigger asChild>
                  <Button
                    color="primary"
                    onClick={() =>
                      addStudents(selectedWorkspace, studentsToAdd)
                    }
                  >
                    Add Students
                  </Button>
                </DialogTrigger>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-8">
          <DataTable columns={columns} data={students} />
        </div>
      </main>
      <footer className="pb-20 px-10 flex flex-col">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <div className="text-sm text-gray-500 w-2/3">
          Showing {students.length} of {totalStudents} students
        </div>
      </footer>
    </div>
  );
}
