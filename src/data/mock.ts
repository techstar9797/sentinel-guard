import {
  InvestigationResult,
  CaseSummary,
  CaseDetail,
  AgentMetrics,
  Playbook,
  AgentEvent,
  MetricTrend,
} from "@/types";

// Mock investigation results
export const mockInvestigation: InvestigationResult = {
  transactionId: "tx_a8f3b2c9",
  wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
  riskScore: 87,
  decision: "BLOCK",
  explanation:
    "High-risk transaction detected: wallet has exposure to darknet marketplaces and shows patterns consistent with previous fraud cases.",
  trmSummary: {
    tags: ["mixer_exposure", "darknet_market", "sanctioned_counterparty"],
    riskScore: 89,
  },
  similarCases: [
    {
      caseId: "case_001",
      similarity: 0.93,
      wallet: "0x8e9f...",
      decision: "BLOCK",
      description: "Similar mixer usage pattern + ransomware payout cluster",
    },
    {
      caseId: "case_002",
      similarity: 0.81,
      wallet: "0x3a2c...",
      decision: "BLOCK",
      description: "Phishing cash-out cluster with matching timing patterns",
    },
  ],
  agentVersion: "detective_v3",
  evidenceTrace: [
    {
      agent: "Watcher",
      action: "Flagged as HIGH priority",
      timestamp: new Date(Date.now() - 5000).toISOString(),
      details: {
        reason: "Large transaction amount + new wallet",
        priority: "HIGH",
      },
    },
    {
      agent: "Detective",
      action: "TRM Intelligence lookup completed",
      timestamp: new Date(Date.now() - 3000).toISOString(),
      details: {
        tags: ["mixer_exposure", "darknet_market"],
        trmRiskScore: 89,
      },
    },
    {
      agent: "Detective",
      action: "Vector similarity search completed",
      timestamp: new Date(Date.now() - 2000).toISOString(),
      details: {
        matchesFound: 2,
        topSimilarity: 0.93,
      },
    },
    {
      agent: "Guardian",
      action: "Transaction BLOCKED",
      timestamp: new Date().toISOString(),
      details: {
        reason: "Risk score exceeds block threshold (>85)",
        autoBlocked: true,
      },
    },
  ],
  timestamp: new Date().toISOString(),
};

// Mock cases
export const mockCases: CaseSummary[] = [
  {
    caseId: "case_a8f3b2c9",
    transactionId: "tx_a8f3b2c9",
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    amount: 50000,
    currency: "USDC",
    riskScore: 87,
    decision: "BLOCK",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    agentVersion: "detective_v3",
  },
  {
    caseId: "case_b7e2a1d8",
    transactionId: "tx_b7e2a1d8",
    wallet: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    amount: 1200,
    currency: "ETH",
    riskScore: 12,
    decision: "ALLOW",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    agentVersion: "detective_v3",
  },
  {
    caseId: "case_c6d1b0a9",
    transactionId: "tx_c6d1b0a9",
    wallet: "0x1234567890abcdef1234567890abcdef12345678",
    amount: 25000,
    currency: "USDT",
    riskScore: 64,
    decision: "STEP_UP",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    agentVersion: "detective_v3",
  },
];

// Mock case detail
export const mockCaseDetail: CaseDetail = {
  ...mockInvestigation,
  caseId: "case_a8f3b2c9",
  guardianAction: {
    action: "BLOCK",
    reason: "Risk score exceeds block threshold (>85)",
    timestamp: new Date().toISOString(),
  },
  darkWebClusters: [
    {
      clusterId: "cluster_mixer_001",
      description: "Mixer X + ransomware payouts",
      similarity: 0.93,
      tags: ["mixer", "ransomware", "darknet"],
    },
    {
      clusterId: "cluster_phish_042",
      description: "Phishing cash-out cluster",
      similarity: 0.81,
      tags: ["phishing", "cash-out"],
    },
  ],
  narrative:
    "This transaction exhibits multiple high-risk indicators consistent with fraudulent activity. The wallet address shows direct exposure to cryptocurrency mixers commonly used to obscure transaction trails. TRM Intelligence has identified connections to darknet marketplace activity and sanctioned entities. Vector similarity analysis reveals strong correlation (0.93) with previously confirmed fraud cases, particularly those involving ransomware payment flows. The transaction timing and amount pattern match known cash-out behavior. Given the aggregate risk profile, Guardian Agent initiated an automatic block to prevent potential loss.",
};

