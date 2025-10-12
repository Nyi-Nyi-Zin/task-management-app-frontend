import { useState, useRef, useEffect } from "react";
import { Card as CardUI } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as CardType } from "@/types/card";
import { CardItem } from "./CardItem";
import { cn } from "@/lib/utils";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ListColumnProps {
  list: { id: number; title: string };
  cards: CardType[];
  onAddCard: (title: string) => void;
  onDeleteCard: (cardId: string) => void;
}

export function ListColumn({ list, cards, onAddCard, onDeleteCard }: ListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input when it appears
  useEffect(() => {
    if (isAdding) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isAdding]);

  const handleAdd = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(newCardTitle); // directly call React Query mutation
    setNewCardTitle("");
    setIsAdding(false);
  };

  return (
    <CardUI className="flex-shrink-0 w-80 p-4 flex flex-col bg-secondary/30 max-h-[470px]">
      <h3 className="font-semibold mb-2">{list.title}</h3>

      <div className="flex flex-col flex-1 overflow-y-auto gap-2">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem key={card.id} card={card} onClick={() => {}} onToggleDone={() => {}} />
          ))}
        </SortableContext>
      </div>

      {isAdding ? (
        <div className="mt-2 space-y-2">
          <Input
            ref={inputRef}
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Enter card title..."
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAdd}>
              Add Card
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button variant="default" size="default" className="mt-2" onClick={() => setIsAdding(true)}>
          Add a card
        </Button>
      )}
    </CardUI>
  );
}
