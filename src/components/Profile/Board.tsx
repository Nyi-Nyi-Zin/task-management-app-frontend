import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import BoardCard from "./BoardCard";
import Title from "../common/Title";

function Board({
  showForm,
  isLoading,
  board,
  editingBoardId,
  handleNewBoard,
  handleUpdateBoard,
  handleDeleteBoard,
  setShowForm,
  textFieldRef,
  boardName,
  setBoardName,
  setEditingTitle,
  setEditingBoardId,
  editingTitle,
}) {
  const { user } = useSelector((state) => state.reducer.user);

  return (
    <section className="min-h-screen flex justify-center items-start">
      {user ? (
        <>
          <section className="w-full max-w-[1000px] mx-auto my-5">
            {/* Create New Board Button */}
            {/* <div className="flex justify-end  px-4">
              <Button
                onClick={() => {
                  setShowForm(true);
                }}
                size="large"
                variant="contained"
              >
                Create New Board
              </Button>
            </div> */}
            <Title>YOUR WORKSPACES</Title>
            {/* New Board Form */}
            {showForm && (
              <Box
                className="flex justify-end"
                component="form"
                sx={{ "& > :not(style)": { m: 1, width: "25ch" } }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  inputRef={textFieldRef}
                  id="outlined-basic"
                  label="Board Name"
                  variant="outlined"
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                />
                <Button
                  size="small"
                  variant="outlined"
                  sx={{ width: "5ch !important", m: 1 }}
                  onClick={() => {
                    setShowForm(false);
                    handleNewBoard();
                  }}
                >
                  OK
                </Button>
              </Box>
            )}
            {isLoading ? (
              <Box sx={{ display: "flex" }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {board.length < 1 ? (
                  <p className="h-50 flex justify-center items-center text-xl sm:text-2xl md:text-3xl lg:text-4xl text-blue-700">
                    No Boards To Show
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 w-full">
                    {board.map((item) => (
                      <BoardCard
                        key={item.id}
                        item={item}
                        editingBoardId={editingBoardId}
                        handleUpdateBoard={handleUpdateBoard}
                        handleDeleteBoard={handleDeleteBoard}
                        setEditingTitle={setEditingTitle}
                        setEditingBoardId={setEditingBoardId}
                        editingTitle={editingTitle}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>
        </>
      ) : (
        <section className="flex justify-center items-center h-[87vh]">
          <p className="text-blue-600 text-4xl mb-10 text-center">
            Login or Register to Start Manage Your Tasks
          </p>
        </section>
      )}
    </section>
  );
}
export default Board;
