import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Board, Card, List } from "@/types/board";
import { BoardHeader } from "@/components/board/BoardHeader";
import { ListColumn } from "@/components/board/ListColumn";
import { AddListButton } from "@/components/board/AddListButton";
import { CardDetailsDialog } from "@/components/board/CardDetailsDialog";
import { CardItem } from "@/components/board/CardItem";
import { useAuth } from "@/hooks/useAuth";

interface BoardPageProps {
  board: Board;
  onBack: () => void;
  onLogout: () => void;
}

export function BoardPage({ board, onBack }: BoardPageProps) {
  const { user, logout } = useAuth();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Mock lists & cards for UI
  const [lists, setLists] = useState<List[]>([
    { id: "1", title: "Todo", order: 0 },
    { id: "2", title: "In Progress", order: 1 },
    { id: "3", title: "Done", order: 2 },
  ]);

  const [allCards, setAllCards] = useState<Card[]>([
    { id: "1", title: "Task 1", listId: "1", isDone: false, order: 0 },
    { id: "2", title: "Task 2", listId: "1", isDone: false, order: 1 },
    { id: "3", title: "Task 3", listId: "2", isDone: false, order: 0 },
  ]);

  const handleDragStart = (event: DragStartEvent) => {
    const card = allCards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    // Dragging a list
    const activeListIndex = lists.findIndex((l) => l.id === active.id);
    const overListIndex = lists.findIndex((l) => l.id === over.id);
    if (activeListIndex !== -1 && overListIndex !== -1 && activeListIndex !== overListIndex) {
      const newLists = arrayMove(lists, activeListIndex, overListIndex);
      setLists(newLists);
      return;
    }

    // Dragging a card
    const activeCardIndex = allCards.findIndex((c) => c.id === active.id);
    const overCardIndex = allCards.findIndex((c) => c.id === over.id);
    if (activeCardIndex !== -1 && overCardIndex !== -1 && activeCardIndex !== overCardIndex) {
      const newCards = arrayMove(allCards, activeCardIndex, overCardIndex);
      setAllCards(newCards);
    }
  };

  const handleToggleCardDone = (cardId: string, isDone: boolean) => {
    setAllCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isDone } : c)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <BoardHeader
        boardTitle={board.title}
        userName={user?.name || ""}
        onBack={onBack}
        onLogout={logout}
      />

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="container mx-auto px-4 py-6 h-full">
            <div className="flex gap-4 pb-4 h-full">
              <SortableContext
                items={lists.map((l) => l.id)}
                strategy={horizontalListSortingStrategy}
              >
                {lists.map((list) => {
                  const cards = allCards.filter((c) => c.listId === list.id);
                  return (
                    <ListColumn
                      key={list.id}
                      list={list}
                      cards={cards}
                      onAddCard={(title) =>
                        setAllCards((prev) => [
                          ...prev,
                          {
                            id: (prev.length + 1).toString(),
                            title,
                            listId: list.id,
                            isDone: false,
                            order: cards.length,
                          },
                        ])
                      }
                      onDeleteList={() => setLists((prev) => prev.filter((l) => l.id !== list.id))}
                      onCardClick={setSelectedCard}
                      onToggleCardDone={handleToggleCardDone}
                    />
                  );
                })}
              </SortableContext>
              <AddListButton
                onAdd={(title) =>
                  setLists((prev) => [
                    ...prev,
                    { id: (prev.length + 1).toString(), title, order: prev.length },
                  ])
                }
              />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeCard && <CardItem card={activeCard} onClick={() => {}} onToggleDone={() => {}} />}
        </DragOverlay>
      </DndContext>

      <CardDetailsDialog
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={(updates) =>
          selectedCard &&
          setAllCards((prev) =>
            prev.map((c) => (c.id === selectedCard.id ? { ...c, ...updates } : c)),
          )
        }
        onDelete={() =>
          selectedCard && setAllCards((prev) => prev.filter((c) => c.id !== selectedCard.id))
        }
      />
    </div>
  );
}
