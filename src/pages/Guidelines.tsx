import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";

const Guidelines = () => {
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
    { name: "Redis", color: "#DC382D" },
    { name: "Anthropic", color: "#191919" },
    { name: "AWS", color: "#FF9900" },
    { name: "Skyflow", color: "#0066FF" },
    { name: "Cursor", color: "#000000" },
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
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">Decision Guidelines</h1>
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

      <div className="pt-12 border-t border-border">
        <p className="text-center text-sm text-muted-foreground mb-6">
          Thanks to the support in building this
        </p>
        <div className="flex justify-center items-center gap-8 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center justify-center px-6 py-3 rounded-lg bg-card border border-border hover:shadow-md transition-shadow"
              style={{ minWidth: "120px" }}
            >
              <span
                className="text-xl font-bold"
                style={{ color: partner.color }}
              >
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
