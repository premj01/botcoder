import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

type Message = {
  from: "user" | "ai";
  text: string;
};

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: `Hello! Ask me anything.

\`\`\`ts
function greet(name: string): bro {
  return \`Hello, \${name}!\`;
}
\`\`\`
`,
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, newMsg]);

    // Sending to extension
    vscode.postMessage({
      type: "userPrompt",
      value: input.trim(),
      files: selectedFiles,
    });

    setInput("");
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      if (message.type === "aiResponse") {
        setMessages((prev) => [...prev, { from: "ai", text: message.value }]);
      }
    });
  }, []);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          // display: "flex",
          flex: 1,
          // flexDirection: "column",
          overflowY: "auto",
          padding: "1rem",
          backgroundColor: "#1e1e1e",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              backgroundColor: msg.from === "user" ? "#007acc" : "#2d2d2d",
              color: "#fff",
              alignSelf: msg.from === "user" ? "flex-start" : "flex-end",
              marginBottom: "1rem",
              padding: "0.75rem",
              borderRadius: "10px",
              maxWidth: "80%",
              minWidth: "70%",
            }}
          >
            <ReactMarkdown
              children={msg.text}
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
                    <code
                      style={{
                        backgroundColor: "#444",
                        padding: "0.2rem 0.4rem",
                        borderRadius: "4px",
                      }}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
              }}
            />
          </div>
        ))}
      </div>

      <div
        style={{
          backgroundColor: "#252526",
          padding: "0.5rem",
          display: "flex",
          alignItems: "flex-end",
          gap: "0.5rem",
        }}
      >
        <textarea
          style={{
            flex: 1,
            backgroundColor: "#1e1e1e",
            border: "1px solid #444",
            borderRadius: "6px",
            color: "#fff",
            padding: "0.5rem",
            minHeight: "2.5rem",
            maxHeight: "35vh",
            resize: "vertical",
            fontFamily: "monospace",
            lineHeight: "1.4",
            whiteSpace: "pre-wrap",
          }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Ask BotCoder... (Shift+Enter = newline)"
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "6px",
            backgroundColor: "#0e639c",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
