import { axiosInstance } from "./axiosInstance";

//create new board
export const createBoard = async (payload) => {
  try {
    const response = await axiosInstance.post("/create-board", payload);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//get all boards
export const fetchBoards = async (userId) => {
  try {
    const response = await axiosInstance.get(`/get-boards?userId=${userId}`, {
      validateStatus: () => true,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//update board
export const updateBoard = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `/update-board/${payload.id}`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//delete board
export const deleteBoard = async (id) => {
  try {
    const response = await axiosInstance.delete(`/delete-board/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//fetch old board title
// export const fetchOldBoardTitle = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/get-old-board-title/${id}`);
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

//get single board by id
export const getSingleBoard = async (id) => {
  try {
    const response = await axiosInstance.get(`/get-board/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
