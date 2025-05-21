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

const ITEMS_PER_PAGE = 5;

function IdeaSkeleton() {
  return (
    <li className="flex justify-between items-start bg-gray-100 p-3 rounded-lg animate-pulse h-[72px]">
      <div className="w-full space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2 ml-2">
        <div className="h-6 w-6 rounded bg-gray-200"></div>
        <div className="h-6 w-6 rounded bg-gray-200"></div>
        <div className="h-6 w-6 rounded bg-gray-200"></div>
        <div className="h-6 w-6 rounded bg-gray-200"></div>
      </div>
    </li>
  );
}

export const IdeaSection = () => {
  const [ideas, setIdeas] = useState<Item[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data);
      setLoading(false);
    };
    fetchIdeas();
  }, []);

  useEffect(() => {
    if (visibleCount > ideas.length) setVisibleCount(ideas.length);
    if (ideas.length <= ITEMS_PER_PAGE) setVisibleCount(ITEMS_PER_PAGE);
  }, [ideas]);

  const visibleIdeas = ideas.slice(0, visibleCount);

  const addIdea = async () => {
    if (!newIdea.trim()) return;
    const res = await fetch("/api/ideas", {
      method: "POST",
      body: JSON.stringify({
        text: newIdea,
        favorite: false,
        done: false,
      }),
      headers: { "Content-Type": "application/json" },
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
    setEditText(visibleIdeas[index].text);
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
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
    cancelEdit();
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorite: !current }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
  };

  const toggleDone = async (id: string, current: boolean) => {
    const res = await fetch(`/api/ideas/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !current }),
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setIdeas((prev) => prev.map((idea) => (idea._id === id ? updated : idea)));
  };

  const canShowMore = visibleCount < ideas.length;
  const canShowLess =
    ideas.length > ITEMS_PER_PAGE && visibleCount >= ideas.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, ideas.length));
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="bulb">
          💡
        </span>{" "}
        Ideas
      </h2>
      <div className="flex flex-col gap-2 mb-4">
        <TextareaAutosize
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Add a new idea..."
          className="px-3 py-2 border border-gray-300 rounded-lg resize-none min-w-0"
        />
        <button
          onClick={addIdea}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-max"
        >
          Add
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto pr-1">
        <ul className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <IdeaSkeleton key={i} />)
          ) : (
            <AnimatePresence>
              {visibleIdeas.map((item, index) => (
                <motion.li
                  key={item._id}
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
                        <motion.button
                          onClick={() =>
                            toggleFavorite(item._id, item.favorite)
                          }
                          className="text-xl cursor-pointer"
                          whileTap={{ scale: 1.2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <span
                            className={`transition ${
                              item.favorite
                                ? "text-yellow-500"
                                : "text-gray-400"
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
          )}
        </ul>
      </div>
      <div className="flex gap-2 mt-2">
        {canShowMore && (
          <button
            onClick={handleShowMore}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Show More
          </button>
        )}
        {canShowLess && (
          <button
            onClick={handleShowLess}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Show Less
          </button>
        )}
      </div>
    </div>
  );
};
