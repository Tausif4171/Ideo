"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";

type Item = {
  text: string;
  favorite: boolean;
  done: boolean;
};

export const FeaturesSection = () => {
  const [features, setFeatures] = useState<Item[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // CREATE
  const addIdea = () => {
    if (!newFeature.trim()) return;
    setFeatures((prev) => [
      ...prev,
      { text: newFeature, favorite: false, done: false },
    ]);
    setNewFeature("");
  };

  // UPDATE
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(features[index].text);
  };

  // DELETE
  const deleteIdea = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const updateIdea = () => {
    if (editingIndex === null || !editText.trim()) return;
    setFeatures((prev) =>
      prev.map((item, i) =>
        i === editingIndex ? { ...item, text: editText } : item
      )
    );
    cancelEdit();
  };

  const toggleFavorite = (index: number) => {
    setFeatures((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, favorite: !item.favorite } : item
      )
    );
  };

  const toggleDone = (index: number) => {
    setFeatures((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">💡 Features</h2>
      {/* Input Field */}
      <div className="flex gap-2 mb-4">
        <TextareaAutosize
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a new feature..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none"
        />
        <button
          onClick={addIdea}
          className="bg-black cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-3">
        <AnimatePresence>
          {features.map((item, index) => (
            <motion.li
              key={index}
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
                      onClick={updateIdea}
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
                      onClick={() => toggleFavorite(index)}
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
                      onClick={() => toggleDone(index)}
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
                      onClick={() => deleteIdea(index)}
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
  );
};
