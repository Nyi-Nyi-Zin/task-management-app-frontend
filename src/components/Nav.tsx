import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "../store/slices/userSlice";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import {
  Toolbar,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Popover,
} from "@mui/material";
import { RootState, AppDispatch } from "../store/store";
import SearchBar from "./SearchBox";

import { useCreateBoard, useFetchBoards } from "../hooks/useBoard";

const Nav = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.reducer.user);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [boardAnchorEl, setBoardAnchorEl] = useState<null | HTMLElement>(null);
  const boardFormOpen = Boolean(boardAnchorEl);

  const [boardName, setBoardName] = useState("");
  const textFieldRef = useRef<HTMLInputElement>(null);

  const { data: boards } = useFetchBoards();

  const { mutateAsync: createBoardMutation, isPending } = useCreateBoard();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setUser(null));
    navigate("/");
    handleClose();
  };

  const handleNewBoard = async () => {
    if (!boardName.trim()) return;

    try {
      // We no longer need to pass userId; backend will use auth token
      await createBoardMutation({ title: boardName });
      setBoardName("");
      handleCloseBoardForm();
    } catch (err: any) {
      console.error("Error creating board:", err.message);
    }
  };

  const handleOpenBoardForm = (event: React.MouseEvent<HTMLElement>) =>
    setBoardAnchorEl(event.currentTarget);
  const handleCloseBoardForm = () => {
    setBoardAnchorEl(null);
    setBoardName("");
  };

  return (
    <nav className="border-b border-b-gray-300">
      <Toolbar sx={{ justifyContent: "space-between", minHeight: 30 }}>
        <Box
          component={Link}
          to="/profile"
          sx={{
            display: { xs: "none", sm: "flex" },
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            justifyContent: "center",
          }}
        >
          <span>Miracle</span>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexGrow: 1,
            maxWidth: { xs: "100%", sm: "77%" },

            gap: 2,
          }}
        >
          <SearchBar />
          <Button
            variant="contained"
            onClick={handleOpenBoardForm}
            sx={{
              borderRadius: "6px",
              textTransform: "none",
              backgroundColor: "#1976d2",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
          >
            Create
          </Button>
        </Box>

        {user && (
          <Box>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleAvatarClick}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar>{user.email.charAt(0).toUpperCase()}</Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              disableScrollLock
            >
              <MenuItem>
                <Typography textAlign="center">{user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>

      {/* Create Board Popover */}
      <Popover
        open={boardFormOpen}
        anchorEl={boardAnchorEl}
        onClose={handleCloseBoardForm}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
      >
        <Box
          component="form"
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: 280,
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleNewBoard();
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Create board
          </Typography>
          <TextField
            inputRef={textFieldRef}
            label="Board Name"
            variant="outlined"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
            <Button
              size="small"
              color="error"
              variant="outlined"
              onClick={handleCloseBoardForm}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={handleNewBoard}
              disabled={isPending}
            >
              {isPending ? <CircularProgress size={16} /> : "OK"}
            </Button>
          </Box>
        </Box>
      </Popover>
    </nav>
  );
};

export default Nav;
