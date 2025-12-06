import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLists,
  createList,
  updateList,
  deleteList,
  reorderLists,
} from "../features/list/listSlice";

import {
  createCard,
  deleteCard,
  getCard,
  updateCard,
  moveCard,
} from "../features/card/cardSlice";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";

const Board = () => {
  const dispatch = useDispatch();
  const { id: boardId } = useParams();

  const { lists, loading } = useSelector((state) => state.list);
  const { cards } = useSelector((state) => state.card);

  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const [cardTitleInputs, setCardTitleInputs] = useState({});
  const [editingCard, setEditingCard] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load lists + cards
  useEffect(() => {
    if (boardId) {
      dispatch(getLists(boardId));
      dispatch(getCard(boardId));
    }
  }, [dispatch, boardId]);

  // ============================================================
  // ⭐⭐⭐ FIXED DnD LOGIC – WORKS LIKE TRELLO
  // ============================================================
  const onDragEnd = (result) => {
    const { source, destination, draggableId, type } = result;
    if (!destination) return;

    // ------------ MOVE LISTS ---------------
    if (type === "LIST") {
      const reordered = Array.from(lists);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);

      const listIds = reordered.map((l) => l._id);
      dispatch(reorderLists({ boardId, listIds }));
      return;
    }

    // ------------ MOVE CARDS ---------------
    const sourceListId = source.droppableId;
    const destinationListId = destination.droppableId;

    // ⭐ CASE 1: reorder inside SAME list
    if (sourceListId === destinationListId) {
      const sameListCards = cards.filter((c) => c.listId === sourceListId);
      const newCards = Array.from(sameListCards);

      const [movedCard] = newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, movedCard);

      const newOrder = newCards.map((c) => c._id);

      dispatch(
        moveCard({
          sourceListId,
          destinationListId,
          cardId: draggableId,
          newCardIdsInDestList: newOrder,
        })
      );

      return;
    }

    // ⭐ CASE 2: move card to DIFFERENT list
    const sourceCards = cards.filter((c) => c.listId === sourceListId);
    const destCards = cards.filter((c) => c.listId === destinationListId);

    const [movedOriginal] = sourceCards.splice(source.index, 1);
    const movedClone = { ...movedOriginal, listId: destinationListId };

    destCards.splice(destination.index, 0, movedClone);

    const newOrder = destCards.map((c) => c._id);

    dispatch(
      moveCard({
        sourceListId,
        destinationListId,
        cardId: draggableId,
        newCardIdsInDestList: newOrder,
      })
    );
  };

  // ============================================================
  // List CRUD
  // ============================================================
  const handleSubmitNewList = () => {
    if (!newListTitle.trim()) return;
    dispatch(createList({ boardId, title: newListTitle }));
    setNewListTitle("");
    setShowAddList(false);
  };

  const handleEdit = (list) => {
    setEditId(list._id);
    setEditTitle(list.title);
  };

  const handleUpdateList = () => {
    if (!editTitle.trim()) return;
    dispatch(updateList({ listId: editId, title: editTitle }));
    setEditId(null);
    setEditTitle("");
  };

  const handleDeleteList = (listId) => {
    if (window.confirm("Delete list permanently?")) {
      dispatch(deleteList(listId));
    }
  };

  // ============================================================
  // Card CRUD
  // ============================================================
  const handleAdd = (listId) => {
    const title = cardTitleInputs[listId];
    if (!title || !title.trim()) return;

    dispatch(createCard({ listId, title }));

    setCardTitleInputs((prev) => {
      const updated = { ...prev };
      delete updated[listId];
      return updated;
    });
  };

  const handleDeleteCard = (cardId) => {
    dispatch(deleteCard(cardId));
  };

  const handleCardTitleChange = (listId, title) => {
    setCardTitleInputs((prev) => ({ ...prev, [listId]: title }));
  };

  if (loading)
    return (
      <div className="text-white text-xl flex justify-center mt-40">
        Loading Board...
      </div>
    );

  // ============================================================
  // UI Rendering
  // ============================================================
  return (
    <div className="min-h-screen bg-sky-800 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">Kanban Board</h1>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="LISTS" type="LIST" direction="horizontal">
          {(provided) => (
            <div
              className="flex gap-4 overflow-x-auto items-start"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {/* ALL LISTS */}
              {lists.map((list, index) => (
                <Draggable key={list._id} draggableId={list._id} index={index}>
                  {(provided) => (
                    <div
                      className="bg-slate-100 min-w-[300px] w-[300px] rounded-xl shadow p-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      {/* LIST DRAG HANDLE */}
                      <div
                        {...provided.dragHandleProps}
                        className="cursor-grab active:cursor-grabbing flex justify-between mb-3"
                      >
                        <span className="font-semibold">{list.title}</span>
                        <span className="text-xl">⋮⋮</span>
                      </div>

                      {/* LIST EDIT */}
                      {editId === list._id ? (
                        <>
                          <input
                            className="w-full border px-2 py-1 rounded"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded"
                              onClick={handleUpdateList}
                            >
                              Save
                            </button>
                            <button
                              className="bg-gray-500 text-white px-3 py-1 rounded"
                              onClick={() => setEditId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex gap-2 mb-3">
                          <button
                            onClick={() => handleEdit(list)}
                            className="bg-yellow-500 text-white px-2 py-1 text-xs rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteList(list._id)}
                            className="bg-red-600 text-white px-2 py-1 text-xs rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}

                      {/* ======================= CARDS ======================= */}
                      <Droppable droppableId={list._id} type="CARD">
                        {(provided) => (
                          <div
                            className="max-h-[60vh] overflow-y-auto space-y-2 mb-3"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {cards
                              .filter((c) => c.listId === list._id)
                              .map((card, index) => (
                                <Draggable
                                  key={card._id}
                                  draggableId={card._id}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      className="bg-white p-3 border rounded shadow-sm flex justify-between items-center 
                                                 cursor-grab active:cursor-grabbing select-none"
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                    >
                                      {/* CARD EDIT */}
                                      {editingCard === card._id ? (
                                        <div className="w-full">
                                          <input
                                            className="w-full border px-2 py-1 rounded"
                                            value={editingTitle}
                                            onChange={(e) =>
                                              setEditingTitle(e.target.value)
                                            }
                                          />
                                          <div className="flex gap-2 mt-2">
                                            <button
                                              className="bg-blue-600 text-white px-3 py-1 rounded"
                                              onClick={() => {
                                                dispatch(
                                                  updateCard({
                                                    cardId: card._id,
                                                    title: editingTitle,
                                                  })
                                                );
                                                setEditingCard(null);
                                                setEditingTitle("");
                                              }}
                                            >
                                              Save
                                            </button>
                                            <button
                                              className="bg-gray-500 text-white px-3 py-1 rounded"
                                              onClick={() =>
                                                setEditingCard(null)
                                              }
                                            >
                                              Cancel
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <>
                                          <span>{card.title}</span>

                                          <div className="flex gap-2">
                                            <button
                                              className="text-blue-600 text-sm"
                                              onClick={() => {
                                                setEditingCard(card._id);
                                                setEditingTitle(card.title);
                                              }}
                                            >
                                              Edit
                                            </button>

                                            <button
                                              className="text-red-600 text-sm"
                                              onClick={() =>
                                                handleDeleteCard(card._id)
                                              }
                                            >
                                              ✕
                                            </button>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))} 

                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* ADD CARD */}
                      <div className="border-t pt-3 mt-3">
                        <input
                          className="w-full border px-3 py-2 rounded"
                          placeholder="Add card..."
                          value={cardTitleInputs[list._id] || ""}
                          onChange={(e) =>
                            handleCardTitleChange(list._id, e.target.value)
                          }
                        />
                        <button
                          className="bg-green-600 text-white w-full py-2 mt-2 rounded"
                          onClick={() => handleAdd(list._id)}
                        >
                          Add Card
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}

              {provided.placeholder}

              {/* ADD NEW LIST */}
              <div className="min-w-[300px] bg-slate-200 rounded-xl p-4">
                {showAddList ? (
                  <>
                    <input
                      className="w-full border px-3 py-2 rounded"
                      placeholder="Enter list title"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                    />
                    <button
                      className="w-full bg-green-600 text-white py-2 mt-2 rounded"
                      onClick={handleSubmitNewList}
                    >
                      Add List
                    </button>
                    <button
                      className="w-full bg-gray-500 text-white py-2 mt-2 rounded"
                      onClick={() => setShowAddList(false)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="w-full bg-slate-300 py-2 rounded text-lg"
                    onClick={() => setShowAddList(true)}
                  >
                    + Add New List
                  </button>
                )}
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Board;