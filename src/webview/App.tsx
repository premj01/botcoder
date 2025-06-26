// // File: src/App.tsx
// import React, { useEffect, useState } from "react";
// import ChatContainer from "./components/ChatContainer";
// import ChatInput from "./components/ChatInput";
// import { Message } from "./types";
// import { RiChatNewLine } from "react-icons/ri";
// import FileSelector from "./components/FileSelector";

// // Acquire VS Code API
// declare const acquireVsCodeApi: () => any;
// const vscode = acquireVsCodeApi();

// const App: React.FC = () => {
//   const [fileList, setFileList] = useState<string[]>([]);
//   const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);

//   const [messages, setMessages] = useState<Message[]>([
//     {
//       from: "ai",
//       text: `Hello! Ask me anything.\n\n\`\`\`ts\nfunction greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\n\`\`\``,
//     },
//   ]);

//   useEffect(() => {
//     const handler = (event: MessageEvent) => {
//       const message = event.data;
//       if (message.type === "aiResponse") {
//         setMessages((prev) => [...prev, { from: "ai", text: message.value }]);
//       }
//     };
//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, []);

//   useEffect(() => {
//     vscode.postMessage({ type: "getFileList" });

//     const handler = (event: MessageEvent) => {
//       const message = event.data;
//       if (message.type === "aiResponse") {
//         setMessages((prev) => [...prev, { from: "ai", text: message.value }]);
//       } else if (message.type === "fileList") {
//         setFileList(message.value || []);
//       }
//     };
//     window.addEventListener("message", handler);
//     return () => window.removeEventListener("message", handler);
//   }, []);

//   const handleSend = (text: string) => {
//     const newMsg = { from: "user", text };
//     setMessages((prev) => [...prev, newMsg]);

//     const mentionedFiles =
//       text.match(/@([\w./\\-]+)/g)?.map((name) => name.substring(1)) || [];

//     vscode.postMessage({
//       type: "userPrompt",
//       value: text,
//       files: mentionedFiles,
//     });
//   };

//   return (
//     <div className="app-container">
//       <button
//         onClick={() => {
//           vscode.postMessage({ type: "clearChat" });
//           setMessages([]); // clear UI messages
//         }}
//         className="new-chat-button"
//       >
//         <RiChatNewLine />
//       </button>

//       <ChatContainer messages={messages} />
//       <FileSelector
//         files={fileList}
//         onSelect={(file) => {
//           if (inputRef) {
//             const cursor = inputRef.selectionStart || 0;
//             const value = inputRef.value;
//             const updated =
//               value.substring(0, cursor) +
//               `@${file} ` +
//               value.substring(cursor);
//             inputRef.value = updated;
//             inputRef.focus();
//           }
//         }}
//       />

//       <ChatInput textareaRef={(el) => setInputRef(el)} onSend={handleSend} />
//     </div>
//   );
// };

// export default App;

// File: src/App.tsx
import React, { useEffect, useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import { Message } from "./types";
import { RiChatNewLine } from "react-icons/ri";

// Acquire VS Code API
declare const acquireVsCodeApi: () => any;
const vscode = acquireVsCodeApi();

const App: React.FC = () => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [inputRef, setInputRef] = useState<HTMLTextAreaElement | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      from: "ai",
      text: `Hello! Ask me anything.\n\n\u0060\u0060\u0060ts\nfunction greet(name: string): string {\n  return \u0060Hello, \${name}!\u0060;\n}\n\u0060\u0060\u0060`,
    },
  ]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const message = event.data;
      if (message.type === "aiResponse") {
        setMessages((prev) => [...prev, { from: "ai", text: message.value }]);
      } else if (message.type === "fileList") {
        setFileList(message.value || []);
      }
    };
    window.addEventListener("message", handler);
    vscode.postMessage({ type: "getFileList" });
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleSend = (text: string) => {
    const newMsg = { from: "user", text };
    setMessages((prev) => [...prev, newMsg]);

    const mentionedFiles =
      text.match(/@([\w./\\-]+)/g)?.map((name) => name.substring(1)) || [];

    vscode.postMessage({
      type: "userPrompt",
      value: text,
      files: mentionedFiles,
    });
  };

  return (
    <div className="app-container">
      <button
        onClick={() => {
          vscode.postMessage({ type: "clearChat" });
          setMessages([]);
        }}
        className="new-chat-button"
      >
        <RiChatNewLine />
      </button>

      <ChatContainer messages={messages} />
      <ChatInput
        onSend={handleSend}
        fileList={fileList}
        textareaRef={setInputRef}
      />
    </div>
  );
};

export default App;
