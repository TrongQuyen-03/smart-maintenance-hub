import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockAlerts } from '@/data/mockData';

export function Header() {
  const unacknowledgedAlerts = mockAlerts.filter(a => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets, work orders..."
            className="pl-10 bg-muted/50 border-muted focus:bg-background"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {unacknowledgedAlerts > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-destructive text-destructive-foreground">
                {unacknowledgedAlerts}
              </span>
            )}
          </Button>

          {/* User */}
          <div className="flex items-center gap-3 pl-4 border-l border-border">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-muted-foreground">Maintenance Manager</p>
            </div>
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
              <User className="w-5 h-5 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
