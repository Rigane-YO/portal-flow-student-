import { Badge } from "@/components/ui/badge";
import { Tag } from "@/types/forum";
import { cn } from "@/lib/utils";

interface TagListProps {
  tags: Tag[];
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "default";
  clickable?: boolean;
  onTagClick?: (tag: Tag) => void;
}

export function TagList({ 
  tags, 
  className, 
  variant = "secondary", 
  size = "default",
  clickable = false,
  onTagClick 
}: TagListProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {tags.map((tag) => (
        <Badge
          key={tag.id}
          variant={variant}
          className={cn(
            "text-xs",
            size === "sm" && "px-2 py-0.5 text-xs",
            clickable && "cursor-pointer hover:bg-opacity-80 transition-colors",
            variant === "secondary" && "bg-blue-100 text-blue-800 hover:bg-blue-200"
          )}
          style={{
            backgroundColor: variant === "outline" ? "transparent" : `${tag.color}20`,
            borderColor: tag.color,
            color: variant === "outline" ? tag.color : undefined
          }}
          onClick={clickable && onTagClick ? () => onTagClick(tag) : undefined}
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
}
