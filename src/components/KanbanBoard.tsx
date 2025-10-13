import { useEffect, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { CardDetailModal } from "./CardDetailModal";
import { useParams } from "react-router-dom";
import { Card } from "@/types/card";
import { useBoard } from "@/hooks/useBoard";
import { List } from "@/types/list";
import { useReorderLists } from "@/hooks/useList";
import { useCreateCard, useReorderCards } from "@/hooks/useCard";
// import boardBackground from "@/assets/board-background.jpg";

// export interface Card {
//   id: string;
//   title: string;
//   description?: string;
//   listId: string;
//   position: number;
// }

// export interface Column {
//   id: string;
//   title: string;
//   position: number;
//   cards: Card[];
// }

export const KanbanBoard = () => {
  const { id } = useParams<{ id: string }>();
  console.log(id);
  const boardIdNum = id ? Number(id) : 0;
  console.log(boardIdNum);
  if (!boardIdNum) return <div>Invalid board</div>;

  const { data: board, isLoading } = useBoard(boardIdNum);

  const [columns, setColumns] = useState<List[]>([]);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [activeColumn, setActiveColumn] = useState<List | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reorderListsMutation = useReorderLists(boardIdNum);
  const reorderCardsMutation = useReorderCards(boardIdNum);
  const createCardMutation = useCreateCard(boardIdNum);

  useEffect(() => {
    if (board?.lists) setColumns(board.lists);
  }, [board]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    // Check if dragging a column
    const column = columns.find((col) => col.id === active.id);
    if (column) {
      setActiveColumn(column);
      return;
    }

    // Check if dragging a card
    const activeColumnForCard = columns.find((col) =>
      col.cards.some((card) => card.id === active.id),
    );
    const card = activeColumnForCard?.cards.find((card) => card.id === active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    setActiveColumn(null);

    if (!over) return;

    // --- Reorder lists ---
    const activeCol = columns.find((col) => col.id.toString() === active.id.toString());
    const overCol = columns.find((col) => col.id.toString() === over.id.toString());

    if (activeCol && overCol) {
      const activeIndex = columns.findIndex((col) => col.id === active.id);
      const overIndex = columns.findIndex((col) => col.id === over.id);
      const newColumns = arrayMove(columns, activeIndex, overIndex);
      setColumns(newColumns);

      // Persist list order
      reorderListsMutation.mutate(
        newColumns.map((col, idx) => ({
          id: Number(col.id),
          position: idx,
        })),
      );

      return;
    }

    // --- Reorder cards ---
    const activeColumnId = columns.find((col) =>
      col.cards?.some((card) => card.id === Number(active.id)),
    )?.id;

    const overColumnId = columns.find(
      (col) => col.id === Number(over.id) || col.cards?.some((card) => card.id === Number(over.id)),
    )?.id;

    if (!activeColumnId || !overColumnId) return;

    setColumns((cols) => {
      const activeCol = cols.find((col) => col.id === activeColumnId);
      const overCol = cols.find((col) => col.id === overColumnId);
      if (!activeCol || !overCol) return cols;

      const activeCardIndex = activeCol.cards!.findIndex((c) => c.id === Number(active.id));
      const overCardIndex = overCol.cards!.findIndex((c) => c.id === Number(over.id));

      if (activeColumnId === overColumnId) {
        // Same column reorder
        const newCards = arrayMove(
          activeCol.cards!,
          activeCardIndex,
          overCardIndex >= 0 ? overCardIndex : activeCol.cards!.length,
        );
        const newCols = cols.map((col) =>
          col.id === activeColumnId ? { ...col, cards: newCards } : col,
        );

        // Persist
        reorderCardsMutation.mutate({
          listId: activeColumnId,
          cardIds: newCards.map((c) => c.id),
        });

        return newCols;
      } else {
        // Move card between columns
        const [movedCard] = activeCol.cards!.splice(activeCardIndex, 1);
        if (overCardIndex >= 0) overCol.cards!.splice(overCardIndex, 0, movedCard);
        else overCol.cards!.push(movedCard);

        // Persist both lists
        reorderCardsMutation.mutate({
          listId: activeColumnId,
          cardIds: activeCol.cards!.map((c) => c.id),
        });
        reorderCardsMutation.mutate({
          listId: overColumnId,
          cardIds: overCol.cards!.map((c) => c.id),
        });

        return [...cols];
      }
    });
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const addCard = async (columnId: string, title: string) => {
    try {
      const newCard = await createCardMutation.mutateAsync({ listId: Number(columnId), title });
      setColumns((prev) =>
        prev.map((col) =>
          col.id === Number(columnId) ? { ...col, cards: [...col.cards, newCard] } : col,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat">
      <div className="min-h-screen backdrop-blur-[2px] bg-black/30">
        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="container mx-auto p-8">
            <SortableContext
              items={columns.map((col) => col.id.toString())}
              strategy={horizontalListSortingStrategy}
            >
              <div className="flex gap-4 overflow-x-auto pb-4">
                {columns.map((column) => (
                  <KanbanColumn
                    key={column.id}
                    onAddCard={addCard}
                    // onDeleteCard={deleteCard}
                    column={column}
                    onCardClick={handleCardClick}
                  />
                ))}
              </div>
            </SortableContext>
          </div>
        </DndContext>

        <CardDetailModal
          card={selectedCard}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
};
