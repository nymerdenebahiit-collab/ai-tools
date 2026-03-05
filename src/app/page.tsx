"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageAnalysisTab from "./features/imageAnalysis/ImageAnalysis";
import ImageCreatorTab from "./features/imageCreator/imageCreator";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  type Message = { role: "user" | "assistant"; text: string };
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return; // avoid empty messages

    const userMessage = inputValue;
    const newMessages: Message[] = [
      ...messages,
      { role: "user", text: userMessage },
    ];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://ai-tools-back-e3qy.onrender.com/api/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-screen p-7 justify-center relative">
      <Tabs defaultValue="account" className="w-100">
        <TabsList>
          <TabsTrigger value="image-analysis">Image Analysis</TabsTrigger>
          <TabsTrigger value="image-creator">Comic creator</TabsTrigger>
        </TabsList>

        <TabsContent value="image-analysis">
          <ImageAnalysisTab />
        </TabsContent>

        <TabsContent value="image-creator">
          <ImageCreatorTab />
        </TabsContent>
      </Tabs>
      <Button
        onClick={() => setOpen(true)}
        className="absolute bottom-9 right-9 rounded-full h-12 w-12"
      >
        <MessageCircle />
      </Button>
      {open && (
        <div className="fixed bottom-9 right-9 w-95 h-118 rounded-lg border border-[#E4E4E7] bg-white shadow-sm flex flex-col">
          <div className="flex items-center gap-2 p-2 px-4 self-stretch">
            <div className="text-[#09090B] font-inter text-base font-medium leading-6 tracking-normal w-95">
              Chat assistant
            </div>
            <Button variant="outline" onClick={() => setOpen(false)}>
              <X />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 border-t border-b border-[#E4E4E7] flex flex-col">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  m.role === "user"
                    ? "bg-[#F4F4F5]/80 self-end rounded-xl w-fit max-w-60 py-2 px-4"
                    : "bg-[#18181B]/90 rounded-xl w-fit max-w-71.25 text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            <div ref={messagesEndRef} />
            {isTyping && (
              <div className="bg-[#18181B]/90 text-white self-start rounded-xl w-fit px-4 py-1 flex gap-1">
                <span className="dot animate-bounce-delay1">•</span>
                <span className="dot animate-bounce-delay1">•</span>
                <span className="dot animate-bounce-delay1">•</span>
              </div>
            )}
          </div>

          <div className="p-2 flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              className=" rounded-full h-10 w-10"
            >
              <Send />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