// Mock agent metrics
export const mockAgentMetrics: Record<string, AgentMetrics> = {
  detective_v2: {
    agentVersion: "detective_v2",
    aps: 0.68,
    apsTrend: -0.05,
    falsePositiveRate: 8.2,
    falseNegativeRate: 4.5,
    lossPrevented: 1250000,
    darkWebSignalUtilization: 42,
    totalCases: 1247,
    period: "Last 30 days",
  },
  detective_v3: {
    agentVersion: "detective_v3",
    aps: 0.85,
    apsTrend: 0.17,
    falsePositiveRate: 3.1,
    falseNegativeRate: 2.8,
    lossPrevented: 2450000,
    darkWebSignalUtilization: 78,
    totalCases: 1583,
    period: "Last 30 days",
  },
  detective_v4: {
    agentVersion: "detective_v4",
    aps: 0.91,
    apsTrend: 0.06,
    falsePositiveRate: 1.9,
    falseNegativeRate: 1.4,
    lossPrevented: 3100000,
    darkWebSignalUtilization: 89,
    totalCases: 892,
    period: "Last 30 days",
  },
};

// Mock metric trends
export const mockMetricTrends: MetricTrend[] = [
  { date: "2024-01-15", value: 0.74, version: "detective_v3" },
  { date: "2024-01-16", value: 0.78, version: "detective_v3" },
  { date: "2024-01-17", value: 0.81, version: "detective_v3" },
  { date: "2024-01-18", value: 0.83, version: "detective_v3" },
  { date: "2024-01-19", value: 0.85, version: "detective_v3" },
  { date: "2024-01-20", value: 0.87, version: "detective_v3" },
  { date: "2024-01-21", value: 0.85, version: "detective_v3" },
  { date: "2024-01-18", value: 0.88, version: "detective_v4" },
  { date: "2024-01-19", value: 0.89, version: "detective_v4" },
  { date: "2024-01-20", value: 0.91, version: "detective_v4" },
  { date: "2024-01-21", value: 0.91, version: "detective_v4" },
];

// Mock playbooks
export const mockPlaybooks: Playbook[] = [
  {
    playbookId: "pb_darkweb_001",
    name: "Darknet Test-Tx Pattern",
    description:
      "Detects many small dark-web–linked test transactions before a big cash-out",
    conditions: [
      "TRM:darknet_market",
      "amount<100",
      "tx_count_24h>20",
      "velocity_high",
    ],
    recommendedAction: "BLOCK",
    confidence: 0.94,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    discoveredBy: "Coach Agent",
    casesMatched: 37,
  },
  {
    playbookId: "pb_mixer_002",
    name: "Mixer Exit Pattern",
    description:
      "Identifies transactions exiting mixers with timing patterns consistent with laundering",
    conditions: [
      "TRM:mixer_exposure",
      "time_since_mix<2h",
      "amount>10000",
      "new_wallet",
    ],
    recommendedAction: "STEP_UP",
    confidence: 0.87,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    discoveredBy: "Coach Agent",
    casesMatched: 52,
  },
  {
    playbookId: "pb_phish_003",
    name: "Phishing Cash-Out Sequence",
    description:
      "Rapid sequence of transactions from phishing-linked wallets to exchanges",
    conditions: [
      "TRM:phishing",
      "destination:exchange",
      "velocity_spike",
      "multiple_sources",
    ],
    recommendedAction: "BLOCK",
    confidence: 0.91,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    discoveredBy: "Coach Agent",
    casesMatched: 28,
  },
  {
    playbookId: "pb_sanction_004",
    name: "Sanctioned Entity Proximity",
    description:
      "Detects transactions within 2 hops of sanctioned addresses",
    conditions: [
      "TRM:sanctioned_counterparty",
      "hops_from_sanction<=2",
      "amount>5000",
    ],
    recommendedAction: "ESCALATE",
    confidence: 0.96,
    createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    discoveredBy: "Coach Agent",
    casesMatched: 15,
  },
];

// Mock activity log
export const mockActivityLog: AgentEvent[] = [
  {
    eventId: "evt_001",
    agent: "Guardian",
    action: "Blocked transaction tx_a8f3b2c9",
    timestamp: new Date(Date.now() - 60000).toISOString(),
    transactionId: "tx_a8f3b2c9",
    details: { riskScore: 87, reason: "Darknet exposure + high similarity" },
  },
  {
    eventId: "evt_002",
    agent: "Detective",
    action: "Retrieved TRM data for wallet 0x742d35Cc...",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    transactionId: "tx_a8f3b2c9",
    details: { tags: ["mixer_exposure", "darknet_market"], trmScore: 89 },
  },
  {
    eventId: "evt_003",
    agent: "Watcher",
    action: "Prioritized transaction tx_a8f3b2c9 as HIGH",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    transactionId: "tx_a8f3b2c9",
    details: { priority: "HIGH", reason: "Large amount + new wallet" },
  },
  {
    eventId: "evt_004",
    agent: "Coach",
    action: "Created playbook pb_darkweb_001",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: {
      playbook: "Darknet Test-Tx Pattern",
      confidence: 0.94,
    },
  },
  {
    eventId: "evt_005",
    agent: "Detective",
    action: "Vector similarity search completed",
    timestamp: new Date(Date.now() - 240000).toISOString(),
    transactionId: "tx_a8f3b2c9",
    details: { matchesFound: 2, topSimilarity: 0.93 },
  },
];
