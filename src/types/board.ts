import { List } from "./list";

export interface Board {
  id: string;
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
