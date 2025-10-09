import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card as CardType } from "@/lib/types";

const cardSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  description: z.string().max(500, "Description is too long"),
  isDone: z.boolean(),
});

type CardForm = z.infer<typeof cardSchema>;

interface CardDetailsDialogProps {
  card: CardType | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<CardType>) => void;
  onDelete: () => void;
}

export function CardDetailsDialog({ card, open, onClose, onUpdate, onDelete }: CardDetailsDialogProps) {
  const form = useForm<CardForm>({
    resolver: zodResolver(cardSchema),
    values: card ? {
      title: card.title,
      description: card.description,
      isDone: card.isDone,
    } : undefined,
  });

  const onSubmit = (data: CardForm) => {
    onUpdate(data);
    onClose();
  };

  if (!card) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-destructive">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              rows={5}
              placeholder="Add a more detailed description..."
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-destructive">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-3">
              <Check className="h-5 w-5 text-success" />
              <div>
                <Label htmlFor="card-done" className="font-semibold">Mark as Done</Label>
                <p className="text-sm text-muted-foreground">
                  Mark this card as completed
                </p>
              </div>
            </div>
            <Switch
              id="card-done"
              checked={form.watch("isDone")}
              onCheckedChange={(checked) => form.setValue("isDone", checked)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                onDelete();
                onClose();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
