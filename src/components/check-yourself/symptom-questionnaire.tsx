"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { refinedSymptomQuestionnaireSchema, symptomQuestionnaireSchema } from "@/lib/schemas";
import { PHQ9Questions, GAD7Questions, AnswerOptions } from "@/lib/questionnaires";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type SymptomQuestionnaireProps = {
  onSubmit: (data: z.infer<typeof symptomQuestionnaireSchema>) => void;
  isLoading: boolean;
};

type QuestionnaireType = "PHQ-9" | "GAD-7";

export default function SymptomQuestionnaire({
  onSubmit,
  isLoading,
}: SymptomQuestionnaireProps) {
  const [questionnaireType, setQuestionnaireType] = useState<QuestionnaireType>("PHQ-9");

  const questions = useMemo(() => {
    return questionnaireType === "PHQ-9" ? PHQ9Questions : GAD7Questions;
  }, [questionnaireType]);
  
  const defaultValues = useMemo(() => {
    const data = questions.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {});
    return {
      questionnaireType: questionnaireType,
      questionnaireData: data,
    };
  }, [questions, questionnaireType]);

  const form = useForm<z.infer<typeof refinedSymptomQuestionnaireSchema>>({
    resolver: zodResolver(refinedSymptomQuestionnaireSchema),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleFormSubmit = (values: z.infer<typeof refinedSymptomQuestionnaireSchema>) => {
    const totalScore = Object.values(values.questionnaireData).reduce((sum, value) => sum + Number(value), 0);
    console.log("Submitting with score:", totalScore);
    onSubmit(values);
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Check Yourself</CardTitle>
        <CardDescription className="text-muted-foreground pt-2">
          This is a confidential tool to help you understand your feelings. Your answers are not stored.
          Select a questionnaire and answer the questions below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="questionnaireType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a questionnaire</FormLabel>
                  <Select
                    onValueChange={(value: QuestionnaireType) => {
                      setQuestionnaireType(value);
                      field.onChange(value);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a questionnaire" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PHQ-9">PHQ-9 (Depression)</SelectItem>
                      <SelectItem value="GAD-7">GAD-7 (Anxiety)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Over the last 2 weeks, how often have you been bothered by any of the following problems?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              {questions.map((question, index) => (
                <FormField
                  key={question.id}
                  control={form.control}
                  name={`questionnaireData.${question.id}`}
                  render={({ field }) => (
                    <FormItem className="space-y-3 rounded-md border p-4 shadow-sm">
                      <FormLabel className="text-base">{index + 1}. {question.text}</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(Number(value))}
                          defaultValue={String(field.value)}
                          className="flex flex-col space-y-1"
                        >
                          {AnswerOptions.map(option => (
                            <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={String(option.value)} />
                              </FormControl>
                              <FormLabel className="font-normal">{option.label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="space-y-4">
              <Alert variant="destructive">
                <Info className="h-4 w-4" />
                <AlertTitle>Important Disclaimer</AlertTitle>
                <AlertDescription>
                  This tool is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                </AlertDescription>
              </Alert>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  "Get Recommendations"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
