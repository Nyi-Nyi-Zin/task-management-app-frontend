import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listApi } from "@/api/list";
import type { List, CreateListRequest, UpdateListRequest } from "@/types/list";
import { LIST_KEYS } from "@/queryKeys/list";
import { BOARD_KEYS } from "@/queryKeys/board";

// ✅ Fetch all lists for a specific board
export const useLists = (boardId: number) => {
  return useQuery<List[]>({
    queryKey: LIST_KEYS.all(boardId),
    queryFn: () => listApi.getLists(boardId), // API returns cards inside lists
    enabled: !!boardId,
  });
};

// ✅ Fetch single list by ID
export const useList = (boardId: number, listId: number) => {
  return useQuery<List>({
    queryKey: LIST_KEYS.detail(boardId, listId),
    queryFn: () => listApi.getList(boardId, listId),
    enabled: !!boardId && !!listId,
  });
};

// ✅ Create a new list
export const useCreateList = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateListRequest) => listApi.createList(boardId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) }),
  });
};

export const useUpdateList = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ listId, data }: { listId: number; data: UpdateListRequest }) =>
      listApi.updateList(boardId, listId, data),
    onSuccess: () => {
      // Just refetch board after update
      queryClient.invalidateQueries({ queryKey: BOARD_KEYS.detail(boardId) });
    },
  });
};

// ✅ Delete a list
export const useDeleteList = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listId: number) => listApi.deleteList(boardId, listId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: LIST_KEYS.all(boardId) }),
  });
};
