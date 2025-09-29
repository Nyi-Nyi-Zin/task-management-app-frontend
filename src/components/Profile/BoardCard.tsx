import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import boardImage from "../../assets/bg_image.webp";

interface BoardCardProps {
  item: { id: number; title: string };
  editingBoardId: number | null;
  editingTitle: string;
  setEditingBoardId: (id: number | null) => void;
  setEditingTitle: (title: string) => void;
  handleUpdateBoard: (id: number, newTitle: string) => void;
  handleDeleteBoard: (id: number) => void;
}

function BoardCard({
  item,
  editingBoardId,
  setEditingBoardId,
  setEditingTitle,
  editingTitle,
  handleUpdateBoard,
  handleDeleteBoard,
}: BoardCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      key={item.id}
      className="cursor-pointer h-40 w-full flex flex-col justify-between overflow-hidden rounded-lg shadow-md bg-amber-300"
      onClick={() => {
        navigate(`/board/${item.id}`);
      }}
    >
      <div className="h-[70%] w-full">
        <img
          src={boardImage}
          alt="board image"
          className="h-full w-full object-cover"
        />
      </div>

      <CardContent className="h-[30%] p-2 flex items-center justify-center text-start">
        {editingBoardId === item.id ? (
          <div
            className="flex gap-2 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              fullWidth
              size="small"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
            />
            <Button
              size="small"
              variant="contained"
              onClick={() => handleUpdateBoard(item.id, editingTitle)}
            >
              OK
            </Button>
          </div>
        ) : (
          <Typography
            variant="body2"
            className="truncate text-center w-full text-start"
          >
            {item.title}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default BoardCard;
