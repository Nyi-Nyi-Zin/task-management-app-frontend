import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import BoardCard from "./BoardCard";

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
    <section className=" min-h-screen " style={{ paddingTop: "100px" }}>
      {user ? (
        <>
          <p className="text-blue-600 text-4xl font-bold flex justify-center items-center h-20 w-full">
            Your Boards
          </p>

          <section className="flex flex-col items-center justify-center gap-3 w-[100%] ">
            <div className="flex justify-end ">
              <Button
                onClick={() => {
                  setShowForm(true);
                }}
                size="large"
                variant="contained"
              >
                Create New Board
              </Button>
            </div>
            {showForm ? (
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
            ) : (
              <></>
            )}
            {isLoading ? (
              <>
                <Box sx={{ display: "flex" }}>
                  <CircularProgress />
                </Box>
              </>
            ) : (
              <>
                {board.length < 1 ? (
                  <>
                    <p className=" h-50 flex justify-center items-center text-4xl text-blue-700">
                      No Boards To Show
                    </p>
                  </>
                ) : (
                  <>
                    {board.map((item) => (
                      <BoardCard
                        item={item}
                        key={item.id}
                        editingBoardId={editingBoardId}
                        setEditingBoardId={setEditingBoardId}
                        setEditingTitle={setEditingTitle}
                        editingTitle={editingTitle}
                        handleUpdateBoard={handleUpdateBoard}
                        handleDeleteBoard={handleDeleteBoard}
                      />
                    ))}
                  </>
                )}
              </>
            )}
            <div className="mt-50"></div>
          </section>
        </>
      ) : (
        <>
          <section className="flex justify-center items-center h-[87vh]">
            <p className=" text-blue-600 text-4xl mb-10 text-center">
              Login or Register to Start Manage Your Tasks
            </p>
          </section>
        </>
      )}
    </section>
  );
}
export default Board;
