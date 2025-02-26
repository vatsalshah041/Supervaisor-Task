export const flowData = {
    steps: [
      {
        id: "step-1",
        name: "User Registration",
        nodes: [
          { id: "1", label: "Start", subNodes: ["2", "3"] },
          { id: "2", label: "Enter Details", subNodes: [] },
          { id: "3", label: "Verify Email", subNodes: ["4"] },
          { id: "4", label: "Complete Registration", subNodes: [] }
        ],
        attachments: [
          { source: "1", target: "2", relation: "Leads To" },
          { source: "1", target: "3", relation: "Alternative Path" },
          { source: "3", target: "4", relation: "Depends On" }
        ]
      },
      // {
      //   id: "step-2",
      //   name: "Login Process",
      //   nodes: [
      //     { id: "5", label: "Login Page", subNodes: ["6"] },
      //     { id: "6", label: "Authenticate User", subNodes: ["7", "8"] },
      //     { id: "7", label: "Success - Dashboard", subNodes: [] },
      //     { id: "8", label: "Failure - Retry Login", subNodes: [] }
      //   ],
      //   attachments: [
      //     { source: "5", target: "6", relation: "Leads To" },
      //     { source: "6", target: "7", relation: "Success Path" },
      //     { source: "6", target: "8", relation: "Failure Path" }
      //   ]
      // }
    ]
  };
  