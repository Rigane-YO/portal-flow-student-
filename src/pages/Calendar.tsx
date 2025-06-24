
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
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Calendar</h1>
          <Button onClick={handleAddNewEvent}>
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-5 w-5" />
              <h2 className="text-xl font-semibold">{monthName}</h2>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px">
            {weekDays.map((day) => (
              <div key={day} className="text-center font-semibold py-2 bg-gray-50">
                {day}
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

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          <div className="space-y-3">
            {events
              .filter((event) => event.date >= new Date())
              .sort((a, b) => a.date.getTime() - b.date.getTime())
              .slice(0, 5)
              .map((event) => (
                <div
                  key={event.id}
                  className="p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSelectEvent(event)}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">{event.title}</h3>
                    <span className="text-sm text-gray-500">
                      {format(event.date, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {event.location && `${event.location} • `}
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </div>
                  {event.description && (
                    <p className="text-sm mt-1 text-gray-600">
                      {event.description}
                    </p>
                  )}
                </div>
              ))}
            {events.filter((event) => event.date >= new Date()).length === 0 && (
              <p className="text-gray-500 text-center py-4">No upcoming events</p>
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
