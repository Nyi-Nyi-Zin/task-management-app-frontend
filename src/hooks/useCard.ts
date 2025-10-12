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

export const useUpdateCard = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ cardId, data }: { cardId: number; data: UpdateCardRequest }) =>
      cardApi.updateCard(cardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
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
