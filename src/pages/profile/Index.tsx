import { useSelector, TypedUseSelectorHook } from "react-redux";
import { useEffect, useState, useRef } from "react";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../../apicalls/board";
import Board from "./Board";
import { RootState } from "../../store/store";

export const handleNewBoard = async () => {
  try {
    const response = await createBoard({
      title: boardName,
      userId: user.id,
    });
    if (response.isSuccess) {
      setBoardName("");
      setShowForm(false);
      fetchAllBoards();
    }
  } catch (error) {
    console.error("Error creating board:", error);
  }
};

function Index() {
  const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
  const { user } = useTypedSelector((state) => state.reducer.user);
  const [isLoading, setIsLoading] = useState(false);
  const [board, setBoards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [boardName, setBoardName] = useState("");
  const [editingBoardId, setEditingBoardId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const textFieldRef = useRef(null);

  const fetchAllBoards = async () => {
    setIsLoading(true);
    try {
      const response = await fetchBoards(user.id);
      if (response.isSuccess) {
        setBoards(response.boards);
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id) {
      fetchAllBoards();
    }
  }, [user]);

  useEffect(() => {
    if (showForm && textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [showForm]);

  const handleUpdateBoard = async (id, title) => {
    try {
      const response = await updateBoard({
        id,
        title,
      });
      if (response.isSuccess) {
        setEditingBoardId(null);
        fetchAllBoards();
      }
    } catch (error) {
      console.error("Error updating board:", error);
    }
  };

  const handleDeleteBoard = async (id) => {
    try {
      const response = await deleteBoard(id);
      if (response.isSuccess) {
        fetchAllBoards();
      }
    } catch (error) {
      console.error("Error deleting board:", error);
    }
  };

  return (
    <Board
      showForm={showForm}
      isLoading={isLoading}
      board={board}
      editingBoardId={editingBoardId}
      handleNewBoard={handleNewBoard}
      handleUpdateBoard={handleUpdateBoard}
      handleDeleteBoard={handleDeleteBoard}
      editingTitle={editingTitle}
      setEditingTitle={setEditingTitle}
      setShowForm={setShowForm}
      textFieldRef={textFieldRef}
      boardName={boardName}
      setBoardName={setBoardName}
      setEditingBoardId={setEditingBoardId}
    />
  );
}

export default Index;
