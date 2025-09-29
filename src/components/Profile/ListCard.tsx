import CardBox from "./CardBox";
import CustomizedMenus from "../Menu";
import { styled } from "@mui/material/styles";
import {
  Typography,
  Box,
  Paper,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import { blue } from "@mui/material/colors";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

function ListCard({
  list,
  editMode,
  handleListEdit,
  handleDeleteList,
  cardsByList,
  showAddCardForList,
  cardEditMode,
  descEditMode,
  editCardDesc,
  setSelectedCard,
  selectedCard,
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
  setEditCardDesc,
  setDescEditMode,
  handleUpdateDesc,
  getOldTitle,
  editingListId,
  newListTitle,
  setNewListTitle,
  setEditMode,
}) {
  return (
    <div key={list.id} className="">
      <Item className="min-w-[300px] max-w-[300px] ">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            gap: 0,
         
          
          }}
        >
          <Typography
            variant="h6"
            sx={{
              wordWrap: "break-word",
              whiteSpace: "normal",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              maxWidth: "500px",
              flex: 1,
              alignSelf: "flex-start",
            }}
          >
            {editMode && editingListId === list.id ? (
              <Box sx={{ display: "flex" }}>
                <TextField
                  fullWidth
                  size="small"
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment
                        position="end"
                        sx={{ marginRight: "-14px", padding: 0 }}
                      >
                        <Button
                          className="text-nowrap ml-100"
                          variant="contained"
                          size="medium"
                          onClick={async () => {
                            await handleListEdit(list.id, newListTitle);
                            setNewListTitle("");
                            setEditMode(false);
                          }}
                        >
                          OK
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            ) : (
              <>
                <div className="flex justify-between items-center ">
                  <Typography variant="h6" className="pl-3 text-black">
                    {list.title}
                  </Typography>
                  <CustomizedMenus
                    handleListEdit={handleListEdit}
                    listId={list.id}
                    handleDeleteList={handleDeleteList}
                  />
                </div>
                <hr className="border-gray-400" />
                <CardBox
                  list={list}
                  cardsByList={cardsByList}
                  showAddCardForList={showAddCardForList}
                  cardEditMode={cardEditMode}
                  selectedCard={selectedCard}
                  descEditMode={descEditMode}
                  editCardDesc={editCardDesc}
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
                  setSelectedCard={setSelectedCard}
                  setEditCardDesc={setEditCardDesc}
                  setDescEditMode={setDescEditMode}
                  handleUpdateDesc={handleUpdateDesc}
                  getOldTitle={getOldTitle}
                />
              </>
            )}
          </Typography>
        </Box>
      </Item>
    </div>
  );
}
export default ListCard;
