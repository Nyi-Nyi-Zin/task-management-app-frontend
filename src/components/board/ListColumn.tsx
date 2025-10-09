import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDroppable } from "@dnd-kit/core";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { List, Card as CardType } from "@/lib/types";
import { CardItem } from "./CardItem";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ListColumnProps {
  list: List;
  cards: CardType[];
  onAddCard: (title: string) => void;
  onDeleteList: () => void;
  onCardClick: (card: CardType) => void;
  onToggleCardDone: (cardId: string, isDone: boolean) => void;
}

export function ListColumn({ list, cards, onAddCard, onDeleteList, onCardClick, onToggleCardDone }: ListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: list.id });

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: list.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const handleAddCard = () => {
    if (newCardTitle.trim()) {
      onAddCard(newCardTitle);
      setNewCardTitle("");
      setIsAdding(false);
    }
  };

  return (
    <Card ref={setNodeRef} style={style} className="flex-shrink-0 w-80 bg-secondary/30 border-border">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4 gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-base flex-1">{list.title}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDeleteList}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2 min-h-[100px]">
          <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {cards.map((card) => (
              <CardItem 
                key={card.id} 
                card={card} 
                onClick={() => onCardClick(card)}
                onToggleDone={onToggleCardDone}
              />
            ))}
          </SortableContext>
        </div>

        {isAdding ? (
          <div className="mt-3 space-y-2">
            <Input
              autoFocus
              placeholder="Enter card title..."
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCard();
                if (e.key === "Escape") {
                  setIsAdding(false);
                  setNewCardTitle("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCard}>
                Add Card
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false);
                  setNewCardTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="w-full mt-3 justify-start gap-2 text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
            Add a card
          </Button>
        )}
      </div>
    </Card>
  );
}
