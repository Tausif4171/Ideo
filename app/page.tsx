import { IdeaSection } from "./components/Ideas/IdeaSection";
import { FeaturesSection } from "./components/Features/FeaturesSection";

export default function Home() {
  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        🚀 Idea & Feature Tracker
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <IdeaSection />
        <FeaturesSection />
      </div>
    </main>
  );
}
