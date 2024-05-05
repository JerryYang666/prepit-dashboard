"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  PaginationPrevious,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationContent,
  Pagination,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { getAgents, AgentsResponse } from "@/app/api/agent/agent";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"

export default function CaseBook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [agents, setAgents] = useState<AgentsResponse["agents"]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: session, status } = useSession()
  const router = useRouter();
  const pageSize = 12;

  const fetchAgents = (page: number) => {
    getAgents({ page, page_size: pageSize, search: searchTerm }).then(
      (response) => {
        setAgents(response.agents);
        // response.total is the total number of agents, calculate the total number of pages
        setTotalPages(Math.ceil(response.total / pageSize));
      },
    );
  };

  useEffect(() => {
    fetchAgents(currentPage);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAgents(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const authorizedEmails = [
    "jasonxiao0514@gmail.com",
    "jerryyang20141113@gmail.com"
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="container grid gap-4 items-center">
          <div className="w-full max-w-lg justify-self-start">
            <form
              onSubmit={handleSearch}
              className="flex flex-row justify-center items-center gap-2"
            >
              <Input
                className="w-full border-gray-300"
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
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      // open practice page in a new tab
                      window.open(
                        `https://prepit-user-web-git-new-ui-jerryyang666s-projects.vercel.app/case/${agent.agent_id}`,
                        "_blank",
                      );
                    }}
                  >
                    Practice
                  </button>
                  {session?.user?.email && authorizedEmails.includes(session?.user?.email) && (
                    <button
                      className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-md shadow-md transition-opacity opacity-70 group-hover:opacity-100"
                      onClick={() =>
                        router.push(`/dashboard/casebook/edit/${agent.agent_id}`)
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
        <div className="container flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 && (
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                )}
              </PaginationItem>
              {[...Array(totalPages)].map((_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    href="#"
                    onClick={() => handlePageChange(index + 1)}
                    isActive={currentPage === index + 1}
                  >
                    {index + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                {currentPage < totalPages && (
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </footer>
    </div>
  );
}
