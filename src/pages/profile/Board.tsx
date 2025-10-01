import { useEffect, useState } from "react";
import { getSingleBoard } from "../../apicalls/board";
import { useParams } from "react-router-dom";
import { fetchAllCards, fetchOldCardsTitle, createCard, updateCard, deleteCard } from "../../apicalls/card";
import { useList } from "../../hooks/useList";
import { useCard } from "../../hooks/useCard";

import * as React from "react";
import Listss from "../../components/Profile/List";

export default function Board() {
  const params = useParams();
  const id = params.boardId;

  const {
    lists: allLists,
    addList,
    editList,
    removeList,
    getListTitle,
    loading,
  } = useList(id);

  const safeLists = Array.isArray(allLists) ? allLists : [];

  const { editingCardTitle, setEditingCardTitle, getOldTitle } = useCard();

  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [boardDetails, setBoardDetails] = useState<any>(undefined);
  const [newListTitle, setNewListTitle] = useState("");
  const [showAddList, setShowAddList] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingListId, setEditingListId] = useState(null);

  const [showAddCardForList, setShowAddCardForList] = useState({});
  const [cardEditMode, setCardEditMode] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [newCardTitles, setNewCardTitles] = useState({});
  const [cardsByList, setCardsByList] = useState({});

  const [descEditMode, setDescEditMode] = useState(true);
  const [editCardDesc, setEditCardDesc] = useState("");

  //get all cards
  const getAllCards = async (listId) => {
    const cardsRes = await fetchAllCards(listId);
    const cards = cardsRes?.cards ?? [];
    setCardsByList((prev) => ({
      ...prev,
      [listId]: cards,
    }));
  };

  //fetch single board details
  const fetchBoardDetails = async (id) => {
    try {
      const response = await getSingleBoard(id);
      if (response.isSuccess) {
        setBoardDetails(response.data);
      } else {
        console.error("Error fetching board details:", response.message);
      }
    } catch (error) {
      console.error("Error fetching board details:", error);
    }
  };

  //handle both list title fetch & update
  const handleListEdit = async (listId, newTitle = null) => {
    if (!newTitle) {
      const title = await getListTitle(listId);
      setNewListTitle(title);
      setEditingListId(listId);
      setEditMode(true);
      return;
    }

    await editList(listId, newTitle);
    setNewListTitle("");
    setEditMode(false);
    setEditingListId(null);
  };

  //delete list
  const handleDeleteList = async (listId) => {
    await removeList(listId);
  };

  //create card
  const handleCreateCard = async (listId) => {
    await createCard({ listId, title: newCardTitles[listId] || "" });
    setNewCardTitles((prev) => ({ ...prev, [listId]: "" }));
    await getAllCards(listId);
  };

  //handle update card
  const handleUpdateCard = async (cardId, listId, description) => {
    await updateCard({ cardId, description });
    setCardEditMode(false);
    setEditingCardId(null);
    await getAllCards(listId);
  };

  //handle update desc
  const handleUpdateDesc = async (cardId, listId, description) => {
    await updateCard({ cardId, description });
    setCardsByList((prev) => ({
      ...prev,
      [listId]: prev[listId].map((card) =>
        card.id === cardId ? { ...card, description } : card
      ),
    }));

    setSelectedCard((prev) => ({
      ...prev,
      description: description,
    }));
    setEditCardDesc(description);
    setDescEditMode(false);
    await getAllCards(listId);
  };

  //create list
  const handleCreateList = async () => {
    await addList(newListTitle);
    setNewListTitle("");
    setShowAddList(false);
  };

  //handle fetch old card title
  const handleOldCardsTitle = async (cardId) => {
    try {
      const response = await fetchOldCardsTitle(cardId);
      if (response.isSuccess) {
        setEditingCardTitle(response.cardTitle);
      } else {
        console.error("Error fetching old card title:", response.message);
      }
    } catch (error) {
      console.error("Error fetching old card title:", error);
    }
  };

  // //fetch old list title
  // const fetchOldListTitle = async (listId) => {
  //   try {
  //     const response = await editingListTitle(listId);
  //     if (response.isSuccess) {
  //       setNewListTitle(response.title);
  //       response.cardDesc;
  //     } else {
  //       console.error("Error fetching old list title:", response.message);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching old list title:", error);
  //   }
  // };

  //handle delete card
  const handleDeleteCard = async (cardId, listId) => {
    try {
      await deleteCard(cardId);
      await getAllCards(listId);
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

  useEffect(() => {
    if (selectedCard) {
      setEditCardDesc(selectedCard.description || "");
    }
  }, [selectedCard]);

  useEffect(() => {
    if (id) {
      fetchBoardDetails(id);
    }
  }, [id]);

  useEffect(() => {
    //if lists exist, fetch all cards according to each list
    if (safeLists.length > 0) {
      safeLists.forEach((list) => {
        getAllCards(list.id);
      });
    }
  }, [safeLists, selectedCard]);

  return (
    <section className=" flex justify-center items-start ">
      <div className="w-full  mx-auto">
        <Listss boardDetails={boardDetails} allLists={safeLists} />
      </div>
    </section>
  );
}
