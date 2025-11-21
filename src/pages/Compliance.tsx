import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle2, AlertTriangle, Globe, Eye, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Compliance = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('compliance_metrics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching compliance metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Loading compliance data...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Compliance Dashboard</h1>
        <p className="text-muted-foreground">
          Privacy-first architecture with Skyflow tokenization and GDPR compliance
        </p>
      </div>

      {/* Compliance Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-success/10 to-success/5 border-success/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-success/20 rounded-lg">
              <Shield className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">GDPR Compliance</p>
              <p className="text-2xl font-bold text-success">
                {metrics?.gdpr_compliant ? "Compliant" : "Non-Compliant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <span>All PII tokenized via Skyflow</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CCPA Compliance</p>
              <p className="text-2xl font-bold text-primary">
                {metrics?.ccpa_compliant ? "Compliant" : "Non-Compliant"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Data subject rights enabled</span>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Globe className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data Residency</p>
              <p className="text-2xl font-bold">{metrics?.data_residency || "US"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
            <span>Skyflow vault region</span>
          </div>
        </Card>
      </div>

      {/* Tokenization Coverage */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          PII Tokenization Coverage
        </h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Fields Tokenized</span>
              <span className="text-sm font-bold">
                {metrics?.tokenized_fields} / {metrics?.total_pii_fields} fields 
                ({metrics?.tokenization_percentage}%)
              </span>
            </div>
            <Progress value={metrics?.tokenization_percentage || 0} className="h-2" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Name</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">Tokenized via Skyflow</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Email</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">Tokenized via Skyflow</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Phone</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">Tokenized via Skyflow</p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span className="text-sm font-semibold">Address</span>
              </div>
              <p className="text-xs text-muted-foreground pl-6">Tokenized via Skyflow</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Data Access Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Data Access Audit
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Detokenization Requests</p>
                <p className="text-xs text-muted-foreground">Total API calls to Skyflow</p>
              </div>
              <span className="text-2xl font-bold">{metrics?.detokenization_requests || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="font-semibold">Analyst Access Count</p>
                <p className="text-xs text-muted-foreground">Human reviews with PII</p>
              </div>
              <span className="text-2xl font-bold">{metrics?.analyst_access_count || 0}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            All data access is logged and auditable for compliance
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Data Retention Policy
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Right to Be Forgotten</p>
                <p className="text-xs text-muted-foreground">
                  Single API call to Skyflow deletes all PII permanently
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Automated Retention</p>
                <p className="text-xs text-muted-foreground">
                  90-day automatic deletion for closed cases
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Audit Trail</p>
                <p className="text-xs text-muted-foreground">
                  Complete history of data access and deletion
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Architecture Diagram */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
        <h3 className="text-lg font-semibold mb-4">Privacy-First Architecture</h3>
        <div className="flex flex-col items-center space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
            <div className="p-4 bg-background rounded-lg border space-y-2">
              <p className="font-bold text-sm">1. Input</p>
              <p className="text-xs text-muted-foreground">User submits transaction with PII</p>
              <div className="text-xs font-mono bg-muted p-2 rounded">
                name, email, phone, address
              </div>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30 space-y-2">
              <p className="font-bold text-sm text-primary">2. Skyflow Tokenization</p>
              <p className="text-xs text-muted-foreground">PII → Tokens instantly</p>
              <div className="text-xs font-mono bg-background p-2 rounded">
                sky_abc123, sky_def456...
              </div>
            </div>
            <div className="p-4 bg-success/10 rounded-lg border border-success/30 space-y-2">
              <p className="font-bold text-sm text-success">3. Secure Storage</p>
              <p className="text-xs text-muted-foreground">Only tokens in database</p>
              <div className="text-xs font-mono bg-background p-2 rounded">
                GDPR compliant ✓
              </div>
            </div>
          </div>
          
          <div className="w-full p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
            <p className="font-bold text-sm mb-2">4. TRM Risk Analysis</p>
            <p className="text-xs text-muted-foreground mb-2">
              Fraud detection works on blockchain data (wallet address) - NO PII NEEDED for screening
            </p>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-500" />
              <span className="text-xs">Detective Agent analyzes risk without accessing customer identity</span>
            </div>
          </div>

          <div className="w-full p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
            <p className="font-bold text-sm mb-2">5. Analyst Review (If Needed)</p>
            <p className="text-xs text-muted-foreground">
              Only when human review is required, detokenize via Skyflow API (logged and audited)
            </p>
          </div>
        </div>
      </Card>

      {/* Compliance Benefits */}
      <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30">
        <h3 className="text-xl font-semibold mb-4">✅ Why This Architecture Wins</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Traditional Fraud Systems</p>
                <p className="text-xs text-muted-foreground">
                  Store raw PII → GDPR violations → Data breach exposes customers → Fines & lawsuits
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Sentinel + Skyflow</p>
                <p className="text-xs text-muted-foreground">
                  Zero raw PII → GDPR compliant → Data breach = useless tokens → Customer trust
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Compliance;
