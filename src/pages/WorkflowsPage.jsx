import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchWorkflows } from "../services/api";
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import DownloadIcon from "@mui/icons-material/Download";

function WorkflowsPage() {
  const itemsPerPage = 8;
  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const initializeSampleData = () => {
      const existing = localStorage.getItem("my_workflows");
      if (!existing) {
        const sampleWorkflows = [
          {
            id: "wf-1001",
            name: "Onboarding Flow",
            nodes: [
              { id: "start", type: "start", label: "Start" },
              { id: "node1", type: "email", label: "Email" },
              { id: "end", type: "end", label: "End" }
            ],
            lastEditedOn: new Date().toLocaleString("en-IN", {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            description: "New employee onboarding process",
            starred: true
          },
          {
            id: "wf-1002",
            name: "Order Processing",
            nodes: [
              { id: "start", type: "start", label: "Start" },
              { id: "node1", type: "api", label: "API Call" },
              { id: "node2", type: "text", label: "Text Box" },
              { id: "end", type: "end", label: "End" }
            ],
            lastEditedOn: new Date().toLocaleString("en-IN", {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
            description: "E-commerce order handling system",
            starred: false
          },
        ];
        localStorage.setItem("my_workflows", JSON.stringify(sampleWorkflows));
      }
    };
    initializeSampleData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchWorkflows();
      setWorkflows(data);
    };
    loadData();
  }, [location.key]); // Refresh when location changes

  const handleToggleStar = (id) => {
    const updated = workflows.map(w => 
      w.id === id ? { ...w, starred: !w.starred } : w
    );
    setWorkflows(updated);
    localStorage.setItem("my_workflows", JSON.stringify(updated));
  };

  const filtered = workflows.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#fef8eb",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Top Bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 3,
          borderBottom: "1px solid #ddd",
          bgcolor: "#fff"
        }}
      >
        <IconButton sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{ fontWeight: 700, mr: 4, color: "#000" }}
        >
          Workflow Builder
        </Typography>

        <TextField
          placeholder="Search by Workflow Name/ID"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
        />

        <Box sx={{ flex: 1 }} />

        <Button
          variant="contained"
          sx={{
            bgcolor: "black",
            color: "#fff",
            borderRadius: "10px",
            ":hover": { bgcolor: "#333" }
          }}
          onClick={() => navigate("/editor")}
        >
          + Create New Process
        </Button>
        <Button
          variant="outlined"
          sx={{ ml: 2 }}
          color="error"
          onClick={() => {
            localStorage.removeItem("loggedIn");
            navigate("/login");
          }}
        >
          Logout
        </Button>
      </Box>

      {/* Table Section */}
      <Box sx={{ flex: 1, p: 3 }}>
        <TableContainer
          component={Paper}
          sx={{
            mt: 2,
            borderRadius: 2,
            overflowX: "auto",
            maxHeight: "calc(100vh - 200px)"
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Workflow Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Last Edited On</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Star</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentData.map((w) => (
                <TableRow key={w.id} hover>
                  <TableCell>
                    {w.name.length > 20 ? `${w.name.slice(0, 20)}...` : w.name}
                  </TableCell>
                  <TableCell>{w.id}</TableCell>
                  <TableCell>{w.lastEditedOn}</TableCell>
                  <TableCell>
                    {w.description.length > 40 ? `${w.description.slice(0, 40)}...` : w.description}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleToggleStar(w.id)}>
                      {w.starred ? (
                        <StarIcon sx={{ color: "#ffa000" }} />
                      ) : (
                        <StarBorderIcon sx={{ color: "#ffa000" }} />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{ mr: 1 }}
                      onClick={() => alert(`Executing ${w.id}`)}
                    >
                      Execute
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => navigate("/editor", { state: { workflowId: w.id } })}
                    >
                      Edit
                    </Button>
                    <IconButton onClick={() => alert(`Downloading ${w.id}`)}>
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {currentData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No matching workflows found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              variant={currentPage === i + 1 ? "contained" : "outlined"}
              sx={{ ml: 1 }}
            >
              {i + 1}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default WorkflowsPage;