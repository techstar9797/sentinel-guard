import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockPlaybooks } from "@/data/mock";
import { formatDistanceToNow } from "date-fns";
import { BookOpen, Target } from "lucide-react";

export default function Playbooks() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Playbooks & Patterns
        </h2>
        <p className="text-muted-foreground">
          Fraud patterns learned and refined by the Coach Agent
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockPlaybooks.map((playbook) => (
          <Card key={playbook.playbookId} className="bg-card border-border">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg mb-1">
                      {playbook.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {playbook.description}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-success/10 text-success border-success/20"
                >
                  {(playbook.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Conditions
                </p>
                <div className="flex flex-wrap gap-2">
                  {playbook.conditions.map((condition, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-muted text-muted-foreground border-border font-mono text-xs"
                    >
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Recommended Action
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        playbook.recommendedAction === "BLOCK"
                          ? "bg-danger/10 text-danger border-danger/20"
                          : playbook.recommendedAction === "STEP_UP"
                          ? "bg-warning/10 text-warning border-warning/20"
                          : "bg-primary/10 text-primary border-primary/20"
                      }
                    >
                      {playbook.recommendedAction}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Cases Matched
                    </p>
                    <p className="text-sm font-semibold text-foreground">
                      {playbook.casesMatched}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Discovered by: {playbook.discoveredBy}</span>
                <span>
                  {formatDistanceToNow(new Date(playbook.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
