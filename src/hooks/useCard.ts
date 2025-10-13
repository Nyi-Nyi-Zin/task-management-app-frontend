import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi } from "@/api/card";
import type { Card, CreateCardRequest, UpdateCardRequest } from "@/types/card";
import { CARD_KEYS } from "@/queryKeys/card";
import { LIST_KEYS } from "@/queryKeys/list";
import { BOARD_KEYS } from "@/queryKeys/board";
import { toast } from "sonner";
import { Board } from "@/types/board";

// ✅ Fetch all cards for a specific list
export const useCards = (listId: number) => {
  return useQuery<Card[]>({
    queryKey: CARD_KEYS.all(listId),
    queryFn: () => cardApi.getCards(listId),
    enabled: !!listId,
  });
};

// ✅ Fetch single card by ID
export const useCard = (cardId: number) => {
  return useQuery<Card>({
    queryKey: CARD_KEYS.detail(cardId),
    queryFn: () => cardApi.getCard(cardId),
    enabled: !!cardId,
  });
};

export const useCreateCard = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCardRequest) => cardApi.createCard(data),
    onSuccess: (newCard) => {
      queryClient.setQueryData<Board>(BOARD_KEYS.detail(boardId), (oldData) => {
        if (!oldData) return oldData;

        const newLists = oldData.lists?.map((list) =>
          list.id === newCard.listId ? { ...list, cards: [...(list.cards || []), newCard] } : list,
        );

        return { ...oldData, lists: newLists };
      });
    },
    onError: (error: any) => {
      console.error("Failed to create card:", error);
      toast.error(error?.message || "Failed to create card");
    },
  });
};

export const useUpdateCard = (boardId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: number; data: UpdateCardRequest }) =>
      cardApi.updateCard(cardId, data),

    onSuccess: (updatedCard) => {
      queryClient.setQueryData<Board>(BOARD_KEYS.detail(boardId), (oldBoard) => {
        if (!oldBoard) return oldBoard;

        const newLists = oldBoard.lists?.map((list) => {
          // Update card in same list
          if (list.id === updatedCard.listId) {
            let updatedCards = [...list.cards];

            if (updatedCard.position !== undefined) {
              // Remove the card if it exists
              updatedCards = updatedCards.filter((c) => c.id !== updatedCard.id);
              // Insert at new position
              updatedCards.splice(updatedCard.position, 0, updatedCard);
              // Reassign positions
              updatedCards = updatedCards.map((c, idx) => ({ ...c, position: idx }));
            } else {
              // Update card fields
              updatedCards = updatedCards.map((c) =>
                c.id === updatedCard.id ? { ...c, ...updatedCard } : c,
              );
            }

            return { ...list, cards: updatedCards };
          }

          // Remove card if moved from this list
          if (updatedCard.listId !== list.id && list.cards.some((c) => c.id === updatedCard.id)) {
            const updatedCards = list.cards.filter((c) => c.id !== updatedCard.id);
            return { ...list, cards: updatedCards };
          }

          return list;
        });

        return { ...oldBoard, lists: newLists };
      });
    },
  });
};

// ✅ Delete a card
export const useDeleteCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId }: { cardId: number }) => cardApi.deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists"] });
    },
  });
};

export const useReorderCards = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, cardIds }: { listId: number; cardIds: number[] }) =>
      cardApi.reorderCards(listId, cardIds),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) }),
  });
};
