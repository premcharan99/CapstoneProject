'use server';

/**
 * @fileOverview Analyzes mental health questionnaire data to provide a preliminary assessment and recommendations.
 *
 * - analyzeMentalHealth - Analyzes the data and provides recommendations.
 * - AnalyzeMentalHealthInput - The input type for the analyzeMentalHealth function.
 * - AnalyzeMentalHealthOutput - The return type for the analyzeMentalHealth function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { symptomQuestionnaireSchema } from '@/lib/schemas';

export type AnalyzeMentalHealthInput = z.infer<typeof symptomQuestionnaireSchema>;

const RecommendationSchema = z.object({
  therapistType: z.string().describe("The type of therapist recommended (e.g., 'Psychiatrist', 'Psychologist', 'Licensed Clinical Social Worker')."),
  reason: z.string().describe("The reason for recommending this type of therapist."),
});

const AnalyzeMentalHealthOutputSchema = z.object({
  analysis: z.string().describe("A brief, empathetic analysis of the user's questionnaire score."),
  severity: z.string().describe("The assessed severity level (e.g., 'Mild', 'Moderate', 'Severe')."),
  score: z.number().describe("The total calculated score from the questionnaire."),
  recommendations: z.array(RecommendationSchema).describe("A list of recommended therapist types and reasons."),
  nextSteps: z.array(z.string()).describe("A list of suggested next steps for the user to take."),
});
export type AnalyzeMentalHealthOutput = z.infer<typeof AnalyzeMentalHealthOutputSchema>;


export async function analyzeMentalHealth(input: AnalyzeMentalHealthInput): Promise<AnalyzeMentalHealthOutput> {
  return analyzeMentalHealthFlow(input);
}

const triagePrompt = ai.definePrompt({
  name: 'triagePrompt',
  input: { schema: symptomQuestionnaireSchema },
  output: { schema: AnalyzeMentalHealthOutputSchema },
  prompt: `You are a helpful and empathetic AI assistant designed to provide a preliminary analysis of self-reported mental health questionnaires. Your role is to analyze the provided data, calculate the score, assess the severity, and offer general, supportive recommendations.

IMPORTANT: You are not a healthcare professional. Your analysis is not a diagnosis. Always start your analysis with a clear disclaimer stating this.

Analyze the following questionnaire data:
Questionnaire Type: {{{questionnaireType}}}
Answers (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day):
{{{JSON.stringify questionnaireData}}}

1.  **Calculate the total score**.
2.  **Determine the severity** based on the score and questionnaire type (e.g., for PHQ-9: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe. For GAD-7: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe).
3.  **Write a brief, empathetic analysis** of the score. Acknowledge their feelings and the courage it takes to self-assess.
4.  **Recommend therapist types**: Based on the severity and type of questionnaire, suggest 1-2 types of professionals (e.g., Psychologist, Psychiatrist, LCSW, LMFT). Briefly explain why each might be a good fit.
5.  **Suggest next steps**: Provide a short, actionable list of next steps, such as 'Talk to a trusted friend or family member', 'Schedule an appointment with a primary care doctor', 'Explore online therapy platforms'.`,
});


const analyzeMentalHealthFlow = ai.defineFlow(
  {
    name: 'analyzeMentalHealthFlow',
    inputSchema: symptomQuestionnaireSchema,
    outputSchema: AnalyzeMentalHealthOutputSchema,
  },
  async (input) => {
    const { output } = await triagePrompt(input);
    return output!;
  }
);
