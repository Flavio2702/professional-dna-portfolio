import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface CVTabProps {
  value: string;
  onChange: (value: string) => void;
}

export function CVTab({ value, onChange }: CVTabProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="cv" className="text-lg font-semibold">
          Your CV / LinkedIn Profile
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-3">
          Paste your CV, resume, or LinkedIn profile text. The more detail, the
          better the DNA analysis.
        </p>
        <Textarea
          id="cv"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Example:&#10;&#10;John Doe - Senior Product Designer&#10;&#10;Experience:&#10;• Lead Designer at TechCorp (2020-2024)&#10;  - Redesigned core product, increasing user retention by 40%&#10;  - Led team of 5 designers&#10;&#10;• UX Designer at StartupXYZ (2018-2020)&#10;  - Created design system used across 3 products&#10;&#10;Skills: Figma, User Research, Design Systems, Prototyping"
          className="min-h-[400px] font-mono text-sm"
        />
      </div>
    </div>
  );
}
