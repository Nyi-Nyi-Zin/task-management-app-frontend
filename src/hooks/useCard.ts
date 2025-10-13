import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cardApi } from "@/api/card";
import type { Card, CreateCardRequest, UpdateCardRequest } from "@/types/card";
import { CARD_KEYS } from "@/queryKeys/card";
import { LIST_KEYS } from "@/queryKeys/list";
import { BOARD_KEYS } from "@/queryKeys/board";
import { toast } from "sonner";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
    },
    onError: (error: any) => {
      console.error("Failed to create card:", error);
      toast.error(error?.message || "Failed to create card");
    },
  });
};

// ✅ Update a card
export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: number; data: UpdateCardRequest }) =>
      cardApi.updateCard(cardId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: CARD_KEYS.detail(variables.cardId) });
      queryClient.invalidateQueries({ queryKey: ["lists"] });
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
export const useToggleCardDone = (boardId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cardApi.toggleCardDone(id),
    onSuccess: (updatedCard) => {
      // Invalidate board detail query if boardId is available
      if (boardId) {
        queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
      }

      // Optimistic update for cards cache
      queryClient.setQueryData(["cards"], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.map((card: any) => (card.id === updatedCard.id ? updatedCard : card));
      });
    },
  });
};
