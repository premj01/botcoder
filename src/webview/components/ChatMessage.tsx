import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import MessageBubble from "./MessageBubble";
import { FaCopy, FaCheck } from "react-icons/fa";

interface Props {
  from: "user" | "ai";
  text: string;
}

const ChatMessage: React.FC<Props> = ({ from, text }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // for multiple blocks

  const handleCopyToClipboard = async (
    e: any,
    codeText: string,
    index: number
  ) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedIndex(index);

      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error("Failed to copy code: ", err);
    }
  };

  let codeBlockCounter = 0;

  return (
    <MessageBubble from={from}>
      <ReactMarkdown
        children={text}
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeText = String(children).replace(/\n$/, "");
            const index = codeBlockCounter++;

            return !inline && match ? (
              <div style={{ position: "relative" }}>
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeText}
                </SyntaxHighlighter>
                <button
                  onClick={(e) => handleCopyToClipboard(e, codeText, index)}
                  style={{
                    position: "absolute",
                    top: "-7px",
                    right: "-7px",
                    background: "rgba(255, 255, 255, 0.2)",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "3px",
                    cursor: "pointer",
                    fontSize: "0.8em",
                    zIndex: 1,
                  }}
                >
                  {copiedIndex === index ? <FaCheck /> : <FaCopy />}
                </button>
              </div>
            ) : (
              <code className="inline-code" {...props}>
                {children}
              </code>
            );
          },
        }}
      />
    </MessageBubble>
  );
};

export default ChatMessage;
