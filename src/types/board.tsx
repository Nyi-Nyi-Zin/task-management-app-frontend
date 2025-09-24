export interface BoardType {
  id: string;
  title: string;
  userId: string;
}

export interface CreateBoardRequest {
  title: string;
  userId: string;
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
