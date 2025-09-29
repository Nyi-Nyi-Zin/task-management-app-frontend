import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBoard, fetchBoards } from "../apicalls/board";
import { BoardType, CreateBoardRequest } from "../types/board";

export const useCreateBoard = () => {
  const queryClient = useQueryClient();
  return useMutation<BoardType, Error, CreateBoardRequest>({
    mutationFn: createBoard,
    onSuccess: (newBoard, variables) => {
      queryClient.invalidateQueries({ queryKey: ["boards", variables.userId] });

      console.log("Board created successfully and board list invalidated.");
    },
    onError: (error: any) => {
      console.error("Error creating board:", error.message);
    },
  });
};

export const useFetchBoards = () => {
  return useQuery<BoardType[]>({
    queryKey: ["boards"],
    queryFn: async () => {
      const response = await fetchBoards();
      if (response.isSuccess && response.data) return response.data;
      return [];
    },
    enabled: true,
  });
};
