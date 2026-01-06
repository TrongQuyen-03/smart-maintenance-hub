import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Server, 
  Calendar, 
  User, 
  ExternalLink,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { WOStatusBadge } from '@/components/workorder/WOStatusBadge';
import { WOSourceBadge } from '@/components/workorder/WOSourceBadge';
import { ChecklistComponent } from '@/components/workorder/ChecklistComponent';
import { mockWorkOrders } from '@/data/mockData';
import { useState } from 'react';
import { ChecklistItem } from '@/types/maintenance';
import { cn } from '@/lib/utils';

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const workOrder = mockWorkOrders.find(wo => wo.id === id);
  const [checklist, setChecklist] = useState<ChecklistItem[]>(workOrder?.checklist || []);
  const [notes, setNotes] = useState(workOrder?.notes || '');

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground mb-4">Work Order not found</p>
        <Button variant="outline" onClick={() => navigate('/work-orders')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work Orders
        </Button>
      </div>
    );
  }

  const isEditable = workOrder.status !== 'done';
  const priorityColors = {
    low: 'border-muted-foreground/30',
    medium: 'border-info/30',
    high: 'border-warning/30',
    critical: 'border-destructive/30',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/work-orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-primary text-sm">{workOrder.id}</span>
              <WOSourceBadge source={workOrder.source} />
              <WOStatusBadge status={workOrder.status} />
            </div>
            <h1 className="text-2xl font-bold">{workOrder.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {workOrder.status === 'open' && (
            <Button variant="outline">
              Assign to Me
            </Button>
          )}
          {workOrder.status === 'in_progress' && (
            <Button>
              Complete Work Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* CBM Trigger Info */}
          {workOrder.source === 'CBM' && workOrder.triggerInfo && (
            <Card className={cn(
              'p-4 border-2',
              priorityColors[workOrder.priority],
              'bg-warning/5'
            )}>
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">CBM Alert Trigger</h3>
                  <p className="text-sm text-muted-foreground">
                    <span className="capitalize">{workOrder.triggerInfo.metric}</span>: 
                    <span className="font-mono text-foreground ml-1">
                      {workOrder.triggerInfo.value}
                    </span>
                    {' exceeds threshold of '}
                    <span className="font-mono text-warning">
                      {workOrder.triggerInfo.threshold}
                    </span>
                  </p>
                  {workOrder.triggerInfo.chartLink && (
                    <Link
                      to={workOrder.triggerInfo.chartLink}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    >
                      View Telemetry Chart
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Checklist */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Work Checklist</h2>
            <ChecklistComponent
              items={checklist}
              onUpdate={setChecklist}
              readonly={!isEditable}
            />
          </Card>

          {/* Notes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notes & Comments</h2>
            <Textarea
              placeholder="Add notes about this work order..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[120px] bg-muted/30"
              disabled={!isEditable}
            />
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details Card */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                  <Server className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Asset</p>
                  <Link
                    to={`/assets/${workOrder.assetId}`}
                    className="font-medium hover:text-primary"
                  >
                    {workOrder.assetName}
                  </Link>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">
                    {new Date(workOrder.dueDate).toLocaleDateString('vi-VN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Assignee</p>
                  <p className="font-medium">{workOrder.assignee || 'Unassigned'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(workOrder.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Priority Card */}
          <Card className={cn('p-6 border-2', priorityColors[workOrder.priority])}>
            <h3 className="font-semibold mb-2">Priority</h3>
            <p className={cn(
              'text-2xl font-bold capitalize',
              workOrder.priority === 'critical' && 'text-destructive',
              workOrder.priority === 'high' && 'text-warning',
              workOrder.priority === 'medium' && 'text-info',
              workOrder.priority === 'low' && 'text-muted-foreground'
            )}>
              {workOrder.priority}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
