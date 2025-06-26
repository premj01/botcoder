// File: src/components/ChatContainer.tsx
import React from "react";
import ChatMessage from "./ChatMessage";
import { Message } from "../types";
import { useScrollToBottom } from "../hooks/useScrollToBottom";

interface Props {
  messages: Message[];
}

const ChatContainer: React.FC<Props> = ({ messages }) => {
  const containerRef = useScrollToBottom<HTMLDivElement>([messages]);
  return (
    <>
      <div ref={containerRef} className="chat-container">
        {messages.map((msg, index) => (
          <ChatMessage key={index} from={msg.from} text={msg.text} />
        ))}
      </div>
    </>
  );
};

export default ChatContainer;
