'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CVTab } from '@/components/form/CVTab';
import { ProjectsTab } from '@/components/form/ProjectsTab';
import { PhilosophyTab } from '@/components/form/PhilosophyTab';
import { BigFiveTab } from '@/components/form/BigFiveTab';
import { FormData } from '@/types/portfolio';
import { savePortfolio } from '@/lib/storage';

export default function CreatePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('cv');
  const [isGenerating, setIsGenerating] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    cv: '',
    projects: {
      github: '',
      portfolio: '',
      caseStudies: '',
    },
    philosophy: {
      problemSolving: '',
      failure: '',
      love: '',
      hate: '',
      workStyle: '',
    },
    bigFive: {},
  });

  // Validation logic
  const isFormComplete = () => {
    const cvValid = formData.cv.length > 100;
    const philosophyValid = formData.philosophy.problemSolving.length > 0;
    const bigFiveValid = Object.keys(formData.bigFive).length === 25;

    return cvValid && philosophyValid && bigFiveValid;
  };

  // Handle form submission
  const handleGeneratePortfolio = async () => {
    if (!isFormComplete()) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        let serverMessage = `HTTP ${response.status}`;
        try {
          const err = await response.json();
          if (err?.message) serverMessage = err.message as string;
          else if (err?.error) serverMessage = err.error as string;
        } catch {
          // Ignore JSON parse errors
        }
        throw new Error(serverMessage);
      }

      const data = await response.json();
      if (data?.id && data?.data) {
        savePortfolio(data.id, data.data);
      }
      router.push(`/portfolio/${data.id}`);
      setIsGenerating(false);
    } catch (error) {
      console.error('Error generating portfolio:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to generate portfolio. Please try again.';
      alert(message);
      setIsGenerating(false);
    }
  };

  // Update handlers
  const handleCVChange = (value: string) => {
    setFormData((prev) => ({ ...prev, cv: value }));
  };

  const handleProjectsChange = (
    field: 'github' | 'portfolio' | 'caseStudies',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      projects: { ...prev.projects, [field]: value },
    }));
  };

  const handlePhilosophyChange = (
    field: 'problemSolving' | 'failure' | 'love' | 'hate' | 'workStyle',
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      philosophy: { ...prev.philosophy, [field]: value },
    }));
  };

  const handleBigFiveChange = (questionId: string, value: 1 | 2 | 3 | 4 | 5) => {
    setFormData((prev) => ({
      ...prev,
      bigFive: { ...prev.bigFive, [questionId]: value },
    }));
  };

  // Calculate completion percentage
  const completionPercentage = () => {
    let completed = 0;
    let total = 3;

    if (formData.cv.length > 100) completed++;
    if (formData.philosophy.problemSolving.length > 0) completed++;
    if (Object.keys(formData.bigFive).length === 25) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Create Your Professional DNA Portfolio
          </h1>
          <p className="text-lg text-muted-foreground">
            Answer a few questions to generate your unique anti-portfolio
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/">← Back to home</Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Progress</CardTitle>
          <CardDescription>
            {completionPercentage()}% complete
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage()}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="cv">CV</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="philosophy">Philosophy</TabsTrigger>
          <TabsTrigger value="personality">Personality</TabsTrigger>
        </TabsList>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <TabsContent value="cv" className="mt-0">
              <CVTab value={formData.cv} onChange={handleCVChange} />
            </TabsContent>

            <TabsContent value="projects" className="mt-0">
              <ProjectsTab
                github={formData.projects.github}
                portfolio={formData.projects.portfolio}
                caseStudies={formData.projects.caseStudies}
                onChange={handleProjectsChange}
              />
            </TabsContent>

            <TabsContent value="philosophy" className="mt-0">
              <PhilosophyTab
                problemSolving={formData.philosophy.problemSolving}
                failure={formData.philosophy.failure}
                love={formData.philosophy.love}
                hate={formData.philosophy.hate}
                workStyle={formData.philosophy.workStyle}
                onChange={handlePhilosophyChange}
              />
            </TabsContent>

            <TabsContent value="personality" className="mt-0">
              <BigFiveTab
                answers={formData.bigFive}
                onChange={handleBigFiveChange}
              />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>

      <div className="mt-8 flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          {isFormComplete() ? (
            <span className="text-green-600 font-medium">
              ✓ Form complete! Ready to generate.
            </span>
          ) : (
            <span>
              Complete all sections to generate your portfolio
            </span>
          )}
        </div>

        <Button
          size="lg"
          onClick={handleGeneratePortfolio}
          disabled={!isFormComplete() || isGenerating}
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <span className="animate-spin mr-2">⚙️</span>
              Generating...
            </>
          ) : (
            'Generate Portfolio'
          )}
        </Button>
      </div>
    </div>
  );
}
