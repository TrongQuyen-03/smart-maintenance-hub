import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WOStatusBadge } from '@/components/workorder/WOStatusBadge';
import { WOSourceBadge } from '@/components/workorder/WOSourceBadge';
import { mockWorkOrders } from '@/data/mockData';
import { WOSource, WOStatus } from '@/types/maintenance';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function WorkOrders() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState<WOSource | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<WOStatus | 'all'>('all');

  const filteredOrders = mockWorkOrders.filter(wo => {
    const matchesSearch = 
      wo.title.toLowerCase().includes(search.toLowerCase()) ||
      wo.id.toLowerCase().includes(search.toLowerCase()) ||
      wo.assetName.toLowerCase().includes(search.toLowerCase());
    
    const matchesSource = sourceFilter === 'all' || wo.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;

    return matchesSearch && matchesSource && matchesStatus;
  });

  const priorityColors = {
    low: 'text-muted-foreground',
    medium: 'text-info',
    high: 'text-warning',
    critical: 'text-destructive',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Work Orders</h1>
          <p className="text-muted-foreground">
            Manage and track maintenance work orders
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Work Order
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, title, or asset..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>

        <Select value={sourceFilter} onValueChange={(v) => setSourceFilter(v as WOSource | 'all')}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="TBM">TBM</SelectItem>
            <SelectItem value="CBM">CBM</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as WOStatus | 'all')}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Work Orders Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Asset</th>
              <th>Source</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((wo) => (
              <tr
                key={wo.id}
                className="cursor-pointer"
                onClick={() => navigate(`/work-orders/${wo.id}`)}
              >
                <td className="font-mono text-primary">{wo.id}</td>
                <td className="font-medium max-w-[300px] truncate">{wo.title}</td>
                <td className="text-muted-foreground">{wo.assetName}</td>
                <td><WOSourceBadge source={wo.source} /></td>
                <td>
                  <span className={cn('capitalize font-medium', priorityColors[wo.priority])}>
                    {wo.priority}
                  </span>
                </td>
                <td><WOStatusBadge status={wo.status} /></td>
                <td className="text-muted-foreground">
                  {new Date(wo.dueDate).toLocaleDateString('vi-VN')}
                </td>
                <td className="text-muted-foreground">{wo.assignee || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No work orders found</p>
          </div>
        )}
      </div>
    </div>
  );
}
