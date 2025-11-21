import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Ban, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DecisionBadgeProps {
  decision: "ALLOW" | "STEP_UP" | "BLOCK" | "ESCALATE";
  className?: string;
}

export function DecisionBadge({ decision, className }: DecisionBadgeProps) {
  const config = {
    ALLOW: {
      icon: Shield,
      label: "Allow",
      className: "bg-success/10 text-success border-success/20",
    },
    STEP_UP: {
      icon: AlertTriangle,
      label: "Step-Up Auth",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    BLOCK: {
      icon: Ban,
      label: "Block",
      className: "bg-danger/10 text-danger border-danger/20",
    },
    ESCALATE: {
      icon: AlertCircle,
      label: "Escalate",
      className: "bg-primary/10 text-primary border-primary/20",
    },
  };

  const { icon: Icon, label, className: variantClass } = config[decision];

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold px-3 py-1 flex items-center gap-1.5",
        variantClass,
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Badge>
  );
}
