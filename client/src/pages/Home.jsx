import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getBoardData,
  deleteBoard,
  createBoard,
  updateBoard,
} from "../features/board/boardSlice";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { boards, isLoading } = useSelector((state) => state.board);

  const user = JSON.parse(localStorage.getItem("user"));

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    console.log("hlo");
    dispatch(getBoardData());
  }, [dispatch]);

  const handleSubmit = () => {
    if (!title.trim()) return;

    if (editId) {
      dispatch(updateBoard({ boardId: editId, title, description }));
      setEditId(null);
    } else {
      dispatch(createBoard({ title, description }));
    }

    setTitle("");
    setDescription("");
  };

  const handleEdit = (board) => {
    setEditId(board._id);
    setTitle(board.title);
    setDescription(board.description || "");
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this board?")) {
      dispatch(deleteBoard(id));
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* LEFT CONTENT AREA */}
        <div className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Your Boards
          </h1>

          {/* BOARD GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map(
              (board) =>
                board._id !== editId && (
                  <div
                    key={board._id}
                    className="bg-white shadow-md hover:shadow-xl transition rounded-lg 
                               p-5 border flex flex-col justify-between h-64"
                  >
                    {/* Board Title */}
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                      {board.title}
                    </h2>

                    {/* Description (scrollable) */}
                    <p className="text-gray-600 mt-3 mb-4 overflow-y-auto flex-1 pr-1">
                      {board.description || "No description"}
                    </p>

                    {/* Buttons */}
                    <div className="flex justify-between items-center pt-3 border-t">
                      <Link
                        to={`/board/${board._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                                   hover:bg-blue-700 transition text-sm md:text-base"
                      >
                        Open
                      </Link>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(board)}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg 
                                     hover:bg-yellow-600 transition text-sm md:text-base"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(board._id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg 
                                     hover:bg-red-700 transition text-sm md:text-base"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
            )}

            {boards.length === 0 && (
              <div className="text-gray-500 text-lg">No boards created yet.</div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR FORM */}
        <div
          className="
          w-full md:w-96 bg-white shadow-xl border-l 
          p-6 sticky top-0 md:h-screen overflow-y-auto 
          md:block
          "
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {editId ? "Update Board" : "Create Board"}
          </h2>

          {/* USER BOX */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded mb-5">
            <p className="text-sm text-blue-700">
              Logged in as:{" "}
              <span className="font-semibold">{user?.email}</span>
            </p>
          </div>

          {/* FORM */}
          <input
            className="border w-full p-2 rounded mb-3 focus:ring focus:ring-blue-200"
            placeholder="Board Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="border w-full p-2 rounded mb-3 focus:ring focus:ring-blue-200 h-24"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editId ? "Update Board" : "Create Board"}
          </button>

          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setTitle("");
                setDescription("");
              }}
              className="w-full py-2 mt-3 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
