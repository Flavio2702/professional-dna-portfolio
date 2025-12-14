import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section2Props {
  data: ProfessionalDNA;
}

export function Section2_ChromosomeMap({ data }: Section2Props) {
  const { chromosomes } = data;

  const getDominanceBadgeColor = (dominance: string) => {
    if (dominance.includes('Dominant')) {
      return 'bg-gradient-to-r from-orange-500 to-red-500 text-white';
    } else if (dominance.includes('Active')) {
      return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white';
    } else {
      return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
    }
  };

  const getChromosomeBorderColor = (id: string) => {
    if (id === 'technical-dna') {
      return 'border-l-purple-500';
    } else if (id === 'behavioral-dna') {
      return 'border-l-emerald-500';
    }
    return 'border-l-primary';
  };

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">
          CHROMOSOME MAP
        </h2>
        <p className="text-muted-foreground text-lg">
          Breaking down dominant and developing genes to show how my operating system actually expresses itself at work.
        </p>
      </div>

      {/* Chromosomes */}
      {chromosomes.map((chromosome) => (
        <div key={chromosome.id} className="space-y-4">
          {/* Chromosome Header */}
          <Card className={`border-l-4 ${getChromosomeBorderColor(chromosome.id)}`}>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <span className="font-mono text-sm text-muted-foreground">
                  [{chromosome.id}]
                </span>
                {chromosome.name}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Genes Grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {chromosome.genes.map((gene, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{gene.name}</CardTitle>
                    <Badge className={getDominanceBadgeColor(gene.dominance)}>
                      {gene.dominance}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basis */}
                  {gene.basis && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {gene.basis}
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">{gene.expression}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Legend */}
      <Card className="bg-muted">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500"></div>
              <span className="text-sm font-medium">Dominant - Naturally excel</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
              <span className="text-sm font-medium">Active - Capable with focus</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500"></div>
              <span className="text-sm font-medium">Developing - Growing</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
