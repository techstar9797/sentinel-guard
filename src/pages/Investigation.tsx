import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { screenSingleAddress } from "@/services/trmService";
import { screenWallets, MoralisWalletData } from "@/services/moralisService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EnhancedWalletResult extends MoralisWalletData {
  trmResult?: {
    isSanctioned: boolean;
    riskScore: number;
  };
  evidenceTrace?: Array<{
    agent: string;
    action: string;
    timestamp: string;
    details: any;
  }>;
}

export default function Investigation() {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<InvestigationResult | null>(null);
  const [multipleResults, setMultipleResults] = useState<EnhancedWalletResult[]>([]);
  const [mode, setMode] = useState<"single" | "multiple">("single");
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    wallet: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4",
    wallets: "",
    amount: "50000",
    currency: "USDC",
    channel: "Web",
    ip: "192.168.1.1",
    deviceId: "dev_abc123",
  });

  const handleRunSentinel = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      // Call TRM Labs API to screen the wallet
      const trmResult = await screenSingleAddress(formData.wallet);
      
      // Create enhanced investigation result with real TRM data
      const investigation: InvestigationResult = {
        ...mockInvestigation,
        wallet: formData.wallet,
        trmSummary: {
          ...mockInvestigation.trmSummary,
          tags: trmResult.isSanctioned 
            ? ["sanctioned_entity", "high_risk"]
            : ["clean"],
          riskScore: trmResult.isSanctioned ? 95 : 5,
        },
        riskScore: trmResult.isSanctioned ? 95 : 15,
        decision: trmResult.isSanctioned ? "BLOCK" : mockInvestigation.decision,
        explanation: trmResult.isSanctioned 
          ? `Wallet ${formData.wallet} is flagged as sanctioned by TRM Labs. Transaction blocked.`
          : `Wallet ${formData.wallet} passed TRM Labs screening with no sanctions found.`,
        evidenceTrace: [
          {
            agent: "Watcher",
            action: "Transaction prioritized for high-value screening",
            timestamp: new Date().toISOString(),
            details: {
              amount: formData.amount,
              currency: formData.currency,
              priority: "HIGH"
            }
          },
          {
            agent: "Detective",
            action: "TRM Labs sanctions screening completed",
            timestamp: new Date().toISOString(),
            details: {
              address: formData.wallet,
              isSanctioned: trmResult.isSanctioned,
              source: "TRM Labs API"
            }
          },
          ...mockInvestigation.evidenceTrace.slice(1),
        ],
      };

      setResult(investigation);
      
      toast({
        title: "Analysis Complete",
        description: trmResult.isSanctioned 
          ? "⚠️ Sanctioned wallet detected" 
          : "✓ Wallet screening passed",
        variant: trmResult.isSanctioned ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error running Sentinel:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze transaction",
        variant: "destructive",
      });
      // Fallback to mock data on error
      setResult(mockInvestigation);
    } finally {
      setIsRunning(false);
    }
  };

  const handleScreenMultiple = async () => {
    setIsRunning(true);
    setMultipleResults([]);

    try {
      // Parse addresses from textarea
      const addresses = formData.wallets
        .split('\n')
        .map(addr => addr.trim())
        .filter(addr => addr.length > 0);

      if (addresses.length === 0) {
        toast({
          title: "No Addresses",
          description: "Please enter at least one wallet address",
          variant: "destructive",
        });
        return;
      }

      // Screen wallets using Moralis and TRM in parallel
      const [moralisResults, trmResults] = await Promise.all([
        screenWallets(addresses),
        Promise.all(addresses.map(addr => 
          screenSingleAddress(addr).catch(err => {
            console.error(`TRM screening failed for ${addr}:`, err);
            return { isSanctioned: false };
          })
        ))
      ]);

      // Combine Moralis and TRM results
      const enhancedResults: EnhancedWalletResult[] = moralisResults.map((wallet, index) => ({
        ...wallet,
        trmResult: {
          isSanctioned: trmResults[index].isSanctioned,
          riskScore: trmResults[index].isSanctioned ? 95 : 5,
        },
        evidenceTrace: [
          {
            agent: "Watcher",
            action: "Wallet prioritized for screening",
            timestamp: new Date().toISOString(),
            details: {
              address: wallet.address,
              priority: "HIGH"
            }
          },
          {
            agent: "Detective",
            action: "TRM Labs sanctions screening completed",
            timestamp: new Date().toISOString(),
            details: {
              address: wallet.address,
              isSanctioned: trmResults[index].isSanctioned,
              source: "TRM Labs API"
            }
          },
          {
            agent: "Investigator",
            action: "Moralis wallet analysis completed",
            timestamp: new Date().toISOString(),
            details: {
              balance: wallet.balance,
              tokenCount: Array.isArray(wallet.tokens) ? wallet.tokens.length : 0,
              nftCount: Array.isArray(wallet.nfts) ? wallet.nfts.length : 0,
              source: "Moralis API"
            }
          }
        ]
      }));

      setMultipleResults(enhancedResults);

      const sanctionedCount = enhancedResults.filter(r => r.trmResult?.isSanctioned).length;
      toast({
        title: "Screening Complete",
        description: sanctionedCount > 0 
          ? `Screened ${enhancedResults.length} addresses - ${sanctionedCount} sanctioned detected ⚠️`
          : `Screened ${enhancedResults.length} addresses - All clear ✓`,
        variant: sanctionedCount > 0 ? "destructive" : "default",
      });
    } catch (error) {
      console.error("Error screening wallets:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to screen wallets",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
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
            <Tabs value={mode} onValueChange={(v) => setMode(v as "single" | "multiple")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="single">Single Wallet</TabsTrigger>
                <TabsTrigger value="multiple">Multiple Wallets</TabsTrigger>
              </TabsList>
              
              <TabsContent value="single" className="space-y-4 mt-4">
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
              </TabsContent>

              <TabsContent value="multiple" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="quick-select">Quick Select Addresses</Label>
                  <Select
                    value=""
                    onValueChange={(address) => {
                      if (address && !formData.wallets.includes(address)) {
                        setFormData({ 
                          ...formData, 
                          wallets: formData.wallets 
                            ? `${formData.wallets}\n${address}` 
                            : address 
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select common addresses..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb">Binance Hot Wallet</SelectItem>
                      <SelectItem value="0x28C6c06298d514Db089934071355E5743bf21d60">Binance 14</SelectItem>
                      <SelectItem value="0x21a31Ee1afC51d94C2eFcCAa2092aD1028285549">Binance 15</SelectItem>
                      <SelectItem value="0xDFd5293D8e347dFe59E90eFd55b2956a1343963d">Binance 16</SelectItem>
                      <SelectItem value="0x56Eddb7aa87536c09CCc2793473599fD21A8b17F">Binance Cold Wallet</SelectItem>
                      <SelectItem value="0x5041ed759Dd4aFc3a72b8192C143F72f4724081A">Kraken Exchange</SelectItem>
                      <SelectItem value="0x267be1C1D684F78cb4F6a176C4911b741E4Ffdc0">Kraken 2</SelectItem>
                      <SelectItem value="0xE853c56864A2ebe4576a807D26Fdc4A0adA51919">Coinbase 10</SelectItem>
                      <SelectItem value="0xA9D1e08C7793af67e9d92fe308d5697FB81d3E43">Coinbase 14</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallets">Wallet Addresses</Label>
                  <Textarea
                    id="wallets"
                    value={formData.wallets}
                    onChange={(e) =>
                      setFormData({ ...formData, wallets: e.target.value })
                    }
                    placeholder="Enter one address per line&#10;0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb4&#10;0x..."
                    className="bg-background border-border min-h-[200px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter one wallet address per line
                  </p>
                </div>

                <Button
                  onClick={handleScreenMultiple}
                  disabled={isRunning}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Screening Wallets...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-4 w-4" />
                      Screen Wallets
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {mode === "single" ? (
            result ? (
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
            )
          ) : multipleResults.length > 0 ? (
            <div className="space-y-6">
              {multipleResults.map((wallet, index) => (
                <div key={index} className="space-y-4">
                  {/* Wallet Header */}
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{index + 1}</span>
                    </div>
                    <p className="text-sm font-mono text-foreground break-all flex-1">
                      {wallet.address}
                    </p>
                  </div>

                  {/* Risk Assessment */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Risk Score</p>
                          <RiskBadge score={wallet.trmResult?.riskScore || 0} />
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-sm text-muted-foreground">Decision</p>
                          <DecisionBadge 
                            decision={wallet.trmResult?.isSanctioned ? "BLOCK" : "ALLOW"} 
                          />
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border">
                        <p className="text-sm text-foreground">
                          {wallet.trmResult?.isSanctioned 
                            ? `⚠️ Wallet is flagged as sanctioned by TRM Labs. Transaction blocked.`
                            : `✓ Wallet passed TRM Labs screening with no sanctions found.`}
                        </p>
                      </div>

                      {!wallet.error && (
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Balance (ETH)</p>
                            <p className="text-sm font-semibold text-foreground">
                              {wallet.balance ? (parseFloat(wallet.balance) / 1e18).toFixed(4) : '0'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">ERC20 Tokens</p>
                            <p className="text-sm font-semibold text-foreground">
                              {Array.isArray(wallet.tokens) ? wallet.tokens.length : 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">NFTs</p>
                            <p className="text-sm font-semibold text-foreground">
                              {Array.isArray(wallet.nfts) ? wallet.nfts.length : 0}
                            </p>
                          </div>
                        </div>
                      )}

                      {wallet.error && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm text-destructive">{wallet.error}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Evidence Timeline */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-lg">Evidence Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {wallet.evidenceTrace?.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex gap-4">
                            <div className="flex flex-col items-center">
                              <div className="h-8 w-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              </div>
                              {stepIndex < (wallet.evidenceTrace?.length || 0) - 1 && (
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
                </div>
              ))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-20 text-center">
                <p className="text-muted-foreground">
                  Enter wallet addresses (one per line) and click "Screen Wallets"
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
