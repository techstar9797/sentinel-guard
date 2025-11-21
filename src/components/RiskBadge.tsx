import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  score: number;
  className?: string;
}

export function RiskBadge({ score, className }: RiskBadgeProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 85) return { label: "CRITICAL", variant: "danger" as const };
    if (score >= 70) return { label: "HIGH", variant: "danger" as const };
    if (score >= 40) return { label: "MEDIUM", variant: "warning" as const };
    return { label: "LOW", variant: "success" as const };
  };

  const { label, variant } = getRiskLevel(score);

  const variantStyles = {
    success: "bg-success/10 text-success border-success/20",
    warning: "bg-warning/10 text-warning border-warning/20",
    danger: "bg-danger/10 text-danger border-danger/20",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold px-3 py-1",
        variantStyles[variant],
        className
      )}
    >
      {label} ({score})
    </Badge>
  );
}
