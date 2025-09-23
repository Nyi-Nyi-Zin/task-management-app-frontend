import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { CardActions } from "@mui/material";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";

function BoardCard({
  item,
  editingBoardId,
  setEditingBoardId,
  setEditingTitle,
  editingTitle,
  handleUpdateBoard,
  handleDeleteBoard,
}) {
  const navigate = useNavigate();
  return (
    <Card
      key={item.id}
      sx={{ minWidth: 275 }}
      className="mt-4 cursor-pointer "
      classes={{ root: "w-[80%] bg-amber-200" }}
      onClick={() => {
        navigate(`/board/${item.id}`);
      }}
    >
      <div className="hover:bg-gray-200">
        <CardContent>
          {editingBoardId === item.id ? (
            <div className="flex gap-1 ">
              <TextField
                fullWidth
                value={editingTitle}
                onChange={(e) => {
                  setEditingTitle(e.target.value);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                size="small"
                variant="contained"
                onClick={(e) => {
                  handleUpdateBoard(item.id, editingTitle);
                  e.stopPropagation();
                }}
              >
                OK
              </Button>
            </div>
          ) : (
            <Typography
              variant="body2"
              style={{
                wordWrap: "break-word",
                whiteSpace: "normal",
              }}
            >
              {item.title}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={(e) => {
              setEditingBoardId(item.id);
              setEditingTitle(item.title);
              e.stopPropagation();
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteBoard(item.id);
            }}
          >
            Delete
          </Button>
        </CardActions>
      </div>
    </Card>
  );
}
export default BoardCard;
