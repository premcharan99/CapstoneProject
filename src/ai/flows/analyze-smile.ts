'use server';
/**
 * @fileOverview Analyzes an image of a person to determine their smiling percentage.
 *
 * - analyzeSmile - Analyzes an image and returns a smiling percentage.
 * - AnalyzeSmileInput - The input type for the analyzeSmile function.
 * - AnalyzeSmileOutput - The return type for the analyzeSmile function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeSmileInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person's face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeSmileInput = z.infer<typeof AnalyzeSmileInputSchema>;

const AnalyzeSmileOutputSchema = z.object({
  smilingPercentage: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A percentage from 0 to 100 indicating how much the person is smiling. 0 means not smiling at all, 100 means a very big, clear smile. If no face is detected, return 0.'
    ),
  reason: z.string().describe('A brief, fun, and encouraging comment about the smile (or lack thereof).'),
});
export type AnalyzeSmileOutput = z.infer<typeof AnalyzeSmileOutputSchema>;

export async function analyzeSmile(
  input: AnalyzeSmileInput
): Promise<AnalyzeSmileOutput> {
  return analyzeSmileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSmilePrompt',
  input: { schema: AnalyzeSmileInputSchema },
  output: { schema: AnalyzeSmileOutputSchema },
  prompt: `You are an expert in facial expression analysis. Your task is to analyze the provided image and determine the percentage of how much the person is smiling, from 0 to 100.

- A score of 0 means absolutely no smile, a neutral or sad expression.
- A score of 100 means a huge, beaming, toothy smile.
- If no human face is clearly visible, you MUST return a smilingPercentage of 0 and a reason like "I can't seem to find a face to analyze!".
- Provide a fun, encouraging, one-sentence comment about the determined smile percentage.

Analyze the image and return ONLY the JSON object in the specified format.

Photo: {{media url=photoDataUri}}`,
});

const analyzeSmileFlow = ai.defineFlow(
  {
    name: 'analyzeSmileFlow',
    inputSchema: AnalyzeSmileInputSchema,
    outputSchema: AnalyzeSmileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input, { model: 'googleai/gemini-1.5-flash-latest' });
    return output!;
  }
);
