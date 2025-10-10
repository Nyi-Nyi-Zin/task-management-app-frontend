import { Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Board } from "@/types/board";
import { format } from "date-fns";

interface BoardCardProps {
  board: Board;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-l-4 border-l-primary"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-lg">{board.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Created {format(new Date(board.createdAt), "MMM d, yyyy")}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-muted-foreground hover:text-destructive ml-auto"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
