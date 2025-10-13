import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "./KanbanBoard";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface KanbanCardProps {
  card: Card;
  isDragging?: boolean;
  onDelete?: (cardId: string) => void;
  onClick?: (card: Card) => void;
}

export const KanbanCard = ({ card, isDragging = false, onDelete, onClick }: KanbanCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick?.(card)}
      className={cn(
        "group relative bg-card-bg hover:bg-card-hover rounded-lg p-3 cursor-grab active:cursor-grabbing transition-colors",
        "border border-border/50 hover:border-primary/50",
        (isDragging || isSortableDragging) && "opacity-50 ring-2 ring-card-drag",
      )}
    >
      <div className="pr-6">
        <h4 className="text-foreground text-sm font-medium mb-1">{card.title}</h4>
        {card.description && (
          <p className="text-muted-foreground text-xs line-clamp-2">{card.description}</p>
        )}
      </div>
      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20 hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
};
