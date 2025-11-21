import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskBadge } from "@/components/RiskBadge";
import { DecisionBadge } from "@/components/DecisionBadge";
import { mockInvestigation } from "@/data/mock";
import { InvestigationResult } from "@/types";
import { Loader2, Play } from "lucide-react";

export default function Investigation() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [formData, setFormData] = useState({
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    amount: "50000",
    currency: "USDC",
    channel: "Web",
    ip: "192.168.1.1",
    deviceId: "dev_abc123",
  });

  const handleRunSentinel = async () => {
    setIsRunning(true);
    setResult(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setResult(mockInvestigation);
    setIsRunning(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Live Investigation
        </h2>
        <p className="text-muted-foreground">
          Analyze transactions in real-time with Sentinel's autonomous agents
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <Card className="lg:col-span-1 bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg">Transaction Input</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet Address</Label>
              <Input
                id="wallet"
                value={formData.wallet}
                onChange={(e) =>
                  setFormData({ ...formData, wallet: e.target.value })
                }
                placeholder="0x..."
                className="bg-background border-border"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    setFormData({ ...formData, currency: value })
                  }
                >
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="BTC">BTC</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="channel">Channel</Label>
              <Select
                value={formData.channel}
                onValueChange={(value) =>
                  setFormData({ ...formData, channel: value })
                }
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Web">Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="API">API</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ip">IP Address</Label>
              <Input
                id="ip"
                value={formData.ip}
                onChange={(e) =>
                  setFormData({ ...formData, ip: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deviceId">Device ID</Label>
              <Input
                id="deviceId"
                value={formData.deviceId}
                onChange={(e) =>
                  setFormData({ ...formData, deviceId: e.target.value })
                }
                className="bg-background border-border"
              />
            </div>

            <Button
              onClick={handleRunSentinel}
              disabled={isRunning}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              size="lg"
            >
              {isRunning ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Analysis...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Sentinel
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result ? (
            <>
              {/* Risk Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Risk Score
                      </p>
                      <RiskBadge score={result.riskScore} />
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-sm text-muted-foreground">Decision</p>
                      <DecisionBadge decision={result.decision} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-foreground">
                      {result.explanation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        TRM Risk Score
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {result.trmSummary.riskScore}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Agent Version
                      </p>
                      <p className="text-lg font-semibold text-primary">
                        {result.agentVersion}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Timeline */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">Evidence Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {result.evidenceTrace.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                          </div>
                          {index < result.evidenceTrace.length - 1 && (
                            <div className="flex-1 w-px bg-border min-h-[40px]" />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-start justify-between mb-1">
                            <p className="text-sm font-semibold text-foreground">
                              {step.agent} Agent
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(step.timestamp)}
                            </p>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {step.action}
                          </p>
                          <div className="bg-muted/30 rounded-lg p-3">
                            <pre className="text-xs text-muted-foreground overflow-x-auto">
                              {JSON.stringify(step.details, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">
                  Enter transaction details and click "Run Sentinel" to begin
                  analysis
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
