import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCard,
  fetchAllCards,
  fetchOldCardsTitle,
  updateCard,
  deleteCard,
  CardResponse,
} from "../apicalls/card";
import { toast } from "sonner";

export const useCard = (listId?: string) => {
  const [editingCardTitle, setEditingCardTitle] = useState("");
  const [editingCardDesc, setEditingCardDesc] = useState("");
  const queryClient = useQueryClient();

  const {
    data: cardsData,
    isLoading,
    error,
  } = useQuery<CardResponse, any, CardResponse>({
    queryKey: ["cards", listId ?? ""],
    queryFn: () => fetchAllCards(listId || ""),
    enabled: !!listId,
  });

  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message ?? "Failed to fetch cards");
    }
  }, [error]);

  const createMutation = useMutation<
    CardResponse,
    any,
    { listId: string; title: string }
  >({
    mutationFn: (payload: { listId: string; title: string }) =>
      createCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", listId ?? ""] });
      toast.success("Card created");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create card"),
  });

  const updateMutation = useMutation<
    CardResponse,
    any,
    { cardId: string; title?: string; description?: string }
  >({
    mutationFn: (payload: {
      cardId: string;
      title?: string;
      description?: string;
    }) => updateCard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", listId ?? ""] });
      toast.success("Card updated");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update card"),
  });

  const deleteMutation = useMutation<CardResponse, any, string>({
    mutationFn: (cardId: string) => deleteCard(cardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards", listId ?? ""] });
      toast.success("Card deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete card"),
  });

  const getOldTitle = async (cardId: string) => {
    try {
      const res = await fetchOldCardsTitle(cardId);
      if (res.isSuccess) {
        setEditingCardTitle(res.cardTitle ?? "");
        setEditingCardDesc(res.cardDesc ?? "");
        return res;
      }
      toast.error(res.message ?? "Failed to load card");
      return null;
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to load card");
      return null;
    }
  };

  return {
    editingCardTitle,
    setEditingCardTitle,
    cards: cardsData,
    cardsList: cardsData?.cards ?? [],
    isLoading,
    error,
    create: (title: string) =>
      createMutation.mutate({ listId: listId || "", title }),
    update: (cardId: string) =>
      updateMutation.mutate({ cardId, title: editingCardTitle }),
    updateDescription: (cardId: string, description: string) =>
      updateMutation.mutate({ cardId, description }),
    remove: (cardId: string) => deleteMutation.mutate(cardId),
    getOldTitle,
    editingCardDesc,
    setEditingCardDesc,
  };
};
