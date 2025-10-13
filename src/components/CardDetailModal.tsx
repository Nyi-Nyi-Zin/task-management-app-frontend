import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/types/card";

interface CardDetailModalProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (cardId: number, updates: Partial<Card>) => void;
}

export const CardDetailModal = ({ card, isOpen, onClose, onUpdate }: CardDetailModalProps) => {
  const [title, setTitle] = useState(card?.title || "");
  const [description, setDescription] = useState(card?.description || "");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(!card?.description);

  const descRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Reset state when card changes
  useEffect(() => {
    setTitle(card?.title || "");
    setDescription(card?.description || "");
    setIsEditingTitle(false);
    setIsEditingDescription(false); // Do not auto-focus description
  }, [card]);

  // Click outside logic to stop editing
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    if (
      titleRef.current &&
      !titleRef.current.contains(target) &&
      descRef.current &&
      !descRef.current.contains(target) &&
      buttonsRef.current &&
      !buttonsRef.current.contains(target)
    ) {
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  if (!card) return null;

  const handleSave = () => {
    onUpdate(card.id, { title, description });
    setIsEditingTitle(false);
    setIsEditingDescription(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Card Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2" ref={titleRef}>
            <Label htmlFor="title">Title</Label>
            {isEditingTitle ? (
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="w-full rounded-md bg-background px-3 py-2 text-sm cursor-text hover:bg-accent/10 transition-colors"
              >
                {title || "Click to add a title..."}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2" ref={descRef}>
            <Label htmlFor="description">Description</Label>
            {isEditingDescription ? (
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a more detailed description..."
                className="min-h-[150px] border border-input rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            ) : (
              <div
                onClick={() => setIsEditingDescription(true)}
                className="min-h-[150px] w-full rounded-md bg-background px-3 py-2 text-sm cursor-text hover:bg-accent/10 transition-colors"
              >
                {description || "Click to add a description..."}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2" ref={buttonsRef}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
