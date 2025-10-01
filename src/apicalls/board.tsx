import { axiosInstance, handleRequest } from "./axiosInstance";
import {
  BoardType,
  CreateBoardRequest,
  UpdateBoardRequest,
} from "../types/board";

export const createBoard = async (
  payload: CreateBoardRequest
): Promise<{ isSuccess: boolean; data?: BoardType; message?: string }> => {
  return handleRequest(axiosInstance.post(`/create-board`, payload));
};

export const fetchBoards = async (): Promise<{
  isSuccess: boolean;
  data?: BoardType[];
  message?: string;
}> => {
  return handleRequest(axiosInstance.get(`/get-boards`));
};

export const updateBoard = async (
  payload: UpdateBoardRequest
): Promise<{ isSuccess: boolean; data?: BoardType; message?: string }> => {
  return handleRequest(
    axiosInstance.put(`/update-board/${payload.id}`, payload)
  );
};

export const deleteBoard = async (
  id: string
): Promise<{ isSuccess: boolean; message?: string }> => {
  return handleRequest(axiosInstance.delete(`/delete-board/${id}`));
};

export const getSingleBoard = async (id: string) => {
  return handleRequest(axiosInstance.get(`/get-board/${id}`));
};
