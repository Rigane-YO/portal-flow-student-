
import { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { useCalendar, CalendarEvent } from "@/hooks/use-calendar";
import { CalendarDay } from "@/components/calendar/CalendarDay";
import { EventDialog } from "@/components/calendar/EventDialog";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Calendar = () => {
  const {
    currentDate,
    monthName,
    days,
    events,
    getEventsForDay,
    addEvent,
    updateEvent,
    deleteEvent,
    nextMonth,
    prevMonth,
    goToToday,
  } = useCalendar();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const day = startOfWeek(currentDate);
    return format(addDays(day, i), "EEE");
  });

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(event.date);
    setIsDialogOpen(true);
  };

  const handleAddEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent = addEvent(eventData);
    toast({
      title: "Event added",
      description: `${newEvent.title} has been added to your calendar.`,
    });
  };

  const handleUpdateEvent = (id: string, updates: Partial<Omit<CalendarEvent, "id">>) => {
    updateEvent(id, updates);
    toast({
      title: "Event updated",
      description: `The event has been updated.`,
    });
  };

  const handleDeleteEvent = (id: string) => {
    deleteEvent(id);
    toast({
      title: "Event deleted",
      description: `The event has been removed from your calendar.`,
      variant: "destructive",
    });
  };

  const handleAddNewEvent = () => {
    setSelectedDate(new Date());
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="space-responsive-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-responsive-2xl font-bold text-gray-900 dark:text-gray-100">Calendar</h1>
          <Button onClick={handleAddNewEvent} className="touch-manipulation min-h-[44px] w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Event</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              <h2 className="text-responsive-xl font-semibold text-gray-900 dark:text-gray-100">{monthName}</h2>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth} className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous month</span>
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday} className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300">
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth} className="touch-manipulation min-h-[44px] sm:min-h-[36px] dark:border-gray-600 dark:text-gray-300">
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next month</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border dark:border-gray-600">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold py-2 sm:py-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-xs sm:text-sm">
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden">{day.charAt(0)}</span>
              </div>
            ))}
            {days.map((day) => (
              <CalendarDay
                key={day.toString()}
                date={day}
                currentMonth={currentDate}
                events={getEventsForDay(day)}
                onSelectDate={handleSelectDate}
              />
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4 sm:p-6">
          <h2 className="text-responsive-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Upcoming Events</h2>
          <div className="space-y-3">
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3 border dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors touch-manipulation"
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-2 flex-1">{event.title}</h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                      {format(event.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {event.location && `${event.location} • `}
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </div>
                  {event.description && (
                    <p className="text-sm mt-1 text-gray-600 dark:text-gray-300 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            {events.filter((event) => event.date >= new Date()).length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No upcoming events</p>
            )}
          </div>
        </div>
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        selectedDate={selectedDate}
        selectedEvent={selectedEvent}
        onSave={handleAddEvent}
        onUpdate={handleUpdateEvent}
        onDelete={handleDeleteEvent}
      />
    </DashboardLayout>
  );
};

export default Calendar;
