import React from "react";
import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar: React.FC = () => {
  return (
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
  );
};

export default SearchBar;
