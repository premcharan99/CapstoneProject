"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { mentalHealthData } from "@/lib/mental-health-data";
import { BarChart, XAxis, YAxis, Bar, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line, Tooltip } from "recharts";
import { Users, Activity, PieChart as PieChartIcon } from "lucide-react";

export default function DataAnalysisPage() {
  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

  return (
    <div className="bg-muted/30">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl xl:text-6xl/none">
                Mental Health Data Insights
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Exploring trends and statistics in mental wellness. All data is illustrative.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 text-primary" /> Prevalence Over Time</CardTitle>
            <CardDescription>Illustrative trend of major depressive episodes in adults (2015-2024).</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-64 w-full">
              <LineChart data={mentalHealthData.prevalenceOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="prevalence" stroke="hsl(var(--primary))" strokeWidth={2} name="Prevalence"/>
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center"><PieChartIcon className="mr-2 text-primary" /> Condition Breakdown</CardTitle>
            <CardDescription>Share of common mental health conditions.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="h-64 w-full">
                <PieChart>
                    <Pie data={mentalHealthData.conditionBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {mentalHealthData.conditionBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center"><Users className="mr-2 text-primary" /> Age Group Analysis</CardTitle>
            <CardDescription>Prevalence of any mental illness (AMI) by age group.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{}} className="h-72 w-full">
              <BarChart data={mentalHealthData.ageGroupAnalysis}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis unit="%" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="prevalence" name="Prevalence" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

         <Card>
          <CardHeader>
            <CardTitle>Treatment Seeking</CardTitle>
             <CardDescription>Percentage of adults with AMI who received mental health services in the past year.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary">{mentalHealthData.treatmentSeeking.receivedTreatment}%</div>
              <p className="text-muted-foreground">Received Treatment</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Comorbidity</CardTitle>
            <CardDescription>Overlap between anxiety disorders and substance use disorder.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48">
             <div className="text-center">
              <div className="text-6xl font-bold text-accent">{mentalHealthData.comorbidity.anxietyAndSUD}%</div>
              <p className="text-muted-foreground">Co-occurrence</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Youth Mental Health</CardTitle>
            <CardDescription>Youth (12-17) with at least one major depressive episode.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center h-48">
             <div className="text-center">
              <div className="text-6xl font-bold text-primary">{mentalHealthData.youthMHD.majorDepressiveEpisode}%</div>
               <p className="text-muted-foreground">In the past year</p>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
