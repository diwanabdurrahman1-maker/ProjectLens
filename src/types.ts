export interface ProjectInput {
  idea: string;
  audience: string;
  problem: string;
  solutions: string;
}

export interface Persona {
  id: string;
  title: string;
  demographics: string;
  description: string;
  coreFriction: string;
}

export interface CompetitorItem {
  solutionClass: string;
  coreStrengths: string;
  criticalWeaknesses: string;
  opportunityGap: string;
}

export interface DomainSource {
  name: string;
  type: string;
  description: string;
}

export interface PrioritizedRisk {
  tier: string;
  title: string;
  severity: number;
  likelihood: number;
  description: string;
  mitigation: string;
}

export interface SmokeTestExperiment {
  title: string;
  costDuration: string;
  description: string;
  successCriterion: string;
}

export interface MvpFeature {
  title: string;
  description: string;
}

export interface SprintMilestone {
  sprint: string;
  timeRange: string;
  title: string;
  description: string;
  keyDeliverables: string[];
}

export interface TechStack {
  frontend: string;
  backend: string;
  database: string;
  aiServices: string;
  auth: string;
}

export interface ChecklistItem {
  task: string;
  done: boolean;
}

export interface ProjectAnalysis {
  id: string;
  title: string;
  tagline: string;
  clarityScore: number;
  feasibilityIndex: number;
  riskRating: "Low" | "Medium" | "High" | string;
  estimatedWeeksToAlpha: number;
  radarScores: {
    demand: number;
    techEase: number;
    defensibility: number;
    velocity: number;
  };
  executiveSummary: string;
  strategicPillars: {
    primaryAdvantage: string;
    targetAudiencePillar: string;
    monetizationPath: string;
  };
  research: {
    personas: Persona[];
    competitorAnalysis: CompetitorItem[];
    marketResearchQuestions: string[];
    domainAuthoritySources: DomainSource[];
  };
  validate: {
    problemClarity: {
      status: string;
      explanation: string;
    };
    willingnessToPay: {
      assessment: string;
      pricingModel: string;
      details: string;
    };
    mainAssumptions: string[];
    potentialUserNeeds: string[];
    prioritizedRisks: PrioritizedRisk[];
    smokeTestExperiments: SmokeTestExperiment[];
  };
  improve: {
    vulnerabilities: Array<{ title: string; description: string }>;
    missingFeatures: Array<{ title: string; description: string }>;
    differentiationOpportunities: Array<{ title: string; moatFactor: string; description: string }>;
    specificRecommendations: string[];
  };
  build: {
    mvpFeatures: {
      mustHave: MvpFeature[];
      shouldHave: MvpFeature[];
      niceToHave: MvpFeature[];
    };
    sprintRoadmap: SprintMilestone[];
    suggestedTechStack: TechStack;
    immediate72HourChecklist: ChecklistItem[];
  };
  finalProjectPlan: {
    problemStatement: string;
    targetAudience: string;
    proposedSolution: string;
    keyFeatures: string[];
    mainRisks: string[];
    mvpScope: string;
    recommendedNextSteps: string[];
    markdownSpecification: string;
  };
  createdAt: string;
  updatedAt?: string;
  modelUsed?: string;
  inputs: ProjectInput;
}
