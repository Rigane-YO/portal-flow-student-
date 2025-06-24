
import { useState } from 'react';
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  description?: string;
  type: 'class' | 'exam' | 'assignment' | 'meeting' | 'other';
  location?: string;
}

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Mathematics Exam',
      date: addDays(new Date(), 2),
      description: 'Final examination for Algebra course',
      type: 'exam',
      location: 'Room 301'
    },
    {
      id: '2',
      title: 'Computer Science Class',
      date: addDays(new Date(), 1),
      description: 'Introduction to programming concepts',
      type: 'class',
      location: 'Lab 102'
    },
    {
      id: '3',
      title: 'Project Submission',
      date: addDays(new Date(), 5),
      description: 'Submit the final project for evaluation',
      type: 'assignment',
      location: 'Online'
    },
    {
      id: '4',
      title: 'Student Council Meeting',
      date: addDays(new Date(), 3),
      description: 'Discussion about upcoming events',
      type: 'meeting',
      location: 'Meeting Room 2'
    }
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const getDaysInMonth = () => {
    return monthDays;
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };
  
  const getEventsForMonth = () => {
    return events.filter(event => isSameMonth(event.date, currentDate));
  };

  const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === id ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  return {
    currentDate,
    monthName: format(currentDate, 'MMMM yyyy'),
    days: getDaysInMonth(),
    events,
    getEventsForDay,
    getEventsForMonth,
    addEvent,
    updateEvent,
    deleteEvent,
    nextMonth,
    prevMonth,
    goToToday
  };
}
