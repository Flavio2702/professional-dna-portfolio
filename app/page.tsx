import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center py-24 text-center">
        <div className="max-w-3xl space-y-8">
          {/* Emoji */}
          <div className="text-8xl animate-pulse">🧬</div>

          {/* Title */}
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Professional DNA
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-muted-foreground font-light">
            The Anti-Portfolio for the AI Era
          </p>

          {/* Description */}
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop selling yourself. Start showing yourself. A radically honest portfolio that reveals your strengths, weaknesses, and unique professional genome.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/create">Create Your DNA</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8">
              <Link href="#examples">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container py-24">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">Why Professional DNA?</h2>
            <p className="text-xl text-muted-foreground">
              Four principles that make this different from traditional portfolios
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Feature 1: DNA Metaphor */}
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">🧬</div>
                <CardTitle className="text-2xl">DNA Metaphor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Your professional identity mapped to chromosomes, genes, and mutations. Technical DNA (skills, tools) meets Behavioral DNA (work style, personality).
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Because you&apos;re more than a list of buzzwords.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2: Scientifically Validated */}
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">🔬</div>
                <CardTitle className="text-2xl">Scientifically Validated</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Powered by the Big Five personality model (OCEAN) - the most validated psychological framework. Your traits inform your behavioral DNA.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Psychology meets AI, not astrology.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3: Prose Over Metrics */}
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">📖</div>
                <CardTitle className="text-2xl">Prose Over Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  No skill bars, no percentage charts, no gamification. Just honest, first-person narratives backed by evidence and concrete examples.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Because &quot;React: 85%&quot; means nothing.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4: Honest Compatibility */}
            <Card>
              <CardHeader>
                <div className="text-5xl mb-4">✅</div>
                <CardTitle className="text-2xl">Honest Compatibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-muted-foreground">
                  Shows where you excel, where you&apos;re capable, and where you&apos;re developing. Plus environments where you thrive vs struggle.
                </p>
                <p className="text-sm text-muted-foreground italic">
                  Self-awareness is the ultimate flex.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground">
              From input to insight in three steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                1
              </div>
              <h3 className="text-xl font-semibold">Fill the Form</h3>
              <p className="text-muted-foreground">
                Share your CV, projects, work philosophy, and complete the 25-question Big Five personality assessment.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                2
              </div>
              <h3 className="text-xl font-semibold">AI Analyzes Your DNA</h3>
              <p className="text-muted-foreground">
                Claude Sonnet 4 maps your experiences and personality into a unique professional genome with evidence-based insights.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto">
                3
              </div>
              <h3 className="text-xl font-semibold">Share Your Portfolio</h3>
              <p className="text-muted-foreground">
                Download as HTML or share via unique URL. Your professional DNA, ready to show the world who you really are.
              </p>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center pt-8">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/create">Start Sequencing Your DNA</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Examples Gallery */}
      <section id="examples" className="container py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold">See Examples</h2>
            <p className="text-xl text-muted-foreground">
              Explore real Professional DNA portfolios across different roles
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Developer Example */}
            <Link href="/portfolio/developer" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader>
                  <div className="text-4xl mb-2">💻</div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Alex Chen
                  </CardTitle>
                  <CardDescription className="text-base">
                    Frontend Engineer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;I build interfaces that load in milliseconds and scale to millions, preferably while no one&apos;s watching.&quot;
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Performance
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      TypeScript
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Remote-First
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Designer Example */}
            <Link href="/portfolio/designer" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader>
                  <div className="text-4xl mb-2">🎨</div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Maya Patel
                  </CardTitle>
                  <CardDescription className="text-base">
                    UX Designer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;I talk to users like a therapist, prototype like a developer, and advocate like a lawyer.&quot;
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      User Research
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Prototyping
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Collaboration
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* PM Example */}
            <Link href="/portfolio/pm" className="group">
              <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02]">
                <CardHeader>
                  <div className="text-4xl mb-2">📊</div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Jordan Rivera
                  </CardTitle>
                  <CardDescription className="text-base">
                    Product Manager
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground italic">
                    &quot;I translate user pain into engineering priorities, business metrics into product strategy, and chaos into roadmaps.&quot;
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Strategy
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Data-Driven
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      Cross-Functional
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Built for the Anthropic Hackathon 2025
          </p>
          <p className="text-xs text-muted-foreground">
            Powered by Claude Sonnet 4.5 &middot; Big Five Model (OCEAN) &middot; Next.js 14
          </p>
        </div>
      </footer>
    </div>
  );
}
