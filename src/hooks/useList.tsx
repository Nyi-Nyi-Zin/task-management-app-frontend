import { useState, useEffect } from "react";
import {
  createNewList,
  getAllLists,
  updateList,
  deleteList,
  getOldListTitle,
} from "../apicalls/list";

export const useList = (boardId) => {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingListTitle, setEditingListTitle] = useState("");

  const fetchLists = async () => {
    try {
      setLoading(true);
      const response = await getAllLists(boardId);
      if (response.isSuccess) {
        setLists(response.lists);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch lists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  const addList = async (title) => {
    setLoading(true);
    try {
      const response = await createNewList({ boardId, title });
      if (response.isSuccess) {
        await fetchLists();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to create list.");
    } finally {
      setLoading(false);
    }
  };

  const editList = async (listId, newTitle) => {
    try {
      const response = await updateList({ listId, title: newTitle });
      if (response.isSuccess) {
        await fetchLists();
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to update list.");
    }
  };

  const removeList = async (listId) => {
    try {
      const response = await deleteList(listId);
      if (response.isSuccess) {
        setLists((prev) => prev.filter((list) => list.id !== listId));
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message || "Failed to delete list.");
    }
  };

  const getListTitle = async (listId) => {
    try {
      const response = await getOldListTitle(listId);
      if (response.isSuccess) {
        setEditingListTitle(response.title);
        return response.title;
      } else {
        setError(response.message);
        return "";
      }
    } catch (err) {
      setError(err.message || "Failed to fetch list title.");
      return "";
    }
  };

  return {
    lists,
    loading,
    error,
    addList,
    editList,
    removeList,
    getListTitle,
    editingListTitle,
    setEditingListTitle,
    refetchLists: fetchLists,
  };
};
