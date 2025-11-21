"use client";

import type { SuggestBusinessModelOutput } from "@/ai/flows/suggest-business-model";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  Printer,
  RotateCcw,
  Lightbulb,
  Target,
  DollarSign,
  Info,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Label, Pie, PieChart, Cell } from "recharts";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

type BusinessModelDashboardProps = {
  data: SuggestBusinessModelOutput;
  onReset: () => void;
};

const chartConfig = {
  confidence: {
    label: "Confidence",
  },
} satisfies ChartConfig;

export default function BusinessModelDashboard({
  data,
  onReset,
}: BusinessModelDashboardProps) {

  const handleDownloadJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "business-model-recommendation.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const confidencePercentage = Math.round(data.confidenceScore * 100);
  const chartData = [
    { name: 'Confidence', value: confidencePercentage, fill: 'hsl(var(--primary))' },
    { name: 'Remaining', value: 100 - confidencePercentage, fill: 'hsl(var(--muted))' },
  ];

  return (
    <>
      <div className="printable-area">
        <Card className="max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardDescription>Recommended Business Model</CardDescription>
                <CardTitle className="font-headline text-4xl text-primary">
                  {data.businessModel}
                </CardTitle>
              </div>
              <div className="w-32 h-32">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel hideIndicator />}
                    />
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={38}
                      strokeWidth={2}
                      startAngle={90}
                      endAngle={450}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-3xl font-bold"
                                >
                                  {confidencePercentage.toLocaleString()}%
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 16}
                                  className="fill-muted-foreground text-sm"
                                >
                                  Confidence
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                      <Cell />
                      <Cell />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 card-content">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Justification</AlertTitle>
              <AlertDescription>{data.reasons}</AlertDescription>
            </Alert>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1" className="accordion-item">
                <AccordionTrigger className="text-xl font-headline">
                  <Lightbulb className="mr-2 text-accent" />
                  MVP Features
                </AccordionTrigger>
                <AccordionContent className="accordion-content prose prose-sm max-w-none text-muted-foreground">
                  <p>{data.mvpFeatures}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="accordion-item">
                <AccordionTrigger className="text-xl font-headline">
                  <Target className="mr-2 text-accent" />
                  Go-To-Market Channels
                </AccordionTrigger>
                <AccordionContent className="accordion-content prose prose-sm max-w-none text-muted-foreground">
                  <p>{data.gtmChannels}</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="accordion-item">
                <AccordionTrigger className="text-xl font-headline">
                  <DollarSign className="mr-2 text-accent" />
                  Monetization Forecasts
                </AccordionTrigger>
                <AccordionContent className="accordion-content prose prose-sm max-w-none text-muted-foreground">
                  <p>{data.monetizationForecasts}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="text-xs text-muted-foreground font-code mt-4 no-print">
                <span className="font-bold">Disclaimer:</span> The recommendations provided are generated by an AI model and should be used for informational purposes only. Always conduct thorough market research and consult with business professionals before making any decisions.
            </p>
          </CardContent>
          <CardFooter className="flex-col sm:flex-row justify-end gap-2 no-print">
            <Button variant="outline" onClick={handleDownloadJson}>
              <FileDown className="mr-2" />
              Download JSON
            </Button>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2" />
              Print Summary
            </Button>
            <Button onClick={onReset}>
              <RotateCcw className="mr-2" />
              Start Over
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
