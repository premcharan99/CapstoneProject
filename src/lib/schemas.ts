import { z } from "zod";
import { PHQ9_QUESTIONS, GAD7_QUESTIONS } from "./constants";

export const businessCriteriaSchema = z.object({
  serviceType: z.string().min(1, "Service type is required."),
  ownership: z.string().min(1, "Ownership is required."),
  targetAgeGroup: z.string().min(1, "Target age group is required."),
  location: z.string().min(1, "Location is required."),
  marketDemand: z.string().min(1, "Market demand is required."),
  deliveryMode: z.string().min(1, "Delivery mode is required."),
  paymentMethods: z.string().min(1, "Payment methods are required."),
  accessibilityGoal: z.string().min(1,"Accessibility goal is required."),
  targetUsers: z.string().min(1, "Target users description is required."),
  delivery: z.string().min(1, "Delivery description is required."),
  content: z.string().min(1, "Content description is required."),
  regulations: z.string().min(1, "Regulations description is required."),
  funding: z.string().min(1, "Funding description is required."),
  budget: z.string().min(1, "Budget description is required."),
  monetization: z.string().min(1, "Monetization description is required."),
  scope: z.string().min(1, "Scope is required."),
  dataSensitivity: z.string().min(1, "Data sensitivity description is required."),
  clinicalInvolvement: z.string().min(1, "Clinical involvement description is required."),
});

const phq9Schema = z.object(
  PHQ9_QUESTIONS.reduce((acc, q) => {
    acc[q.id] = z.coerce.number().min(0).max(3);
    return acc;
  }, {} as Record<string, z.ZodType<number, z.ZodTypeDef>>)
);

const gad7Schema = z.object(
  GAD7_QUESTIONS.reduce((acc, q) => {
    acc[q.id] = z.coerce.number().min(0).max(3);
    return acc;
  }, {} as Record<string, z.ZodType<number, z.ZodTypeDef>>)
);

export const symptomQuestionnaireSchema = z.discriminatedUnion("questionnaireType", [
    z.object({
        questionnaireType: z.literal("PHQ-9"),
        questionnaireData: phq9Schema,
        userDetails: z.string().optional(),
    }),
    z.object({
        questionnaireType: z.literal("GAD-7"),
        questionnaireData: gad7Schema,
        userDetails: z.string().optional(),
    }),
]);


export type BusinessCriteria = z.infer<typeof businessCriteriaSchema>;
export type SymptomQuestionnaire = z.infer<typeof symptomQuestionnaireSchema>;