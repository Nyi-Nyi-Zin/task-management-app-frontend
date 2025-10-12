import { useState, useRef, useEffect } from "react";
import { Card as CardUI } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card as CardType } from "@/types/card";
import { CardItem } from "./CardItem";
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface ListColumnProps {
  list: { id: number; title: string };
  cards: CardType[];
  onAddCard: (title: string) => void;
  onDeleteCard: (cardId: number) => void;
  onMoveCard: (cardId: number, newPosition: number) => void; // new callback
}

export function ListColumn({ list, cards, onAddCard, onDeleteCard, onMoveCard }: ListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [localCards, setLocalCards] = useState<CardType[]>(cards);
  const inputRef = useRef<HTMLInputElement>(null);

  // sync local state when props.cards change
  useEffect(() => {
    setLocalCards(cards.slice().sort((a, b) => a.position - b.position));
  }, [cards]);

  useEffect(() => {
    if (isAdding) requestAnimationFrame(() => inputRef.current?.focus());
  }, [isAdding]);

  const handleAdd = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(newCardTitle);
    setNewCardTitle("");
    setIsAdding(false);
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localCards.findIndex((c) => c.id.toString() === active.id.toString());
    const newIndex = localCards.findIndex((c) => c.id.toString() === over.id.toString());

    const newCards = arrayMove(localCards, oldIndex, newIndex).map((c, idx) => ({
      ...c,
      position: idx, // update positions locally
    }));

    setLocalCards(newCards);

    // call backend to update position
    const movedCard = newCards[newIndex];
    onMoveCard(movedCard.id, movedCard.position);
  };

  return (
    <CardUI className="flex-shrink-0 w-80 p-4 flex flex-col bg-secondary/30 max-h-[470px]">
      <h3 className="font-semibold mb-2">{list.title}</h3>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-col flex-1 overflow-y-auto gap-2">
          <SortableContext
            items={localCards.map((c) => c.id.toString())}
            strategy={verticalListSortingStrategy}
          >
            {localCards.map((card) => (
              <CardItem key={card.id} card={card} onClick={() => {}} onToggleDone={() => {}} />
            ))}
          </SortableContext>
        </div>
      </DndContext>

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
