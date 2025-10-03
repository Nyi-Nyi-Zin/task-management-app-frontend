// List.tsx
import React, { useEffect, useState } from "react";
import {
  Card,
  Box,
  TextField,
  Button,
  IconButton,
  Popover,
  MenuItem,
} from "@mui/material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { useNavigate, useParams } from "react-router-dom";
import ListCard from "./ListCard";
import { useUpdateBoard, useDeleteBoard } from "../../hooks/useBoard";
import { toast } from "sonner";
import { ListSchema } from "../../schema/board";
import type { Board, List } from "../../schema/board";
import { useQueryClient } from "@tanstack/react-query";

type ListProps = {
  boardDetails?: Board; // optional now
  allLists?: List[]; // optional now
};

function Lists({ boardDetails = {}, allLists = [] }: ListProps) {
  console.log(boardDetails);

  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const queryClient = useQueryClient();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(boardDetails?.title ?? "");

  const { mutate: updateBoard } = useUpdateBoard();
  const { mutate: deleteBoard } = useDeleteBoard();

  // Sync title if boardDetails changes
  useEffect(() => {
    setTitle(boardDetails?.title ?? "");
  }, [boardDetails?.title]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleUpdate = () => {
    if (!boardDetails?.id) return;

    updateBoard(
      { id: boardDetails.id.toString(), title },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Board updated successfully");
          console.log(boardDetails.id);

          // ✅ Now queryClient is defined
          // queryClient.invalidateQueries({
          //   queryKey: ["board", boardDetails.id],
          // });
          // queryClient.invalidateQueries({ queryKey: ["boards"] });
        },
        onError: () => toast.error("Failed to update board"),
      }
    );
  };
  const handleDelete = () => {
    if (!boardId) return;
    deleteBoard(boardId, { onSuccess: () => navigate("/profile") });
  };

  return (
    <Card className="w-full min-h-screen bg-amber-900">
      <section className="w-full h-screen bg-[#0079BF]">
        {/* Header */}
        <div className="text-white font-bold text-center py-3 w-full break-words bg-[#005C91] flex items-center justify-between px-10">
          {isEditing ? (
            <div className="flex gap-2 items-center">
              <TextField
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
              />
              <Button onClick={handleUpdate} variant="contained">
                Update
              </Button>
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setTitle(boardDetails?.title ?? "");
                }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h1 className="text-[20px] text-center mx-5">
              {boardDetails?.title ?? "Loading..."}
            </h1>
          )}

          <IconButton aria-label="settings-app" onClick={handleOpen}>
            <SettingsApplicationsIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        </div>

        {/* Popover */}
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem
            onClick={() => {
              setIsEditing(true);
              handleClose();
            }}
          >
            Edit
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            sx={{ color: "red" }}
          >
            Delete
          </MenuItem>
        </Popover>

        {/* Lists */}
        <Box sx={{ display: "flex", padding: 2, gap: 3 }}>
          {allLists.map((list) => {
            const parsedList = ListSchema.safeParse(list);
            if (!parsedList.success) {
              console.warn("Invalid list schema:", list);
              return null;
            }
            return <ListCard key={parsedList.data.id} list={parsedList.data} />;
          })}
        </Box>
      </section>
    </Card>
  );
}

export default Lists;
