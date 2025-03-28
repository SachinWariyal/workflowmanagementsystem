import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgimg from "../assets/bg-image.png";
import googlelogo from "../assets/google.png";
import facebooklogo from "../assets/facebook.png";
import applelogo from "../assets/apple.png";
import logo_highbridge from "../assets/logo_highbridge.png";
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";

function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const existing = localStorage.getItem("users");
    const parsed = existing ? JSON.parse(existing) : [];
    const user = parsed.find((u) => u.email === email && u.password === password);
    if (!user) {
      setErrorMsg("Invalid credentials");
      setShowError(true);
      return;
    }
    onLoginSuccess();
    if (rememberMe) {
      localStorage.setItem("loggedIn", "true");
    }
    navigate("/workflows");
  };

  const handleCloseError = () => {
    setShowError(false);
    setErrorMsg("");
  };

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
          Building the Future...
        </Typography>
        <Typography variant="body1" sx={{ maxWidth: "60%", lineHeight: 1.6 }}>
          Welcome to HighBridge, where we will shape our future together.
        </Typography>
      </Box>

      <Box sx={{ width: 460, height: 768, mt: "132px", mr: 30 }}>
        <Card elevation={5} sx={{ borderRadius: "30px", p: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Welcome Back!
            </Typography>
            <Typography variant="h4" sx={{ mb: 3 }}>
              Log In to your Account
            </Typography>
            <form onSubmit={handleSubmit}>
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
                sx={{ mb: 2 }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      color="primary"
                    />
                  }
                  label="Remember me"
                />
                <Link href="#forgot" underline="hover">
                  Forgot Password?
                </Link>
              </Box>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                sx={{ mb: 2, borderRadius: "20px", height: "50px" }}
              >
                Log In
              </Button>
              <Divider sx={{ my: 2 }}>Or</Divider>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1
                }}
              >
                <Box
                  component="img"
                  src={googlelogo}
                  alt="Google"
                  sx={{ width: 18, height: 18, ml: 1 }}
                />
                <Typography sx={{ flex: 1, textAlign: "center" }}>
                  Log In with Google
                </Typography>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1
                }}
              >
                <Box
                  component="img"
                  src={facebooklogo}
                  alt="Facebook"
                  sx={{ width: 18, height: 18, ml: 1 }}
                />
                <Typography sx={{ flex: 1, textAlign: "center" }}>
                  Log In with Facebook
                </Typography>
              </Button>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mb: 2,
                  borderRadius: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1
                }}
              >
                <Box
                  component="img"
                  src={applelogo}
                  alt="Apple"
                  sx={{ width: 18, height: 18, ml: 1 }}
                />
                <Typography sx={{ flex: 1, textAlign: "center" }}>
                  Log In with Apple
                </Typography>
              </Button>

              <Typography variant="body2" textAlign="center">
                New User?{" "}
                <Link href="/signup" underline="hover">
                  Sign Up Free
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
    </Box>
  );
}

export default LoginPage;
