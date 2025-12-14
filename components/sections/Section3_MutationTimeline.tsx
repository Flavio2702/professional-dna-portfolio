import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section3Props {
  data: ProfessionalDNA;
}

export function Section3_MutationTimeline({ data }: Section3Props) {
  const { mutations } = data;

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">
          MUTATION TIMELINE
        </h2>
        <p className="text-muted-foreground text-lg">
          The inflection points that rewrote my DNA—experiments, shocks, and the lessons that stuck.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line connector */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 hidden md:block"></div>

        {/* Mutations */}
        <div className="space-y-8">
          {mutations.slice(0, 3).map((mutation, index) => (
            <div key={index} className="relative">
              {/* Timeline dot */}
              <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-4 border-background z-10 hidden md:block"></div>

              {/* Mutation Card */}
              <div className="md:ml-16">
                <Card className="border-l-4 border-l-purple-500 hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                      <Badge variant="outline" className="text-lg px-4 py-1">
                        {mutation.year}
                      </Badge>
                      <div className="text-2xl" title="Mutation Point">
                        &#10024;
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{mutation.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Description */}
                    <p className="leading-relaxed text-sm text-muted-foreground">
                      {mutation.description}
                    </p>
                    <div className="bg-purple-500/10 border-l-2 border-purple-500 p-4 rounded-r">
                      <h5 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
                        DNA MUTATION
                      </h5>
                      <p className="text-sm italic">{mutation.mutation}</p>
                    </div>
                    <p className="text-sm font-medium text-emerald-700">
                      New trait unlocked: {mutation.newTrait}
                    </p>
                    {mutation.evidence && mutation.evidence.length > 0 && (
                      <p className="text-sm text-primary">
                        Proof cue: {mutation.evidence[0]}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <Card className="bg-muted border-dashed">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-muted-foreground italic">
            Each mutation represents a fundamental shift in how I approach work - these are not just skill upgrades, they are rewrites of my professional operating system.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
