import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";

export type List = {
  id: string;
  title: string;
  cards: { id: string; title: string }[];
};

export type Board = {
  id: string;
  title: string;
};

type ListCardProps = {
  list: List;
  board?: Board;
};

const ListCard: React.FC<ListCardProps> = ({ list, board }) => {
  const [cards, setCards] = useState(list.cards || []);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [addingCard, setAddingCard] = useState(false);

  const handleAddCard = () => {
    if (!newCardTitle.trim()) return;
    const newCard = { id: Date.now().toString(), title: newCardTitle };
    setCards([...cards, newCard]);
    setNewCardTitle("");
    setAddingCard(false);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        minWidth: 280,
        maxWidth: 280,
        p: 1,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F1F2F4",
        maxHeight: "360px",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        px={1}
        py={0.5}
      >
        <Typography variant="subtitle1" fontWeight={500}>
          {list.title}
        </Typography>
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        flex={1}
        overflow="auto"
        display="flex"
        flexDirection="column"
        gap={1}
        px={1}
      >
        {cards.map((card) => (
          <Paper
            key={card.id}
            sx={{
              p: 1,
              bgcolor: "##FFFFFF",
              borderRadius: 1,
              margin: "1px 0",
            }}
          >
            {card.title}
          </Paper>
        ))}
      </Box>

      <Box px={1} mt={1}>
        {!addingCard ? (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setAddingCard(true)}
            sx={{
              justifyContent: "flex-start",
              color: "text.secondary",
              textTransform: "none",
              fontSize: "0.9rem",
              width: "100%",
            }}
          >
            Add a card
          </Button>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            <TextField
              size="small"
              placeholder="Enter a title for this card"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              fullWidth
              autoFocus
            />
            <Box display="flex" gap={1}>
              <Button variant="contained" size="small" onClick={handleAddCard}>
                Add
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setAddingCard(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default ListCard;
