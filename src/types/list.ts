import { Card } from "./card";

export interface List {
  id: number;
  title: string;
  boardId: number;
  cards?: Card[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateListRequest {
  title: string;
}

export interface UpdateListRequest {
  title: string;
}
