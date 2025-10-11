import { LogOut, Layout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CreateBoardDialog } from "@/components/boards/CreateBoardDialog";
import { BoardCard } from "@/components/boards/BoardCard";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useBoards, useCreateBoard, useDeleteBoard } from "@/hooks/useBoard";
import type { Board } from "@/types/board";

export function Home() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // --- Hooks ---
  const { data: boards = [], isLoading } = useBoards();
  const createBoardMutation = useCreateBoard();
  const deleteBoardMutation = useDeleteBoard();

  // --- Handlers ---
  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const handleSelectBoard = (board: Board) => {
    navigate(`/boards/${board.id}`); // redirect to board detail route
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layout className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Boards</h1>
              <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <CreateBoardDialog
            onCreate={(title: string) =>
              createBoardMutation.mutate(
                { title },
                {
                  onSuccess: () => toast.success("Board created successfully!"),
                },
              )
            }
          />
        </div>

        {isLoading ? (
          <p>Loading boards...</p>
        ) : boards.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
              <Layout className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No boards yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first board to get started organizing your tasks
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onClick={() => handleSelectBoard(board)}
                onDelete={(e) => {
                  e.stopPropagation();
                  deleteBoardMutation.mutate(board.id, {
                    onSuccess: () => toast.success("Board deleted"),
                  });
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
