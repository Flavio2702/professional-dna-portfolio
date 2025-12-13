'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getPortfolio, savePortfolio } from '@/lib/storage';
import { ProfessionalDNA } from '@/types/portfolio';
import { Section1_GenomeOverview } from '@/components/sections/Section1_GenomeOverview';
import { Section2_ChromosomeMap } from '@/components/sections/Section2_ChromosomeMap';
import { Section3_MutationTimeline } from '@/components/sections/Section3_MutationTimeline';
import { Section4_GeneExpression } from '@/components/sections/Section4_GeneExpression';
import { Section5_UniqueSequence } from '@/components/sections/Section5_UniqueSequence';
import { Section6_DNACompatibility } from '@/components/sections/Section6_DNACompatibility';

export default function PortfolioPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const [portfolio, setPortfolio] = useState<ProfessionalDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        // First, try to load from localStorage
        const stored = getPortfolio(id);

        if (stored) {
          setPortfolio(stored);
          setLoading(false);
          return;
        }

        // If not in localStorage, check URL params
        const dataParam = searchParams.get('data');
        if (dataParam) {
          try {
            // Decode base64 and parse JSON
            const decoded = atob(dataParam);
            const portfolioData = JSON.parse(decoded) as ProfessionalDNA;

            // Save to localStorage for future visits
            savePortfolio(id, portfolioData);

            setPortfolio(portfolioData);
            setLoading(false);
            return;
          } catch (decodeError) {
            console.error('Error decoding portfolio data:', decodeError);
            setError('Invalid portfolio data in URL');
            setLoading(false);
            return;
          }
        }

        // Check if this is an example portfolio (developer, designer, pm)
        const exampleIds = ['developer', 'designer', 'pm'];
        if (exampleIds.includes(id)) {
          try {
            const response = await fetch(`/examples/${id}.json`);
            if (response.ok) {
              const portfolioData = await response.json() as ProfessionalDNA;

              // Save to localStorage for future visits
              savePortfolio(id, portfolioData);

              setPortfolio(portfolioData);
              setLoading(false);
              return;
            }
          } catch (fetchError) {
            console.error('Error loading example portfolio:', fetchError);
            // Continue to error state below
          }
        }

        // Portfolio not found in localStorage, URL, or examples
        setError('Portfolio not found');
        setLoading(false);
      } catch (err) {
        console.error('Error loading portfolio:', err);
        setError('Failed to load portfolio');
        setLoading(false);
      }
    };

    loadPortfolio();
  }, [id, searchParams]);

  const handleDownload = () => {
    if (!contentRef.current || !portfolio) return;

    try {
      // Get the HTML content
      const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.metadata.name} - Professional DNA Portfolio</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #fafafa;
    }
    .section {
      margin-bottom: 40px;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    h1, h2, h3 { color: #1a1a1a; }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      background: #e5e7eb;
      font-size: 0.875rem;
      margin: 4px;
    }
  </style>
</head>
<body>
  ${contentRef.current.innerHTML}
</body>
</html>
      `;

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${portfolio.metadata.name.replace(/\s+/g, '_')}_DNA_Portfolio.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading portfolio:', err);
      alert('Failed to download portfolio');
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
              <p className="text-lg font-medium">Sequencing DNA...</p>
              <p className="text-sm text-muted-foreground">
                Loading your professional genome
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error State
  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-500">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="text-6xl">❌</div>
              <h2 className="text-2xl font-bold">Portfolio Not Found</h2>
              <p className="text-muted-foreground">
                {error || 'The requested portfolio could not be found.'}
              </p>
              <Button
                onClick={() => (window.location.href = '/create')}
                className="mt-4"
              >
                Create a New Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success State - Render Portfolio
  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold truncate max-w-md">
              {portfolio.metadata.name}
            </h1>
            <span className="text-sm text-muted-foreground hidden sm:block">
              {portfolio.metadata.title}
            </span>
          </div>
          <Button onClick={handleDownload} variant="outline">
            Download Portfolio
          </Button>
        </div>
      </header>

      {/* Portfolio Content */}
      <main ref={contentRef} className="container py-8 space-y-16">
        {/* Section 1: Genome Overview */}
        <section id="genome-overview">
          <Section1_GenomeOverview data={portfolio} />
        </section>

        <div className="border-t"></div>

        {/* Section 2: Chromosome Map */}
        <section id="chromosome-map">
          <Section2_ChromosomeMap data={portfolio} />
        </section>

        <div className="border-t"></div>

        {/* Section 3: Mutation Timeline */}
        <section id="mutation-timeline">
          <Section3_MutationTimeline data={portfolio} />
        </section>

        <div className="border-t"></div>

        {/* Section 4: Gene Expression */}
        <section id="gene-expression">
          <Section4_GeneExpression data={portfolio} />
        </section>

        <div className="border-t"></div>

        {/* Section 5: Unique Sequence */}
        <section id="unique-sequence">
          <Section5_UniqueSequence data={portfolio} />
        </section>

        <div className="border-t"></div>

        {/* Section 6: DNA Compatibility */}
        <section id="dna-compatibility">
          <Section6_DNACompatibility data={portfolio} />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 text-sm text-muted-foreground border-t">
          <p>
            Generated with Professional DNA Anti-Portfolio
          </p>
          <p className="mt-2">
            Last updated: {new Date(portfolio.metadata.lastUpdated).toLocaleDateString()}
          </p>
        </footer>
      </main>
    </div>
  );
}
