import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldOff, Eye, EyeOff, AlertTriangle } from "lucide-react";

const DemoPrivacy = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, San Francisco, CA 94102"
  });

  const [withPrivacy, setWithPrivacy] = useState<any>(null);
  const [withoutPrivacy, setWithoutPrivacy] = useState<any>(null);
  const [showDecrypted, setShowDecrypted] = useState(false);

  const handleScreen = async (usePrivacy: boolean) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('screen-with-privacy', {
        body: {
          walletAddress: formData.walletAddress,
          piiData: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address
          },
          usePrivacy
        }
      });

      if (error) throw error;

      if (usePrivacy) {
        setWithPrivacy(data);
      } else {
        setWithoutPrivacy(data);
      }

      toast({
        title: "Screening Complete",
        description: usePrivacy 
          ? "Transaction screened with Skyflow privacy protection" 
          : "Transaction screened without privacy protection"
      });
    } catch (error) {
      console.error('Screening error:', error);
      toast({
        title: "Error",
        description: "Failed to screen transaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetokenize = async () => {
    if (!withPrivacy?.tokens) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('skyflow-detokenize', {
        body: { tokens: withPrivacy.tokens }
      });

      if (error) throw error;

      setShowDecrypted(true);
      toast({
        title: "Data Detokenized",
        description: data.warning,
        variant: "default"
      });
    } catch (error) {
      console.error('Detokenization error:', error);
      toast({
        title: "Error",
        description: "Failed to detokenize data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Privacy-First Fraud Detection Demo</h1>
        <p className="text-muted-foreground">
          Compare fraud detection with and without Skyflow PII tokenization
        </p>
      </div>

      {/* Input Form */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Wallet Address</Label>
            <Input
              value={formData.walletAddress}
              onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
              placeholder="0x..."
            />
          </div>
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              type="email"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <Button 
            onClick={() => handleScreen(false)}
            disabled={loading}
            variant="outline"
            className="flex-1"
          >
            <ShieldOff className="mr-2 h-4 w-4" />
            Screen WITHOUT Skyflow
          </Button>
          <Button 
            onClick={() => handleScreen(true)}
            disabled={loading}
            className="flex-1"
          >
            <Shield className="mr-2 h-4 w-4" />
            Screen WITH Skyflow
          </Button>
        </div>
      </Card>

      {/* Comparison View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Without Skyflow */}
        <Card className="p-6 border-2 border-destructive/30 bg-destructive/5">
          <div className="flex items-center gap-2 mb-4">
            <ShieldOff className="h-5 w-5 text-destructive" />
            <h3 className="text-lg font-semibold">Without Skyflow</h3>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded">
                ⚠️ GDPR Risk
              </span>
            </div>
          </div>

          {withoutPrivacy ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Database Storage</p>
                <div className="bg-background p-3 rounded border space-y-1 text-sm font-mono">
                  <p className="text-destructive">name: "{formData.name}"</p>
                  <p className="text-destructive">email: "{formData.email}"</p>
                  <p className="text-destructive">phone: "{formData.phone}"</p>
                  <p className="text-destructive">address: "{formData.address}"</p>
                  <p>wallet: "{formData.walletAddress}"</p>
                  <p>risk_score: {withoutPrivacy.trmData.riskScore}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Compliance Issues:</p>
                <ul className="space-y-1 text-sm text-destructive">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Raw PII stored in database (GDPR violation risk)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Data breach exposes customer identities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Cannot enforce data residency requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>"Right to be forgotten" requires manual cleanup</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm">
                  <span className="font-semibold">TRM Decision:</span>{" "}
                  <span className={`font-bold ${
                    withoutPrivacy.case.decision === 'blocked' ? 'text-destructive' :
                    withoutPrivacy.case.decision === 'review' ? 'text-warning' : 'text-success'
                  }`}>
                    {withoutPrivacy.case.decision.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Screen WITHOUT Skyflow" to see traditional approach
            </p>
          )}
        </Card>

        {/* With Skyflow */}
        <Card className="p-6 border-2 border-success/30 bg-success/5">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold">With Skyflow</h3>
            <div className="ml-auto">
              <span className="text-xs px-2 py-1 bg-success/20 text-success rounded">
                ✓ GDPR Compliant
              </span>
            </div>
          </div>

          {withPrivacy ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-muted-foreground">Database Storage</p>
                <div className="bg-background p-3 rounded border space-y-1 text-sm font-mono">
                  <p className="text-success">name_token: "{withPrivacy.tokens.name_token}"</p>
                  <p className="text-success">email_token: "{withPrivacy.tokens.email_token}"</p>
                  <p className="text-success">phone_token: "{withPrivacy.tokens.phone_token}"</p>
                  <p className="text-success">address_token: "{withPrivacy.tokens.address_token}"</p>
                  <p>wallet: "{formData.walletAddress}"</p>
                  <p>risk_score: {withPrivacy.trmData.riskScore}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Compliance Benefits:</p>
                <ul className="space-y-1 text-sm text-success">
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Zero raw PII in database (GDPR compliant)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Data breach reveals only tokens, not identities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Enforced data residency via Skyflow vault</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>"Right to be forgotten" via single API call</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t space-y-3">
                <p className="text-sm">
                  <span className="font-semibold">TRM Decision:</span>{" "}
                  <span className={`font-bold ${
                    withPrivacy.case.decision === 'blocked' ? 'text-destructive' :
                    withPrivacy.case.decision === 'review' ? 'text-warning' : 'text-success'
                  }`}>
                    {withPrivacy.case.decision.toUpperCase()}
                  </span>
                </p>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDetokenize}
                  disabled={loading}
                  className="w-full"
                >
                  {showDecrypted ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
                  {showDecrypted ? "Data Decrypted (Analyst View)" : "Detokenize for Review (Audited)"}
                </Button>

                {showDecrypted && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded space-y-1 text-sm">
                    <p className="font-semibold text-yellow-700 dark:text-yellow-500">🔓 Decrypted Data (Audit Logged)</p>
                    <p>Name: {formData.name}</p>
                    <p>Email: {formData.email}</p>
                    <p>Phone: {formData.phone}</p>
                    <p>Address: {formData.address}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This detokenization was logged for compliance audit
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Click "Screen WITH Skyflow" to see privacy-first approach
            </p>
          )}
        </Card>
      </div>

      {/* Key Takeaway */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
        <h3 className="text-xl font-semibold mb-3">🎯 Key Takeaway</h3>
        <p className="text-sm leading-relaxed">
          <strong>Autonomous Fraud Guard Sentinel</strong> detects the same threats with or without Skyflow—
          but <strong>WITH Skyflow</strong>, you get GDPR compliance, data breach protection, and customer trust 
          without sacrificing detection accuracy. Catch criminals, protect privacy.
        </p>
      </Card>
    </div>
  );
};

export default DemoPrivacy;
