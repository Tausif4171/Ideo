"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const IdeaSection = () => {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [newIdea, setNewIdea] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // CREATE
  const addIdea = () => {
    if (!newIdea.trim()) return;
    setIdeas((prev) => [...prev, newIdea]);
    setNewIdea("");
  };

  // READ: rendering below as a list

  // DELETE
  const deleteIdea = (index: number) => {
    setIdeas((prev) => prev.filter((_, i) => i !== index));
  };

  // UPDATE
  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(ideas[index]);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditText("");
  };

  const updateIdea = () => {
    if (editingIndex === null || !editText.trim()) return;
    const updatedIdeas = [...ideas];
    updatedIdeas[editingIndex] = editText;
    setIdeas(updatedIdeas);
    cancelEdit();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">💡 Ideas</h2>

      {/* Input Field */}
      <div className="flex gap-2 mb-4">
        <input
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
          placeholder="Add a new idea..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={addIdea}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-3">
        <AnimatePresence>
          {ideas.map((idea, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-between items-start bg-gray-100 p-3 rounded-lg"
            >
              {editingIndex === index ? (
                <div className="w-full flex flex-col gap-2">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full px-3 py-1 border border-gray-400 rounded"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={updateIdea}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="w-full">{idea}</p>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => startEdit(index)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteIdea(index)}
                      className="text-red-600 hover:text-red-800"
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
