import {
  Box,
  Button,
  Card,
  IconButton,
  TextField,
  Popover,
  MenuItem,
} from "@mui/material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ListCard from "./ListCard";
import {
  useGetSingleBoard,
  useUpdateBoard,
  useDeleteBoard,
} from "../../hooks/useBoard";
import { toast } from "sonner";
import { BoardSchema, ListSchema } from "../../schema/board";
import type { Board, List } from "../../schema/board";

type ListProps = {
  boardDetails?: Board;
  allLists?: List[];
};

function Lists({ boardDetails: initialBoardDetails, allLists }: ListProps) {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();

  const { data: boardResponse, isLoading } = useGetSingleBoard(boardId);

  // Debug logs
  console.log("boardId:", boardId);
  console.log("boardResponse:", boardResponse);

  // ✅ Fix: parse the actual "board" field, not the whole response
  const parsedBoard = boardResponse?.board
    ? BoardSchema.safeParse(boardResponse.board)
    : null;

  console.log("parsedBoard:", parsedBoard);

  const boardDetails = parsedBoard?.success
    ? parsedBoard.data
    : initialBoardDetails;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");

  const { mutate: updateBoard } = useUpdateBoard();
  const { mutate: deleteBoard } = useDeleteBoard();

  useEffect(() => {
    if (boardDetails?.title) setTitle(boardDetails.title);
  }, [boardDetails?.title]);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);

  const handleUpdate = () => {
    if (!boardDetails) return;

    updateBoard(
      { id: boardDetails.id.toString(), title },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Board updated successfully");
        },
        onError: (error) => {
          console.error("Failed to update board:", error);
          toast.error("Failed to update board");
        },
      }
    );
  };

  const handleDelete = () => {
    if (!boardId) return;
    deleteBoard(boardId, {
      onSuccess: () => navigate("/profile"),
    });
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading board...</div>;
  }

  if (!boardDetails) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load board data. Check console for details.
      </div>
    );
  }

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
                  setTitle(boardDetails.title);
                }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <h1 className="text-[20px] text-center mx-5">
              {boardDetails.title}
            </h1>
          )}

          <IconButton aria-label="settings-app" onClick={handleOpen}>
            <SettingsApplicationsIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        </div>

        {/* Popover */}
        <Popover
          open={open}
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
          {allLists?.map((list) => {
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
