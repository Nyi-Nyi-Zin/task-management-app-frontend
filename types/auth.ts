export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Card {
  id: string;
  title: string;
  description: string;
  isDone: boolean;
  listId: string;
  order: number;
}

export interface List {
  id: string;
  title: string;
  boardId: string;
  order: number;
}

export interface Board {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
}
