// Core types for Sentinel

export interface TransactionInput {
  transactionId?: string;
  wallet: string;
  amount: number;
  currency: "USDC" | "USDT" | "BTC" | "ETH";
  channel: "Web" | "Mobile" | "API";
  ip: string;
  deviceId: string;
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface InvestigationResult {
  transactionId: string;
  wallet: string;
  riskScore: number;
  decision: "ALLOW" | "STEP_UP" | "BLOCK" | "ESCALATE";
  explanation: string;
  trmSummary: {
    tags: string[];
    riskScore: number;
  };
  similarCases: SimilarCase[];
  agentVersion: string;
  evidenceTrace: EvidenceStep[];
  timestamp: string;
}

export interface SimilarCase {
  caseId: string;
  similarity: number;
  wallet: string;
  decision: string;
  description: string;
}

export interface EvidenceStep {
  agent: "Watcher" | "Detective" | "Guardian" | "Coach";
  action: string;
  timestamp: string;
  details: Record<string, any>;
}

export interface CaseSummary {
  caseId: string;
  transactionId: string;
  wallet: string;
  amount: number;
  currency: string;
  riskScore: number;
  decision: string;
  timestamp: string;
  agentVersion: string;
}

export interface CaseDetail extends InvestigationResult {
  caseId: string;
  guardianAction?: {
    action: string;
    reason: string;
    timestamp: string;
  };
  darkWebClusters: DarkWebCluster[];
  narrative: string;
  groundTruth?: "FRAUD" | "CLEAN";
  analystNotes?: string;
}

export interface DarkWebCluster {
  clusterId: string;
  description: string;
  similarity: number;
  tags: string[];
}

export interface AgentMetrics {
  agentVersion: string;
  aps: number; // Agent Performance Score
  apsTrend: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  lossPrevented: number;
  darkWebSignalUtilization: number;
  totalCases: number;
  period: string;
}

export interface Playbook {
  playbookId: string;
  name: string;
  description: string;
  conditions: string[];
  recommendedAction: string;
  confidence: number;
  createdAt: string;
  discoveredBy: string;
  casesMatched?: number;
}

export interface AgentEvent {
  eventId: string;
  agent: "Watcher" | "Detective" | "Guardian" | "Coach";
  action: string;
  timestamp: string;
  transactionId?: string;
  details: Record<string, any>;
}

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface MetricTrend {
  date: string;
  value: number;
  version: string;
}
