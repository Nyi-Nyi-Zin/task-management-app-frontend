import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useUpdateBoard } from "@/hooks/useBoard";

interface BoardTitleProps {
  boardId: number;
  title: string;
}

export function BoardTitle({ boardId, title }: BoardTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);
  const updateBoard = useUpdateBoard();

  const handleSave = () => {
    setIsEditing(false);
    if (newTitle.trim() && newTitle !== title) {
      updateBoard.mutate({ id: boardId, data: { title: newTitle } });
    } else {
      setNewTitle(title);
    }
  };

  return (
    <Input
      ref={inputRef}
      value={newTitle}
      readOnly={!isEditing}
      onFocus={() => setIsEditing(true)}
      onChange={(e) => setNewTitle(e.target.value)}
      onBlur={handleSave}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleSave();
        if (e.key === "Escape") {
          setIsEditing(false);
          setNewTitle(title);
          inputRef.current?.blur();
        }
      }}
      className={`w-[97%] lg:text-3xl  text-4xl font-bold bg-transparent px-1 transition-all duration-150 ${
        isEditing
          ? "border border-input focus-visible:ring-1"
          : "border-none focus-visible:ring-0 cursor-pointer hover:border-input hover:ring-1 transition-all"
      }`}
    />
  );
}
