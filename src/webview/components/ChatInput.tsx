import React, { useState, useRef, useEffect } from "react";

interface Props {
  onSend: (message: string) => void;
  textareaRef?: (el: HTMLTextAreaElement) => void;
  fileList: string[];
}

const ChatInput: React.FC<Props> = ({ textareaRef, onSend, fileList }) => {
  const [input, setInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState(0);
  const textareaEl = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef) textareaRef(textareaEl.current!);
  }, [textareaRef]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
    setShowDropdown(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;
    setInput(value);
    setCursorPos(cursor);

    const match = /@([\w./-]*)$/.exec(value.slice(0, cursor));
    if (match) {
      const keyword = match[1];
      const filtered = fileList.filter((f) =>
        f.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredFiles(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleSelect = (filename: string) => {
    if (!textareaEl.current) return;
    const value = input;
    const before = value.slice(0, cursorPos);
    const after = value.slice(cursorPos);
    const match = /@([\w./-]*)$/.exec(before);
    if (!match) return;
    const newBefore = before.slice(0, match.index) + `@${filename} `;
    const newValue = newBefore + after;
    setInput(newValue);
    setShowDropdown(false);

    setTimeout(() => {
      textareaEl.current!.focus();
      textareaEl.current!.selectionStart = textareaEl.current!.selectionEnd =
        newBefore.length;
    }, 0);
  };

  return (
    <div className="chat-input" style={{ position: "relative" }}>
      <textarea
        ref={textareaEl}
        className="chat-textarea"
        value={input}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Ask BotCoder... (Shift+Enter = newline)"
      />
      <button className="chat-send-btn" onClick={handleSend}>
        Send
      </button>

      {showDropdown && filteredFiles.length > 0 && (
        <ul
          style={{
            position: "absolute",
            bottom: "3.5rem",
            left: "16px",
            maxHeight: "150px",
            overflowY: "auto",
            background: "rgb(0,0,0)",
            color: "rgb(174 174 174)",
            border: "1px solid #555",
            borderRadius: "6px",
            zIndex: 10,
            padding: "4px 0",
            width: "70%",
            scrollBehavior: "smooth",
            scrollbarWidth: "none",
          }}
        >
          {filteredFiles.map((file, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(file)}
              style={{
                padding: "6px 12px",
                cursor: "pointer",
                borderBottom: "1px solid #444",
              }}
            >
              {file}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatInput;
