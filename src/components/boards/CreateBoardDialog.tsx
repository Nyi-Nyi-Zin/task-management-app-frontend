import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const boardSchema = z.object({
  title: z.string().min(1, "Board name is required").max(50, "Board name is too long"),
});

type BoardForm = z.infer<typeof boardSchema>;

interface CreateBoardDialogProps {
  onCreate: (title: string) => void;
}

export function CreateBoardDialog({ onCreate }: CreateBoardDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<BoardForm>({
    resolver: zodResolver(boardSchema),
    defaultValues: { title: "" },
  });

  const onSubmit = (data: BoardForm) => {
    onCreate(data.title);
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
          <DialogDescription>
            Create a new board to organize your tasks and projects.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="board-title">Board Name</Label>
            <Input
              id="board-title"
              placeholder="My Project Board"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full">
            Create Board
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
