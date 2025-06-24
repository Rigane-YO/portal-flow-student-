import { useState } from "react";
import { Flag, AlertTriangle, Trash2, Ban } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface ModerationDialogProps {
  targetId: string;
  targetType: "question" | "answer";
  targetTitle?: string;
  children: React.ReactNode;
}

export function ModerationDialog({ 
  targetId, 
  targetType, 
  targetTitle, 
  children 
}: ModerationDialogProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: "spam", label: "Spam or promotional content" },
    { value: "inappropriate", label: "Inappropriate or offensive content" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "misinformation", label: "Misinformation or false claims" },
    { value: "off-topic", label: "Off-topic or irrelevant" },
    { value: "duplicate", label: "Duplicate content" },
    { value: "other", label: "Other (please specify)" }
  ];

  const handleSubmitReport = async () => {
    if (!reason) {
      toast.error("Please select a reason for reporting");
      return;
    }

    if (reason === "other" && !description.trim()) {
      toast.error("Please provide a description for 'Other' reason");
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, this would call an API to submit the report
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Report submitted successfully. Our moderation team will review it.");
      setIsOpen(false);
      setReason("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canModerate = user?.role === "admin" || user?.role === "teacher";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Flag className="h-5 w-5 text-red-500" />
            <span>Report {targetType}</span>
          </DialogTitle>
          <DialogDescription>
            {targetTitle && (
              <span className="block mb-2 font-medium">"{targetTitle}"</span>
            )}
            Help us maintain a respectful community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Reason for reporting *</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {reportReasons.map((reportReason) => (
                <div key={reportReason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reportReason.value} id={reportReason.value} />
                  <Label htmlFor={reportReason.value} className="text-sm">
                    {reportReason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="description" className="text-sm font-medium">
              Additional details {reason === "other" && "*"}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide additional context about why you're reporting this content..."
              className="mt-1"
              rows={3}
            />
          </div>

          {canModerate && (
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-orange-600">
                Moderator Actions
              </Label>
              <div className="mt-2 space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-orange-600 border-orange-200"
                >
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Flag for Review
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-red-600 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-gray-600 border-gray-200"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Suspend User
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReport}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
