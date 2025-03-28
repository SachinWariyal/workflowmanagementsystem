import React, { useState, useEffect, useReducer } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

function workflowReducer(state, action) {
  switch (action.type) {
    case 'ADD_NODE':
      return {
        ...state,
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: [
            ...state.present.nodes.slice(0, action.index + 1),
            action.node,
            ...state.present.nodes.slice(action.index + 1)
          ]
        },
        future: []
      };
    case 'DELETE_NODE':
      return {
        ...state,
        past: [...state.past, state.present],
        present: {
          ...state.present,
          nodes: state.present.nodes.filter((_, i) => i !== action.index)
        },
        future: []
      };
    case 'UNDO':
      return state.past.length > 0 ? {
        past: state.past.slice(0, -1),
        present: state.past[state.past.length - 1],
        future: [state.present, ...state.future]
      } : state;
    case 'REDO':
      return state.future.length > 0 ? {
        past: [...state.past, state.present],
        present: state.future[0],
        future: state.future.slice(1)
      } : state;
    case 'RESET':
      return {
        ...state,
        present: action.payload
      };
    default:
      return state;
  }
}

export default function EditWorkflowPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const workflowId = state?.workflowId || null;

  const [workflowName, setWorkflowName] = useState("Untitled");
  const [isAddNodeDialogOpen, setIsAddNodeDialogOpen] = useState(false);
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const initialState = {
    past: [],
    present: {
      name: "Untitled",
      nodes: [
        { id: "start", type: "start", label: "Start" },
        { id: "end", type: "end", label: "End" }
      ]
    },
    future: []
  };

  const [workflowState, dispatch] = useReducer(workflowReducer, initialState);

  useEffect(() => {
    if (workflowId) {
      const workflows = JSON.parse(localStorage.getItem("my_workflows") || "[]");
      const existing = workflows.find(w => w.id === workflowId);
      if (existing) {
        setWorkflowName(existing.name);
        dispatch({ 
          type: 'RESET', 
          payload: {
            name: existing.name,
            nodes: existing.nodes
          }
        });
      }
    }
  }, [workflowId]);

  const handleSave = () => {
    const workflows = JSON.parse(localStorage.getItem("my_workflows") || "[]");
    const workflowData = {
      id: workflowId || `wf-${Date.now()}`,
      name: workflowName,
      nodes: workflowState.present.nodes,
      lastEditedOn: new Date().toLocaleString("en-IN", { 
        hour: '2-digit', 
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      description: `Flow with ${workflowState.present.nodes.length} nodes`,
      starred: false
    };

    const newWorkflows = workflowId 
      ? workflows.map(w => w.id === workflowId ? workflowData : w)
      : [...workflows, workflowData];

    localStorage.setItem("my_workflows", JSON.stringify(newWorkflows));
    navigate("/workflows");
  };

  const handleAddNode = (type) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      label: type === "api" ? "API Call" : type === "email" ? "Email" : "Text Box"
    };

    dispatch({
      type: 'ADD_NODE',
      node: newNode,
      index: selectedNodeIndex
    });

    setIsAddNodeDialogOpen(false);
  };

  // Fixed delete function
  const handleDeleteNode = (index) => {
    if (workflowState.present.nodes[index].type === 'start' || 
        workflowState.present.nodes[index].type === 'end') {
      return;
    }
    dispatch({ type: 'DELETE_NODE', index });
  };

  return (
    <Box sx={{ 
      width: "100vw", 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      backgroundColor: "#fff6e6"
    }}>
      {/* Top Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <IconButton onClick={() => navigate("/workflows")}>
          <ArrowBackIcon />
        </IconButton>
        <TextField
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)}
          variant="outlined"
          sx={{ mx: 2, flexGrow: 1 }}
        />
        <Button 
          startIcon={<SaveIcon />} 
          variant="contained" 
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      {/* Workflow Canvas */}
      <Box sx={{ 
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transform: `scale(${zoomLevel})`,
        transition: "transform 0.2s",
        overflow: "auto",
        py: 4
      }}>
        {workflowState.present.nodes.map((node, index) => (
          <React.Fragment key={node.id}>
            {/* Node Container */}
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              position: "relative",
              my: 2
            }}>
              {/* Node */}
              <Box sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                bgcolor: 
                  node.type === "start" ? "green" : 
                  node.type === "end" ? "red" : 
                  "blue",
                color: "white",
                fontWeight: "bold"
              }}>
                {node.label}
                {node.type !== "start" && node.type !== "end" && (
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(255,255,255,0.2)",
                      '&:hover': { bgcolor: "rgba(255,255,255,0.4)" }
                    }}
                    onClick={() => handleDeleteNode(index)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>

              {/* Add Node Button (except after End) */}
              {node.type !== "end" && (
                <IconButton 
                  sx={{ 
                    mt: 2, 
                    bgcolor: "rgba(0,0,0,0.1)",
                    '&:hover': { bgcolor: "rgba(0,0,0,0.2)" }
                  }}
                  onClick={() => {
                    setSelectedNodeIndex(index);
                    setIsAddNodeDialogOpen(true);
                  }}
                >
                  <AddIcon />
                </IconButton>
              )}
            </Box>

            {/* Connector Line */}
            {index < workflowState.present.nodes.length - 1 && (
              <Box sx={{ 
                width: 2, 
                height: 40, 
                bgcolor: "grey.500",
                position: "relative",
                '&::after': {
                  content: '"▼"',
                  position: "absolute",
                  bottom: -20,
                  left: -6,
                  fontSize: 16,
                  color: "grey.500"
                }
              }} />
            )}
          </React.Fragment>
        ))}
      </Box>

      {/* Bottom Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderTop: '1px solid #ddd' }}>
        <Box>
          <IconButton 
            onClick={() => dispatch({ type: 'UNDO' })}
            disabled={!workflowState.past.length}
          >
            <UndoIcon />
          </IconButton>
          <IconButton 
            onClick={() => dispatch({ type: 'REDO' })}
            disabled={!workflowState.future.length}
          >
            <RedoIcon />
          </IconButton>
        </Box>
        <Box>
          <IconButton onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.1))}>
            <ZoomOutIcon />
          </IconButton>
          <Typography component="span" sx={{ mx: 2 }}>
            {Math.round(zoomLevel * 100)}%
          </Typography>
          <IconButton onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.1))}>
            <ZoomInIcon />
          </IconButton>
        </Box>
      </Box>

      <Dialog open={isAddNodeDialogOpen} onClose={() => setIsAddNodeDialogOpen(false)}>
        <DialogTitle>Add Node</DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {['api', 'email', 'text'].map((type) => (
              <Button
                key={type}
                variant="outlined"
                onClick={() => handleAddNode(type)}
                sx={{ textTransform: 'capitalize' }}
              >
                {type === 'api' ? 'API Call' : type === 'email' ? 'Email' : 'Text Box'}
              </Button>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}