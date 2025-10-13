// import {
//   DndContext,
//   DragEndEvent,
//   DragOverlay,
//   PointerSensor,
//   useSensor,
//   useSensors,
//   closestCorners,
// } from "@dnd-kit/core";
// import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
// import { Board } from "@/types/board";
// import { useBoard } from "@/hooks/useBoard";
// import { Card as CardType } from "@/types/card";
// import { BoardHeader } from "@/components/board/BoardHeader";
// import { ListColumn } from "@/components/board/ListColumn";
// import { AddListButton } from "@/components/board/AddListButton";
// import { useCreateList, useUpdateList } from "@/hooks/useList";
// import { useCreateCard, useUpdateCard, useDeleteCard } from "@/hooks/useCard";
// import { useQueryClient } from "@tanstack/react-query";
// import { BOARD_KEYS } from "@/queryKeys/board";
// import { CardItem } from "@/components/board/CardItem";
// import { useState } from "react";

// export function BoardPage({
//   board,
//   onBack,
//   onLogout,
// }: {
//   board: Board;
//   onBack: () => void;
//   onLogout: () => void;
// }) {
//   const { data: freshBoard } = useBoard(board.id);
//   const displayBoard: Board = freshBoard ?? board;

//   const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
//   const createList = useCreateList(board.id);
//   const updateList = useUpdateList(board.id);
//   const createCard = useCreateCard(board.id);
//   const updateCard = useUpdateCard(board.id);
//   const deleteCard = useDeleteCard();
//   const queryClient = useQueryClient();

//   const [activeCard, setActiveCard] = useState<CardType | null>(null);

//   const handleDragStart = ({ active }: { active: any }) => {
//     const card = displayBoard.lists
//       .flatMap((l) => l.cards || [])
//       .find((c) => c.id === Number(active.id));
//     if (card) setActiveCard(card);
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over || active.id === over.id) {
//       setActiveCard(null);
//       return;
//     }

//     const cardId = Number(active.id);
//     const activeCard = displayBoard.lists
//       .flatMap((l) => l.cards || [])
//       .find((c) => c.id === cardId);
//     if (!activeCard) return;

//     const sourceListId = activeCard.listId;
//     let targetListId = sourceListId;

//     if (over.data.current?.type === "card") targetListId = Number(over.data.current.listId);
//     else if (over.data.current?.type === "list") targetListId = Number(over.id);
//     else return;

//     const targetList = displayBoard.lists.find((l) => l.id === targetListId);
//     if (!targetList) return;

//     const sortedCards = [...(targetList.cards || [])].sort((a, b) => a.position - b.position);
//     let targetPosition = sortedCards.length;
//     if (over.data.current?.type === "card") {
//       const overIndex = sortedCards.findIndex((c) => c.id === Number(over.id));
//       const sourceIndex = sortedCards.findIndex((c) => c.id === activeCard.id);
//       targetPosition =
//         sourceListId === targetListId
//           ? sourceIndex < overIndex
//             ? overIndex + 1
//             : overIndex
//           : overIndex === -1
//           ? sortedCards.length
//           : overIndex;
//     }

//     queryClient.setQueryData(BOARD_KEYS.detail(board.id), (old: any) => {
//       const copy = JSON.parse(JSON.stringify(old));

//       // Remove from source
//       for (const l of copy.lists) {
//         if (!l.cards) continue;
//         const idx = l.cards.findIndex((c: any) => c.id === activeCard.id);
//         if (idx !== -1) l.cards.splice(idx, 1);
//       }

//       // Insert into target
//       targetList.cards = targetList.cards || [];
//       targetList.cards.splice(targetPosition, 0, { ...activeCard, listId: targetListId });

//       // Reindex
//       targetList.cards.forEach((c: any, i: number) => (c.position = i));

//       return copy;
//     });

//     updateCard.mutate({
//       cardId: activeCard.id,
//       data: { listId: targetListId, position: targetPosition },
//     });

//     setActiveCard(null);
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <BoardHeader
//         boardTitle={displayBoard.title}
//         userName=""
//         onBack={onBack}
//         onLogout={onLogout}
//       />

//       <DndContext
//         sensors={sensors}
//         collisionDetection={closestCorners}
//         onDragStart={handleDragStart}
//         onDragEnd={handleDragEnd}
//       >
//         <SortableContext
//           items={displayBoard.lists.map((l) => l.id.toString())}
//           strategy={horizontalListSortingStrategy}
//         >
//           <div className="flex items-start gap-4">
//             {displayBoard.lists.map((list) => (
//               <ListColumn
//                 key={list.id}
//                 list={list}
//                 cards={list.cards || []}
//                 onAddCard={(title) => createCard.mutate({ title, listId: list.id })}
//                 onDeleteCard={(cardId) => deleteCard.mutate({ cardId })}
//               />
//             ))}
//             <AddListButton onAdd={(title) => createList.mutate({ title })} />
//           </div>
//         </SortableContext>

//         {/* Drag overlay */}
//         <DragOverlay>
//           {activeCard ? (
//             <CardItem card={activeCard} onClick={() => {}} onToggleDone={() => {}} />
//           ) : null}
//         </DragOverlay>
//       </DndContext>
//     </div>
//   );
// }
