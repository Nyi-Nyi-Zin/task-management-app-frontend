import React from "react";
import { Box, IconButton } from "@mui/material";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { useParams } from "react-router-dom";
import ListCard from "./ListCard";
import AddList from "./AddList";
import { useList } from "../../hooks/useList";

type ListProps = {
  boardDetails?: { id: string; title: string };
};

function Lists({ boardDetails }: ListProps) {
  const { boardId } = useParams<{ boardId: string }>();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  if (!boardId) return null;

  const { lists, addList, removeList, editList } = useList(boardId);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <section className="w-full flex-1  flex flex-col pt-4 h-[550px]">
      <div className="text-white font-bold text-center py-3 break-words bg-[#005C91] flex items-center justify-between rounded-2xl w-[95%] mx-auto ">
        <h1 className="text-[20px] text-center mx-5">{boardDetails?.title}</h1>
        <IconButton aria-label="settings-app" onClick={handleOpen}>
          <SettingsApplicationsIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      </div>

      {/* Horizontal scroll container */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          overflowY: "hidden", // prevent vertical scroll
          flex: 1,
          alignItems: "flex-start", // keep cards aligned top
          padding: "0 35px",
        }}
      >
        {lists?.map((list) => (
          <Box key={list.id} sx={{ flex: "0 0 auto", mt: "10px" }}>
            <ListCard list={list} editList={editList} removeList={removeList} />
          </Box>
        ))}

        <Box sx={{ flex: "0 0 auto", mt: "10px" }}>
          <AddList addList={addList} />
        </Box>
      </Box>
    </section>
  );
}

export default Lists;
