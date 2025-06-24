
import { useState } from "react";
import { format } from "date-fns";
import { CalendarEvent } from "@/hooks/use-calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  onSave: (event: Omit<CalendarEvent, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Omit<CalendarEvent, 'id'>>) => void;
  onDelete: (id: string) => void;
}

export function EventDialog({
  isOpen,
  onClose,
  selectedDate,
  selectedEvent,
  onSave,
  onUpdate,
  onDelete,
}: EventDialogProps) {
  const [title, setTitle] = useState(selectedEvent?.title || "");
  const [description, setDescription] = useState(selectedEvent?.description || "");
  const [type, setType] = useState<CalendarEvent['type']>(selectedEvent?.type || "other");
  const [location, setLocation] = useState(selectedEvent?.location || "");

  const handleSave = () => {
    if (!selectedDate) return;

    if (selectedEvent) {
      onUpdate(selectedEvent.id, {
        title,
        description,
        type,
        location,
      });
    } else {
      onSave({
        title,
        description,
        type,
        location,
        date: selectedDate,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      onDelete(selectedEvent.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-gray-100">
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {selectedDate && `Date: ${format(selectedDate, "MMMM d, yyyy")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="title" className="sm:text-right dark:text-gray-300">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="sm:col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="type" className="sm:text-right dark:text-gray-300">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as CalendarEvent['type'])}
            >
              <SelectTrigger className="sm:col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-700 dark:border-gray-600">
                <SelectItem value="class" className="dark:text-gray-100 dark:hover:bg-gray-600">Class</SelectItem>
                <SelectItem value="exam" className="dark:text-gray-100 dark:hover:bg-gray-600">Exam</SelectItem>
                <SelectItem value="assignment" className="dark:text-gray-100 dark:hover:bg-gray-600">Assignment</SelectItem>
                <SelectItem value="meeting" className="dark:text-gray-100 dark:hover:bg-gray-600">Meeting</SelectItem>
                <SelectItem value="other" className="dark:text-gray-100 dark:hover:bg-gray-600">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start sm:items-center gap-2 sm:gap-4">
            <Label htmlFor="location" className="sm:text-right dark:text-gray-300">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="sm:col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              style={{ fontSize: '16px' }}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-start gap-2 sm:gap-4">
            <Label htmlFor="description" className="sm:text-right dark:text-gray-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="sm:col-span-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              style={{ fontSize: '16px' }}
            />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row justify-between gap-2">
          <div>
            {selectedEvent && (
              <Button variant="destructive" onClick={handleDelete} className="touch-manipulation min-h-[44px] w-full sm:w-auto">
                Delete
              </Button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={onClose} className="touch-manipulation min-h-[44px] dark:border-gray-600 dark:text-gray-300">
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave} className="touch-manipulation min-h-[44px]">
              {selectedEvent ? "Update" : "Add"} Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
