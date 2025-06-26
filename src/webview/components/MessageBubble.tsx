// File: src/components/MessageBubble.tsx
import React from "react";

interface Props {
  from: "user" | "ai";
  children: React.ReactNode;
}

const MessageBubble: React.FC<Props> = ({ from, children }) => {
  return <div className={`message-bubble ${from}`}>{children}</div>;
};

export default MessageBubble;
