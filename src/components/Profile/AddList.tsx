// AddList.tsx
import React, { useState } from "react";
import { Box, TextField, Button, IconButton, Card } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type AddListProps = {
  addList: (title: string) => void;
};

const AddList: React.FC<AddListProps> = ({ addList }) => {
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    if (!title.trim()) return;
    addList(title); // call API via hook
    setTitle("");
    setIsAdding(false);
  };

  return (
    <Box
      sx={{
        minWidth: 250,
        maxWidth: 250,
        p: 1,
        borderRadius: 1,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
        height: "150px",
        marginTop: "5px",
      }}
    >
      {!isAdding ? (
        <Button
          fullWidth
          variant="outlined"
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            borderRadius: 2,
            color: "black",
            backgroundColor: "white",
          }}
          onClick={() => setIsAdding(true)}
        >
          + Add another list
        </Button>
      ) : (
        <Card sx={{ height: "100px", padding: "8px" }}>
          <TextField
            size="small"
            placeholder="Enter list name..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button variant="contained" onClick={handleAdd}>
              Add list
            </Button>
            <IconButton onClick={() => setIsAdding(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Card>
      )}
    </Box>
  );
};

export default AddList;
