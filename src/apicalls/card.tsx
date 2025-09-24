import { axiosInstance } from "./axiosInstance";

// Create a new card
//hook used
export const createCard = async (payload) => {
  try {
    const response = await axiosInstance.post(
      "/board/list/create-card",
      payload,
      {
        validateStatus: () => true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Fetch all cards
//hook used
export const fetchAllCards = async (listId) => {
  try {
    const response = await axiosInstance.get(`/board/${listId}/cards`, {
      validateStatus: () => true,
    });
    return response.data;
  } catch (error) {
    return {
      isSuccess: false,
      message: error.response?.data?.message || "Unknown error",
    };
  }
};

//fetch old cards title
export const fetchOldCardsTitle = async (cardId) => {
  try {
    const response = await axiosInstance.get(
      `/board/list/get-old-card-title/${cardId}`,
      {
        validateStatus: () => true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update card title
//hook used
export const updateCard = async (payload) => {
  try {
    const response = await axiosInstance.put(
      `/board/list/update-card/${payload.cardId}`,
      payload,
      {
        validateStatus: () => true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

//update card Desc
// export const createDesc = async (payload) => {
//   try {
//     const response = await axiosInstance.post(
//       `/board/list/create-card-desc/${payload.cardId}`,
//       payload,
//       {
//         validateStatus: () => true,
//       }
//     );
//     return response.data;
//   } catch (error) {
//     throw error.response.data;
//   }
// };

//delete card
//hook used
export const deleteCard = async (cardId) => {
  try {
    const response = await axiosInstance.delete(
      `/board/list/delete-card/${cardId}`,
      {
        validateStatus: () => true,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
