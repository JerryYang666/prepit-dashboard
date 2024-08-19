"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import CustomPagination from "./CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  getThreadList,
  ThreadListItem,
  GetThreadListRequest,
} from "@/app/api/thread/thread";
import { columns } from "./student-logs-table/columns";
import { DataTable } from "./student-logs-table/student-logs-table";
import { Icons } from "@/components/icons";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import { toast } from "sonner";

export default function StudentLogs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("Please select a casebook");
  const [threads, setThreads] = useState<ThreadListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalThreads, setTotalThreads] = useState(0);
  const { user } = usePrepitUserSession();
  const pageSize = 10;

  const fetchThreads = (page: number, workspace_id: string) => {
    if (workspace_id === "Please select a casebook") {
      toast.error("Please select a casebook");
      return;
    }
    let apiParams: GetThreadListRequest = {
      page,
      page_size: pageSize,
      search: searchTerm,
      workspace_id: workspace_id,
      admin_mode: true,
    };
    getThreadList(apiParams).then((response) => {
      setThreads(response.threads);
      // response.total is the total number of agents, calculate the total number of pages
      setTotalPages(Math.ceil(response.total / pageSize));
      setTotalThreads(response.total);
    });
  };

  useEffect(() => {
    // get all keys in user.workspace_roles where the value is "teacher"
    const userWorkspaces = Object.keys(user?.workspace_role || {}).filter(
      (key) => user?.workspace_role[key] === "teacher"
    );
    setWorkspaces(["Please select a casebook", ...userWorkspaces]);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchThreads(1, selectedWorkspace);
  };

  const handleWorkspaceChange = (workspace: string) => {
    setSelectedWorkspace(workspace);
    setCurrentPage(1);
    fetchThreads(1, workspace);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm font-semibold hidden sm:block">
            CaseBook:
          </span>
          <Select onValueChange={handleWorkspaceChange} defaultValue="Please select a casebook">
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
                placeholder="Search for interview"
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
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-8">
          <DataTable columns={columns} data={threads} />
        </div>
      </main>
      <footer className="pb-20 px-10 flex flex-col">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <div className="text-sm text-gray-500 w-2/3">
          Showing {threads.length} of {totalThreads} interviews
        </div>
      </footer>
    </div>
  );
}
