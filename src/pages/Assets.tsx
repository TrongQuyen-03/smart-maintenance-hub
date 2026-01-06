import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetCard } from '@/components/assets/AssetCard';
import { mockAssets } from '@/data/mockData';
import { AssetType, AssetStatus } from '@/types/maintenance';
import { cn } from '@/lib/utils';

export default function Assets() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AssetType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AssetStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredAssets = mockAssets.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(search.toLowerCase()) ||
      asset.id.toLowerCase().includes(search.toLowerCase()) ||
      asset.location.toLowerCase().includes(search.toLowerCase());
    
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || asset.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Asset Management</h1>
          <p className="text-muted-foreground">
            {mockAssets.length} assets registered in the system
          </p>
        </div>
        <Button>
          Add Asset
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-muted/50"
          />
        </div>

        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as AssetType | 'all')}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="AHU">AHU</SelectItem>
            <SelectItem value="FCU">FCU</SelectItem>
            <SelectItem value="Chiller">Chiller</SelectItem>
            <SelectItem value="Pump">Pump</SelectItem>
            <SelectItem value="Compressor">Compressor</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AssetStatus | 'all')}>
          <SelectTrigger className="w-[150px] bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="online">Online</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="offline">Offline</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center border border-border rounded-lg p-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', viewMode === 'grid' && 'bg-muted')}
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn('h-8 w-8', viewMode === 'list' && 'bg-muted')}
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Assets Grid */}
      <div className={cn(
        'grid gap-4',
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      )}>
        {filteredAssets.map(asset => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      {filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No assets found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
