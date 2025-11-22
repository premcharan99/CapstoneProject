"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight, BrainCircuit, Lightbulb } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter font-headline sm:text-5xl xl:text-6xl/none">
                    Navigate Your Journey with AI-Powered Insight
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Clarity Compass offers intelligent tools for both aspiring entrepreneurs and individuals seeking mental wellness. Find your path forward.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/business-model">
                    <Button size="lg" className="w-full min-[400px]:w-auto">
                      For Startups
                      <Lightbulb className="ml-2" />
                    </Button>
                  </Link>
                  <Link href="/check-yourself">
                    <Button size="lg" variant="secondary" className="w-full min-[400px]:w-auto">
                      For Individuals
                       <BrainCircuit className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 <svg 
                  viewBox="0 0 128 128" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-64 h-64 lg:w-full lg:h-full"
                >
                  <circle cx="64" cy="64" r="56" stroke="hsl(var(--primary))" strokeWidth="4"/>
                  <path d="M64 28L80 64L64 100L48 64L64 28Z" fill="hsl(var(--accent))" fillOpacity="0.5"/>
                  <path d="M64 28L80 64L64 100L48 64L64 28Z" stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinejoin="round" strokeOpacity="0.5"/>
                  <circle cx="64" cy="64" r="8" fill="hsl(var(--primary))"/>
                  <circle cx="64" cy="64" r="6" stroke="hsl(var(--background))" strokeWidth="1"/>
                  <path d="M24 44L44 24" stroke="hsl(var(--accent))" strokeWidth="2" />
                  <path d="M104 84L84 104" stroke="hsl(var(--accent))" strokeWidth="2" />
                   <path d="M24 84L44 104" stroke="hsl(var(--accent))" strokeWidth="2" />
                  <path d="M104 44L84 24" stroke="hsl(var(--accent))" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-full bg-primary/20 text-primary">
                        <Lightbulb className="w-8 h-8" />
                     </div>
                     <CardTitle className="text-3xl font-headline">For the Innovator</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    Have a groundbreaking idea but unsure of the right business model? Our AI-powered tool analyzes your unique criteria to suggest the most viable path forward, complete with MVP features and market strategies.
                  </CardDescription>
                  <Link href="/business-model">
                    <Button variant="outline">
                      Plan Your Business <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
              <Card className="shadow-lg">
                 <CardHeader>
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-full bg-accent/20 text-accent">
                        <BrainCircuit className="w-8 h-8" />
                     </div>
                     <CardTitle className="text-3xl font-headline">For Your Well-being</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                   <CardDescription className="text-base">
                    Take a moment to check in with yourself. Our confidential questionnaire provides a preliminary analysis of mental health symptoms, helping you understand your feelings and consider the next steps on your wellness journey.
                  </CardDescription>
                  <Link href="/check-yourself">
                    <Button variant="outline">
                      Check Yourself <ArrowRight className="ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
