import { IdeaSection } from "./components/Ideas/IdeaSection";
import { FeaturesSection } from "./components/Features/FeaturesSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 space-y-9 px-6 py-9">
      <h1 className="text-3xl font-bold text-center font-mono">
        Idea & Feature Tracker 🚀
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <IdeaSection />
        <FeaturesSection />
      </div>
    </main>
  );
}
