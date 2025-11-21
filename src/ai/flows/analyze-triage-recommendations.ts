
'use server';

/**
 * @fileOverview Analyzes questionnaire data to determine triage levels and provide personalized recommendations.
 *
 * - analyzeTriage - A function that analyzes questionnaire data and returns personalized recommendations.
 * - AnalyzeTriageInput - The input type for the analyzeTriage function.
 * - AnalyzeTriageOutput - The return type for the analyzeTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTriageInputSchema = z.object({
  questionnaireType: z.enum(['PHQ-9', 'GAD-7']).describe('The type of questionnaire used (PHQ-9 or GAD-7).'),
  questionnaireData: z.record(z.string(), z.number()).describe('The data from the questionnaire, with question keys and numeric answers.'),
  userDetails: z.string().optional().describe('Optional details about the user for personalization.'),
});
export type AnalyzeTriageInput = z.infer<typeof AnalyzeTriageInputSchema>;

const AnalyzeTriageOutputSchema = z.object({
  triageLevel: z.string().describe('The determined triage level (e.g., Mild, Moderate, Severe).'),
  selfHelpRecommendations: z.array(z.string()).describe('Personalized self-help strategies.'),
  productServiceRecommendations: z.array(z.string()).describe('Relevant product/service suggestions.'),
  crisisResources: z.array(z.string()).describe('Essential crisis resources.'),
  explanation: z.string().describe('Explanation of why the model returned this triage level.'),
});
export type AnalyzeTriageOutput = z.infer<typeof AnalyzeTriageOutputSchema>;

export async function analyzeTriage(input: AnalyzeTriageInput): Promise<AnalyzeTriageOutput> {
  return analyzeTriageFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: {schema: AnalyzeTriageInputSchema},
  output: {schema: AnalyzeTriageOutputSchema},
  prompt: `You are an AI assistant designed to analyze mental health questionnaire data and provide personalized recommendations.

The user has completed the {{{questionnaireType}}} questionnaire. The results are as follows, with each question's answer scored from 0 (Not at all) to 3 (Nearly every day):
{{{JSON.stringify questionnaireData}}}

Analyze the scores to determine a total score.
- For PHQ-9, the total score ranges from 0 to 27.
- For GAD-7, the total score ranges from 0 to 21.

Based on the total score, determine the triage level:
- PHQ-9: 0-4 (None-minimal), 5-9 (Mild), 10-14 (Moderate), 15-19 (Moderately severe), 20-27 (Severe).
- GAD-7: 0-4 (Minimal), 5-9 (Mild), 10-14 (Moderate), 15-21 (Severe).

Group "None-minimal" and "Minimal" into a "Mild" triage level. Group "Moderately severe" into "Severe".

Provide an explanation for the triage level based on the score.
Then, provide personalized self-help strategies, relevant product/service suggestions, and essential crisis resources. If the user provided personal details ({{{userDetails}}}), use them to tailor the recommendations.

IMPORTANT: If any answer indicates self-harm (for PHQ-9, this is the question about 'thoughts that you would be better off dead'), the triage level must be classified as 'Severe' regardless of the total score, and you must heavily prioritize crisis resources.
`,
});

const analyzeTriageFlow = ai.defineFlow(
  {
    name: 'analyzeTriageFlow',
    inputSchema: AnalyzeTriageInputSchema,
    outputSchema: AnalyzeTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
