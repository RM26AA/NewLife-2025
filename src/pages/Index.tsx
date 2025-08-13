import { useState } from "react";
import Hero from "@/components/Hero";
import ExplorerForm, { FormData } from "@/components/ExplorerForm";
import Results, { RecommendationResult } from "@/components/Results";
import { getLocationRecommendations } from "@/services/geminiApi";
import { useToast } from "@/hooks/use-toast";

type AppState = "hero" | "form" | "results";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("hero");
  const [results, setResults] = useState<RecommendationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetStarted = () => {
    setCurrentState("form");
  };

  const handleFormSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const recommendations = await getLocationRecommendations(formData);
      setResults(recommendations);
      setCurrentState("results");
      toast({
        title: "Recommendations ready!",
        description: "Your personalized location recommendations have been generated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get recommendations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentState("form");
  };

  const handleBackToHero = () => {
    setCurrentState("hero");
  };

  const handleStartOver = () => {
    setResults(null);
    setCurrentState("hero");
  };

  return (
    <div className="min-h-screen">
      {currentState === "hero" && (
        <Hero onGetStarted={handleGetStarted} />
      )}
      
      {currentState === "form" && (
        <ExplorerForm
          onSubmit={handleFormSubmit}
          onBack={handleBackToHero}
          isLoading={isLoading}
        />
      )}
      
      {currentState === "results" && results && (
        <Results
          results={results}
          onBack={handleBackToForm}
          onStartOver={handleStartOver}
        />
      )}
    </div>
  );
};

export default Index;
