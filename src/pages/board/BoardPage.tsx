import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { Board } from "@/types/board";
import { useBoard } from "@/hooks/useBoard";
import { Card as CardType } from "@/types/card";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ListColumn } from "@/components/board/ListColumn";
import { AddListButton } from "@/components/board/AddListButton";
import { useCreateList, useUpdateList } from "@/hooks/useList";
import { useCreateCard, useUpdateCard, useDeleteCard } from "@/hooks/useCard";
import { useQueryClient } from "@tanstack/react-query";
import { BOARD_KEYS } from "@/queryKeys/board";

interface BoardPageProps {
  board: Board;
  onBack: () => void;
  onLogout: () => void;
}

export function BoardPage({ board, onBack, onLogout }: BoardPageProps) {
  const { data: freshBoard } = useBoard(board.id);
  const displayBoard: Board = freshBoard ?? board;

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const createList = useCreateList(board.id);
  const updateList = useUpdateList(board.id);
  const createCard = useCreateCard(board.id);
  const updateCard = useUpdateCard(board.id);
  const deleteCard = useDeleteCard();

  const queryClient = useQueryClient();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    // ✅ Reorder lists
    if (activeType === "list" && overType === "list") {
      const oldIndex = displayBoard.lists.findIndex((l) => l.id === Number(active.id));
      const newIndex = displayBoard.lists.findIndex((l) => l.id === Number(over.id));
      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const newLists = [...displayBoard.lists];
      const [moved] = newLists.splice(oldIndex, 1);
      newLists.splice(newIndex, 0, moved);

      // Optimistic UI
      queryClient.setQueryData(BOARD_KEYS.detail(board.id), (old: any) => {
        const copy = JSON.parse(JSON.stringify(old));
        copy.lists = newLists;
        return copy;
      });

      // Update backend
      newLists.forEach((list, idx) => {
        if (list.position !== idx) updateList.mutate({ listId: list.id, data: { position: idx } });
      });
      return;
    }

    // ✅ Reorder cards
    if (activeType === "card") {
      const activeCard = displayBoard.lists
        .flatMap((l) => l.cards || [])
        .find((c) => c.id === Number(active.id));
      if (!activeCard) return;

      const sourceListId = activeCard.listId;
      let targetListId = sourceListId;

      if (overType === "card") targetListId = Number(over.data.current?.listId);
      else if (overType === "list") targetListId = Number(over.id);
      else return;

      const targetList = displayBoard.lists.find((l) => l.id === targetListId);
      if (!targetList) return;

      const sortedCards = [...(targetList.cards || [])].sort((a, b) => a.position - b.position);

      let targetPosition = sortedCards.length;
      if (overType === "card") {
        const overIndex = sortedCards.findIndex((c) => c.id === Number(over.id));
        const sourceIndex = sortedCards.findIndex((c) => c.id === activeCard.id);
        targetPosition =
          sourceListId === targetListId
            ? sourceIndex < overIndex
              ? overIndex + 1
              : overIndex
            : overIndex === -1
            ? sortedCards.length
            : overIndex;
      }

      // ✅ Optimistic update
      queryClient.setQueryData(BOARD_KEYS.detail(board.id), (old: any) => {
        const boardCopy = JSON.parse(JSON.stringify(old));
        // Remove card from source
        for (const l of boardCopy.lists) {
          if (!l.cards) continue;
          const idx = l.cards.findIndex((c: any) => c.id === activeCard.id);
          if (idx !== -1) {
            l.cards.splice(idx, 1);
            break;
          }
        }
        // Insert into target
        targetList.cards = targetList.cards || [];
        targetList.cards.splice(targetPosition, 0, {
          ...activeCard,
          listId: targetListId,
          position: targetPosition,
        });
        // Reindex positions
        targetList.cards.forEach((c: any, i: number) => (c.position = i));
        return boardCopy;
      });

      // Update backend
      updateCard.mutate({
        cardId: activeCard.id,
        data: { listId: targetListId, position: targetPosition },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BoardHeader
        boardTitle={displayBoard.title}
        userName={""}
        onBack={onBack}
        onLogout={onLogout}
      />

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto w-[99%] flex flex-col p-4">
          <SortableContext
            items={displayBoard.lists.map((l) => l.id.toString())}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex items-start gap-4">
              {(displayBoard.lists || []).map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  cards={list.cards || []}
                  onAddCard={(title) => createCard.mutate({ title, listId: list.id })}
                  onDeleteCard={(cardId) => deleteCard.mutate({ cardId })}
                  onMoveCard={(cardId, newPosition) =>
                    updateCard.mutate({ cardId, data: { listId: list.id, position: newPosition } })
                  }
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
