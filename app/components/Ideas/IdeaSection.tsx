"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";

type Item = {
  _id: string;
  text: string;
  favorite: boolean;
  done: boolean;
};

const ITEMS_PER_PAGE = 5; // You can adjust this value

export const IdeaSection = () => {
  const [ideas, setIdeas] = useState<Item[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [visibleIdeas, setVisibleIdeas] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchIdeas = async () => {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data);
    };
    fetchIdeas();
  }, []);

  useEffect(() => {
    // Update visible ideas whenever the ideas or currentPage changes
    const start = 0;
    const end = currentPage * ITEMS_PER_PAGE;
    setVisibleIdeas(ideas.slice(start, end));
  }, [ideas, currentPage]);

  const addIdea = async () => {
    if (!newIdea.trim()) return;

    const res = await fetch("/api/ideas", {
      method: "POST",
      body: JSON.stringify({
        text: newIdea,
        favorite: false,
        done: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    setIdeas((prev) => [...prev, data]);
    setNewIdea("");
  };

  const deleteIdea = async (id: string) => {
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    setIdeas((prev) => prev.filter((idea) => idea._id !== id));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(visibleIdeas[index].text); // Use visibleIdeas here
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const updateIdea = async (id: string) => {
    if (!editText.trim()) return;
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ text: editText }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
    cancelEdit();
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorite: !current }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
  };

  const toggleDone = async (id: string, current: boolean) => {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !current }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
  };

  const loadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const hasMoreIdeas = visibleIdeas.length < ideas.length;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">💡 Ideas</h2>

      <div className="flex gap-2 mb-4">
        <TextareaAutosize
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Add a new idea..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none"
        />
        <button
          onClick={addIdea}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        <AnimatePresence>
          {visibleIdeas.map((item, index) => (
            <motion.li
              key={item._id} // Use a unique key
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-between items-start bg-gray-100 p-3 rounded-lg"
            >
              {editingIndex === index ? (
                <div className="w-full flex flex-col gap-2">
                  <TextareaAutosize
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-400 rounded resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateIdea(item._id)}
                      className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 cursor-pointer text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p
                    className={`w-full ${
                      item.done ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </p>
                  <div className="flex gap-2 ml-2">
                    {/* Animated Favorite Button */}
                    <motion.button
                      onClick={() => toggleFavorite(item._id, item.favorite)}
                      className={`text-xl cursor-pointer`}
                      whileTap={{ scale: 1.2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span
                        className={`transition ${
                          item.favorite ? "text-yellow-500" : "text-gray-400"
                        }`}
                      >
                        {item.favorite ? "★" : "☆"}
                      </span>
                    </motion.button>

                    <button
                      onClick={() => toggleDone(item._id, item.done)}
                      className={`${
                        item.done ? "text-green-600" : "text-gray-400"
                      } hover:text-green-700 cursor-pointer`}
                    >
                      ✔
                    </button>
                    <button
                      onClick={() => startEdit(index)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteIdea(item._id)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {hasMoreIdeas && (
        <button
          onClick={loadMore}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Load More
        </button>
      )}
    </div>
  );
};
