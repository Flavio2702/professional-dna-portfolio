export interface ProfessionalDNA {
  metadata: {
    name: string;
    title: string;
    sequencedFrom: { projects: number; skills: number; experiences: number };
    rarityScore: number;
    lastUpdated: string;
    assessmentConfidence?: 'high' | 'medium' | 'low';
    personalityCalibration?: {
      crossValidated: boolean;
      discrepancies?: string[]; // Flags if CV/projects contradict self-reported Big Five
      calibrationNotes?: string;
    };
  };
  genomeOverview: {
    tagline: string;
    dominantTraits: string[];
    dnaSequence: string;
  };
  chromosomes: Chromosome[];
  mutations: MutationPoint[];
  projects: Project[];
  uniqueSequence: UniqueSequence;
  compatibility: Compatibility;
}

export interface Chromosome {
  id: string;
  name: string;
  genes: Gene[];
}

export interface Gene {
  name: string;
  dominance: '=% Dominant' | '� Active' | '=� Developing';
  basis: string | null;
  expression: string;
  evidence: string[];
  behaviorEvidence?: string[]; // Optional: How trait manifests in actions
  outcomeEvidence?: string[]; // Optional: What the behavior achieved
}

export interface MutationPoint {
  year: number;
  title: string;
  description: string;
  mutation: string;
  newTrait: string;
  evidence: string[];
}

export interface Project {
  geneId: string;
  title: string;
  context: string;
  approach: string[];
  outcome: { metric: string; secondary?: string };
  proof: {
    liveLink?: string;
    testimonial?: { quote: string; author: string };
  };
  insight?: string;
}

export interface UniqueSequence {
  combinations: string[];
  statement: string;
  whyRare: string[];
  evidence: string[];
}

export interface Trait {
  name: string;
  basis: string;
  inPractice: string;
  bestApplied: string;
  contextDependencies: ContextDependencies;
  environmentalFactors: EnvironmentalFactors;
}

export interface DevelopingTrait {
  name: string;
  basis: string;
  myApproach: string;
  growth: string;
  integrationGoal: string; // How to apply trait better, not change it
  contextDependencies: ContextDependencies;
  environmentalFactors: EnvironmentalFactors;
}

export interface Environment {
  title: string;
  why: string;
}

export interface ContextDependencies {
  assumes: string[];
  strugglesIf: string[];
}

export interface EnvironmentalFactors {
  thrivesWhen?: string[];
  strugglesWhen?: string[];
  amplifiers?: string[];
  suppressors?: string[];
}

export interface Compatibility {
  excel: Trait[];
  capable: Trait[];
  developing: DevelopingTrait[];
  thrivingEnvironments: Environment[];
  strugglingEnvironments: Environment[];
  idealHabitat: string;
}

export interface FormData {
  cv: string;
  projects: {
    github?: string;
    portfolio?: string;
    caseStudies: string;
  };
  philosophy: {
    problemSolving: string;
    failure: string;
    love: string;
    hate: string;
    workStyle: string;
  };
  bigFive: Record<string, 1 | 2 | 3 | 4 | 5>;
}

export interface BigFiveScores {
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
}
