import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsPage } from "./BoardsPage";
import { BoardPage } from "./BoardPage";
import { dataStore } from "@/lib/store";
import { Board } from "@/types/board";

const Index = () => {
  const navigate = useNavigate();
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const user = dataStore.getCurrentUser(); // check if user is logged in

  useEffect(() => {
    if (!user) {
      navigate("/auth"); // redirect to login/register page
    }
  }, [navigate, user]);

  const handleLogout = () => {
    dataStore.logout();
    setSelectedBoard(null);
    navigate("/auth"); // redirect to login page on logout
  };

  if (!user) return null; // prevent rendering BoardsPage while redirecting

  if (selectedBoard) {
    return (
      <BoardPage
        board={selectedBoard}
        onBack={() => setSelectedBoard(null)}
        onLogout={handleLogout}
      />
    );
  }

  return <BoardsPage onSelectBoard={(board) => setSelectedBoard(board)} onLogout={handleLogout} />;
};

export default Index;
