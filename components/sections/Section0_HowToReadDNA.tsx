'use client';

import { useId, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function Section0_HowToReadDNA() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const navLinks = [
    { label: 'Genome Overview', href: '#genome-overview' },
    { label: 'Mutation Timeline', href: '#mutation-timeline' },
    { label: 'DNA Compatibility', href: '#dna-compatibility' },
  ];

  return (
    <Card className="border-2 border-dashed border-primary/40">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="uppercase text-xs tracking-wider text-muted-foreground">
              Orientation guide
            </p>
            <CardTitle>How to read this DNA</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls={panelId}
            className="w-full sm:w-auto"
          >
            {open ? 'Hide guide' : 'Show guide'}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {navLinks.map((link) => (
            <Button key={link.href} variant="secondary" size="sm" asChild>
              <a href={link.href}>{link.label}</a>
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent
        id={panelId}
        className={`space-y-6 transition-all ${open ? 'block' : 'hidden'}`}
      >
        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            What this is
          </h3>
          <p className="text-base leading-relaxed">
            Not a CV. A system view of how I work: patterns &gt; trade-offs &gt; contexts.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            How to use it
          </h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Recruiter - start with Genome Overview and DNA Compatibility.</li>
            <li>Founder - start with Mutation Timeline and Unique Sequence.</li>
            <li>Peer / Collaborator - start with Gene Expression and Chromosome Map.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            How to read each section
          </h3>
          <ul className="text-sm space-y-1">
            <li><strong>Genome Overview:</strong> Scan role, tone, and dominant traits.</li>
            <li><strong>Chromosome Map:</strong> Spot which genes lead or are still developing.</li>
            <li><strong>Mutation Timeline:</strong> Follow the pivots that rewired how I work.</li>
            <li><strong>Gene Expression:</strong> Open projects that prove those behaviors.</li>
            <li><strong>Unique Sequence:</strong> Catch the rare combos that explain my edge.</li>
            <li><strong>DNA Compatibility:</strong> See where I thrive or need guardrails.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Guiding questions
          </h3>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>Where do I create value on repeat?</li>
            <li>In which contexts do I stall or drain?</li>
            <li>What trade-offs define how I operate?</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Mini glossary
          </h3>
          <dl className="text-sm space-y-2">
            <div>
              <dt className="font-semibold">Gene</dt>
              <dd>A recurring behavior tied to a dominant trait.</dd>
            </div>
            <div>
              <dt className="font-semibold">Mutation</dt>
              <dd>A pivot that changed the way I work.</dd>
            </div>
            <div>
              <dt className="font-semibold">Compatibility</dt>
              <dd>The fit between my DNA and a specific context.</dd>
            </div>
          </dl>
        </div>
      </CardContent>
    </Card>
  );
}
