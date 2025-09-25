import React from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC = () => {
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <TextField
        variant="outlined"
        placeholder="Search"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          sx: { borderRadius: "6px" },
        }}
        sx={{
          flex: 1,
        }}
      />
      <Button
        variant="contained"
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
  );
};

export default SearchBar;
