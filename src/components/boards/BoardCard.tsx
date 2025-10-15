import { Trash2, Calendar } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Board } from "@/types/board";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BoardCardProps {
  board: Board;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export function BoardCard({ board, onClick, onDelete }: BoardCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-l-4 border-l-primary flex flex-row justify-between h-12 sm:h-40 md:h-44 lg:h-48 ",
      )}
      onClick={onClick}
    >
      <div className="flex justify-center items-center md:items-start">
        <CardHeader>
          <CardTitle className="text-lg">{board.title}</CardTitle>
        </CardHeader>
      </div>
      <div className="flex justify-end items-center md:items-end p-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(e);
          }}
          className="hover:bg-red-400 hover:text-white"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
