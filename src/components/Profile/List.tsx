import { Box, Button, Card, TextField } from "@mui/material";
// import bgImg from '../../assets/bg_image.webp'
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
    <Card className=" w-full min-h-screen bg-amber-900 ">
      {/* <div className="absolute inset-0 -z-50">
        <img
          src={bgImg}
          alt="Developer workspace"
          className="w-full  object-cover h-full "
        />
       
      </div> */}
      <section className=" w-full h-screen bg-[#0079BF]">
        <div className="text-white font-bold text-center mx-auto py-3 w-full  break-words bg-[#005C91] flex">
          {/* <button
          onClick={() => navigate(-1)}
          className=" bg-blue-500 text-white  hover:bg-blue-600   rounded-md cursor-pointer"
        >
          Go Back
        </button> */}
          <h1 className="text-[20px] text-center mx-5">{boardDetails.title}</h1>
        </div>

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
                  sx={{
                    backgroundColor: "rgba(255,255,255,0.5)",
                    color: "black",
                  }} // 0.5 = 50% transparent
                  className="h-10 w-50"
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
    </Card>
  );
}
export default List;
