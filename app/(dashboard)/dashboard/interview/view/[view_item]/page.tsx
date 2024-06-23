"use client";

import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { ChatMessage, getChatHistory } from "@/app/api/thread/thread";

const breadcrumbItems = [
  { title: "Interviews", link: "/dashboard/interview" },
  { title: "View", link: "/dashboard/interview/view" },
];

// Convert UNIX timestamp to readable format
const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleString();
};

// Chat Message Component
function ChatMessageComponent({ role, created_at, content }: ChatMessage) {
  const name = role === "human" ? "You" : "AI";
  const bubbleClass =
    role === "human"
      ? "bg-black text-white justify-end self-end"
      : "bg-gray-200 text-black justify-start self-start";
  return (
    <div
      className={`flex flex-col space-y-1 mr-1 ${role === "human" ? "justify-end" : "justify-start"}`}
    >
      {role === "human" ? (
        <div className="flex items-center space-x-2 justify-end">
          <span className="text-xs text-gray-500">
            {formatTimestamp(created_at)}
          </span>
          <span className="text-sm">{name}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 justify-start">
          <span className="text-sm">{name}</span>
          <span className="text-xs text-gray-500">
            {formatTimestamp(created_at)}
          </span>
        </div>
      )}
      <div className={`${bubbleClass} rounded-xl p-3 max-w-xl`}>
        <p>{content}</p>
      </div>
    </div>
  );
}

// View Interview Component
export default function ViewInterview() {
  const pathname = usePathname();
  const pathEnding = pathname.split("/").pop();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!pathEnding) return;
    getChatHistory({ thread_id: pathEnding }).then((response) => {
      setChatHistory(response.messages);
    });
  }, []);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading
          title="Your Interview"
          description="View your interview here"
        />
      </div>
      <div className="flex justify-start">
        <Card className="w-full md:w-1/2">
          <CardContent>
            <ScrollArea className="h-[80vh] p-1 w-full pt-3">
              <div className="space-y-3">
                {chatHistory.map((chat) => (
                  <ChatMessageComponent key={chat.msg_id} {...chat} />
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
