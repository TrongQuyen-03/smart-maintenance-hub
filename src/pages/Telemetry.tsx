import { useState } from 'react';
import { Activity, ThermometerSun, Zap, Gauge, Waves } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TelemetryChart } from '@/components/telemetry/TelemetryChart';
import { mockAssets, mockCBMPolicies } from '@/data/mockData';
import { MetricType } from '@/types/maintenance';
import { cn } from '@/lib/utils';

const metrics: { value: MetricType; label: string; icon: React.ElementType; unit: string }[] = [
  { value: 'temperature', label: 'Temperature', icon: ThermometerSun, unit: '°C' },
  { value: 'current', label: 'Current', icon: Zap, unit: 'A' },
  { value: 'pressure', label: 'Pressure', icon: Gauge, unit: 'bar' },
  { value: 'vibration', label: 'Vibration', icon: Waves, unit: 'mm/s' },
];

export default function Telemetry() {
  const [selectedAsset, setSelectedAsset] = useState(mockAssets[0].id);
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('temperature');
  const [timeRange, setTimeRange] = useState('24');

  const asset = mockAssets.find(a => a.id === selectedAsset);
  const cbmPolicy = mockCBMPolicies.find(
    p => p.assetId === selectedAsset && p.metric === selectedMetric
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Telemetry Monitor</h1>
          <p className="text-muted-foreground">
            Real-time sensor data and trend analysis
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <Select value={selectedAsset} onValueChange={setSelectedAsset}>
          <SelectTrigger className="w-[300px] bg-muted/50">
            <SelectValue placeholder="Select Asset" />
          </SelectTrigger>
          <SelectContent>
            {mockAssets.map(asset => (
              <SelectItem key={asset.id} value={asset.id}>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground">{asset.id}</span>
                  <span>{asset.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last 1 Hour</SelectItem>
            <SelectItem value="6">Last 6 Hours</SelectItem>
            <SelectItem value="24">Last 24 Hours</SelectItem>
            <SelectItem value="72">Last 3 Days</SelectItem>
            <SelectItem value="168">Last 7 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Asset Info */}
      {asset && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{asset.name}</h2>
              <p className="text-sm text-muted-foreground">{asset.location}</p>
            </div>
            <div className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              asset.status === 'online' && 'bg-success/20 text-success',
              asset.status === 'warning' && 'bg-warning/20 text-warning',
              asset.status === 'critical' && 'bg-destructive/20 text-destructive',
              asset.status === 'offline' && 'bg-muted text-muted-foreground'
            )}>
              {asset.status.toUpperCase()}
            </div>
          </div>
        </Card>
      )}

      {/* Metric Tabs */}
      <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
        <TabsList className="bg-muted/50 p-1">
          {metrics.map(metric => {
            const Icon = metric.icon;
            return (
              <TabsTrigger key={metric.value} value={metric.value} className="gap-2">
                <Icon className="w-4 h-4" />
                {metric.label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {metrics.map(metric => (
          <TabsContent key={metric.value} value={metric.value}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <metric.icon className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold">{metric.label} Trend</h3>
                    <p className="text-sm text-muted-foreground">
                      Last {timeRange} hours
                    </p>
                  </div>
                </div>
                {cbmPolicy && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">CBM Threshold</p>
                    <p className="font-mono text-lg text-warning">
                      {cbmPolicy.threshold} {metric.unit}
                    </p>
                  </div>
                )}
              </div>

              <TelemetryChart
                assetId={selectedAsset}
                metric={metric.value}
                threshold={cbmPolicy?.threshold}
                hours={parseInt(timeRange)}
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Live Values */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon;
          const randomValue = (
            metric.value === 'temperature' ? 35 + Math.random() * 10 :
            metric.value === 'current' ? 28 + Math.random() * 10 :
            metric.value === 'pressure' ? 4 + Math.random() * 2 :
            1 + Math.random() * 3
          ).toFixed(1);

          return (
            <Card
              key={metric.value}
              className={cn(
                'p-4 cursor-pointer transition-all',
                selectedMetric === metric.value && 'border-primary shadow-glow'
              )}
              onClick={() => setSelectedMetric(metric.value)}
            >
              <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{metric.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono">{randomValue}</span>
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <div className="status-indicator status-online" />
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
