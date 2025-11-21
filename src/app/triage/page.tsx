"use client";

import { useState } from "react";
import type { z } from "zod";
import SymptomQuestionnaire from "@/components/triage/symptom-questionnaire";
import TriageResults from "@/components/triage/triage-results";
import { performTriage } from "@/app/actions";
import type { symptomQuestionnaireSchema } from "@/lib/schemas";
import type { AnalyzeTriageOutput } from "@/ai/flows/analyze-triage-recommendations";
import { useToast } from "@/hooks/use-toast";

export default function TriagePage() {
  const [result, setResult] = useState<AnalyzeTriageOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: z.infer<typeof symptomQuestionnaireSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await performTriage(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data);
    } catch (error) {
      console.error("Failed to perform triage:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {result ? (
        <TriageResults data={result} onReset={handleReset} />
      ) : (
        <SymptomQuestionnaire onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
