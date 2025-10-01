import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createNewList,
  getAllLists,
  updateList,
  deleteList,
  getOldListTitle,
} from "../apicalls/list";
import { toast } from "sonner";

export const useList = (boardId?: string) => {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["lists", boardId ?? ""],
    queryFn: () => getAllLists(boardId || ""),
    enabled: !!boardId,
  });

  useEffect(() => {
    if (error) {
      toast.error((error as any)?.message ?? "Failed to fetch lists");
    }
  }, [error]);

  const createMutation = useMutation({
    mutationFn: (payload: { boardId: string; title: string }) =>
      createNewList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId ?? ""] });
      toast.success("List created");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to create list"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { listId: string; title: string }) =>
      updateList(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId ?? ""] });
      toast.success("List updated");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to update list"),
  });

  const deleteMutation = useMutation({
    mutationFn: (listId: string) => deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lists", boardId ?? ""] });
      toast.success("List deleted");
    },
    onError: (err: any) => toast.error(err?.message ?? "Failed to delete list"),
  });

  const getListTitle = async (listId: string) => {
    try {
      const res = await getOldListTitle(listId);
      if (res.isSuccess) return res.title ?? "";
      toast.error(res.message ?? "Failed to fetch list title");
      return "";
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to fetch list title");
      return "";
    }
  };

  return {
    lists: data?.lists,
    loading: isLoading,
    error,
    addList: (title: string) =>
      createMutation.mutate({ boardId: boardId || "", title }),
    editList: (listId: string, title: string) =>
      updateMutation.mutate({ listId, title }),
    removeList: (listId: string) => deleteMutation.mutate(listId),
    getListTitle,
    refetchLists: () =>
      queryClient.invalidateQueries({ queryKey: ["lists", boardId ?? ""] }),
  };
};
