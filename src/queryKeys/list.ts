export const LIST_KEYS = {
  all: (boardId: number) => ["boards", boardId, "lists"] as const,
  detail: (boardId: number, listId: number) => ["boards", boardId, "lists", listId] as const,
};
