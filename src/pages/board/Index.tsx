import { useParams, useNavigate } from "react-router-dom";
import { BoardPage } from "@/pages/board/BoardPage";
import { useBoard } from "@/hooks/useBoard";
import { useState } from "react";
import { Card } from "@/types/card";
import { CardDetailModal } from "@/components/CardDetailModal";

export function BoardDetailPage() {
  const { id } = useParams();
  const boardId = Number(id);
  const navigate = useNavigate();

  console.log(boardId);
  const { data: board, isLoading, isError } = useBoard(boardId);

  if (isLoading) return <p>Loading board...</p>;
  // console.log(board);
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
    <>
      <BoardPage
        // onCardClick={handleCardClick}
        board={board}
        onBack={() => navigate("/")}
        onLogout={() => navigate("/auth")}
      />
    </>
  );
}
