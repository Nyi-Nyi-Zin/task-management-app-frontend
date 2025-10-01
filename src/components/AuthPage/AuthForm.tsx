import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import BgImage from "../../../public/Bg_image.png";

import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Link,
} from "@mui/material";
// import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../apicalls/auth";
import { LoginPayload, LoginResponse } from "../../types/Auth";
import { z } from "zod";
import { toast } from "sonner";

interface AuthFormProps {
  isLoginPage: boolean;
}

const AuthForm = ({ isLoginPage }: AuthFormProps) => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [processing, setProcessing] = useState(false);
  // Feedback handled via sonner toasts; no local alert state needed

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProcessing(true);

    const formData = new FormData(event.currentTarget);
    const values: LoginPayload = {
      email: (formData.get("email") as string) || "",
      password: (formData.get("password") as string) || "",
    };

    const AuthSchema = z.object({
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
    });

    const parseResult = AuthSchema.safeParse(values);
    if (!parseResult.success) {
      const firstError =
        Object.values(parseResult.error.flatten().fieldErrors)[0]?.[0] ||
        "Invalid input";
      toast.error(String(firstError));
      setProcessing(false);
      return;
    }

    try {
      if (isLoginPage) {
        const response: LoginResponse = await loginUser(values);

        if (response.isSuccess) {
          toast.success(response.message ?? "Login successful!");
          localStorage.setItem("token", response.token);
          navigate("/profile");
        } else {
          toast.error(response.message ?? "Login failed");
          throw new Error(response.message ?? "Login failed");
        }
      } else {
        const response = await registerUser(values);

        if (response.isSuccess) {
          toast.success(response.message ?? "Registration successful!");
          setTimeout(() => navigate("/login"), 1200);
        } else {
          toast.error(response.message ?? "Registration failed");
          throw new Error(response.message ?? "Registration failed");
        }
      }
    } catch (err: any) {
      toast.error(err?.message ?? "An error occurred.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      <Box
        sx={{
          flex: 1,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
        }}
      >
        <img
          src={BgImage}
          alt="Bg image"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            p: 4,
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h5" textAlign="center" fontWeight="bold">
            {isLoginPage ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            mb={2}
          >
            {isLoginPage
              ? "Enter your credentials to access your account"
              : "Fill in the form to create a new account"}
          </Typography>

          {/* Sonner toasts are shown globally via Toaster in main.tsx */}

          <Box component="form" onSubmit={handleOnSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              margin="normal"
              required
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
              disabled={processing}
              startIcon={processing && <CircularProgress size={20} />}
            >
              {processing
                ? isLoginPage
                  ? "Signing In..."
                  : "Signing Up..."
                : isLoginPage
                ? "Sign In"
                : "Sign Up"}
            </Button>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            {isLoginPage
              ? "Don't have an account?"
              : "Already have an account?"}
            <Link
              component={RouterLink}
              to={isLoginPage ? "/register" : "/login"}
              underline="hover"
              fontWeight="medium"
              sx={{ ml: 0.5 }}
            >
              {isLoginPage ? "Sign up" : "Sign in"}
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default AuthForm;
