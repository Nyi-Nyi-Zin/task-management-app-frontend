import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface CardItemProps {
  card: CardType;
  onClick: () => void;
  onToggleDone: (cardId: string, isDone: boolean) => void;
}

export function CardItem({ card, onClick, onToggleDone }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-2">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(card.id, !card.isDone);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        >
          <Checkbox checked={card.isDone} />
        </div>
        
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-medium ${card.isDone ? "line-through text-muted-foreground" : ""}`}>
              {card.title}
            </p>
            {card.isDone && (
              <Badge variant="secondary" className="flex-shrink-0 gap-1">
                <Check className="h-3 w-3" />
                Done
              </Badge>
            )}
          </div>
          {card.description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {card.description}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
