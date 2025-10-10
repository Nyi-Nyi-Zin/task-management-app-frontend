import api from "@/lib/axios/api";
import type { Board, CreateBoardRequest, UpdateBoardRequest } from "@/types/board";
import type { ApiResponse } from "@/types/board";

export const boardApi = {
  getBoards: async (): Promise<Board[]> => {
    const response = await api.get<ApiResponse<Board[]>>("/boards");

    return response.data.data || [];
  },

  getBoard: async (id: number): Promise<Board> => {
    const response = await api.get<ApiResponse<Board>>(`/boards/${id}`);
    return response.data.board as Board;
  },

  createBoard: async (data: CreateBoardRequest): Promise<Board> => {
    const response = await api.post<ApiResponse<Board>>("/boards", data);
    return response.data.data as Board;
  },

  updateBoard: async (id: number, data: UpdateBoardRequest): Promise<Board> => {
    const response = await api.put<ApiResponse<Board>>(`/boards/${id}`, data);
    return response.data.data as Board;
  },

  deleteBoard: async (id: number): Promise<void> => {
    await api.delete(`/boards/${id}`);
  },
};
