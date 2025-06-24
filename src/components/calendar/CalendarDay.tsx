
import { format, isToday, isSameMonth } from "date-fns";
import { CalendarEvent } from "@/hooks/use-calendar";
import { cn } from "@/lib/utils";

interface CalendarDayProps {
  date: Date;
  currentMonth: Date;
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
}

export function CalendarDay({ date, currentMonth, events, onSelectDate }: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const dayEvents = events.filter(event => 
    date.getDate() === event.date.getDate() && 
    date.getMonth() === event.date.getMonth() && 
    date.getFullYear() === event.date.getFullYear()
  );

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'class': return 'bg-blue-500 dark:bg-blue-600';
      case 'exam': return 'bg-red-500 dark:bg-red-600';
      case 'assignment': return 'bg-yellow-500 dark:bg-yellow-600';
      case 'meeting': return 'bg-green-500 dark:bg-green-600';
      default: return 'bg-gray-500 dark:bg-gray-600';
    }
  };

  return (
    <div
      className={cn(
        "min-h-[100px] p-2 border border-gray-200 dark:border-gray-600 cursor-pointer transition-colors",
        isCurrentMonth
          ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          : "bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-500",
        isToday(date) && "bg-blue-50 dark:bg-blue-900/30 font-bold ring-2 ring-blue-500 dark:ring-blue-400"
      )}
      onClick={() => onSelectDate(date)}
    >
      <div className={cn(
        "text-sm font-medium",
        isToday(date) && "text-blue-600 dark:text-blue-400"
      )}>
        {format(date, "d")}
      </div>
      <div className="mt-1 space-y-1 max-h-[60px] overflow-y-auto">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              "text-xs px-1 py-0.5 rounded truncate text-white",
              getEventTypeColor(event.type)
            )}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
      </div>
    </div>
  );
}
