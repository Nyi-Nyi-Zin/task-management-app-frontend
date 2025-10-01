import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBoard,
  fetchBoards,
  updateBoard,
  deleteBoard,
  getSingleBoard,
} from "../apicalls/board";
import {
  BoardType,
  CreateBoardRequest,
  UpdateBoardRequest,
  ApiResponse,
} from "../types/board";
import { toast } from "sonner";

// Fetch all boards
export const useFetchBoards = () => {
  return useQuery<BoardType[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetchBoards();
      if (response.isSuccess && response.data) return response.data;
      return [];
    },
  });
};

// Fetch single board by ID
export const useGetSingleBoard = (id: string | undefined) => {
  return useQuery<ApiResponse<BoardType>>({
    queryKey: ["board", id],
    queryFn: () => getSingleBoard(id!),
    enabled: !!id,
  });
};

// Create board
export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { isSuccess: boolean; data?: BoardType; message?: string },
    Error,
    CreateBoardRequest
  >({
    mutationFn: createBoard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board created successfully");
    },
    onError: () => {
      toast.error("Failed to create board");
    },
  });
};

// Update board
export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { isSuccess: boolean; data?: BoardType; message?: string },
    Error,
    UpdateBoardRequest
  >({
    mutationFn: updateBoard,
    onSuccess: (updatedBoard) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      const boardId = updatedBoard.data?.id as string | number | undefined;
      if (boardId)
        queryClient.invalidateQueries({ queryKey: ["board", boardId] });
      toast.success("Board updated successfully");
    },
    onError: () => {
      toast.error("Failed to update board");
    },
  });
};

// Delete board
export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<{ isSuccess: boolean; message?: string }, Error, string>({
    mutationFn: deleteBoard,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      queryClient.removeQueries({ queryKey: ["board", id] });
      toast.success("Board deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete board");
    },
  });
};
