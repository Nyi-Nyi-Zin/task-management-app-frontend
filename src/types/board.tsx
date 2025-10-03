export interface BoardType {
  id: string | number;
  title: string;
  userId?: string | number;
  createdAt?: string;
  updatedAt?: string;
  lists?: ListType[];
  user?: {
    id: string | number;
    email: string;
  };
}

export interface ListType {
  id: string | number;
  title: string;
  boardId: string | number;
  createdAt?: string;
  updatedAt?: string;
  cards?: CardType[];
}

export interface CardType {
  id: string | number;
  title: string;
  description?: string;
  listId: string | number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBoardRequest {
  title: string;
  userId?: string | number;
}

export interface UpdateBoardRequest {
  id: string;
  title: string;
}

export interface ApiResponse<Data = undefined> {
  isSuccess: boolean;
  message: string;
  data?: Data;
}
