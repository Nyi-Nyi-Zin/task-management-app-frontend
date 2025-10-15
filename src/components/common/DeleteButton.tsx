import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteButtonProps {
  onDelete?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export function DeleteButton({ onDelete }: DeleteButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onDelete?.(e);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className="hover:bg-red-400 hover:text-white rounded-full  flex items-center justify-center"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
