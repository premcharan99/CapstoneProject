"use client";

import { useState } from "react";
import type { z } from "zod";
import BusinessCriteriaForm from "@/components/business-model/business-criteria-form";
import BusinessModelDashboard from "@/components/business-model/business-model-dashboard";
import { generateBusinessModel } from "@/app/actions";
import type { businessCriteriaSchema } from "@/lib/schemas";
import type { SuggestBusinessModelOutput } from "@/ai/flows/suggest-business-model";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [result, setResult] = useState<SuggestBusinessModelOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (data: z.infer<typeof businessCriteriaSchema>) => {
    setIsLoading(true);
    setResult(null);
    try {
      const response = await generateBusinessModel(data);
      if (response.error) {
        throw new Error(response.error);
      }
      setResult(response.data);
    } catch (error) {
      console.error("Failed to generate business model:", error);
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
        <BusinessModelDashboard data={result} onReset={handleReset} />
      ) : (
        <BusinessCriteriaForm onSubmit={handleFormSubmit} isLoading={isLoading} />
      )}
    </div>
  );
}
