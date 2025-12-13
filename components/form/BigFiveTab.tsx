import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import questions from '@/data/bigfive-questions.json';

interface BigFiveTabProps {
  answers: Record<string, 1 | 2 | 3 | 4 | 5>;
  onChange: (questionId: string, value: 1 | 2 | 3 | 4 | 5) => void;
}

const scaleLabels = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];

export function BigFiveTab({ answers, onChange }: BigFiveTabProps) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Personality Assessment (Big Five)
        </h3>
        <p className="text-sm text-muted-foreground">
          Rate how much you agree with each statement (1 = Strongly Disagree, 5
          = Strongly Agree)
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <Label className="text-base font-medium mb-3 block">
              {index + 1}. {question.text}
            </Label>

            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  type="button"
                  variant={answers[question.id] === value ? 'default' : 'outline'}
                  size="lg"
                  onClick={() =>
                    onChange(question.id, value as 1 | 2 | 3 | 4 | 5)
                  }
                  className="flex-1 min-w-[80px] h-auto py-3 px-2 flex flex-col gap-1"
                >
                  <span className="text-2xl font-bold">{value}</span>
                  <span className="text-xs opacity-80 whitespace-normal leading-tight">
                    {scaleLabels[value - 1]}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground">
          <strong>Progress:</strong> {Object.keys(answers).length} of{' '}
          {questions.length} questions answered
        </p>
      </div>
    </div>
  );
}
