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
 
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Start' } },
    { id: '2', position: { x: 150, y: 100 }, data: { label: 'Decision' } },
    { id: '3', position: { x: -100, y: 200 }, data: { label: 'Option A' } },
    { id: '4', position: { x: 150, y: 200 }, data: { label: 'Option B' } },
    { id: '5', position: { x: 300, y: 200 }, data: { label: 'Option C' } },
    { id: '6', position: { x: 150, y: 300 }, data: { label: 'End' } },
  ];
  
  const initialEdges = [
    { id: 'e1-2', source: '1', target: '2', label: 'Go to Decision' },
    { id: 'e2-3', source: '2', target: '3', label: 'Choose A' },
    { id: 'e2-4', source: '2', target: '4', label: 'Choose B' },
    { id: 'e2-5', source: '2', target: '5', label: 'Choose C' },
    { id: 'e3-6', source: '3', target: '6', label: 'End from A' },
    { id: 'e4-6', source: '4', target: '6', label: 'End from B' },
    { id: 'e5-6', source: '5', target: '6', label: 'End from C' },
  ];
 
export default function FlowChart() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}