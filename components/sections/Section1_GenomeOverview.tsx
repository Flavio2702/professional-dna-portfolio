import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section1Props {
  data: ProfessionalDNA;
}

export function Section1_GenomeOverview({ data }: Section1Props) {
  const { metadata, genomeOverview } = data;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-4xl font-bold tracking-tight">
          GENOME OVERVIEW
        </h2>
        <p className="text-muted-foreground text-lg">
          First snapshot of my professional DNA—what I actually bring to the table and why this combination works.
        </p>
      </div>

            {/* Header: Name & Title */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold tracking-tight">{metadata.name}</h1>
        <p className="text-2xl text-muted-foreground">{metadata.title}</p>
      </div>

      {/* Tagline */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="pt-6">
          <p className="text-xl italic text-center leading-relaxed">
            &quot;{genomeOverview.tagline}&quot;
          </p>
        </CardContent>
      </Card>

      {/* Dominant Traits */}
      <Card>
        <CardHeader>
          <CardTitle>Dominant Traits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {genomeOverview.dominantTraits.map((trait, index) => (
              <Badge
                key={index}
                variant="default"
                className="text-sm px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500"
              >
                {trait}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DNA Sequence */}
      <Card className="bg-slate-950 text-green-400 border-green-500">
        <CardHeader>
          <CardTitle className="text-green-400 font-mono">
            DNA SEQUENCE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-lg tracking-widest text-center py-4 break-all">
            {genomeOverview.dnaSequence}
          </div>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <div className="text-center text-sm text-muted-foreground">
        Last sequenced: {new Date(metadata.lastUpdated).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
    </div>
  );
}
