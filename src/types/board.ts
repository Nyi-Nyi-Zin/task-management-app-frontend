import { List } from "./list";

export interface Board {
  id: number;
  title: string;
  lists?: List[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBoardRequest {
  title: string;
}

export interface UpdateBoardRequest {
  title: string;
}

export interface ApiResponse<Data = undefined> {
  isSuccess: boolean;
  message: string;
  data?: Data;
}
