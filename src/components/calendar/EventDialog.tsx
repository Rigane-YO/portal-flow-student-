
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {selectedEvent ? "Edit Event" : "Add New Event"}
          </DialogTitle>
          <DialogDescription>
            {selectedDate && `Date: ${format(selectedDate, "MMMM d, yyyy")}`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(value) => setType(value as CalendarEvent['type'])}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="exam">Exam</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <div>
            {selectedEvent && (
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSave}>
              {selectedEvent ? "Update" : "Add"} Event
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
