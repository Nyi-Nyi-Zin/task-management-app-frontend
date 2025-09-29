import { axiosInstance, handleRequest } from "./axiosInstance";
import {
  BoardType,
  CreateBoardRequest,
  UpdateBoardRequest,
  ApiResponse,
} from "../types/board";

export const createBoard = async (
  payload: CreateBoardRequest
): Promise<BoardType> => {
  const res = await axiosInstance.post<BoardType>("/create-board", payload);
  return res.data;
};

// export const fetchBoards = async (
//   userId: number
// ): Promise<ApiResponse<BoardType[]>> => {
//   return handleRequest(
//     axiosInstance.get<ApiResponse<BoardType[]>>(`/get-boards`)
//   );
// };

export const fetchBoards = async (): Promise<ApiResponse<BoardType[]>> => {
  return handleRequest(
    axiosInstance.get<ApiResponse<BoardType[]>>("/get-boards")
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
