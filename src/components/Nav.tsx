import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { RootState, AppDispatch } from "../store/store";
import SearchBar from "./SearchBox";

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "rgba(255, 255, 255, 0.8)",
  backdropFilter: "blur(8px)",
  borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
  boxShadow: "none",
  position: "sticky",
}));

const Nav = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.reducer.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/");
    handleClose();
  };

  return (
    <StyledAppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar
          sx={{ justifyContent: "space-between", minHeight: "64px !important" }}
        >
          <Box
            component={Link}
            to="/profile"
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                height: 50,
                width: 50,
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              maxWidth: { xs: "100%", sm: "70%", md: "70%" },
              mx: { xs: 0, sm: 2 },
            }}
          >
            <SearchBar />
          </Box>

          {user && (
            <Box>
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleAvatarClick}
                  size="small"
                  sx={{ ml: 2 }}
                >
                  <Avatar>{user.email.charAt(0).toUpperCase()} </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                disableScrollLock={true}
              >
                <MenuItem>
                  <Typography textAlign="center">{user.email}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
};

export default Nav;
