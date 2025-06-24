import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useHapticFeedback } from '@/hooks/useSwipeGesture';

interface SwipeableTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
  }>;
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  enableSwipe?: boolean;
}

export function SwipeableTabs({
  tabs,
  defaultTab,
  onTabChange,
  className,
  enableSwipe = true
}: SwipeableTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { triggerHaptic } = useHapticFeedback();
  
  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    if (tabId !== activeTab && !isTransitioning) {
      setIsTransitioning(true);
      setActiveTab(tabId);
      onTabChange?.(tabId);
      triggerHaptic('selection');
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handleSwipeLeft = () => {
    if (enableSwipe && currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id);
    }
  };

  const handleSwipeRight = () => {
    if (enableSwipe && currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    }
  };

  const contentRef = useSwipeGesture<HTMLDivElement>({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
    threshold: 50
  });

  return (
    <div className={cn("w-full", className)}>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap",
                "border-b-2 transition-all duration-200 touch-manipulation",
                "hover:text-blue-600 dark:hover:text-blue-400",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              )}
            >
              {tab.icon && (
                <span className="flex-shrink-0">
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div 
        ref={contentRef}
        className={cn(
          "relative overflow-hidden",
          isTransitioning && "transition-transform duration-300 ease-in-out"
        )}
      >
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${tabs.length * 100}%`
          }}
        >
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="w-full flex-shrink-0"
              style={{ width: `${100 / tabs.length}%` }}
            >
              <div className="p-4">
                {tab.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Swipe Indicator (Mobile) */}
      {enableSwipe && tabs.length > 1 && (
        <div className="flex justify-center mt-4 space-x-1 sm:hidden">
          {tabs.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-colors duration-200",
                index === currentIndex
                  ? "bg-blue-500"
                  : "bg-gray-300 dark:bg-gray-600"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Enhanced Tab Navigation with Swipe Support
interface SwipeableTabNavigationProps {
  tabs: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function SwipeableTabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className
}: SwipeableTabNavigationProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHapticFeedback();

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    triggerHaptic('selection');
  };

  // Auto-scroll to active tab
  useEffect(() => {
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    const scrollContainer = scrollRef.current;
    
    if (scrollContainer && activeIndex !== -1) {
      const tabElement = scrollContainer.children[activeIndex] as HTMLElement;
      if (tabElement) {
        tabElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  }, [activeTab, tabs]);

  return (
    <div className={cn("border-b border-gray-200 dark:border-gray-700", className)}>
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide space-x-1 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={cn(
              "flex items-center space-x-2 px-3 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg",
              "transition-all duration-200 touch-manipulation min-h-[44px]",
              "hover:bg-gray-50 dark:hover:bg-gray-800",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-blue-600 dark:text-blue-400 border-b-2 border-blue-500"
                : "text-gray-600 dark:text-gray-400 border-b-2 border-transparent"
            )}
          >
            {tab.icon && (
              <span className="flex-shrink-0">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full min-w-[1.25rem] h-5 flex items-center justify-center">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
