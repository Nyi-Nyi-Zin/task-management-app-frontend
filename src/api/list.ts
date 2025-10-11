import api from "@/lib/axios/api";
import type { List, CreateListRequest, UpdateListRequest } from "@/types/list";
import type { ApiResponse } from "@/types/common";

export const listApi = {
  // Get all lists for a specific board
  getLists: async (boardId: number): Promise<List[]> => {
    const response = await api.get<ApiResponse<List[]>>(`/boards/${boardId}/lists`);
    return response.data.data || []; // <-- change here
  },

  // Get a single list by ID
  getList: async (boardId: number, listId: number): Promise<List> => {
    const response = await api.get<ApiResponse<List>>(`/boards/${boardId}/lists/${listId}`);
    return response.data.data as List; // <-- change here
  },

  // Create a new list under a specific board
  createList: async (boardId: number, data: CreateListRequest): Promise<List> => {
    const response = await api.post<ApiResponse<List>>(`/boards/${boardId}/lists`, data);
    return response.data.data as List; // <-- change here
  },

  // Update a list by ID
  updateList: async (boardId: number, listId: number, data: UpdateListRequest): Promise<List> => {
    const response = await api.put<ApiResponse<List>>(`/boards/${boardId}/lists/${listId}`, data);
    return response.data.data as List; // <-- change here
  },

  // Delete a list by ID
  deleteList: async (boardId: number, listId: number): Promise<void> => {
    await api.delete(`/boards/${boardId}/lists/${listId}`);
  },
};
