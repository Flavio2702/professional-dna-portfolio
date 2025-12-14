import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ProjectsTabProps {
  github?: string;
  portfolio?: string;
  caseStudies: string;
  onChange: (field: 'github' | 'portfolio' | 'caseStudies', value: string) => void;
}

export function ProjectsTab({
  github,
  portfolio,
  caseStudies,
  onChange,
}: ProjectsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="github" className="text-base font-semibold">
          GitHub Username (Optional)
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          We&apos;ll analyze your repositories and contributions
        </p>
        <Input
          id="github"
          type="text"
          value={github || ''}
          onChange={(e) => onChange('github', e.target.value)}
          placeholder="octocat"
          className="max-w-md"
        />
      </div>

      <div>
        <Label htmlFor="portfolio" className="text-base font-semibold">
          Portfolio URL (Optional)
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Link to your personal website or portfolio
        </p>
        <Input
          id="portfolio"
          type="url"
          value={portfolio || ''}
          onChange={(e) => onChange('portfolio', e.target.value)}
          placeholder="https://yourportfolio.com"
          className="max-w-md"
        />
      </div>

      <div>
        <Label htmlFor="caseStudies" className="text-base font-semibold">
          Projects & Case Studies
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Describe your best work. Include context, your approach, and outcomes.
        </p>
        <Textarea
          id="caseStudies"
          value={caseStudies}
          onChange={(e) => onChange('caseStudies', e.target.value)}
          placeholder="Example:&#10;&#10;Project: E-commerce Redesign&#10;Context: Company had 60% cart abandonment rate&#10;My approach:&#10;• Conducted user interviews with 20 customers&#10;• Simplified checkout from 5 to 2 steps&#10;• A/B tested new design&#10;Outcome: Reduced abandonment to 35%, increased revenue by $2M annually&#10;&#10;Project: Developer Tools CLI&#10;Context: Team spent 2hrs/day on manual deployments&#10;My approach:&#10;• Built CLI tool with TypeScript&#10;• Integrated with GitHub Actions&#10;• Added rollback functionality&#10;Outcome: Saved 400 engineering hours/month, zero deployment failures"
          className="min-h-[350px] font-mono text-sm"
        />
      </div>
    </div>
  );
}
