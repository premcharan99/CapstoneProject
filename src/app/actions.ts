"use server";

import { z } from "zod";
import { suggestBusinessModel, SuggestBusinessModelOutput } from "@/ai/flows/suggest-business-model";
import { businessCriteriaSchema } from "@/lib/schemas";

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
