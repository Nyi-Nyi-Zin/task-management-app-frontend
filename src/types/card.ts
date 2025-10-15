export interface Card {
  id: number;
  title: string;
  description?: string;
  listId: number;

  isDone: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCardRequest {
  title: string;
  description?: string;
  listId: number;
}

// ✅ Input type for updating a card
export interface UpdateCardRequest {
  title: string;
  description?: string;
}
