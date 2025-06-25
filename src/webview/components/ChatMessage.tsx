import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface ChatMessageProps {
  from: "user" | "ai";
  text: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ from, text }) => {
  return (
    <div
      className={`mb-4 p-3 rounded-xl max-w-[80%] whitespace-pre-wrap ${
        from === "user"
          ? "bg-blue-600 text-white self-start"
          : "bg-zinc-800 text-white self-end"
      }`}
    >
      <ReactMarkdown
        children={text}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-zinc-700 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </div>
  );
};

export default ChatMessage;
