import api from "@/lib/axios/api";
import type { Card, CreateCardRequest, UpdateCardRequest } from "@/types/card";
import type { ApiResponse } from "@/types/common";

export const cardApi = {
  // Get all cards for a specific list
  getCards: async (listId: number): Promise<Card[]> => {
    const response = await api.post<ApiResponse<Card[]>>(`/cards/list`, { listId });
    return response.data.data || [];
  },

  // Get a single card by ID
  getCard: async (cardId: number): Promise<Card> => {
    const response = await api.get<ApiResponse<Card>>(`/cards/${cardId}`);
    return response.data.data as Card;
  },

  // Create a new card under a list
  createCard: async (data: CreateCardRequest): Promise<Card> => {
    const response = await api.post<ApiResponse<Card>>(`/cards`, data);
    return response.data.data as Card;
  },

  // Update a card by ID
  updateCard: async (cardId: number, data: UpdateCardRequest): Promise<Card> => {
    const response = await api.put<ApiResponse<Card>>(`/cards/${cardId}`, data);
    return response.data.data as Card;
  },

  // Delete a card by ID
  deleteCard: async (cardId: number): Promise<void> => {
    await api.delete(`/cards/${cardId}`);
  },

  toggleCardDone: async (id: number): Promise<Card> => {
    const response = await api.patch<Card>("/toggle", { id });
    return response.data;
  },
};
