import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BoardsPage } from "./BoardsPage";
import { BoardPage } from "./BoardPage";
import { Board } from "@/types/board";
import {} from "@/providers/auth-provider"; // Use your AuthContext
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuth(); // Get user from context
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth");
    }
  }, [navigate, user, isLoading]);

  const handleLogout = async () => {
    await logout();
    setSelectedBoard(null);
    navigate("/auth");
  };

  if (isLoading || !user) return <div>Loading...</div>; // Show loading while checking

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
