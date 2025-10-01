import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useMemo } from "react";
import { useCard } from "../../hooks/useCard";
import { useNavigate } from "react-router-dom";

function CardBox({
  list,
  cardsByList,
  showAddCardForList,
  cardEditMode,
  selectedCard,
  descEditMode,
  editCardDesc,
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
  const {
    cardsList,
    create,
    remove,
    update,
    updateDescription,
    setEditingCardTitle: setHookEditingTitle,
    editingCardTitle: hookEditingTitle,
    getOldTitle: hookGetOldTitle,
  } = useCard(String(list.id));

  const effectiveCards = useMemo(
    () => cardsByList?.[list.id] ?? cardsList,
    [cardsByList, list.id, cardsList]
  );
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  const handleOpenDialog = (card) => {
    setSelectedCard(card);
    setEditCardDesc(card.description);
    setDescEditMode(false);
    setOpen(true);
  };

  return (
    <section className="max-h-screen ">
      <Box
        sx={{
          maxHeight: 260,
          overflowY: "auto",
          marginTop: 1,
          marginBottom: 1,
        }}
      >
        {effectiveCards?.length > 0 ? (
          effectiveCards.map((card) => (
            <Card
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                handleOpenDialog(card);
              }}
              className="mb-2 cursor-pointer hover:border-blue-900 inset-shadow-xs border border-gray-200"
            >
              <CardContent className="flex justify-between items-center">
                {cardEditMode && editingCardId === card.id ? (
                  <>
                    <Box className="flex w-full gap-2">
                      <TextField
                        onClick={(e) => e.stopPropagation()}
                        fullWidth
                        size="small"
                        className="flex-1"
                        placeholder="Enter title"
                        value={editingCardTitle}
                        onChange={(e) => setEditingCardTitle(e.target.value)}
                      />
                      <Button
                        variant="contained"
                        style={{ height: "40px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardEditMode(false);
                          if (handleUpdateCard) handleUpdateCard(card.id, list.id);
                        }}
                      >
                        OK
                      </Button>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box className="flex items-center hover:border-blue-800">
                      <Checkbox onClick={(e) => e.stopPropagation()} />
                      <Typography variant="body2" className="text-gray-700">
                        {card.title}
                      </Typography>
                    </Box>
                    <Box>
                      <DeleteOutlineIcon
                        className="hover:shadow-lg hover:shadow-black/80 transition duration-300 rounded-full "
                        onClick={(e) => {
                          e.stopPropagation();
                          if (handleDeleteCard) handleDeleteCard(card.id, list.id);
                        }}
                      />
                      <EditOutlinedIcon
                        className="hover:shadow-lg hover:shadow-black/80 transition duration-300 cursor-pointer ml-1 rounded-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCardEditMode(true);
                          setEditingCardId(card.id);
                          (hookGetOldTitle || handleOldCardsTitle)(card.id);
                        }}
                      />

                      {/* Dialog */}
                      <Dialog
                        sx={{
                          "& .MuiDialog-paper": {
                            width: "500px",
                            height: "400px",
                          },
                        }}
                        open={open}
                        onClose={handleClose}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <DialogTitle>{selectedCard?.title}</DialogTitle>
                        <DialogContent>
                          {descEditMode ? (
                            <>
                              <TextField
                                value={editCardDesc}
                                className="w-full"
                                onChange={(e) =>
                                  setEditCardDesc(e.target.value)
                                }
                              ></TextField>
                            </>
                          ) : selectedCard?.description?.length > 0 ? (
                            <p
                              className="w-full"
                              style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {selectedCard?.description}
                            </p>
                          ) : (
                            <TextField
                              autoFocus
                              margin="dense"
                              id="description"
                              name="description"
                              label="Add description"
                              type="text"
                              fullWidth
                              variant="standard"
                              value={editCardDesc}
                              onChange={(e) => setEditCardDesc(e.target.value)}
                            />
                          )}
                        </DialogContent>
                        <DialogActions
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {selectedCard?.description &&
                          selectedCard.description.length > 0 ? (
                            <>
                              <Button
                                onClick={async () => {
                                  await getOldTitle(selectedCard?.id);
                                  setDescEditMode(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={async () => {
                                  if (handleUpdateDesc) {
                                    await handleUpdateDesc(
                                      selectedCard.id,
                                      list.id,
                                      editCardDesc
                                    );
                                  } else {
                                    updateDescription(selectedCard.id, editCardDesc);
                                  }
                                  setDescEditMode(false);
                                }}
                              >
                                Update
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                onClick={() => {
                                  if (handleUpdateDesc) {
                                    handleUpdateDesc(
                                      selectedCard.id,
                                      selectedCard.listId,
                                      editCardDesc
                                    );
                                  } else {
                                    updateDescription(selectedCard.id, editCardDesc);
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </>
                          )}
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body2" className="text-gray-500 p-2">
            No cards in this list
          </Typography>
        )}
      </Box>

      {/* Add Card Input */}
      <Box>
        {showAddCardForList?.[list.id] ? (
          <>
            <TextField
              sx={{ width: "100%" }}
              placeholder="Card Name"
              value={newCardTitles?.[list.id] || ""}
              onChange={(e) =>
                setNewCardTitles((prev) => ({
                  ...prev,
                  [list.id]: e.target.value,
                }))
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{
                      marginRight: "-14px",
                      padding: 0,
                    }}
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        handleCreateCard(list.id);
                        setShowAddCardForList((prev) => ({
                          ...prev,
                          [list.id]: false,
                        }));
                      }}
                      sx={{
                        height: "52px",
                        minWidth: "40px",
                      }}
                    >
                      OK
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </>
        ) : (
          <Button
            variant="contained"
            className="mt-2"
            onClick={() =>
              setShowAddCardForList((prev) => ({
                ...prev,
                [list.id]: true,
              }))
            }
          >
            Add Card
          </Button>
        )}
      </Box>
    </section>
  );
}

export default CardBox;
