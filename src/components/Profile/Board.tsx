import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, Box, CircularProgress } from "@mui/material";
import BoardCard from "./BoardCard";
import Title from "../common/Title";
import { useFetchBoards } from "../../hooks/useBoard";
import { RootState } from "../../store/store";

function Board() {
  const { user } = useSelector((state: RootState) => state.reducer.user);

  // ✅ fetchBoards no longer needs userId
  const { data, isPending } = useFetchBoards();
  console.log(data);
  const boards = data ?? [];

  const [editingBoardId, setEditingBoardId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  const handleUpdateBoard = (id: number, newTitle: string) => {
    // TODO: Integrate updateBoard mutation here
    console.log("Update board", id, newTitle);
    setEditingBoardId(null);
    setEditingTitle("");
  };

  const handleDeleteBoard = (id: number) => {
    // TODO: Integrate deleteBoard mutation here
    console.log("Delete board", id);
  };

  return (
    <section className="min-h-screen flex justify-center items-start">
      {user && (
        <Card className="w-full max-w-[1000px] rounded border-1 border-zinc-300 p-3 ">
          <Title>YOUR WORKSPACES</Title>

          {isPending ? (
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          ) : boards.length < 1 ? (
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blue-700 text-center">
              No Boards To Show
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 w-full">
              {boards.map((item) => (
                <BoardCard
                  key={item.id}
                  item={item}
                  editingBoardId={editingBoardId}
                  editingTitle={editingTitle}
                  setEditingBoardId={setEditingBoardId}
                  setEditingTitle={setEditingTitle}
                  handleUpdateBoard={handleUpdateBoard}
                  handleDeleteBoard={handleDeleteBoard}
                />
              ))}
            </div>
          )}
        </Card>
        //   ) : (
        //     <section className="flex justify-center items-center h-[87vh]">
        //       <p className="text-blue-600 text-4xl mb-10 text-center">
        //         Login or Register to Start Manage Your Tasks
        //       </p>
        //     </section>
      )}
    </section>
  );
}

export default Board;
