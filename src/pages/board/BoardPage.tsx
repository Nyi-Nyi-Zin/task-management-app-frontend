import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Board } from "@/types/board";
import { Card, Card as CardType } from "@/types/card";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ListColumn } from "@/components/board/ListColumn";
import { AddListButton } from "@/components/board/AddListButton";
import { useCreateList, useDeleteList } from "@/hooks/useList";
import { useUpdateCard, useDeleteCard } from "@/hooks/useCard";
import { useCreateCard } from "@/hooks/useCard";
import { useUpdateList } from "@/hooks/useList";

interface BoardPageProps {
  board: Board;
  onBack: () => void;
  onLogout: () => void;
  onCardClick: (card: Card) => void;
}

export function BoardPage({ board, onCardClick, onBack, onLogout }: BoardPageProps) {
  const createList = useCreateList(board.id);
  const deleteList = useDeleteList(board.id);
  const updateList = useUpdateList(board.id);
  const createCard = useCreateCard(board.id);
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BoardHeader
        boardId={board.id}
        boardTitle={board.title}
        userName={board.user?.email || ""}
        onBack={onBack}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-x-auto w-[99%] flex flex-col p-4">
        <div className="flex items-start gap-4">
          {board.lists.map((list) => (
            <ListColumn
              onClick={onCardClick}
              key={list.id}
              list={list}
              cards={list.cards}
              onAddCard={(title: string) => createCard.mutate({ title, listId: list.id })}
              onDeleteCard={(cardId: string) => deleteCard.mutate(cardId)}
            />
          ))}
          <AddListButton onAdd={(title) => createList.mutate({ title })} />
        </div>
      </div>
    </div>
  );
}
