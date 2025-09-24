import { Box, Button, TextField } from "@mui/material";

import { useNavigate } from "react-router-dom";

import ListCard from "./ListCard";

function List({
  boardDetails,
  allLists,
  showAddList,
  editMode,
  handleListEdit,
  handleDeleteList,
  cardsByList,
  showAddCardForList,
  cardEditMode,
  selectedCard,
  descEditMode,
  editCardDesc,
  setShowAddList,
  newListTitle,
  handleCreateList,
  loading,
  setNewListTitle,
  editingListId,
  setEditMode,
  setShowAddCardForList,
  newCardTitles,
  setNewCardTitles,
  handleCreateCard,
  handleDeleteCard,
  setCardEditMode,
  editingCardId,
  setEditingCardId,
  editingCardTitle,
  setEditingCardTitle,
  handleUpdateCard,
  handleOldCardsTitle,
  setSelectedCard,
  setEditCardDesc,
  setDescEditMode,
  handleUpdateDesc,
  getOldTitle,
}) {
  const navigate = useNavigate();
  return (
    <section className="min-h-screen w-full  pt-40 mb-20 ">
      <div className="text-blue-600 text-4xl font-bold text-center mx-auto w-full max-w-[90%] break-words">
        Board's Name "{boardDetails.title}"
      </div>

      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-blue-500 text-white  hover:bg-blue-600 mx-5 rounded-md cursor-pointer"
      >
        Go Back
      </button>

      <Box
        sx={{
          display: "flex",
          padding: 2,
          gap: 3,
        }}
      >
        {allLists &&
          allLists.map((list) => (
            <ListCard
              list={list}
              key={list.id}
              editMode={editMode}
              handleListEdit={handleListEdit}
              handleDeleteList={handleDeleteList}
              cardsByList={cardsByList}
              showAddCardForList={showAddCardForList}
              cardEditMode={cardEditMode}
              descEditMode={descEditMode}
              editCardDesc={editCardDesc}
              setSelectedCard={setSelectedCard}
              selectedCard={selectedCard}
              setShowAddCardForList={setShowAddCardForList}
              newCardTitles={newCardTitles}
              setNewCardTitles={setNewCardTitles}
              handleCreateCard={handleCreateCard}
              handleDeleteCard={handleDeleteCard}
              setCardEditMode={setCardEditMode}
              editingCardId={editingCardId}
              setEditingCardId={setEditingCardId}
              editingCardTitle={editingCardTitle}
              setEditingCardTitle={setEditingCardTitle}
              handleUpdateCard={handleUpdateCard}
              handleOldCardsTitle={handleOldCardsTitle}
              setEditCardDesc={setEditCardDesc}
              setDescEditMode={setDescEditMode}
              handleUpdateDesc={handleUpdateDesc}
              getOldTitle={getOldTitle}
              editingListId={editingListId}
              newListTitle={newListTitle}
              setNewListTitle={setNewListTitle}
              setEditMode={setEditMode}
            />
          ))}
        <div className="flex gap-3 pr-15 ">
          {showAddList ? (
            <>
              <TextField
                className="w-75 h-14"
                label="New List Name"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
              />
              <Button
                onClick={handleCreateList}
                disabled={loading}
                variant="contained"
                className="h-14"
              >
                ADD
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outlined"
                className="h-14 w-75"
                style={{ marginLeft: "20px" }}
                onClick={() => setShowAddList(true)}
              >
                Add New List
              </Button>
            </>
          )}
        </div>
      </Box>
    </section>
  );
}
export default List;
