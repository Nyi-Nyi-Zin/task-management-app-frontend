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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dataStore } from "@/lib/store";
import { Board } from "@/types/board";
// import {Card} from '@/types/'
import { BoardHeader } from "@/components/board/BoardHeader";
import { ListColumn } from "@/components/board/ListColumn";
import { AddListButton } from "@/components/board/AddListButton";
import { CardDetailsDialog } from "@/components/board/CardDetailsDialog";
import { CardItem } from "@/components/board/CardItem";
import { toast } from "sonner";

interface BoardPageProps {
  board: Board;
  onBack: () => void;
  onLogout: () => void;
}

export function BoardPage({ board, onBack, onLogout }: BoardPageProps) {
  const queryClient = useQueryClient();
  const user = dataStore.getCurrentUser();
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  const { data: lists = [] } = useQuery({
    queryKey: ["lists", board.id],
    queryFn: () => dataStore.getLists(board.id),
  });

  const { data: allCards = [] } = useQuery({
    queryKey: ["cards", board.id],
    queryFn: () => {
      return lists.flatMap((list) => dataStore.getCards(list.id));
    },
    enabled: lists.length > 0,
  });

  const createListMutation = useMutation({
    mutationFn: (title: string) => {
      const list = dataStore.createList(title, board.id);
      return Promise.resolve(list);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      toast.success("List created!");
    },
  });

  const deleteListMutation = useMutation({
    mutationFn: (listId: string) => {
      dataStore.deleteList(listId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("List deleted");
    },
  });

  const createCardMutation = useMutation({
    mutationFn: ({ title, listId }: { title: string; listId: string }) => {
      const card = dataStore.createCard(title, listId);
      return Promise.resolve(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card created!");
    },
  });

  const updateCardMutation = useMutation({
    mutationFn: ({ cardId, updates }: { cardId: string; updates: Partial<Card> }) => {
      dataStore.updateCard(cardId, updates);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card updated!");
    },
  });

  const deleteCardMutation = useMutation({
    mutationFn: (cardId: string) => {
      dataStore.deleteCard(cardId);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card deleted");
    },
  });

  const handleDragStart = (event: DragStartEvent) => {
    const card = allCards.find((c) => c.id === event.active.id);
    if (card) {
      setActiveCard(card);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    // Check if dragging a list
    const activeList = lists.find((l) => l.id === active.id);
    if (activeList) {
      const overList = lists.find((l) => l.id === over.id);
      if (overList && activeList.id !== overList.id) {
        const oldIndex = lists.findIndex((l) => l.id === activeList.id);
        const newIndex = lists.findIndex((l) => l.id === overList.id);
        const reordered = arrayMove(lists, oldIndex, newIndex);

        // Update order in store
        reordered.forEach((list, index) => {
          dataStore.updateList(list.id, { order: index });
        });

        queryClient.invalidateQueries({ queryKey: ["lists"] });
        toast.success("List moved!");
      }
      return;
    }

    // Check if dragging a card
    const activeCard = allCards.find((c) => c.id === active.id);
    if (!activeCard) return;

    // Check if dropped on a list
    const targetList = lists.find((l) => l.id === over.id);
    if (targetList && activeCard.listId !== targetList.id) {
      const targetCards = allCards.filter((c) => c.listId === targetList.id);
      dataStore.updateCardOrder(activeCard.id, targetList.id, targetCards.length);
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card moved!");
      return;
    }

    // Check if dropped on another card
    const overCard = allCards.find((c) => c.id === over.id);
    if (overCard && activeCard.id !== overCard.id) {
      const sameList = activeCard.listId === overCard.listId;

      if (sameList) {
        const listCards = allCards.filter((c) => c.listId === activeCard.listId);
        const oldIndex = listCards.findIndex((c) => c.id === activeCard.id);
        const newIndex = listCards.findIndex((c) => c.id === overCard.id);

        const reordered = arrayMove(listCards, oldIndex, newIndex);
        reordered.forEach((card, index) => {
          dataStore.updateCardOrder(card.id, card.listId, index);
        });
      } else {
        dataStore.updateCardOrder(activeCard.id, overCard.listId, overCard.order);
      }

      queryClient.invalidateQueries({ queryKey: ["cards"] });
      toast.success("Card moved!");
    }
  };

  const handleToggleCardDone = (cardId: string, isDone: boolean) => {
    updateCardMutation.mutate({ cardId, updates: { isDone } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex flex-col">
      <BoardHeader
        boardTitle={board.title}
        userName={user?.name || ""}
        onBack={onBack}
        onLogout={onLogout}
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
                      onAddCard={(title) => createCardMutation.mutate({ title, listId: list.id })}
                      onDeleteList={() => deleteListMutation.mutate(list.id)}
                      onCardClick={setSelectedCard}
                      onToggleCardDone={handleToggleCardDone}
                    />
                  );
                })}
              </SortableContext>

              <AddListButton onAdd={(title) => createListMutation.mutate(title)} />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeCard ? (
            <CardItem card={activeCard} onClick={() => {}} onToggleDone={() => {}} />
          ) : null}
        </DragOverlay>
      </DndContext>

      <CardDetailsDialog
        card={selectedCard}
        open={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        onUpdate={(updates) => updateCardMutation.mutate({ cardId: selectedCard!.id, updates })}
        onDelete={() => deleteCardMutation.mutate(selectedCard!.id)}
      />
    </div>
  );
}
