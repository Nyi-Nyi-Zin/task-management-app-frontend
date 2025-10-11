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
import { Card as CardType } from "@/types/card";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ListColumn } from "@/components/board/ListColumn";
import { AddListButton } from "@/components/board/AddListButton";
import { useCreateList, useDeleteList } from "@/hooks/useList";
import { useUpdateCard, useDeleteCard } from "@/hooks/useCard";
import { useCreateCard } from "@/hooks/useCard";

interface BoardPageProps {
  board: Board;
  onBack: () => void;
  onLogout: () => void;
}

export function BoardPage({ board, onBack, onLogout }: BoardPageProps) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const createList = useCreateList(board.id);
  const deleteList = useDeleteList(board.id);
  const createCard = useCreateCard(board.id);
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // handle card movement if needed
    updateCard.mutate({
      cardId: active.id as string,
      data: { listId: over.id as string },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BoardHeader
        boardTitle={board.title}
        userName={board.user?.email || ""}
        onBack={onBack}
        onLogout={onLogout}
      />

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto w-[99%] flex flex-col p-4">
          <SortableContext
            items={board.lists.map((l) => l.id)}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-start gap-4">
              {board.lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  cards={list.cards}
                  onAddCard={(title: string) => createCard.mutate({ title, listId: list.id })}
                  onDeleteCard={(cardId: string) => deleteCard.mutate(cardId)}
                />
              ))}
              <AddListButton onAdd={(title) => createList.mutate({ title })} />
            </div>
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
}
