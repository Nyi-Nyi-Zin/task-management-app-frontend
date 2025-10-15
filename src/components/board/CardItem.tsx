import { Card } from "@/components/ui/card";
import { Card as CardType } from "@/types/card";
import { useToggleCardDone, useUpdateCard, useDeleteCard } from "@/hooks/useCard";
import { useParams } from "react-router-dom";
import { CardDetailModal } from "../CardDetailModal";
import { useState } from "react";
import { DeleteButton } from "@/components/common/DeleteButton"; // Reusable delete button

interface CardItemProps {
  card: CardType;
}

export function CardItem({ card }: CardItemProps) {
  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  const toggleMutation = useToggleCardDone(boardId);
  const updateCardMutation = useUpdateCard();
  const deleteCard = useDeleteCard(boardId);

  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleCardClick = () => {
    setSelectedCard(card);
    setIsDetailOpen(true);
  };

  const handleToggleDone = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMutation.mutate(card.id);
  };

  return (
    <>
      <Card
        className="p-3 cursor-pointer hover:shadow-md transition-all group relative"
        onClick={handleCardClick}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Checkbox + Title wrapper */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={card.isDone}
              readOnly
              onClick={(e) => {
                e.stopPropagation();
                handleToggleDone(e);
              }}
              className={`h-4 w-4 accent-primary cursor-pointer ${
                card.isDone ? "block" : "hidden group-hover:block"
              }`}
            />

            <p
              className={`text-sm font-medium truncate ${
                card.isDone ? "line-through text-muted-foreground" : ""
              }`}
            >
              {card.title}
            </p>
          </div>

          {/* Delete button */}
          <DeleteButton onDelete={() => deleteCard.mutate({ cardId: card.id })} />
        </div>
      </Card>

      {/* Card Detail Modal */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          onUpdate={(cardId, updates) => {
            updateCardMutation.mutate({
              cardId,
              data: {
                title: updates.title ?? selectedCard.title,
                description: updates.description ?? selectedCard.description,
              },
            });
          }}
        />
      )}
    </>
  );
}
