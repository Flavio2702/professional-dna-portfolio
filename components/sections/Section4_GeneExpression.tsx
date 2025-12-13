import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProfessionalDNA } from '@/types/portfolio';

interface Section4Props {
  data: ProfessionalDNA;
}

export function Section4_GeneExpression({ data }: Section4Props) {
  const { projects } = data;

  // Group projects by geneId
  const groupedProjects = projects.reduce((acc, project) => {
    const geneId = project.geneId || 'ungrouped';
    if (!acc[geneId]) {
      acc[geneId] = [];
    }
    acc[geneId].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <div className="space-y-8">
      {/* Main Title */}
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold tracking-tight">
          GENE EXPRESSION IN ACTION
        </h2>
        <p className="text-muted-foreground text-lg">
          How my genes manifest in real-world projects
        </p>
      </div>

      {/* Grouped Projects */}
      {Object.entries(groupedProjects).map(([geneId, geneProjects]) => (
        <div key={geneId} className="space-y-4">
          {/* Gene Header */}
          {geneId !== 'ungrouped' && (
            <div className="flex items-center gap-3 mb-6">
              <Badge variant="outline" className="text-sm px-4 py-2">
                Gene: {geneId}
              </Badge>
              <div className="flex-1 h-px bg-border"></div>
            </div>
          )}

          {/* Projects Grid */}
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            {geneProjects.map((project, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow border-l-4 border-l-indigo-500">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Context */}
                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      CONTEXT
                    </h5>
                    <p className="text-sm leading-relaxed">{project.context}</p>
                  </div>

                  {/* Approach */}
                  <div>
                    <h5 className="text-sm font-semibold text-muted-foreground mb-2">
                      MY APPROACH
                    </h5>
                    <ul className="space-y-1">
                      {project.approach.map((step, stepIndex) => (
                        <li key={stepIndex} className="text-sm flex gap-2">
                          <span className="text-indigo-500 font-bold">
                            {stepIndex + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcome */}
                  <div className="bg-emerald-500/10 border-l-2 border-emerald-500 p-4 rounded-r">
                    <h5 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
                      OUTCOME
                    </h5>
                    <p className="text-sm font-medium">{project.outcome.metric}</p>
                    {project.outcome.secondary && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {project.outcome.secondary}
                      </p>
                    )}
                  </div>

                  {/* Proof Section */}
                  {(project.proof.liveLink || project.proof.testimonial) && (
                    <div className="space-y-3">
                      <h5 className="text-sm font-semibold text-muted-foreground">
                        PROOF
                      </h5>

                      {/* Live Link */}
                      {project.proof.liveLink && (
                        <a
                          href={project.proof.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <span>View Live Project</span>
                          <span>&rarr;</span>
                        </a>
                      )}

                      {/* Testimonial */}
                      {project.proof.testimonial && (
                        <blockquote className="border-l-4 border-muted-foreground/30 pl-4 py-2 italic">
                          <p className="text-sm mb-2">
                            &quot;{project.proof.testimonial.quote}&quot;
                          </p>
                          <footer className="text-xs text-muted-foreground">
                            &mdash; {project.proof.testimonial.author}
                          </footer>
                        </blockquote>
                      )}
                    </div>
                  )}

                  {/* Insight */}
                  {project.insight && (
                    <div className="bg-purple-500/10 border-l-2 border-purple-500 p-4 rounded-r">
                      <h5 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">
                        INSIGHT
                      </h5>
                      <p className="text-sm italic">{project.insight}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Empty state */}
      {projects.length === 0 && (
        <Card className="bg-muted border-dashed">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No projects to display yet.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
