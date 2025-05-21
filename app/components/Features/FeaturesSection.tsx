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

function FeatureSkeleton() {
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

export const FeaturesSection = () => {
  const [features, setFeatures] = useState<Item[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatures = async () => {
      setLoading(true);
      const res = await fetch("/api/features");
      const data = await res.json();
      setFeatures(data);
      setLoading(false);
    };
    fetchFeatures();
  }, []);

  useEffect(() => {
    if (visibleCount > features.length) setVisibleCount(features.length);
    if (features.length <= ITEMS_PER_PAGE) setVisibleCount(ITEMS_PER_PAGE);
  }, [features]);

  const visibleFeatures = features.slice(0, visibleCount);

  const addFeature = async () => {
    if (!newFeature.trim()) return;
    const res = await fetch("/api/features", {
      method: "POST",
      body: JSON.stringify({
        text: newFeature,
        favorite: false,
        done: false,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setFeatures((prev) => [...prev, data]);
    setNewFeature("");
  };

  const deleteFeature = async (id: string) => {
    await fetch(`/api/features/${id}`, { method: "DELETE" });
    setFeatures((prev) => prev.filter((feature) => feature._id !== id));
  };

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(visibleFeatures[index].text);
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
    });
    const updated = await res.json();
    setFeatures((prev) =>
      prev.map((feature) => (feature._id === id ? updated : feature))
    );
  };

  const canShowMore = visibleCount < features.length;
  const canShowLess =
    features.length > ITEMS_PER_PAGE && visibleCount >= features.length;

  const handleShowMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, features.length));
  };

  const handleShowLess = () => {
    setVisibleCount(ITEMS_PER_PAGE);
    setEditingIndex(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span role="img" aria-label="sparkles">
          ✨
        </span>{" "}
        Features
      </h2>
      <div className="flex flex-col gap-2 mb-4">
        <TextareaAutosize
          value={newFeature}
          onChange={(e) => setNewFeature(e.target.value)}
          placeholder="Add a new feature..."
          className="px-3 py-2 border border-gray-300 rounded-lg resize-none min-w-0"
        />
        <button
          onClick={addFeature} // or addFeature in FeaturesSection
          className="flex w-max items-center gap-2 bg-cyan-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:bg-blue-700 active:scale-95 transition-all duration-150"
        >
          Add
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
      <div
        className="max-h-96 overflow-y-auto pr-1"
        style={{ scrollbarWidth: "thin" }}
      >
        <ul className="space-y-3">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <FeatureSkeleton key={i} />)
          ) : (
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
          )}
        </ul>
      </div>
      <div className="flex justify-center mt-4">
        {canShowMore && (
          <button
            onClick={handleShowMore}
            className="flex cursor-pointer items-center gap-2 bg-cyan-500 text-white font-medium px-6 py-2 rounded-full shadow hover:bg-blue-700 transition"
            aria-label="Show More"
          >
            <span>Show More</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        )}
        {canShowLess && (
          <button
            onClick={handleShowLess}
            className="flex items-center gap-2 bg-gray-200 text-gray-800 font-medium px-6 py-2 rounded-full shadow hover:bg-gray-300 transition"
            aria-label="Show Less"
          >
            <span>Show Less</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};
