import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import trmLogo from "@/assets/logos/trm-logo.png";
import redisLogo from "@/assets/logos/redis-logo.png";
import anthropicLogo from "@/assets/logos/anthropic-logo.png";
import awsLogo from "@/assets/logos/aws-logo.png";
import skyflowLogo from "@/assets/logos/skyflow-logo.png";

const Guidelines = () => {
  const agents = [
    {
      name: "Watcher Agent",
      color: "bg-blue-500/10 border-blue-500/30",
      icon: "👁️",
      role: "Event Prioritization",
      responsibilities: [
        "Monitor incoming transactions",
        "Prioritize high-risk events",
        "Log and route to Detective"
      ],
      tech: "Claude AI"
    },
    {
      name: "Detective Agent",
      color: "bg-orange-500/10 border-orange-500/30",
      icon: "🔍",
      role: "Deep Investigation",
      responsibilities: [
        "TRM Labs API lookup",
        "Query Redis long-term memory",
        "Apply playbooks and rules",
        "Gather evidence and context"
      ],
      tech: "Claude AI + Redis + TRM"
    },
    {
      name: "Guardian Agent",
      color: "bg-red-500/10 border-red-500/30",
      icon: "🛡️",
      role: "Decision & Action",
      responsibilities: [
        "Evaluate risk and evidence",
        "Execute policy decisions",
        "Block, allow, or escalate",
        "Trigger step-up authentication"
      ],
      tech: "Policy Engine"
    },
    {
      name: "Coach Agent",
      color: "bg-green-500/10 border-green-500/30",
      icon: "📊",
      role: "Continuous Learning",
      responsibilities: [
        "Analyze true/false positives",
        "Identify pattern gaps",
        "Propose new playbooks",
        "Update thresholds and rules"
      ],
      tech: "Claude AI + Redis"
    }
  ];

  const guidelines = [
    {
      condition: "TRM risk score ≥ 0.9 AND dark-web exposure AND high similarity (>0.85) to ransomware cluster",
      action: "AUTO-BLOCK",
      variant: "danger" as const,
    },
    {
      condition: "TRM risk score ≥ 0.7 with suspicious patterns",
      action: "STEP-UP AUTHENTICATION",
      variant: "warning" as const,
    },
    {
      condition: "TRM risk score ≥ 0.6 but evidence is novel (unknown pattern)",
      action: "ESCALATE TO HUMAN ANALYST",
      variant: "primary" as const,
    },
    {
      condition: "TRM risk < 0.6",
      action: "ALLOW but log for self-improvement",
      variant: "success" as const,
    },
  ];

  const partners = [
    { name: "TRM", logo: trmLogo },
    { name: "Redis", logo: redisLogo },
    { name: "Anthropic", logo: anthropicLogo },
    { name: "AWS", logo: awsLogo },
    { name: "Skyflow", logo: skyflowLogo },
  ];

  const getVariantStyles = (variant: string) => {
    const styles = {
      danger: "bg-danger/10 text-danger border-danger/20",
      warning: "bg-warning/10 text-warning border-warning/20",
      primary: "bg-primary/10 text-primary border-primary/20",
      success: "bg-success/10 text-success border-success/20",
    };
    return styles[variant as keyof typeof styles] || "";
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div>
        <h1 className="text-4xl font-bold mb-2">Architecture and Guidelines</h1>
        <p className="text-muted-foreground">
          Multi-agent system architecture and automated decision-making criteria
        </p>
      </div>

      {/* Architecture Overview */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">System Architecture</h2>
          <p className="text-muted-foreground mb-6">
            Sentinel uses a multi-agent architecture powered by Claude AI, with specialized agents handling different aspects of transaction analysis and risk detection.
          </p>
        </div>

        {/* Architecture Flow Diagram */}
        <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
          <div className="space-y-8">
            {/* Flow Visualization */}
            <div className="flex flex-col items-center space-y-6">
              {/* Transaction Source */}
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-background border-2 border-primary rounded-lg">
                  <span className="text-2xl">💳</span>
                  <span className="font-semibold">Transaction Source</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">App / Exchange / Payment</p>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-border"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-border"></div>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                {agents.map((agent, index) => (
                  <div key={index} className="relative">
                    <Card className={`${agent.color} border-2 p-4 hover:shadow-lg transition-shadow`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl">{agent.icon}</span>
                          <div>
                            <h3 className="font-bold text-sm">{agent.name}</h3>
                            <p className="text-xs text-muted-foreground">{agent.role}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {agent.responsibilities.map((resp, i) => (
                            <p key={i} className="text-xs text-muted-foreground">• {resp}</p>
                          ))}
                        </div>
                        <div className="pt-2 border-t border-border/50">
                          <p className="text-xs font-semibold text-primary">{agent.tech}</p>
                        </div>
                      </div>
                    </Card>
                    {index < agents.length - 1 && (
                      <div className="hidden lg:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-2xl text-border">
                        →
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-border"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-border"></div>
              </div>

              {/* Infrastructure Layer */}
              <div className="w-full">
                <Card className="p-6 bg-background/50 border-2 border-primary/30">
                  <h3 className="font-bold mb-4 text-center">Infrastructure & Data Layer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🗄️</span>
                        <p className="font-semibold">Redis LTM</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Long-term memory: cases, events, playbooks, vectors, metrics
                      </p>
                    </div>
                    <div className="space-y-2 p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔗</span>
                        <p className="font-semibold">TRM Labs</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Blockchain intelligence & dark-web exposure data
                      </p>
                    </div>
                    <div className="space-y-2 p-4 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🔐</span>
                        <p className="font-semibold">Skyflow</p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        PII tokenization vault for secure data handling
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Actions Output */}
              <div className="flex flex-col items-center">
                <div className="w-0.5 h-8 bg-border"></div>
                <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-border"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full">
                <div className="text-center p-4 bg-danger/10 border border-danger/30 rounded-lg">
                  <p className="text-sm font-bold text-danger">🚫 BLOCK</p>
                  <p className="text-xs text-muted-foreground mt-1">High risk detected</p>
                </div>
                <div className="text-center p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-sm font-bold text-warning">🔐 STEP-UP AUTH</p>
                  <p className="text-xs text-muted-foreground mt-1">Additional verification</p>
                </div>
                <div className="text-center p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-sm font-bold text-primary">👤 ESCALATE</p>
                  <p className="text-xs text-muted-foreground mt-1">Human review needed</p>
                </div>
                <div className="text-center p-4 bg-success/10 border border-success/30 rounded-lg">
                  <p className="text-sm font-bold text-success">✓ ALLOW</p>
                  <p className="text-xs text-muted-foreground mt-1">Transaction approved</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Decision Guidelines */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Decision Guidelines</h2>
          <p className="text-muted-foreground">
            Automated decision-making criteria for transaction analysis
          </p>
        </div>

        <Card className="p-6">
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-2/3">Condition</TableHead>
              <TableHead>Guardian Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guidelines.map((guideline, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{guideline.condition}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-md font-semibold border ${getVariantStyles(
                      guideline.variant
                    )}`}
                  >
                    {guideline.action}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          </Table>
        </Card>
      </div>

      <div className="pt-12 border-t border-border">
        <h2 className="text-center text-2xl font-semibold text-foreground mb-8">
          Thanks to the support in building this
        </h2>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center px-6 py-4 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
              style={{ minWidth: "120px" }}
            >
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
