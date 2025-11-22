"use client";

import { useState, useEffect } from "react";
import type { z } from "zod";
import { performTriage } from "@/app/actions";
import type { symptomQuestionnaireSchema } from "@/lib/schemas";
import type { AnalyzeMentalHealthOutput } from "@/ai/flows/analyze-mental-health";
import { useToast } from "@/hooks/use-toast";
import SymptomQuestionnaire from "@/components/check-yourself/symptom-questionnaire";
import TriageResult from "@/components/check-yourself/triage-result";

export default function CheckYourselfPage() {
  const [result, setResult] = useState<AnalyzeMentalHealthOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setIsClient(true);
  }, []);

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
        <TriageResult data={result} onReset={handleReset} />
      ) : (
       isClient ? <SymptomQuestionnaire onSubmit={handleFormSubmit} isLoading={isLoading} /> : null
      )}
    </div>
  );
}
