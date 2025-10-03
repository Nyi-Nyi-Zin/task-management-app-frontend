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

export const useGetSingleBoard = (id: string | undefined) => {
  return useQuery<ApiResponse<BoardType>>({
    queryKey: ["board", id],
    queryFn: () => getSingleBoard(id!),
    enabled: !!id,
  });
};

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
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<
    { isSuccess: boolean; data?: BoardType; message?: string },
    Error,
    UpdateBoardRequest
  >({
    mutationFn: updateBoard,
    onSuccess: (_, variables) => {
      // variables.id is the board id we updated
      if (variables.id) {
        queryClient.invalidateQueries({ queryKey: ["board", variables.id] });
      }
      queryClient.invalidateQueries({ queryKey: ["boards"] });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<{ isSuccess: boolean; message?: string }, Error, string>({
    mutationFn: deleteBoard,

    onMutate: async (id) => {
      const previousBoards = queryClient.getQueryData<BoardType[]>(["boards"]);
      const previousBoard = queryClient.getQueryData(["board", id]);

      queryClient.setQueryData<BoardType[]>(["boards"], (old) =>
        old?.filter((board) => board.id !== id)
      );

      queryClient.removeQueries({ queryKey: ["board", id] });

      return { previousBoards, previousBoard };
    },

    onError: (_err, id, context) => {
      if (context?.previousBoards) {
        queryClient.setQueryData(["boards"], context.previousBoards);
      }
      if (context?.previousBoard) {
        queryClient.setQueryData(["board", id], context.previousBoard);
      }
      toast.error("Failed to delete board");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["boards"] });
      toast.success("Board deleted successfully");
    },
  });
};
