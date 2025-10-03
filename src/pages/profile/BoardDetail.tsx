// BoardDetail.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useList } from "../../hooks/useList";
import { useCard } from "../../hooks/useCard";
import Lists from "../../components/Profile/List";
import { useGetSingleBoard } from "../../hooks/useBoard";

export default function BoardDetail() {
  const params = useParams();
  const id = params.boardId;

  const { lists: allLists, loading } = useList(id);
  const safeLists = Array.isArray(allLists) ? allLists : [];

  const { editingCardTitle, setEditingCardTitle } = useCard();

  const [selectedCard, setSelectedCard] = useState<any>(null);
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

  const { data } = useGetSingleBoard(id);
  console.log(data);
  const boardDetails = data?.board ?? {}; // default to empty object

  useEffect(() => {
    if (selectedCard) {
      setEditCardDesc(selectedCard.description || "");
    }
  }, [selectedCard]);

  useEffect(() => {
    if (safeLists.length > 0) {
      safeLists.forEach((list) => {
        getAllCards(list.id);
      });
    }
  }, [safeLists, selectedCard]);

  const getAllCards = async (listId: string) => {
    // implement fetching cards
  };

  return (
    <section className="flex justify-center items-start bg-[#0079BF]">
      <div className="w-full mx-auto ">
        <Lists boardDetails={boardDetails} allLists={safeLists} />
      </div>
    </section>
  );
}
