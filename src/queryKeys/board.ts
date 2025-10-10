export const BOARD_KEYS = {
  all: ["boards"] as const,
  detail: (id: number) => ["boards", id] as const,
};
