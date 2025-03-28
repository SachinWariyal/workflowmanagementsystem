import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../assets/bg-image.png";
import logo_highbridge from "../assets/logo_highbridge.png";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert
} from "@mui/material";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  function handleCloseError() {
    setShowError(false);
    setErrorMsg("");
  }

  function handleCloseSuccess() {
    setShowSuccess(false);
    setSuccessMsg("");
  }

  function handleSignUp(e) {
    e.preventDefault();
    const existing = localStorage.getItem("users");
    const parsed = existing ? JSON.parse(existing) : [];
    if (!email || !password) {
      setErrorMsg("Please enter valid details");
      setShowError(true);
      return;
    }
    if (parsed.find((u) => u.email === email)) {
      setErrorMsg("User already exists");
      setShowError(true);
      return;
    }
    parsed.push({ email, password });
    localStorage.setItem("users", JSON.stringify(parsed));
    setSuccessMsg("Sign Up successful!");
    setShowSuccess(true);
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  }

  return (
    <Box
      sx={{
        display: "flex",
        minWidth: "100vw",
        minHeight: "100vh",
        backgroundImage: `linear-gradient(
          rgba(33, 33, 33, 0.5),
          rgba(66, 66, 66, 0.5)
        ), url(${bgimg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          color: "#fff",
          ml: 30
        }}
      >
        <Box sx={{ mb: 3 }}>
          <img
            src={logo_highbridge}
            alt="HighBridge Logo"
            style={{ width: 200, height: "auto" }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Join the Future...
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "60%", lineHeight: 1.6 }}>
          Become a part of HighBridge and help us shape tomorrow together.
        </Typography>
      </Box>

      <Box sx={{ width: 460, height: 600, mt: "132px", mr: 30 }}>
        <Card elevation={5} sx={{ borderRadius: "30px", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome!
            </Typography>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Create an Account
            </Typography>
            <form onSubmit={handleSignUp}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mb: 2, borderRadius: "20px", height: "50px" }}
              >
                Sign Up
              </Button>
              <Typography variant="body2" textAlign="center">
                Already have an account?{" "}
                <Link href="/login" underline="hover">
                  Log In
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>

      <Snackbar
        open={showError}
        autoHideDuration={3000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {errorMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {successMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignUpPage;
