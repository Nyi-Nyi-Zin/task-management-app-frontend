import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { boardApi } from "@/api/board";
import type { Board, CreateBoardRequest, UpdateBoardRequest } from "@/types/board";
import { BOARD_KEYS } from "@/queryKeys/board";

export const useBoards = () => {
  return useQuery<Board[]>({
    queryKey: BOARD_KEYS.all,
    queryFn: boardApi.getBoards,
  });
};

export const useBoard = (id: number) => {
  const boardId = Number(id);
  return useQuery<Board>({
    queryKey: BOARD_KEYS.detail(boardId),
    queryFn: () => boardApi.getBoard(boardId),
    enabled: !!id,
  });
};

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateBoardRequest) => boardApi.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all });
    },
  });
};

export const useUpdateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBoardRequest }) =>
      boardApi.updateBoard(id, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(variables.id) });
    },
  });
};

export const useDeleteBoard = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => boardApi.deleteBoard(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.all });
    },
  });
};
