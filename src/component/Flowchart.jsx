import React, { useCallback, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  ReactFlowProvider
} from '@xyflow/react';
import { applyEdgeChanges, applyNodeChanges } from '@xyflow/react';
import Sidebar from './Sidebar'; // Import Sidebar
import { flowData } from './flowData';
import '@xyflow/react/dist/style.css';

const generateNodes = (steps) => {
    return steps.flatMap((step) =>
      step.nodes.map((node) => ({
        id: node.id,
        position: { x: Math.random() * 400, y: Math.random() * 400 }, // Random position
        data: { label: node.label },
        type: "default",
      }))
    );
  };
  
  // 🔹 Convert JSON Attachments to React Flow Edges
  const generateEdges = (steps) => {
    return steps.flatMap((step) =>
      step.attachments.map((attachment) => ({
        id: `e${attachment.source}-${attachment.target}`,
        source: attachment.source,
        target: attachment.target,
        label: attachment.relation,
      }))
    );
  };
// Initial Nodes and Edges
// const initialNodes = [
//   { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
//   { id: '2', position: { x: 150, y: 100 }, data: { label: 'Decision' } },
// ];

// const initialEdges = [
//   { id: 'e1-2', source: '1', target: '2', label: 'Go to Decision' },
// ];


export default function FlowChart() {
    // const { project } = useReactFlow(); 
    const [nodes, setNodes] = useState(generateNodes(flowData.steps)); 
    const [edges, setEdges] = useState(generateEdges(flowData.steps));

  // Handle Connections
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  // Handle Node & Edge Changes
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  // 🔹 Add a New Node
  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      position: { x: Math.random() * 200, y: Math.random() * 200 }, // Random Position
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
  
  // 🔹 Drag & Drop: Handle Drag Over
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  // 🔹 Drag & Drop: Handle Drop on Canvas
  const onDrop = (event) => {
    event.preventDefault();

    const nodeType = event.dataTransfer.getData("application/reactflow");
    if (!nodeType) return;


    const reactFlowBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left-290,
      y: event.clientY - reactFlowBounds.top-130,
    };

    const newNode = {
      id: `${nodes.length + 1}`,
      position,
      data: { label: `Node ${nodes.length + 1}` },
      type: "default",
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
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
      <Sidebar addNode={addNode} clearCanvas={clearCanvas} /> 
      {/* <div style={{ flex: 1, position: 'relative' }}>
       */}
       <div
        style={{ flex: 1, position: "relative" }}
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
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
