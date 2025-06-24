import { useState } from "react";
import { Filter, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SearchFilters, QuestionStatus } from "@/types/forum";
import { TagList } from "./TagList";
import { useForum } from "@/contexts/ForumContext";

interface FilterControlsProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

export function FilterControls({ filters, onFiltersChange, className }: FilterControlsProps) {
  const { getPopularTags } = useForum();
  const [isOpen, setIsOpen] = useState(false);
  
  const popularTags = getPopularTags().slice(0, 10);
  
  const statusOptions: { value: QuestionStatus; label: string }[] = [
    { value: "open", label: "Open" },
    { value: "answered", label: "Answered" },
    { value: "closed", label: "Closed" },
    { value: "flagged", label: "Flagged" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "votes", label: "Most Votes" },
    { value: "activity", label: "Recent Activity" },
    { value: "views", label: "Most Views" }
  ];

  const handleStatusChange = (status: QuestionStatus, checked: boolean) => {
    const currentStatus = filters.status || [];
    const newStatus = checked
      ? [...currentStatus, status]
      : currentStatus.filter(s => s !== status);
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleTagToggle = (tagName: string) => {
    const currentTags = filters.tags || [];
    const newTags = currentTags.includes(tagName)
      ? currentTags.filter(t => t !== tagName)
      : [...currentTags, tagName];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy: sortBy as SearchFilters["sortBy"] });
  };

  const handleAnswerFilterChange = (value: string) => {
    let hasAnswers: boolean | undefined;
    let hasBestAnswer: boolean | undefined;
    
    switch (value) {
      case "unanswered":
        hasAnswers = false;
        break;
      case "answered":
        hasAnswers = true;
        break;
      case "best-answer":
        hasBestAnswer = true;
        break;
      default:
        hasAnswers = undefined;
        hasBestAnswer = undefined;
    }
    
    onFiltersChange({ ...filters, hasAnswers, hasBestAnswer });
  };

  const clearFilters = () => {
    onFiltersChange({
      query: filters.query,
      sortBy: "newest"
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status && filters.status.length > 0) count++;
    if (filters.tags && filters.tags.length > 0) count++;
    if (filters.hasAnswers !== undefined) count++;
    if (filters.hasBestAnswer !== undefined) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-blue-600">
                    {activeFilterCount}
                  </Badge>
                )}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="start">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Filters</h4>
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Status</h5>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.value}
                          checked={filters.status?.includes(option.value) || false}
                          onCheckedChange={(checked) => 
                            handleStatusChange(option.value, checked as boolean)
                          }
                        />
                        <label htmlFor={option.value} className="text-sm">
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Answer Status</h5>
                  <Select
                    value={
                      filters.hasBestAnswer ? "best-answer" :
                      filters.hasAnswers === false ? "unanswered" :
                      filters.hasAnswers === true ? "answered" : "all"
                    }
                    onValueChange={handleAnswerFilterChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Questions</SelectItem>
                      <SelectItem value="unanswered">Unanswered</SelectItem>
                      <SelectItem value="answered">Has Answers</SelectItem>
                      <SelectItem value="best-answer">Has Best Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <h5 className="text-sm font-medium mb-2">Popular Tags</h5>
                  <div className="flex flex-wrap gap-1">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant={filters.tags?.includes(tag.name) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        onClick={() => handleTagToggle(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Select
            value={filters.sortBy || "newest"}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.status?.map((status) => (
            <Badge key={status} variant="secondary" className="text-xs">
              Status: {status}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => handleStatusChange(status, false)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => handleTagToggle(tag)}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          ))}
          {filters.hasAnswers === false && (
            <Badge variant="secondary" className="text-xs">
              Unanswered
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => onFiltersChange({ ...filters, hasAnswers: undefined })}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
          {filters.hasBestAnswer && (
            <Badge variant="secondary" className="text-xs">
              Has Best Answer
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 h-3 w-3 p-0"
                onClick={() => onFiltersChange({ ...filters, hasBestAnswer: undefined })}
              >
                <X className="h-2 w-2" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
