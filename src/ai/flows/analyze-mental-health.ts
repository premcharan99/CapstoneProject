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
  preliminaryAnalysis: z.string().describe("A brief, empathetic analysis of the user's questionnaire score, starting with a disclaimer that this is not a medical diagnosis."),
  severity: z.string().describe("The assessed severity level (e.g., 'Minimal', 'Mild', 'Moderate', 'Severe')."),
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
  prompt: `You are a helpful and empathetic AI assistant designed to provide a preliminary analysis of self-reported mental health questionnaires. Your role is to analyze the provided data, calculate a score, assess the severity, and offer general, supportive recommendations.

IMPORTANT: You are not a healthcare professional. Your analysis is not a diagnosis. Always start your analysis with a clear disclaimer stating this.

Analyze the following questionnaire data:
Questionnaire Type: {{{questionnaireType}}}
Answers (0=Not at all, 1=Several days, 2=More than half the days, 3=Nearly every day):
{{{JSON.stringify questionnaireData}}}

1.  **Calculate the total score** by summing the numeric values of the answers.
2.  **Determine the severity** based on the score and questionnaire type.
    - For PHQ-9 (Depression): 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20-27 severe.
    - For GAD-7 (Anxiety): 0-4 minimal, 5-9 mild, 10-14 moderate, 15-21 severe.
3.  **Write a brief, empathetic analysis** of the score as 'preliminaryAnalysis'. Acknowledge the user's feelings and the courage it takes to self-assess.
4.  **Recommend therapist types**: Based on the severity and type of questionnaire, suggest 1-2 types of professionals (e.g., Psychologist, Psychiatrist, LCSW, LMFT). Briefly explain why each might be a good fit.
5.  **Suggest next steps**: Provide a short, actionable list of next steps, such as 'Talk to a trusted friend or family member', 'Schedule an appointment with your primary care doctor', or 'Explore online therapy platforms'.`,
});


const analyzeMentalHealthFlow = ai.defineFlow(
  {
    name: 'analyzeMentalHealthFlow',
    inputSchema: symptomQuestionnaireSchema,
    outputSchema: AnalyzeMentalHealthOutputSchema,
  },
  async (input) => {
    // Calculate the score server-side to ensure accuracy
    const score = Object.values(input.questionnaireData).reduce((sum, value) => sum + Number(value), 0);
    
    const { output } = await triagePrompt({
        ...input,
        // It's good practice to pass the definitive score to the model,
        // even though it could calculate it itself. This ensures consistency.
        score,
    });
    
    // Ensure the server-calculated score is the one returned
    return {
        ...output!,
        score,
    };
  }
);
