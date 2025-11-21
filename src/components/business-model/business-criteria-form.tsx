"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { useEffect } from "react";

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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { businessCriteriaSchema } from "@/lib/schemas";
import { Loader2, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type BusinessCriteriaFormProps = {
  onSubmit: (data: z.infer<typeof businessCriteriaSchema>) => void;
  isLoading: boolean;
};

const formLocalStorageKey = "businessCriteriaForm";

export default function BusinessCriteriaForm({
  onSubmit,
  isLoading,
}: BusinessCriteriaFormProps) {
  const form = useForm<z.infer<typeof businessCriteriaSchema>>({
    resolver: zodResolver(businessCriteriaSchema),
    defaultValues: {
      serviceType: "", ownership: "", targetAgeGroup: "", location: "", marketDemand: "",
      deliveryMode: "", paymentMethods: "", accessibilityGoal: "", targetUsers: "",
      delivery: "", content: "", regulations: "", funding: "", budget: "",
      monetization: "", scope: "", dataSensitivity: "", clinicalInvolvement: "",
    },
  });

  useEffect(() => {
    const savedData = localStorage.getItem(formLocalStorageKey);
    if (savedData) {
      try {
        form.reset(JSON.parse(savedData));
      } catch (error) {
        console.error("Failed to parse saved form data", error)
      }
    }
  }, [form]);

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(formLocalStorageKey, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);
  
  const handleFormSubmit = (values: z.infer<typeof businessCriteriaSchema>) => {
    onSubmit(values);
    localStorage.removeItem(formLocalStorageKey);
  };
  
  const clinicalInvolvementValue = form.watch("clinicalInvolvement");

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Business Model Recommender</CardTitle>
        <p className="text-muted-foreground pt-2">
          Fill in the criteria below to receive an AI-powered business model recommendation.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-headline">Core Attributes</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="serviceType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a service type" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="B2B">B2B (Business-to-Business)</SelectItem>
                        <SelectItem value="B2C">B2C (Business-to-Consumer)</SelectItem>
                        <SelectItem value="D2C">D2C (Direct-to-Consumer)</SelectItem>
                        <SelectItem value="Marketplace">Marketplace</SelectItem>
                        <SelectItem value="SaaS">SaaS (Software-as-a-Service)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="ownership" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ownership</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an ownership structure" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="LLC">LLC</SelectItem>
                        <SelectItem value="Non-profit">Non-profit</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="targetAgeGroup" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Age Group</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a target age group" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Pediatrics (0-12)">Pediatrics (0-12)</SelectItem>
                        <SelectItem value="Adolescents (13-17)">Adolescents (13-17)</SelectItem>
                        <SelectItem value="Young Adults (18-25)">Young Adults (18-25)</SelectItem>
                        <SelectItem value="Adults (26-64)">Adults (26-64)</SelectItem>
                        <SelectItem value="Seniors (65+)">Seniors (65+)</SelectItem>
                        <SelectItem value="All Ages">All Ages</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="location" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a location scope" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Local">Local</SelectItem>
                        <SelectItem value="Regional">Regional</SelectItem>
                        <SelectItem value="National">National</SelectItem>
                        <SelectItem value="Global">Global</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="marketDemand" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Demand</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select market demand" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="High">High (Proven need)</SelectItem>
                        <SelectItem value="Medium">Medium (Emerging interest)</SelectItem>
                        <SelectItem value="Low">Low (Niche or new concept)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="deliveryMode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Delivery Mode</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select a delivery mode" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Digital/Online">Digital/Online</SelectItem>
                        <SelectItem value="In-person">In-person</SelectItem>
                        <SelectItem value="Hybrid">Hybrid (Digital and In-person)</SelectItem>
                        <SelectItem value="Physical Product">Physical Product</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                 <FormField control={form.control} name="paymentMethods" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Methods</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select payment methods" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="One-time Purchase">One-time Purchase</SelectItem>
                        <SelectItem value="Freemium">Freemium</SelectItem>
                        <SelectItem value="Ad-supported">Ad-supported</SelectItem>
                        <SelectItem value="Commission">Commission-based</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="accessibilityGoal" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accessibility Goal</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select an accessibility goal" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="Basic">Basic Compliance</SelectItem>
                        <SelectItem value="WCAG AA">WCAG 2.1 AA</SelectItem>
                        <SelectItem value="WCAG AAA">WCAG 2.1 AAA</SelectItem>
                        <SelectItem value="Universal Design">Universal Design</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold font-headline">Detailed Descriptions</h3>
              <FormField control={form.control} name="targetUsers" render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Users</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'University students struggling with anxiety...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="delivery" render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Mobile app with daily exercises and therapist chat...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="content" render={({ field }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'CBT/DBT informed content, guided meditations...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="regulations" render={({ field }) => (
                <FormItem>
                  <FormLabel>Regulations</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'HIPAA compliance in the US, GDPR in the EU...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="funding" render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Bootstrapped, seeking seed funding...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="budget" render={({ field }) => (
                <FormItem>
                  <FormLabel>Budget</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Initial budget of $50k for MVP development...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="monetization" render={({ field }) => (
                <FormItem>
                  <FormLabel>Monetization</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Tiered subscription model, pay-per-session...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="scope" render={({ field }) => (
                <FormItem>
                  <FormLabel>Scope</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'MVP to launch in 3 months, focusing on core features...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="dataSensitivity" render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Sensitivity</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Handling of PHI, anonymized data for research...'" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="clinicalInvolvement" render={({ field }) => (
                <FormItem>
                  <FormLabel>Clinical Involvement</FormLabel>
                  <FormControl><Textarea placeholder="e.g., 'Licensed therapists will provide consultations...'" {...field} /></FormControl>
                  <FormDescription>Describe if licensed practitioners are involved. This will trigger safety guardrails.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />
              {clinicalInvolvementValue && clinicalInvolvementValue.length > 0 && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Safety Guardrail</AlertTitle>
                  <AlertDescription>
                    Clinical involvement requires strict adherence to healthcare regulations (e.g., HIPAA) and ethical guidelines. Ensure you consult with legal and clinical experts.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-4">
                <Alert variant="default" className="bg-muted/50">
                    <Info className="h-4 w-4"/>
                    <AlertTitle>Privacy Note</AlertTitle>
                    <AlertDescription>
                        Your form data is saved in your browser's local storage to prevent data loss on accidental refresh. It is not sent to our servers until you submit. This data is cleared upon submission.
                    </AlertDescription>
                </Alert>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                    <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                    </>
                ) : (
                    "Generate Recommendation"
                )}
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
