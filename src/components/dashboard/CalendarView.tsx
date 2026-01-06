import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { calendarEvents } from '@/data/mockData';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)); // January 2025

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDay = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return calendarEvents.filter(e => e.date === dateStr);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-b border-r border-border/50" />);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const isToday = day === 6 && month === 0 && year === 2025; // Mock today
      
      days.push(
        <div
          key={day}
          className={cn(
            'h-24 p-2 border-b border-r border-border/50 transition-colors hover:bg-muted/30',
            isToday && 'bg-primary/5'
          )}
        >
          <span className={cn(
            'inline-flex items-center justify-center w-7 h-7 text-sm rounded-full',
            isToday && 'bg-primary text-primary-foreground font-semibold'
          )}>
            {day}
          </span>
          <div className="mt-1 space-y-1">
            {events.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className={cn(
                  'text-xs px-2 py-0.5 rounded truncate',
                  event.type === 'TBM' ? 'bg-info/20 text-info' : 'bg-warning/20 text-warning'
                )}
              >
                {event.title}
              </div>
            ))}
            {events.length > 2 && (
              <span className="text-xs text-muted-foreground">+{events.length - 2} more</span>
            )}
          </div>
        </div>
      );
    }
    
    return days;
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="text-lg font-semibold">Maintenance Calendar</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={prevMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="min-w-[140px] text-center font-medium">
            {monthNames[month]} {year}
          </span>
          <Button variant="ghost" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 bg-muted/30">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground border-b border-r border-border/50">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {renderCalendarDays()}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-info/50" />
          <span className="text-xs text-muted-foreground">TBM - Scheduled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-warning/50" />
          <span className="text-xs text-muted-foreground">CBM - Triggered</span>
        </div>
      </div>
    </div>
  );
}
