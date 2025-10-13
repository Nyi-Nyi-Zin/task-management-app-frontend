import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/types/card";
import { useToggleCardDone, useUpdateCard } from "@/hooks/useCard";
import { useParams } from "react-router-dom";
import { CardDetailModal } from "../CardDetailModal";
import { useState, useRef, useEffect } from "react";

interface CardItemProps {
  card: CardType;
  onClick?: (card: CardType) => void;
}

export function CardItem({ card, onClick }: CardItemProps) {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  // Hooks
  const toggleMutation = useToggleCardDone(boardId!);
  const updateCardMutation = useUpdateCard();

  // Modal state
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // (Inline description edit state seems unused, but left for context)
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [descValue, setDescValue] = useState(card.description || "");
  const descInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingDesc) {
      descInputRef.current?.focus();
    }
  }, [isEditingDesc]);

  // Open modal
  const handleCardClick = (card: CardType) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Toggle done
  const handleToggle = (cardId: number) => {
    toggleMutation.mutate(cardId);
  };

  // Save description (for inline edit)
  const saveDescription = () => {
    if (!selectedCard) return;
    updateCardMutation.mutate({
      cardId: selectedCard.id,
      data: { title: selectedCard.title, description: descValue },
    });
    setIsEditingDesc(false);
  };

  return (
    <>
      <Card
        className="p-3 cursor-pointer hover:shadow-md transition-all group relative"
        onClick={() => handleCardClick(card)}
      >
        <div className="flex items-start justify-between gap-2">
          {/* Left side: title + description */}
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                card.isDone ? "line-through text-muted-foreground" : ""
              }`}
            >
              {card.title}
            </p>

            {/* Inline description editor seems unused, left as is */}
            {isEditingDesc && (
              <input
                ref={descInputRef}
                type="text"
                value={descValue}
                onChange={(e) => setDescValue(e.target.value)}
                onBlur={saveDescription}
                onKeyDown={(e) => e.key === "Enter" && saveDescription()}
                className="w-full text-xs mt-1 p-1 border border-gray-300 rounded"
              />
            )}
          </div>

          {/* Right side: checkbox */}
          <div className="flex items-center gap-2">
            {card.isDone ? (
              <input
                type="checkbox"
                checked
                readOnly
                className="h-4 w-4 accent-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(card.id);
                }}
              />
            ) : (
              <input
                type="checkbox"
                checked={false}
                readOnly
                className="h-4 w-4 accent-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggle(card.id);
                }}
              />
            )}
          </div>
        </div>
      </Card>

      {/* Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={(cardId: number, updates: Partial<CardType>) => {
            const data = {
              title: updates.title ?? selectedCard.title,
              // FIX 1: Use the selectedCard's description as a fallback, not the local state
              description: updates.description ?? selectedCard.description,
            };
            updateCardMutation.mutate({ cardId, data });
            // FIX 2: This line was causing the modal to close. It has been removed.
            // setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
}
