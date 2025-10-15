import { useState, useRef, useEffect } from "react";
import { Card as CardUI } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, Card as CardType } from "@/types/card";
import { CardItem } from "./CardItem";
import { useUpdateList } from "@/hooks/useList";
import { useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { listApi } from "@/api/list";
import { BOARD_KEYS } from "@/queryKeys/board";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ListColumnProps {
  list: { id: number; title: string };
  cards: CardType[];
  onAddCard: (title: string) => void;
  onDeleteCard: (cardId: string) => void;
  onClick?: (card: Card) => void;
}

export function ListColumn({ list, cards, onAddCard, onDeleteCard, onClick }: ListColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(list.title);

  const { id } = useParams<{ id: string }>();
  const boardId = Number(id);

  const titleInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  const updateList = useUpdateList(boardId);
  const queryClient = useQueryClient();

  const deleteList = useMutation({
    mutationFn: () => listApi.deleteList(boardId, list.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
    },
  });

  useEffect(() => {
    if (isAdding) requestAnimationFrame(() => cardInputRef.current?.focus());
  }, [isAdding]);

  useEffect(() => {
    if (isEditingTitle) requestAnimationFrame(() => titleInputRef.current?.focus());
  }, [isEditingTitle]);

  const handleAdd = () => {
    if (!newCardTitle.trim()) return;
    onAddCard(newCardTitle);
    setNewCardTitle("");
    setIsAdding(false);
  };

  const handleTitleSave = () => {
    setIsEditingTitle(false);
    const trimmed = title.trim();
    if (trimmed && trimmed !== list.title) {
      updateList.mutate({ listId: list.id, data: { title: trimmed } });
    } else {
      setTitle(list.title);
    }
  };

  return (
    <CardUI className="flex-shrink-0 w-80 p-4 flex flex-col bg-secondary/30 max-h-[470px]">
      {/* Title + Delete Icon */}
      <div className="relative flex items-center justify-between mb-2 group">
        {isEditingTitle ? (
          <Input
            ref={titleInputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
            className="font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-ring bg-background h-9 flex-1"
          />
        ) : (
          <h3
            className="font-semibold cursor-pointer rounded-md px-2 py-1 border border-transparent hover:border-input hover:ring-1 transition-all h-9 flex-1"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h3>
        )}

        {/* Delete icon sits outside the input/title */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-red-400 hover:text-white rounded-full p-2 flex items-center justify-center"
            >
              <Trash2 size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete List?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex gap-2 justify-end">
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" onClick={() => deleteList.mutate()}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards */}
      <div className="flex flex-col flex-1 overflow-y-auto gap-2">
        {cards.map((card) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>

      {/* Add Card */}
      {isAdding ? (
        <div className="mt-2 space-y-2">
          <Input
            ref={cardInputRef}
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
