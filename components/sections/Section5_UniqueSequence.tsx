import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section5Props {
  data: ProfessionalDNA;
}

export function Section5_UniqueSequence({ data }: Section5Props) {
  const { uniqueSequence } = data;

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">
          MY UNREPLICABLE COMBINATION
        </h2>
        <p className="text-muted-foreground text-lg">
          Le combinazioni rare che rendono il mio profilo difficile da replicare altrove.
        </p>
      </div>

      {/* Combinations */}
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-xl">Rare Gene Combinations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-center gap-4 text-lg font-semibold">
            {uniqueSequence.combinations.map((combination, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-primary">{combination}</span>
                {index < uniqueSequence.combinations.length - 1 && (
                  <span className="text-muted-foreground text-2xl">x</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Statement */}
      <Card className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2">
        <CardContent className="pt-8 pb-8">
          <p className="text-2xl md:text-3xl font-bold text-center leading-relaxed">
            {uniqueSequence.statement}
          </p>
        </CardContent>
      </Card>

      {/* Why Rare Section */}
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader>
          <CardTitle className="text-xl">
            This combination is rare because:
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {uniqueSequence.whyRare.map((reason, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-amber-500 font-bold text-lg">
                  {index + 1}.
                </span>
                <span className="text-base leading-relaxed pt-0.5">
                  {reason}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Evidence */}
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader>
          <CardTitle className="text-xl">Evidence of This Combination</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {uniqueSequence.evidence.map((evidence, index) => (
              <li key={index} className="flex gap-3">
                <span className="text-emerald-500">&#10003;</span>
                <span className="text-base leading-relaxed">
                  {evidence}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Footer Quote */}
      <Card className="bg-muted border-dashed">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground italic">
            This is not just a list of skills - it is a genetic signature that cannot be copied or taught. It is what happens when specific life experiences collide with specific personality traits in a specific sequence.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
