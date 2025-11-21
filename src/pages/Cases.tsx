import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { DecisionBadge } from "@/components/DecisionBadge";
import { mockCases, mockCaseDetail } from "@/data/mock";
import { CaseSummary } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

export default function Cases() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const caseDetail = selectedCase ? mockCaseDetail : null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Cases</h2>
        <p className="text-muted-foreground">
          Review and analyze investigated transactions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case List */}
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Recent Cases</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockCases.map((case_) => (
              <button
                key={case_.caseId}
                onClick={() => setSelectedCase(case_.caseId)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedCase === case_.caseId
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 bg-muted/30"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-mono text-muted-foreground">
                    {case_.transactionId}
                  </p>
                  <RiskBadge score={case_.riskScore} />
                </div>
                <p className="text-xs font-mono text-muted-foreground mb-2 truncate">
                  {case_.wallet}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">
                    {case_.amount.toLocaleString()} {case_.currency}
                  </p>
                  <DecisionBadge decision={case_.decision as any} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDistanceToNow(new Date(case_.timestamp), {
                    addSuffix: true,
                  })}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Case Detail */}
        <div className="lg:col-span-2 space-y-6">
          {caseDetail ? (
            <>
              {/* Header */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        Case Detail
                      </CardTitle>
                      <p className="text-sm font-mono text-muted-foreground">
                        {caseDetail.transactionId}
                      </p>
                    </div>
                    <DecisionBadge decision={caseDetail.decision} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Amount
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        50,000 USDC
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Risk Score
                      </p>
                      <RiskBadge score={caseDetail.riskScore} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Agent Version
                      </p>
                      <p className="text-sm font-semibold text-primary">
                        {caseDetail.agentVersion}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Wallet
                    </p>
                    <p className="text-sm font-mono text-foreground break-all">
                      {caseDetail.wallet}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* TRM Intelligence */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">TRM Intelligence</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Risk Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {caseDetail.trmSummary.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="bg-danger/10 text-danger border-danger/20"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        TRM Risk Score
                      </p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-danger transition-all"
                          style={{
                            width: `${caseDetail.trmSummary.riskScore}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {caseDetail.trmSummary.riskScore}/100
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Dark Web Clusters */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Dark Web Clusters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {caseDetail.darkWebClusters.map((cluster) => (
                      <div
                        key={cluster.clusterId}
                        className="p-3 rounded-lg bg-muted/30 border border-border"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-sm font-semibold text-foreground">
                            {cluster.description}
                          </p>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {(cluster.similarity * 100).toFixed(0)}%
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cluster.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-muted text-muted-foreground border-border"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Agent Narrative */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Agent Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground leading-relaxed">
                    {caseDetail.narrative}
                  </p>
                </CardContent>
              </Card>

              {/* Guardian Action */}
              {caseDetail.guardianAction && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-lg">Guardian Action</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Action</p>
                      <DecisionBadge
                        decision={caseDetail.guardianAction.action as any}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Reason
                      </p>
                      <p className="text-sm text-foreground">
                        {caseDetail.guardianAction.reason}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Timestamp
                      </p>
                      <p className="text-sm font-mono text-foreground">
                        {new Date(
                          caseDetail.guardianAction.timestamp
                        ).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">
                  Select a case from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
