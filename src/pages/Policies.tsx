import { useState } from 'react';
import { Clock, Activity, Plus, Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockTBMPolicies, mockCBMPolicies, mockAssets } from '@/data/mockData';
import { TBMPolicy, CBMPolicy, MetricType } from '@/types/maintenance';
import { cn } from '@/lib/utils';

export default function Policies() {
  const [tbmPolicies, setTBMPolicies] = useState<TBMPolicy[]>(mockTBMPolicies);
  const [cbmPolicies, setCBMPolicies] = useState<CBMPolicy[]>(mockCBMPolicies);
  const [selectedAsset, setSelectedAsset] = useState<string>('');

  const toggleTBMPolicy = (id: string) => {
    setTBMPolicies(policies =>
      policies.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
    );
  };

  const toggleCBMPolicy = (id: string) => {
    setCBMPolicies(policies =>
      policies.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p)
    );
  };

  const getAssetName = (assetId: string) => {
    return mockAssets.find(a => a.id === assetId)?.name || assetId;
  };

  const metricLabels: Record<MetricType, string> = {
    temperature: 'Temperature (°C)',
    current: 'Current (A)',
    pressure: 'Pressure (bar)',
    vibration: 'Vibration (mm/s)',
    humidity: 'Humidity (%)',
  };

  const operatorLabels = {
    gt: '>',
    lt: '<',
    gte: '≥',
    lte: '≤',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Policy Configuration</h1>
          <p className="text-muted-foreground">
            Configure TBM schedules and CBM threshold rules
          </p>
        </div>
      </div>

      <Tabs defaultValue="tbm" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="tbm" className="gap-2">
            <Clock className="w-4 h-4" />
            TBM Policies
          </TabsTrigger>
          <TabsTrigger value="cbm" className="gap-2">
            <Activity className="w-4 h-4" />
            CBM Rules
          </TabsTrigger>
        </TabsList>

        {/* TBM Section */}
        <TabsContent value="tbm" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-info/20">
                  <Clock className="w-5 h-5 text-info" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Time-Based Maintenance</h2>
                  <p className="text-sm text-muted-foreground">
                    Schedule recurring maintenance tasks
                  </p>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add TBM Policy
              </Button>
            </div>

            <div className="space-y-4">
              {tbmPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    policy.isActive 
                      ? 'bg-card border-info/30' 
                      : 'bg-muted/30 border-border opacity-60'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {policy.id}
                        </span>
                        <Badge variant="outline" className={cn(
                          policy.isActive 
                            ? 'bg-success/10 text-success border-success/30'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1">{getAssetName(policy.assetId)}</h3>
                      
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Interval</Label>
                          <p className="font-mono text-lg">{policy.intervalDays} days</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Last Executed</Label>
                          <p className="font-mono">
                            {policy.lastExecuted 
                              ? new Date(policy.lastExecuted).toLocaleDateString('vi-VN')
                              : '-'
                            }
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Next Due</Label>
                          <p className="font-mono text-info">
                            {new Date(policy.nextDueDate).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>

                      {policy.checklistTemplate && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <Label className="text-xs text-muted-foreground mb-2 block">
                            Checklist Template ({policy.checklistTemplate.length} items)
                          </Label>
                          <div className="flex flex-wrap gap-2">
                            {policy.checklistTemplate.slice(0, 3).map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="font-normal">
                                {item}
                              </Badge>
                            ))}
                            {policy.checklistTemplate.length > 3 && (
                              <Badge variant="outline">
                                +{policy.checklistTemplate.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={policy.isActive}
                        onCheckedChange={() => toggleTBMPolicy(policy.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* CBM Section */}
        <TabsContent value="cbm" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Condition-Based Maintenance</h2>
                  <p className="text-sm text-muted-foreground">
                    Trigger maintenance based on sensor thresholds
                  </p>
                </div>
              </div>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add CBM Rule
              </Button>
            </div>

            <div className="space-y-4">
              {cbmPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className={cn(
                    'p-4 rounded-xl border transition-all',
                    policy.isActive 
                      ? 'bg-card border-primary/30' 
                      : 'bg-muted/30 border-border opacity-60'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-muted-foreground">
                          {policy.id}
                        </span>
                        <Badge variant="outline" className={cn(
                          policy.isActive 
                            ? 'bg-success/10 text-success border-success/30'
                            : 'bg-muted text-muted-foreground'
                        )}>
                          {policy.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {policy.overrideTBM && (
                          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                            Override TBM
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-semibold mb-1">{getAssetName(policy.assetId)}</h3>
                      
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Metric</Label>
                          <p className="font-medium capitalize">{policy.metric}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Condition</Label>
                          <p className="font-mono text-lg">
                            {operatorLabels[policy.operator]} {policy.threshold}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Duration</Label>
                          <p className="font-mono">{policy.durationMinutes} min</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Priority</Label>
                          <p className={cn(
                            'font-medium',
                            policy.priority === 1 && 'text-destructive',
                            policy.priority === 2 && 'text-warning',
                            policy.priority >= 3 && 'text-muted-foreground'
                          )}>
                            P{policy.priority}
                          </p>
                        </div>
                      </div>

                      {/* Visual Rule */}
                      <div className="mt-4 p-3 rounded-lg bg-muted/30 font-mono text-sm">
                        <span className="text-muted-foreground">WHEN</span>{' '}
                        <span className="text-primary">{policy.metric}</span>{' '}
                        <span className="text-warning">{operatorLabels[policy.operator]} {policy.threshold}</span>{' '}
                        <span className="text-muted-foreground">FOR</span>{' '}
                        <span className="text-info">{policy.durationMinutes} min</span>{' '}
                        <span className="text-muted-foreground">→</span>{' '}
                        <span className="text-success">CREATE WO</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="icon">
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Switch
                        checked={policy.isActive}
                        onCheckedChange={() => toggleCBMPolicy(policy.id)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* CBM Priority Info */}
          <Card className="p-4 border-warning/30 bg-warning/5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
              <div>
                <h4 className="font-semibold mb-1">CBM Override Priority</h4>
                <p className="text-sm text-muted-foreground">
                  When "Override TBM" is enabled, CBM-triggered work orders will take precedence 
                  over scheduled TBM maintenance. This ensures critical conditions are addressed 
                  immediately.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
