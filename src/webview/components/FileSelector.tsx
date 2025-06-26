import React from "react";

interface Props {
  files: string[];
  onSelect: (filename: string) => void;
}

const FileSelector: React.FC<Props> = ({ files, onSelect }) => {
  return (
    <div className="file-selector">
      <div className="file-selector-title">📎 Attach file:</div>
      <ul className="file-list">
        {files.map((file, index) => (
          <li
            key={index}
            className="file-item"
            onClick={() => onSelect(file)}
            title={file}
          >
            @{file}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileSelector;
