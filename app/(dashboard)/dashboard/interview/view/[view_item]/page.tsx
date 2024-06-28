"use client";

import BreadCrumb from "@/components/breadcrumb";
import { Heading } from "@/components/ui/heading";
import { usePathname } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { ChatMessage, getChatHistory } from "@/app/api/thread/thread";
import { AudioLines } from "lucide-react";
import Image from "next/image";

const breadcrumbItems = [
  { title: "Interviews", link: "/dashboard/interview" },
  { title: "View", link: "/dashboard/interview/view" },
];

// Convert UNIX timestamp to readable format
const formatTimestamp = (timestamp: string) => {
  const date = new Date(parseInt(timestamp));
  return date.toLocaleString();
};

// View Interview Component
export default function ViewInterview() {
  const pathname = usePathname();
  const pathEnding = pathname.split("/").pop();
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    const devModeLocal =
      new URLSearchParams(window.location.search).get("devMode") === "true";
    setDevMode(devModeLocal);
  }, []);

  useEffect(() => {
    if (!pathEnding) return;
    getChatHistory({ thread_id: pathEnding }).then((response) => {
      setChatHistory(response.messages);
    });
  }, []);

  const playChatMessageAudio = (thread_id: string, msg_id: string) => {
    // Replace the # in msg_id with _
    const msg_id_formatted = msg_id.replace("#", "_");
    const audioUrl = `https://bucket-57h03x.s3.us-east-2.amazonaws.com/prepit_data/audio/${thread_id}/${msg_id_formatted}.mp3`;
    const audioPlayer = new Audio(audioUrl);
    audioPlayer.play().catch((error) => {
      console.error("Error playing audio:", error);
    });
  };

  // Chat Message Component
  function ChatMessageComponent({
    role,
    created_at,
    content,
    msg_id,
    thread_id,
    has_audio,
  }: ChatMessage) {
    const name = role === "human" ? "You" : "AI";
    const bubbleClass =
      role === "human"
        ? "bg-black text-white justify-end self-end"
        : "bg-gray-200 text-black justify-start self-start";
    // if there's a url enclosed in curly braces, replace it with a Image component
    const contentImage = content.match(/{(.*?)}/g);
    let imageUrl = "";
    if (contentImage) {
      imageUrl = contentImage[0].replace(/{|}/g, "");
      if (
        !imageUrl.startsWith("https://bucket-57h03x.s3.us-east-2.amazonaws.com")
      ) {
        imageUrl = "";
      }
    }
    return (
      <div
        className={`flex flex-col space-y-1 mr-1 ${role === "human" ? "justify-end" : "justify-start"}`}
      >
        {role === "human" ? (
          <div className="flex items-center space-x-2 justify-end">
            {has_audio && (
              <div
                className="flex items-center space-x-2 justify-start hover:text-cyan-600 cursor-pointer"
                onClick={() => playChatMessageAudio(thread_id, msg_id)}
              >
                <AudioLines size={18} />
              </div>
            )}
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
          <p>{devMode ? content : content.replace(/\[.*?]|\{.*?}/g, "")}</p>
          {imageUrl !== "" && (
            <Image
              src={imageUrl}
              alt="exhibit"
              width={400}
              height={200}
              className="rounded-xl w-full"
            />
          )}
        </div>
      </div>
    );
  }

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
