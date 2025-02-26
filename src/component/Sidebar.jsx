import React from 'react';

const Sidebar = ({ addNode, clearCanvas }) => {
  return (
    <div style={sidebarStyles}>
      <h3>Controls</h3>
      <button onClick={addNode}>➕ Add Node</button>
      <button onClick={clearCanvas}>🗑️ Clear Canvas</button>
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

export default Sidebar;
