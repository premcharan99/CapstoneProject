"use server";

import { z } from "zod";
import { suggestBusinessModel, SuggestBusinessModelOutput } from "@/ai/flows/suggest-business-model";
import { analyzeMentalHealth, AnalyzeMentalHealthOutput } from "@/ai/flows/analyze-mental-health";
import { analyzeSmile, AnalyzeSmileOutput } from "@/ai/flows/analyze-smile";
import { businessCriteriaSchema, refinedSymptomQuestionnaireSchema, symptomQuestionnaireSchema } from "@/lib/schemas";

type ActionResponse<T> = {
  data?: T;
  error?: string;
};

export async function generateBusinessModel(
  input: z.infer<typeof businessCriteriaSchema>
): Promise<ActionResponse<SuggestBusinessModelOutput>> {
  try {
    const validatedInput = businessCriteriaSchema.parse(input);
    const result = await suggestBusinessModel(validatedInput);
    return { data: result };
  } catch (error) {
    console.error("Error in generateBusinessModel:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data. " + error.message };
    }
    return { error: "An unexpected error occurred while generating the business model." };
  }
}

export async function performTriage(
  input: z.infer<typeof symptomQuestionnaireSchema>
): Promise<ActionResponse<AnalyzeMentalHealthOutput>> {
  try {
    // Note: We use the refined schema here for validation before passing to the flow.
    const validatedInput = refinedSymptomQuestionnaireSchema.parse(input);
    const result = await analyzeMentalHealth(validatedInput);
    return { data: result };
  } catch (error) {
    console.error("Error in performTriage:", error);
    if (error instanceof z.ZodError) {
      return { error: "Invalid input data. " + error.message };
    }
    return { error: "An unexpected error occurred while performing triage." };
  }
}

export async function checkSmile(
  photoDataUri: string
): Promise<ActionResponse<AnalyzeSmileOutput>> {
    if (!photoDataUri) {
        return { error: "No photo data provided." };
    }
  try {
    const result = await analyzeSmile({ photoDataUri });
    return { data: result };
  } catch (error) {
    console.error("Error in checkSmile:", error);
    return { error: "An unexpected error occurred while analyzing your smile." };
  }
}
