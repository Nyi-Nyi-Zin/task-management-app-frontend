import { axiosInstance, handleRequest } from "./axiosInstance";

export interface CreateListPayload {
  boardId: string;
  title: string;
}

export interface ListResponse {
  isSuccess: boolean;
  message?: string;
  lists?: any[];
  title?: string;
}

export const createNewList = async (
  payload: CreateListPayload
): Promise<ListResponse> => {
  return handleRequest(
    axiosInstance.post<ListResponse>("/board/create-list", payload)
  );
};

export const getAllLists = async (boardId: string): Promise<ListResponse> => {
  return handleRequest(
    axiosInstance.get<ListResponse>(`/get-lists/${boardId}`)
  );
};

export const updateList = async (payload: {
  listId: string;
  title: string;
}): Promise<ListResponse> => {
  return handleRequest(
    axiosInstance.put<ListResponse>(`/board/update-list/${payload.listId}`, {
      title: payload.title,
    })
  );
};

export const getOldListTitle = async (
  listId: string
): Promise<ListResponse> => {
  return handleRequest(
    axiosInstance.get<ListResponse>(`/board/get-old-list-title/${listId}`)
  );
};

export const deleteList = async (listId: string): Promise<ListResponse> => {
  return handleRequest(
    axiosInstance.delete<ListResponse>(`/board/delete-list/${listId}`)
  );
};
