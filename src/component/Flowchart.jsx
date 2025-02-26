import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import Sidebar from './Sidebar'; // Import Sidebar

import '@xyflow/react/dist/style.css';

// Initial Nodes and Edges
const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
  { id: '2', position: { x: 150, y: 100 }, data: { label: 'Decision' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'Go to Decision' },
];

export default function FlowChart() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Handle Connections
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Handle Node & Edge Changes
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // 🔹 Add a New Node
  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random Position
      data: { label: `Node ${nodes.length + 1}` },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  // 🔹 Clear the Canvas
  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  // 🔹 Rename a Node on Double Click
  const onNodeDoubleClick = (event, node) => {
    const newLabel = prompt("Enter new node label:", node.data.label);
    if (newLabel !== null && newLabel.trim() !== "") {
      setNodes((prevNodes) =>
        prevNodes.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, label: newLabel } } : n))
      );
    }
  };

  // 🔹 Rename an Edge on Double Click
  const onEdgeDoubleClick = (event, edge) => {
    const newLabel = prompt("Enter new edge label:", edge.label);
    if (newLabel !== null && newLabel.trim() !== "") {
      setEdges((prevEdges) =>
        prevEdges.map((e) => (e.id === edge.id ? { ...e, label: newLabel } : e))
      );
    }
  };
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setNodes((nds) => nds.filter((n) => n.id !== node.id));
    setEdges((eds) => eds.filter((e) => e.source !== node.id && e.target !== node.id));
  };

  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
  };


  return (
    <div style={{paddingLeft:"10vw", width: '80vw', height: '40vw', display: 'flex' }}>
      <Sidebar addNode={addNode} clearCanvas={clearCanvas} /> {/* Sidebar Added */}
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeDoubleClick={onNodeDoubleClick} 
          onEdgeDoubleClick={onEdgeDoubleClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
}
