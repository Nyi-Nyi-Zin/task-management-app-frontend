import { useState } from "react";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddListButtonProps {
  onAdd: (title: string) => void;
}

export function AddListButton({ onAdd }: AddListButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(title);
      setTitle("");
      setIsAdding(false);
    }
  };

  if (isAdding) {
    return (
      <Card className="flex-shrink-0 w-80 p-4 bg-secondary/30">
        <Input
          autoFocus
          placeholder="Enter list title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
            if (e.key === "Escape") {
              setIsAdding(false);
              setTitle("");
            }
          }}
          className="mb-2"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleAdd}>
            Add List
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsAdding(false);
              setTitle("");
            }}
          >
            Cancel
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="flex-shrink-0 w-80 p-4 bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={() => setIsAdding(true)}
    >
      <Button variant="ghost" className="w-full justify-start gap-2">
        <Plus className="h-5 w-5" />
        Add a list
      </Button>
    </Card>
  );
}
