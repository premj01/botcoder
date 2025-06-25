import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

interface Message {
  from: "user" | "ai";
  text: string;
}

interface ChatWindowProps {
  messages: Message[];
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col flex-1 overflow-y-auto p-4 bg-zinc-900"
    >
      {messages.map((msg, i) => (
        <ChatMessage key={i} from={msg.from} text={msg.text} />
      ))}
    </div>
  );
};

export default ChatWindow;
