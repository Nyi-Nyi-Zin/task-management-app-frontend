import { axiosInstance, handleRequest } from "./axiosInstance";

export interface CardCreatePayload {
  listId: string;
  title: string;
}

export interface CardResponse {
  isSuccess: boolean;
  message?: string;
  cards?: any[];
  cardTitle?: string;
  cardDesc?: string;
}

export const createCard = async (
  payload: CardCreatePayload
): Promise<CardResponse> => {
  return handleRequest(
    axiosInstance.post<CardResponse>("/board/list/create-card", payload)
  );
};

export const fetchAllCards = async (listId: string): Promise<CardResponse> => {
  return handleRequest(
    axiosInstance.get<CardResponse>(`/board/${listId}/cards`)
  );
};

export const fetchOldCardsTitle = async (
  cardId: string
): Promise<CardResponse> => {
  return handleRequest(
    axiosInstance.get<CardResponse>(`/board/list/get-old-card-title/${cardId}`)
  );
};

export const updateCard = async (payload: {
  cardId: string;
  title?: string;
  description?: string;
}): Promise<CardResponse> => {
  return handleRequest(
    axiosInstance.put<CardResponse>(
      `/board/list/update-card/${payload.cardId}`,
      payload
    )
  );
};

export const deleteCard = async (cardId: string): Promise<CardResponse> => {
  return handleRequest(
    axiosInstance.delete<CardResponse>(`/board/list/delete-card/${cardId}`)
  );
};
