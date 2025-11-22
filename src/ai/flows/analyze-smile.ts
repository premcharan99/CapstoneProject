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
  model: 'googleai/gemini-pro-vision', // Specify the vision model
  prompt: `You are a fun, friendly, and encouraging AI that can detect smiles.
Your task is to analyze the provided image of a person's face and determine how much they are smiling.

- If no face is visible in the image, return a smilingPercentage of 0 and a reason like "I can't see your lovely face!".
- If a face is visible but not smiling, return a low percentage (0-10) and an encouraging reason like "A little smile can brighten the day!".
- If the person has a small or subtle smile, return a moderate percentage (20-60).
- If the person has a big, obvious, toothy grin, return a high percentage (70-100).

Be consistent in your scoring. Return your analysis in the specified JSON format.

Photo: {{media url=photoDataUri}}`,
});

const analyzeSmileFlow = ai.defineFlow(
  {
    name: 'analyzeSmileFlow',
    inputSchema: AnalyzeSmileInputSchema,
    outputSchema: AnalyzeSmileOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
