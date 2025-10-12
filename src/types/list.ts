import { Card } from "./card";

export interface List {
  id: number;
  title: string;
  boardId: number;
  cards?: Card[];
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListRequest {
  title: string;
}

export interface UpdateListRequest {
  title?: string;
  position: number;
}
