import { axiosInstance, handleRequest } from "./axiosInstance";
import {
  BoardType,
  CreateBoardRequest,
  UpdateBoardRequest,
  ApiResponse,
} from "../types/board";

export const createBoard = async (
  payload: CreateBoardRequest
): Promise<ApiResponse<BoardType>> => {
  return handleRequest(
    axiosInstance.post<ApiResponse<BoardType>>("/create-board", payload)
  );
};

export const fetchBoards = async (
  userId: string
): Promise<ApiResponse<BoardType[]>> => {
  return handleRequest(
    axiosInstance.get<ApiResponse<BoardType[]>>(`/get-boards?userId=${userId}`)
  );
};

export const updateBoard = async (
  payload: UpdateBoardRequest
): Promise<ApiResponse<BoardType>> => {
  return handleRequest(
    axiosInstance.put<ApiResponse<BoardType>>(
      `/update-board/${payload.id}`,
      payload
    )
  );
};

export const deleteBoard = async (id: string): Promise<ApiResponse<null>> => {
  return handleRequest(
    axiosInstance.delete<ApiResponse<null>>(`/delete-board/${id}`)
  );
};

export const getSingleBoard = async (
  id: string
): Promise<ApiResponse<BoardType>> => {
  return handleRequest(
    axiosInstance.get<ApiResponse<BoardType>>(`/get-board/${id}`)
  );
};
