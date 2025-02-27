import React, { useCallback, useState,useEffect } from 'react';
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
    const [flowDataState, setFlowDataState] = useState(flowData)
    const [nodes, setNodes] = useState(generateNodes(flowData.steps)); 
    const [edges, setEdges] = useState(generateEdges(flowData.steps));

  // Handle Connections
  // const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);
  const onConnect = (params) => {
    const { source, target } = params;
  
    // Create a new edge
    const newEdge = {
      id: `e${source}-${target}`,
      source,
      target,
      label: "New Edge",
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  
    // Update flowDataState
    setFlowDataState((prevFlowData) => {
      const updatedSteps = prevFlowData.steps.map((step) => {
        // Check if step contains either source or target
        const containsSource = step.nodes.some((node) => node.id === source);
        const containsTarget = step.nodes.some((node) => node.id === target);
  
        if (containsSource || containsTarget) {
          const updatedNodes = step.nodes.map((node) => {
            if (node.id === source) {
              // Ensure target node is added to subNodes if not already present
              const updatedSubNodes = [...new Set([...node.subNodes, target])];
              return { ...node, subNodes: updatedSubNodes };
            }
            return node;
          });
  
          // Add new attachment if it doesn't exist
          const updatedAttachments = [...step.attachments];
          const attachmentExists = updatedAttachments.some(
            (attachment) => (attachment.source === source && attachment.target === target) ||
                            (attachment.source === target && attachment.target === source)
          );
  
          if (!attachmentExists) {
            updatedAttachments.push({
              source,
              target,
              relation: "New Connection",
            });
          }
  
          return { ...step, nodes: updatedNodes, attachments: updatedAttachments };
        }
  
        return step;
      });
  
      return { ...prevFlowData, steps: updatedSteps };
    });
  
    console.log("Updated flowDataState:", flowDataState);
  };
  const saveToLocalStorage = (nodes, edges) => {
    localStorage.setItem('flowchartData', JSON.stringify({ nodes, edges }));
  };
  useEffect(() => {
    saveToLocalStorage(nodes, edges);
  }, [nodes, edges]);
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

    setFlowDataState((prevFlowData) => {
        const newStep = {
          id: `step-${prevFlowData.steps.length + 1}`,
          name: `New Step ${prevFlowData.steps.length + 1}`,
          nodes: [{ id: newNode.id, label: `Node ${newNode.id}`, subNodes: [] }],
          attachments: [],
        };
        return { ...prevFlowData, steps: [...prevFlowData.steps, newStep] };
      });

      console.log("updated on adding new node:",flowDataState);
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
    onNodeDelete(node.id);
  };
  const onNodeDelete = (nodeId) => {
    // setEdges((prevEdges) => prevEdges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  
    setFlowDataState((prevFlowData) => {
      const updatedSteps = prevFlowData.steps.map((step) => {
        const updatedNodes = step.nodes.filter((node) => node.id !== nodeId);
  
        // Remove nodeId from subNodes of other nodes
        const cleanedNodes = updatedNodes.map((node) => ({
          ...node,
          subNodes: node.subNodes.filter((id) => id !== nodeId),
        }));
  
        // Remove attachments where this node was source or target
        const updatedAttachments = step.attachments.filter(
          (attachment) => attachment.source !== nodeId && attachment.target !== nodeId
        );
  
        return { ...step, nodes: cleanedNodes, attachments: updatedAttachments };
      });
  
      return { ...prevFlowData, steps: updatedSteps };
    });
  
    console.log(`Node ${nodeId} deleted via context menu. Updated flowDataState:`, flowDataState);
  };

  const onEdgeContextMenu = (event, edge) => {
    event.preventDefault();
    setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    onEdgeDelete(edge.id, edge.source, edge.target);
  };
  const onEdgeDelete = (edgeId, source, target) => {
    // Remove the edge from the edges state
    // setEdges((prevEdges) => prevEdges.filter((edge) => edge.id !== edgeId));
  
    // Update flowDataState
    setFlowDataState((prevFlowData) => {
      const updatedSteps = prevFlowData.steps.map((step) => {
        const updatedNodes = step.nodes.map((node) => {
          if (node.id === source) {
            // Remove target from subNodes
            return { ...node, subNodes: node.subNodes.filter((id) => id !== target) };
          } else if (node.id === target) {
            // Remove source from subNodes
            return { ...node, subNodes: node.subNodes.filter((id) => id !== source) };
          }
          return node;
        });
  
        // Remove the attachment where the source and target match
        const updatedAttachments = step.attachments.filter(
          (attachment) => !(attachment.source === source && attachment.target === target) &&
                          !(attachment.source === target && attachment.target === source)
        );
  
        return { ...step, nodes: updatedNodes, attachments: updatedAttachments };
      });
  
      return { ...prevFlowData, steps: updatedSteps };
    });
  
    console.log("Updated flowDataState after edge deletion:", flowDataState);
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
