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

export const FeaturesSection = () => {
  const [features, setFeatures] = useState<Item[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  console.log(features);

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
    setEditText(features[index].text);
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

  const toggleDone = (index: number) => {
    setFeatures((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, done: !item.done } : item
      )
    );
  };

  useEffect(() => {
    const fetchFeatures = async () => {
      const res = await fetch("/api/features");
      const data = await res.json();
      setFeatures(data);
    };
    fetchFeatures();
  }, []);

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
          onClick={addFeature}
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
                      onClick={() => updateFeature(features[index]._id)}
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
                      onClick={() =>
                        toggleFavorite(features[index]._id, item.favorite)
                      }
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
                      onClick={() => deleteFeature(features[index]._id)}
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
