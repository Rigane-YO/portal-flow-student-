import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnSwipeDown?: boolean;
  className?: string;
}

export function ResponsiveModal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnSwipeDown = true,
  className
}: ResponsiveModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle modal visibility with animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle swipe down to close on mobile
  const modalRef = useSwipeGesture<HTMLDivElement>({
    onSwipeDown: closeOnSwipeDown && isMobile ? onClose : undefined,
    threshold: 100
  });

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const getSizeClasses = () => {
    if (isMobile) {
      return 'w-full h-full max-h-full rounded-none';
    }

    switch (size) {
      case 'sm':
        return 'w-full max-w-md max-h-[80vh]';
      case 'md':
        return 'w-full max-w-lg max-h-[80vh]';
      case 'lg':
        return 'w-full max-w-2xl max-h-[80vh]';
      case 'xl':
        return 'w-full max-w-4xl max-h-[80vh]';
      case 'full':
        return 'w-full h-full max-w-none max-h-none';
      default:
        return 'w-full max-w-lg max-h-[80vh]';
    }
  };

  if (!isVisible) return null;

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        isMobile ? "items-end" : "items-center"
      )}
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black transition-opacity duration-300",
          isOpen ? "opacity-50" : "opacity-0"
        )}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 overflow-hidden",
          isMobile 
            ? "w-full rounded-t-2xl max-h-[90vh]" 
            : "rounded-lg",
          getSizeClasses(),
          isOpen 
            ? (isMobile ? "translate-y-0" : "scale-100 opacity-100")
            : (isMobile ? "translate-y-full" : "scale-95 opacity-0"),
          className
        )}
      >
        {/* Mobile drag indicator */}
        {isMobile && closeOnSwipeDown && (
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {title}
            </h2>
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 touch-manipulation"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cn(
          "overflow-y-auto",
          isMobile ? "flex-1" : "max-h-[calc(80vh-8rem)]"
        )}>
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Bottom Sheet component for mobile-first design
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: number[];
  defaultSnapPoint?: number;
  showDragIndicator?: boolean;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = [0.3, 0.6, 0.9],
  defaultSnapPoint = 0.6,
  showDragIndicator = true,
  className
}: BottomSheetProps) {
  const [currentSnapPoint, setCurrentSnapPoint] = useState(defaultSnapPoint);
  const [isDragging, setIsDragging] = useState(false);

  const sheetRef = useSwipeGesture<HTMLDivElement>({
    onSwipeDown: () => {
      const currentIndex = snapPoints.indexOf(currentSnapPoint);
      if (currentIndex > 0) {
        setCurrentSnapPoint(snapPoints[currentIndex - 1]);
      } else {
        onClose();
      }
    },
    onSwipeUp: () => {
      const currentIndex = snapPoints.indexOf(currentSnapPoint);
      if (currentIndex < snapPoints.length - 1) {
        setCurrentSnapPoint(snapPoints[currentIndex + 1]);
      }
    },
    threshold: 50
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-2xl shadow-xl",
          "transition-transform duration-300 ease-out",
          className
        )}
        style={{
          height: `${currentSnapPoint * 100}vh`,
          transform: isOpen ? 'translateY(0)' : 'translateY(100%)'
        }}
      >
        {/* Drag Indicator */}
        {showDragIndicator && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-8 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
          </div>
        )}

        {/* Header */}
        {title && (
          <div className="px-4 pb-2">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">
              {title}
            </h2>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}

// Action Sheet component for mobile actions
interface ActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  actions: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    variant?: 'default' | 'destructive';
    disabled?: boolean;
  }>;
  cancelLabel?: string;
}

export function ActionSheet({
  isOpen,
  onClose,
  title,
  actions,
  cancelLabel = 'Cancel'
}: ActionSheetProps) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Action Sheet */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
          {title && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 text-center">
                {title}
              </h3>
            </div>
          )}

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                disabled={action.disabled}
                className={cn(
                  "w-full px-4 py-3 text-left flex items-center space-x-3",
                  "hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "touch-manipulation min-h-[44px]",
                  action.variant === 'destructive' 
                    ? "text-red-600 dark:text-red-400" 
                    : "text-gray-900 dark:text-gray-100"
                )}
              >
                {action.icon && (
                  <span className="flex-shrink-0">
                    {action.icon}
                  </span>
                )}
                <span className="font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onClose}
          className="w-full mt-2 bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors touch-manipulation min-h-[44px]"
        >
          {cancelLabel}
        </button>
      </div>
    </div>,
    document.body
  );
}
