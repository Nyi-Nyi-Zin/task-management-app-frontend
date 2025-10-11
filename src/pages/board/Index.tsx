import { useParams, useNavigate } from "react-router-dom";
import { BoardPage } from "@/pages/board/BoardPage";
import { useBoard } from "@/hooks/useBoard";

export function BoardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const boardId = id ? parseInt(id, 10) : undefined;

  const { data: board, isLoading, isError } = useBoard(boardId);

  if (isLoading) return <p>Loading board...</p>;

  if (isError || !board)
    return (
      <div className="text-center py-16">
        <p className="text-red-500">Failed to load board</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-4 py-2 bg-primary text-white rounded"
        >
          Back to Boards
        </button>
      </div>
    );

  return (
    <BoardPage board={board} onBack={() => navigate("/")} onLogout={() => navigate("/auth")} />
  );
}
