export interface ApiResponse<Data = undefined> {
  isSuccess: boolean;
  message: string;
  data?: Data;
}
