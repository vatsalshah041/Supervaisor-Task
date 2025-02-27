import React, { useState } from "react";
import { Handle, Position } from "@xyflow/react";

const CustomNode = ({ id, data, setNodes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  
  // Update node label when editing is finished
  const handleBlur = () => {
    setIsEditing(false);
    setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id ? { ...node, data: { ...node.data, label } } : node
      )
    );
  };

  return (
    <div style={nodeStyle}>
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={inputStyle}
        />
      ) : (
        <div onDoubleClick={() => setIsEditing(true)}>{label}</div>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

// Styling for the custom node
const nodeStyle = {
  padding: "10px",
  border: "1px solid black",
  borderRadius: "5px",
  background: "#fff",
  textAlign: "center",
  cursor: "pointer",
};

const inputStyle = {
  width: "100px",
  fontSize: "14px",
  textAlign: "center",
};

export default CustomNode;
