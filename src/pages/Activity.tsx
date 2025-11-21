import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { mockActivityLog } from "@/data/mock";
import { formatDistanceToNow } from "date-fns";
import { Eye, Search, Shield, Brain } from "lucide-react";

const agentIcons = {
  Watcher: Eye,
  Detective: Search,
  Guardian: Shield,
  Coach: Brain,
};

const agentColors = {
  Watcher: "bg-primary/10 text-primary border-primary/20",
  Detective: "bg-success/10 text-success border-success/20",
  Guardian: "bg-danger/10 text-danger border-danger/20",
  Coach: "bg-warning/10 text-warning border-warning/20",
};

export default function Activity() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Activity Log
          </h2>
          <p className="text-muted-foreground">
            Chronological record of all agent actions
          </p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Filter by agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Agents</SelectItem>
              <SelectItem value="watcher">Watcher</SelectItem>
              <SelectItem value="detective">Detective</SelectItem>
              <SelectItem value="guardian">Guardian</SelectItem>
              <SelectItem value="coach">Coach</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="block">Blocks</SelectItem>
              <SelectItem value="step-up">Step-Ups</SelectItem>
              <SelectItem value="allow">Allows</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockActivityLog.map((event) => {
              const Icon = agentIcons[event.agent];
              return (
                <div
                  key={event.eventId}
                  className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        agentColors[event.agent]
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge
                            variant="outline"
                            className={`mb-2 ${agentColors[event.agent]}`}
                          >
                            {event.agent}
                          </Badge>
                          <p className="text-sm font-semibold text-foreground">
                            {event.action}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.timestamp), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {event.transactionId && (
                        <p className="text-xs font-mono text-muted-foreground mb-2">
                          Transaction: {event.transactionId}
                        </p>
                      )}
                      <details className="mt-2">
                        <summary className="text-xs text-primary cursor-pointer hover:underline">
                          View details
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-background border border-border">
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
                            {JSON.stringify(event.details, null, 2)}
                          </pre>
                        </div>
                      </details>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
