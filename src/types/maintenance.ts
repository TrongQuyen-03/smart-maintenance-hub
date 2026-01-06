export type AssetType = 'AHU' | 'FCU' | 'Chiller' | 'Pump' | 'Compressor' | 'Motor';
export type AssetStatus = 'online' | 'warning' | 'critical' | 'offline';
export type WOSource = 'TBM' | 'CBM' | 'Manual';
export type WOStatus = 'open' | 'in_progress' | 'done' | 'overdue';
export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type MetricType = 'temperature' | 'current' | 'pressure' | 'vibration' | 'humidity';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  location: string;
  status: AssetStatus;
  specifications: Record<string, string>;
  lastMaintenance?: string;
  nextMaintenance?: string;
  installDate: string;
  manufacturer?: string;
  model?: string;
}

export interface TBMPolicy {
  id: string;
  assetId: string;
  intervalDays: number;
  nextDueDate: string;
  lastExecuted?: string;
  isActive: boolean;
  checklistTemplate?: string[];
}

export interface CBMPolicy {
  id: string;
  assetId: string;
  metric: MetricType;
  threshold: number;
  operator: 'gt' | 'lt' | 'gte' | 'lte';
  durationMinutes: number;
  priority: number;
  isActive: boolean;
  overrideTBM: boolean;
}

export interface WorkOrder {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  source: WOSource;
  status: WOStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  assignee?: string;
  triggerInfo?: {
    metric?: MetricType;
    value?: number;
    threshold?: number;
    chartLink?: string;
  };
  checklist: ChecklistItem[];
  notes?: string;
  images?: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  note?: string;
  imageUrl?: string;
}

export interface TelemetryReading {
  timestamp: string;
  assetId: string;
  metric: MetricType;
  value: number;
  unit: string;
}

export interface Alert {
  id: string;
  assetId: string;
  assetName: string;
  metric: MetricType;
  value: number;
  threshold: number;
  severity: AlertSeverity;
  timestamp: string;
  acknowledged: boolean;
  resolvedAt?: string;
}

export interface DashboardStats {
  totalWO: number;
  openWO: number;
  inProgressWO: number;
  doneWO: number;
  overdueWO: number;
  tbmCount: number;
  cbmCount: number;
  manualCount: number;
  criticalAlerts: number;
}
