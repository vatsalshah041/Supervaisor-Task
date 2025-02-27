import React from 'react';

const Sidebar = ({ addNode, clearCanvas }) => {
  // Handle Drag Start
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };
  const downloadJSON = () => {
    const flowchartData = localStorage.getItem('flowchartData');
    if (!flowchartData) {
      alert('No data available to download!');
      return;
    }

    const blob = new Blob([flowchartData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'flowchart.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={sidebarStyles}>
      <h3>Controls</h3>
      <button onClick={addNode}>➕ Add Node</button>
      <button onClick={clearCanvas}>🗑️ Clear Canvas</button>
      <button onClick={downloadJSON}>📥 Download JSON</button>

      <h3>Drag Nodes</h3>
      <div
        style={nodeStyle}
        draggable
        onDragStart={(event) => onDragStart(event, 'custom')}
      >
        🟢 Drag Custom Node
      </div>
    </div>
  );
};

// Sidebar Styles
const sidebarStyles = {
  width: '200px',
  height: '100vh',
  background: '#f4f4f4',
  padding: '10px',
  boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
  position: 'absolute',
  left: 0,
  top: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const nodeStyle = {
  padding: '10px',
  background: '#00bcd4',
  color: 'white',
  cursor: 'grab',
  textAlign: 'center',
  borderRadius: '5px',
};

export default Sidebar;
