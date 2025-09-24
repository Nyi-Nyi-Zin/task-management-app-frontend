import { useState } from "react";
import {
  createCard,
  fetchAllCards,
  fetchOldCardsTitle,
  updateCard,
  deleteCard,
} from "../apicalls/card";

export const useCard = () => {
  const [editingCardTitle, setEditingCardTitle] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingCardDesc, setEditingCardDesc] = useState("");

  const fetchCards = async (listId) => {
    try {
      setLoading(true);
      const response = await fetchAllCards(listId);
      if (response.isSuccess) {
        return response.cards;
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || "Failed to fetch cards.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const create = async (listId, title) => {
    if (!title) return;
    try {
      const response = await createCard({ listId, title });
      if (response.isSuccess) {
        await fetchCards(listId);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to create card.");
    }
  };

  const update = async (cardId, listId) => {
    try {
      const response = await updateCard({
        cardId,
        title: editingCardTitle,
      });
      if (response.isSuccess) {
        await fetchCards(listId);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to update card.");
    }
  };

  //update desc
  const updateDesc = async (cardId, listId, description) => {
    try {
      const response = await updateCard({
        cardId,
        description,
      });
      if (response.isSuccess) {
        await fetchCards(listId);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to update card.");
    }
  };

  const remove = async (cardId, listId) => {
    try {
      const response = await deleteCard(cardId);
      if (response.isSuccess) {
        return await fetchCards(listId);
      } else {
        setError(response.message);
        return [];
      }
    } catch (err) {
      setError(err.message || "Failed to delete card.");
      return [];
    }
  };

  const getOldTitle = async (cardId) => {
    try {
      const response = await fetchOldCardsTitle(cardId);
      console.log("old title & desc", response);
      if (response.isSuccess) {
        setEditingCardTitle(response.cardTitle);
        setEditingCardDesc(response.cardDesc);
        return response;
      } else {
        setError(response.message);
        return "";
      }
    } catch (err) {
      setError(err.message || "Failed to fetch old card title.");
      return "";
    }
  };

  return {
    editingCardTitle,
    setEditingCardTitle,
    fetchCards,
    create,
    update,
    remove,
    getOldTitle,
    error,
    loading,
    updateDesc,
    editingCardDesc,
  };
};
