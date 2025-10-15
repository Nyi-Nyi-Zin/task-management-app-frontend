import { ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BoardTitle } from "@/components/board/BoardTitle";

interface BoardHeaderProps {
  boardId: number;
  boardTitle: string;
  userName: string;
  onBack: () => void;
  onLogout: () => void;
}

export function BoardHeader({ boardId, boardTitle, userName, onBack, onLogout }: BoardHeaderProps) {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1 min-w-0">
              <BoardTitle boardId={boardId} title={boardTitle} />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{userName}</span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={onLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
