import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { mockAgentMetrics, mockMetricTrends, mockPlaybooks } from "@/data/mock";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function Performance() {
  const [selectedVersion, setSelectedVersion] = useState("detective_v3");
  const metrics = mockAgentMetrics[selectedVersion];

  const chartData = mockMetricTrends.map(trend => ({
    date: new Date(trend.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    [trend.version]: trend.value
  })).reduce((acc, curr) => {
    const existing = acc.find(item => item.date === curr.date);
    if (existing) {
      Object.assign(existing, curr);
    } else {
      acc.push(curr);
    }
    return acc;
  }, [] as any[]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Agent Performance
          </h2>
          <p className="text-muted-foreground">
            Track metrics and self-improvement over time
          </p>
        </div>
        <Select value={selectedVersion} onValueChange={setSelectedVersion}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="detective_v2">detective_v2</SelectItem>
            <SelectItem value="detective_v3">detective_v3</SelectItem>
            <SelectItem value="detective_v4">detective_v4</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Agent Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-foreground">
                {(metrics.aps * 100).toFixed(0)}
                <span className="text-lg text-muted-foreground">/100</span>
              </p>
              <Badge
                variant="outline"
                className={
                  metrics.apsTrend > 0
                    ? "bg-success/10 text-success border-success/20"
                    : "bg-danger/10 text-danger border-danger/20"
                }
              >
                {metrics.apsTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {metrics.apsTrend > 0 ? "+" : ""}
                {(metrics.apsTrend * 100).toFixed(1)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              False Positive Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {metrics.falsePositiveRate.toFixed(1)}
              <span className="text-lg text-muted-foreground">%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              False Negative Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {metrics.falseNegativeRate.toFixed(1)}
              <span className="text-lg text-muted-foreground">%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Loss Prevented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-success">
              ${(metrics.lossPrevented / 1000000).toFixed(2)}M
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Dark Web Signal Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {metrics.darkWebSignalUtilization}
              <span className="text-lg text-muted-foreground">%</span>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">
              {metrics.totalCases.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Chart */}
      <Card className="bg-card border-border mb-8">
        <CardHeader>
          <CardTitle className="text-lg">APS Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
                domain={[0.6, 1]}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="detective_v3" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
                name="v3"
              />
              <Line 
                type="monotone" 
                dataKey="detective_v4" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))' }}
                name="v4"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recently Learned */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg">What Sentinel Learned Recently</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPlaybooks.slice(0, 3).map((playbook) => (
              <div
                key={playbook.playbookId}
                className="p-4 rounded-lg border border-border bg-muted/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground mb-1">
                      {playbook.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {playbook.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {(playbook.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Discovered by: {playbook.discoveredBy}</span>
                  <span>•</span>
                  <span>
                    {new Date(playbook.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
