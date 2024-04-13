"use client";

import { useState } from "react";
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

export default function CaseBook() {
  const [searchTerm, setSearchTerm] = useState("");

  const books = [
    {
      title: "Distero",
      description:
        "Our client, Distero, is a large grocery distributor based out of the United States...",
      image: "/case0.png",
    },
    {
      title: "NFL Mexico",
      description:
        "Your client is a wealthy former founder and CEO of a multi-national company interested...",
      image: "/case1.png",
    },
    {
      title: "Business School",
      description:
        "Our client, Greg Wilkinson, is the Dean of the business school at a mid-sized, four-year...",
      image: "/case2.png",
    },
    {
      title: "Distero",
      description:
        "Our client, Distero, is a large grocery distributor based out of the United States...",
      image: "/case0.png",
    },
    {
      title: "NFL Mexico",
      description:
        "Your client is a wealthy former founder and CEO of a multi-national company interested...",
      image: "/case1.png",
    },
    {
      title: "Business School",
      description:
        "Our client, Greg Wilkinson, is the Dean of the business school at a mid-sized, four-year...",
      image: "/case2.png",
    },
    {
      title: "Distero",
      description:
        "Our client, Distero, is a large grocery distributor based out of the United States...",
      image: "/case0.png",
    },
    {
      title: "NFL Mexico",
      description:
        "Your client is a wealthy former founder and CEO of a multi-national company interested...",
      image: "/case1.png",
    },
    {
      title: "Business School",
      description:
        "Our client, Greg Wilkinson, is the Dean of the business school at a mid-sized, four-year...",
      image: "/case2.png",
    },
    {
      title: "Distero",
      description:
        "Our client, Distero, is a large grocery distributor based out of the United States...",
      image: "/case0.png",
    },
    {
      title: "NFL Mexico",
      description:
        "Your client is a wealthy former founder and CEO of a multi-national company interested...",
      image: "/case1.png",
    },
    {
      title: "Business School",
      description:
        "Our client, Greg Wilkinson, is the Dean of the business school at a mid-sized, four-year...",
      image: "/case2.png",
    },
    // Add more books here...
  ];

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4">
        <div className="container grid gap-4 items-center">
          <div className="w-full max-w-lg justify-self-start">
            <Input
              className="w-full border-gray-300"
              placeholder="Search for case"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>
      <main className="flex-1 py-4">
        <div className="container grid gap-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book, index) => (
              <Card key={index} className="group">
                <div className="group aspect-card overflow-hidden rounded-lg h-40 flex items-center relative">
                  <img
                    alt={book.title}
                    className="w-full h-full object-cover object-center transform transition duration-300 ease-in-out group-hover:scale-110"
                    src={book.image}
                  />
                  <button className="absolute top-3 right-3 bg-gray-900 text-white px-3 py-1 rounded-md shadow-md transition-opacity opacity-70 group-hover:opacity-100">
                    Edit
                  </button>
                </div>
                <div className="p-4 grid gap-2">
                  <h3 className="text-lg font-semibold leading-none">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-none">
                    {book.description}
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </footer>
    </div>
  );
}
