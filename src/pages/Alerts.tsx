import { useState } from 'react';
import { Bell, Check, Filter, AlertTriangle, ThermometerSun, Zap, Gauge, Activity } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockAlerts } from '@/data/mockData';
import { Alert, AlertSeverity, MetricType } from '@/types/maintenance';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const metricIcons: Record<MetricType, React.ElementType> = {
  temperature: ThermometerSun,
  current: Zap,
  pressure: Gauge,
  vibration: Activity,
  humidity: Activity,
};

const severityConfig: Record<AlertSeverity, { 
  label: string; 
  className: string;
  bgClass: string;
}> = {
  critical: { 
    label: 'Critical', 
    className: 'bg-destructive text-destructive-foreground',
    bgClass: 'bg-destructive/10 border-destructive/30',
  },
  high: { 
    label: 'High', 
    className: 'bg-warning text-warning-foreground',
    bgClass: 'bg-warning/10 border-warning/30',
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-info text-info-foreground',
    bgClass: 'bg-info/10 border-info/30',
  },
  low: { 
    label: 'Low', 
    className: 'bg-muted text-muted-foreground',
    bgClass: 'bg-muted/50 border-border',
  },
};

export default function Alerts() {
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(a => 
      a.id === id ? { ...a, acknowledged: true } : a
    ));
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !alert.resolvedAt && !alert.acknowledged) ||
      (statusFilter === 'acknowledged' && alert.acknowledged && !alert.resolvedAt) ||
      (statusFilter === 'resolved' && alert.resolvedAt);
    
    return matchesSeverity && matchesStatus;
  });

  const activeCount = alerts.filter(a => !a.resolvedAt && !a.acknowledged).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.resolvedAt).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Alert Center</h1>
          <p className="text-muted-foreground">
            Monitor and manage CBM threshold violations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <span className="font-mono text-destructive">{criticalCount} Critical</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning/10 border border-warning/30">
            <Bell className="w-5 h-5 text-warning" />
            <span className="font-mono text-warning">{activeCount} Active</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as AlertSeverity | 'all')}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-[180px] bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active (Unacked)</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const MetricIcon = metricIcons[alert.metric];
          const config = severityConfig[alert.severity];
          const timestamp = new Date(alert.timestamp);

          return (
            <Card
              key={alert.id}
              className={cn(
                'p-4 border-2 transition-all',
                config.bgClass,
                !alert.acknowledged && !alert.resolvedAt && 'animate-pulse'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  'flex items-center justify-center w-12 h-12 rounded-xl',
                  alert.severity === 'critical' && 'bg-destructive/20',
                  alert.severity === 'high' && 'bg-warning/20',
                  alert.severity === 'medium' && 'bg-info/20',
                  alert.severity === 'low' && 'bg-muted'
                )}>
                  <MetricIcon className={cn(
                    'w-6 h-6',
                    alert.severity === 'critical' && 'text-destructive',
                    alert.severity === 'high' && 'text-warning',
                    alert.severity === 'medium' && 'text-info',
                    alert.severity === 'low' && 'text-muted-foreground'
                  )} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <Badge className={config.className}>
                      {config.label}
                    </Badge>
                    <span className="font-mono text-xs text-muted-foreground">{alert.id}</span>
                    {alert.acknowledged && !alert.resolvedAt && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                        Acknowledged
                      </Badge>
                    )}
                    {alert.resolvedAt && (
                      <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                        Resolved
                      </Badge>
                    )}
                  </div>
                  
                  <h3 
                    className="font-semibold cursor-pointer hover:text-primary"
                    onClick={() => navigate(`/assets/${alert.assetId}`)}
                  >
                    {alert.assetName}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="capitalize">{alert.metric}</span>:{' '}
                    <span className="font-mono text-foreground">{alert.value}</span>
                    {' exceeded threshold of '}
                    <span className="font-mono text-warning">{alert.threshold}</span>
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>
                      {timestamp.toLocaleDateString('vi-VN')} {timestamp.toLocaleTimeString('vi-VN')}
                    </span>
                    {alert.resolvedAt && (
                      <span className="text-success">
                        Resolved: {new Date(alert.resolvedAt).toLocaleTimeString('vi-VN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!alert.acknowledged && !alert.resolvedAt && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledgeAlert(alert.id)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Acknowledge
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/telemetry?asset=${alert.assetId}&metric=${alert.metric}`)}
                  >
                    View Chart
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredAlerts.length === 0 && (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">No alerts matching your filters</p>
        </Card>
      )}
    </div>
  );
}
