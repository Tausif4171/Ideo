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

export const FeaturesSection = () => {
  const [features, setFeatures] = useState<Item[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await fetch("/api/features");
      const data = await res.json();
      setFeatures(data);
    };
    fetchFeatures();
  }, []);

  // Reset visibleCount if features shrink (e.g. after delete)
  useEffect(() => {
    if (visibleCount > features.length) {
      setVisibleCount(features.length);
    }
    if (features.length <= ITEMS_PER_PAGE) {
      setVisibleCount(ITEMS_PER_PAGE);
    }
  }, [features]);

  const visibleFeatures = features.slice(0, visibleCount);

  // CREATE
  const addFeature = async () => {
    if (!newFeature.trim()) return;
    const res = await fetch("/api/features", {
      method: "POST",
      body: JSON.stringify({
        text: newFeature,
        favorite: false,
        done: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFeatures((prev) => [...prev, data]);
    setNewFeature("");
  };

  // UPDATE
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(visibleFeatures[index].text);
  };

  // DELETE
  const deleteFeature = async (id: string) => {
    await fetch(`/api/features/${id}`, { method: "DELETE" });
    setFeatures((prev) => prev.filter((feature) => feature._id !== id));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const updateFeature = async (id: string) => {
    if (!editText.trim()) return;
    const res = await fetch(`/api/features/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ text: editText }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setFeatures((prev) =>
      prev.map((feature) => (feature._id === id ? updated : feature))
    );
    cancelEdit();
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    const res = await fetch(`/api/features/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ favorite: !current }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setFeatures((prev) =>
      prev.map((feature) => (feature._id === id ? updated : feature))
    );
  };

  const toggleDone = async (id: string, current: boolean) => {
    const res = await fetch(`/api/features/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ done: !current }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const updated = await res.json();
    setFeatures((prev) =>
      prev.map((feature) => (feature._id === id ? updated : feature))
    );
  };

  // Button logic
  const canShowMore = visibleCount < features.length;
  const canShowLess =
    features.length > ITEMS_PER_PAGE && visibleCount >= features.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, features.length));
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    setEditingIndex(null); // Optional: cancel edit if any
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4">💡 Features</h2>
      {/* Input Field */}
      <div className="flex flex-col gap-2 mb-4">
        <TextareaAutosize
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a new feature..."
          className=" px-3 py-2 border border-gray-300 rounded-lg resize-none min-w-0"
        />
        <button
          onClick={addFeature}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition w-max"
        >
          Add
        </button>
      </div>

      {/* List */}
      <div
        className="max-h-96 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin" }}
      >
        <ul className="space-y-3">
          <AnimatePresence>
            {visibleFeatures.map((item, index) => (
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
                        onClick={() => updateFeature(item._id)}
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
                        onClick={() => deleteFeature(item._id)}
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
