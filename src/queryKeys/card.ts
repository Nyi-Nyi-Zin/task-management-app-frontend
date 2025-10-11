// queryKeys/card.ts
export const CARD_KEYS = {
  all: (listId: number) => ["cards", listId] as const,
  detail: (cardId: number) => ["card", cardId] as const,
};
