import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PhilosophyTabProps {
  problemSolving: string;
  failure: string;
  love: string;
  hate: string;
  workStyle: string;
  onChange: (
    field: 'problemSolving' | 'failure' | 'love' | 'hate' | 'workStyle',
    value: string
  ) => void;
}

export function PhilosophyTab({
  problemSolving,
  failure,
  love,
  hate,
  workStyle,
  onChange,
}: PhilosophyTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="problemSolving" className="text-base font-semibold">
          How do you approach problem-solving?
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Describe your process and thinking style
        </p>
        <Textarea
          id="problemSolving"
          value={problemSolving}
          onChange={(e) => onChange('problemSolving', e.target.value)}
          placeholder="I start by breaking down the problem into smaller parts, then research existing solutions. I prefer to prototype quickly and iterate based on feedback..."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="failure" className="text-base font-semibold">
          Tell me about a significant failure and what you learned
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          Be honest and specific
        </p>
        <Textarea
          id="failure"
          value={failure}
          onChange={(e) => onChange('failure', e.target.value)}
          placeholder="I once launched a feature without proper user testing. It confused users and we had to roll it back. I learned to always validate assumptions with real users before building..."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="love" className="text-base font-semibold">
          What do you love most about your work?
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          What energizes you?
        </p>
        <Textarea
          id="love"
          value={love}
          onChange={(e) => onChange('love', e.target.value)}
          placeholder="I love the moment when a complex system finally clicks together and works beautifully. Seeing users delight in something I built gives me energy..."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="hate" className="text-base font-semibold">
          What do you struggle with or dislike in your work?
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          What drains you?
        </p>
        <Textarea
          id="hate"
          value={hate}
          onChange={(e) => onChange('hate', e.target.value)}
          placeholder="I struggle with overly bureaucratic processes that slow down progress. Endless meetings without clear outcomes drain my energy..."
          className="min-h-[100px]"
        />
      </div>

      <div>
        <Label htmlFor="workStyle" className="text-base font-semibold">
          Describe your ideal work environment and style
        </Label>
        <p className="text-sm text-muted-foreground mt-1 mb-2">
          When do you do your best work?
        </p>
        <Textarea
          id="workStyle"
          value={workStyle}
          onChange={(e) => onChange('workStyle', e.target.value)}
          placeholder="I thrive with autonomy and clear goals. I prefer async communication and deep focus time in the morning. I work best in small teams where I can own entire features..."
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}
