"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import CustomPagination from "./CustomPagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getAgents, AgentsResponse } from "@/app/api/agent/agent";
import { getNewThread } from "@/app/api/thread/thread";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { usePrepitUserSession } from "@/contexts/PrepitUserSessionContext";
import { Plus } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prepitInterviewPageUrl } from "@/constants/constants";

export default function CaseBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [workspaces, setWorkspaces] = useState<string[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("all");
  const [agents, setAgents] = useState<AgentsResponse["agents"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAgents, setTotalAgents] = useState(0);
  const { user, userCanManageWorkspace } = usePrepitUserSession();
  const router = useRouter();
  const pageSize = 12;

  const fetchAgents = (page: number, workspace_id: string = "") => {
    getAgents({
      page,
      page_size: pageSize,
      search: searchTerm,
      workspace_id: workspace_id,
    }).then((response) => {
      setAgents(response.agents);
      // response.total is the total number of agents, calculate the total number of pages
      setTotalPages(Math.ceil(response.total / pageSize));
      setTotalAgents(response.total);
    });
  };

  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // get all keys in user.workspace_roles, which is a dictionary
    const userWorkspaces = Object.keys(user?.workspace_role || {});
    setWorkspaces(["all", ...userWorkspaces]);
  }, [user]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAgents(1, selectedWorkspace === "all" ? "" : selectedWorkspace);
  };

  const handleWorkspaceChange = (workspace: string) => {
    setSelectedWorkspace(workspace);
    setCurrentPage(1);
    fetchAgents(1, workspace === "all" ? "" : workspace);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePractice = (agent_id: string) => {
    getNewThread({ agent_id }).then((response) => {
      window.open(`${prepitInterviewPageUrl}/${response.thread_id}`, "_blank");
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-sm font-semibold hidden sm:block">
            CaseBook:
          </span>
          <Select onValueChange={handleWorkspaceChange} defaultValue="all">
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
                placeholder="Search for case"
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
          {userCanManageWorkspace && (
            <Link
              href={"/dashboard/casebook/edit/new"}
              className={cn(buttonVariants({ variant: "default" }))}
            >
              <Plus className="mr-2 h-4 w-4" /> Create
            </Link>
          )}
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map((agent, index) => (
              <Card key={index} className="group">
                <div className="group aspect-card overflow-hidden rounded-lg h-40 flex items-center relative">
                  <img
                    alt={agent.agent_name}
                    className="w-full h-full object-cover object-center transform transition duration-300 ease-in-out group-hover:scale-110"
                    src={agent.agent_cover}
                  />
                  <button
                    className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-md shadow-md transition-opacity opacity-70 group-hover:opacity-100"
                    onClick={() => {
                      handlePractice(agent.agent_id);
                    }}
                  >
                    Practice
                  </button>
                  {(user?.system_admin ||
                    user?.workspace_role[agent.workspace_id] === "teacher") && (
                    <button
                      className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-md shadow-md transition-opacity opacity-70 group-hover:opacity-100"
                      onClick={() =>
                        router.push(
                          `/dashboard/casebook/edit/${agent.agent_id}`,
                        )
                      }
                    >
                      Edit
                    </button>
                  )}
                </div>
                <div className="p-4 grid gap-2">
                  <h3 className="text-lg font-semibold leading-none">
                    {agent.agent_name}
                  </h3>
                  <p className="text-sm text-gray-500 leading-none">
                    {agent.agent_description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <footer className="p-4">
        <CustomPagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
        />
        <div className="text-sm text-gray-500 w-2/3">
          Showing {agents.length} of {totalAgents} cases
        </div>
      </footer>
    </div>
  );
}
