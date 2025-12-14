import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section6Props {
  data: ProfessionalDNA;
}

interface ContextListProps {
  label: string;
  items?: string[];
}

function ContextList({ label, items }: ContextListProps) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <ul className="list-disc pl-4 text-sm space-y-1">
        {items.map((item, index) => (
          <li key={`${label}-${index}`}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function hasItems(...lists: Array<string[] | undefined>) {
  return lists.some((list) => list && list.length > 0);
}

export function Section6_DNACompatibility({ data }: Section6Props) {
  const { compatibility } = data;

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">
          BEHAVIORAL DNA PROFILE
        </h2>
        <p className="text-muted-foreground text-lg">
          The contexts where my DNA thrives—and where it drains—so you can instantly tell if it’s a fit.
        </p>
      </div>

      {/* Excel Section */}
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🔥 WHERE I NATURALLY EXCEL
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Dominant genes - I thrive here without effort
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {compatibility.excel.map((trait, index) => {
            const contextDeps = trait.contextDependencies;
            const envFactors = trait.environmentalFactors;
            const hasContext = hasItems(
              contextDeps?.assumes,
              contextDeps?.strugglesIf
            );
            const hasEnvironment = hasItems(
              envFactors?.thrivesWhen,
              envFactors?.strugglesWhen,
              envFactors?.amplifiers,
              envFactors?.suppressors
            );
            return (
              <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                <h4 className="font-semibold text-lg text-orange-600">
                  {trait.name}
                </h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    <strong>Basis:</strong> {trait.basis}
                  </p>
                  <p>
                    <strong>In practice:</strong> {trait.inPractice}
                  </p>
                  <p className="text-sm italic">
                    <strong>Best applied:</strong> {trait.bestApplied}
                  </p>
                  {hasContext && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList label="Assumes" items={contextDeps?.assumes} />
                      <ContextList
                        label="Struggles if"
                        items={contextDeps?.strugglesIf}
                      />
                    </div>
                  )}
                  {hasEnvironment && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList
                        label="Thrives when"
                        items={envFactors?.thrivesWhen}
                      />
                      <ContextList
                        label="Struggles when"
                        items={envFactors?.strugglesWhen}
                      />
                      <ContextList
                        label="Amplifiers"
                        items={envFactors?.amplifiers}
                      />
                      <ContextList
                        label="Suppressors"
                        items={envFactors?.suppressors}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Capable Section */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            ⚡ WHERE I&apos;M NATURALLY CAPABLE
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Active genes - I perform well with focus
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {compatibility.capable.map((trait, index) => {
            const contextDeps = trait.contextDependencies;
            const envFactors = trait.environmentalFactors;
            const hasContext = hasItems(
              contextDeps?.assumes,
              contextDeps?.strugglesIf
            );
            const hasEnvironment = hasItems(
              envFactors?.thrivesWhen,
              envFactors?.strugglesWhen,
              envFactors?.amplifiers,
              envFactors?.suppressors
            );
            return (
              <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                <h4 className="font-semibold text-lg text-blue-600">
                  {trait.name}
                </h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    <strong>Basis:</strong> {trait.basis}
                  </p>
                  <p>
                    <strong>In practice:</strong> {trait.inPractice}
                  </p>
                  <p className="text-sm italic">
                    <strong>Best applied:</strong> {trait.bestApplied}
                  </p>
                  {hasContext && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList label="Assumes" items={contextDeps?.assumes} />
                      <ContextList
                        label="Struggles if"
                        items={contextDeps?.strugglesIf}
                      />
                    </div>
                  )}
                  {hasEnvironment && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList
                        label="Thrives when"
                        items={envFactors?.thrivesWhen}
                      />
                      <ContextList
                        label="Struggles when"
                        items={envFactors?.strugglesWhen}
                      />
                      <ContextList
                        label="Amplifiers"
                        items={envFactors?.amplifiers}
                      />
                      <ContextList
                        label="Suppressors"
                        items={envFactors?.suppressors}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Developing Section */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            💡 WHERE I&apos;M DEVELOPING
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Growing genes - actively building these capabilities
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {compatibility.developing.map((trait, index) => {
            const contextDeps = trait.contextDependencies;
            const envFactors = trait.environmentalFactors;
            const hasContext = hasItems(
              contextDeps?.assumes,
              contextDeps?.strugglesIf
            );
            const hasEnvironment = hasItems(
              envFactors?.thrivesWhen,
              envFactors?.strugglesWhen,
              envFactors?.amplifiers,
              envFactors?.suppressors
            );
            return (
              <div key={index} className="space-y-2 pb-4 border-b last:border-b-0">
                <h4 className="font-semibold text-lg text-yellow-600">
                  {trait.name}
                </h4>
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground">
                    <strong>Basis:</strong> {trait.basis}
                  </p>
                  <p>
                    <strong>My approach:</strong> {trait.myApproach}
                  </p>
                  <p className="text-sm italic">
                    <strong>Growth:</strong> {trait.growth}
                  </p>
                  <p className="text-sm">
                    <strong>Integration goal:</strong> {trait.integrationGoal}
                  </p>
                  {hasContext && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList label="Assumes" items={contextDeps?.assumes} />
                      <ContextList
                        label="Struggles if"
                        items={contextDeps?.strugglesIf}
                      />
                    </div>
                  )}
                  {hasEnvironment && (
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <ContextList
                        label="Thrives when"
                        items={envFactors?.thrivesWhen}
                      />
                      <ContextList
                        label="Struggles when"
                        items={envFactors?.strugglesWhen}
                      />
                      <ContextList
                        label="Amplifiers"
                        items={envFactors?.amplifiers}
                      />
                      <ContextList
                        label="Suppressors"
                        items={envFactors?.suppressors}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Environment Compatibility */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Thriving Environments */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              ✅ THRIVING ENVIRONMENTS
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Where I do my best work
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {compatibility.thrivingEnvironments.map((env, index) => (
              <div key={index} className="space-y-1">
                <h5 className="font-semibold text-green-700">{env.title}</h5>
                <p className="text-sm">{env.why}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Struggling Environments */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              ❌ STRUGGLING ENVIRONMENTS
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Where I drain quickly
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {compatibility.strugglingEnvironments.map((env, index) => (
              <div key={index} className="space-y-1">
                <h5 className="font-semibold text-red-700">{env.title}</h5>
                <p className="text-sm">{env.why}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Ideal Habitat */}
      <Card className="border-2 border-primary bg-gradient-to-br from-background to-secondary/20">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🎯 IDEAL HABITAT
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            The environment where all my genes express optimally
          </p>
        </CardHeader>
        <CardContent>
          <p className="text-lg leading-relaxed">
            {compatibility.idealHabitat}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
