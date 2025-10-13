import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import { Card, Column } from "./KanbanBoard";
import { KanbanCard } from "./KanbanCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Plus, MoreHorizontal } from "lucide-react";
import { Card } from "@/types/card";
import { List } from "@/types/list";

interface KanbanColumnProps {
  column: List;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onCardClick: (card: Card) => void;
  isDragging?: boolean;
}

export const KanbanColumn = ({
  column,
  onAddCard,
  onDeleteCard,
  onCardClick,
  isDragging = false,
}: KanbanColumnProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardContent, setNewCardContent] = useState("");

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: column.id,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: column.id.toString(),
    data: { type: "column" },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const setNodeRef = (node: HTMLElement | null) => {
    setDroppableRef(node);
    setSortableRef(node);
  };

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      onAddCard(column.id, newCardContent);
      setNewCardContent("");
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCard();
    } else if (e.key === "Escape") {
      setIsAdding(false);
      setNewCardContent("");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex-shrink-0 w-[280px] bg-column-bg/70 backdrop-blur-md rounded-xl p-3 animate-fade-in ${
        isDragging || isSortableDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between mb-3 cursor-grab active:cursor-grabbing"
      >
        <h3 className="text-foreground font-semibold text-sm">{column.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-card-hover pointer-events-auto"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      <SortableContext items={column.cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 min-h-[100px]">
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} onDelete={onDeleteCard} onClick={onCardClick} />
          ))}
        </div>
      </SortableContext>

      {isAdding ? (
        <div className="mt-2 space-y-2 animate-slide-up">
          <Input
            autoFocus
            value={newCardContent}
            onChange={(e) => setNewCardContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter card title..."
            className="bg-card-bg border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={handleAddCard}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              Add Card
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewCardContent("");
              }}
              className="hover:bg-card-hover"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          onClick={() => setIsAdding(true)}
          className="w-full mt-2 justify-start text-muted-foreground hover:bg-card-hover hover:text-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
};
