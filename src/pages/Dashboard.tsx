import { 
  ClipboardList, 
  AlertCircle, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Activity
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/KPICard';
import { CalendarView } from '@/components/dashboard/CalendarView';
import { HotAlertsList } from '@/components/dashboard/HotAlertsList';
import { WOSourceChart } from '@/components/dashboard/WOSourceChart';
import { mockDashboardStats } from '@/data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Maintenance Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of maintenance operations and system health
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <KPICard
          title="Total Work Orders"
          value={mockDashboardStats.totalWO}
          subtitle="This month"
          icon={<ClipboardList className="w-6 h-6" />}
          trend="up"
          trendValue="+12% vs last month"
        />
        <KPICard
          title="Open"
          value={mockDashboardStats.openWO}
          subtitle="Pending assignment"
          icon={<AlertCircle className="w-6 h-6" />}
          variant="default"
        />
        <KPICard
          title="In Progress"
          value={mockDashboardStats.inProgressWO}
          subtitle="Being worked on"
          icon={<Clock className="w-6 h-6" />}
          variant="warning"
        />
        <KPICard
          title="Completed"
          value={mockDashboardStats.doneWO}
          subtitle="This month"
          icon={<CheckCircle className="w-6 h-6" />}
          variant="success"
          trend="up"
          trendValue="+8%"
        />
        <KPICard
          title="Overdue"
          value={mockDashboardStats.overdueWO}
          subtitle="Needs attention"
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="danger"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar - Takes 2 columns */}
        <div className="lg:col-span-2">
          <CalendarView />
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          <WOSourceChart />
        </div>
      </div>

      {/* Hot Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HotAlertsList />
        
        {/* Quick Stats */}
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            System Health Overview
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm">Assets Online</span>
              <span className="font-mono text-success">3/5 (60%)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm">Sensor Data Flow</span>
              <span className="font-mono text-success">Active</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm">TBM Policies Active</span>
              <span className="font-mono text-info">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <span className="text-sm">CBM Rules Active</span>
              <span className="font-mono text-primary">3</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10">
              <span className="text-sm">Critical Alerts</span>
              <span className="font-mono text-destructive">{mockDashboardStats.criticalAlerts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
