export interface BoardType {
  id: string | number;
  title: string;
  userId?: string | number;
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
