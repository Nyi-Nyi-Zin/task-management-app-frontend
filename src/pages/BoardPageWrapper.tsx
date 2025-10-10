// BoardPageWrapper.tsx
import { useParams, useNavigate } from "react-router-dom";
import { BoardPage } from "@/pages/BoardPage";
import { useBoard } from "@/hooks/useBoard";

export function BoardPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Convert boardId to number
  const boardIdNumber = id ? parseInt(id, 10) : undefined;

  const { data: board, isLoading, isError } = useBoard(boardIdNumber ?? 0);

  console.log(board);

  const handleBack = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    navigate("/auth");
  };

  if (isLoading) {
    return <p className="text-center py-16">Loading board...</p>;
  }

  if (isError || !board) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Failed to load board</p>
        <button onClick={handleBack} className="mt-4 px-4 py-2 bg-primary text-white rounded">
          Back to Boards
        </button>
      </div>
    );
  }

  return <BoardPage board={board} onBack={handleBack} onLogout={handleLogout} />;
}
