import { useRef, useEffect, RefObject } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

interface TouchPosition {
  x: number;
  y: number;
}

export function useSwipeGesture<T extends HTMLElement>(
  options: SwipeGestureOptions = {}
): RefObject<T> {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmoveEvent = false
  } = options;

  const elementRef = useRef<T>(null);
  const startTouch = useRef<TouchPosition | null>(null);
  const currentTouch = useRef<TouchPosition | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      };
      currentTouch.current = startTouch.current;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (preventDefaultTouchmoveEvent) {
        e.preventDefault();
      }

      const touch = e.touches[0];
      currentTouch.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };

    const handleTouchEnd = () => {
      if (!startTouch.current || !currentTouch.current) return;

      const deltaX = currentTouch.current.x - startTouch.current.x;
      const deltaY = currentTouch.current.y - startTouch.current.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // Determine if this is a horizontal or vertical swipe
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > threshold) {
          if (deltaX > 0) {
            onSwipeRight?.();
          } else {
            onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY > threshold) {
          if (deltaY > 0) {
            onSwipeDown?.();
          } else {
            onSwipeUp?.();
          }
        }
      }

      // Reset touch positions
      startTouch.current = null;
      currentTouch.current = null;
    };

    const handleTouchCancel = () => {
      startTouch.current = null;
      currentTouch.current = null;
    };

    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: !preventDefaultTouchmoveEvent });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchCancel, { passive: true });

    // Cleanup
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, preventDefaultTouchmoveEvent]);

  return elementRef;
}

// Hook for haptic feedback
export function useHapticFeedback() {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'selection' = 'light') => {
    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(50);
          break;
        case 'selection':
          navigator.vibrate([5, 5]);
          break;
      }
    }

    // For iOS devices with haptic feedback API
    if ('hapticFeedback' in window) {
      try {
        switch (type) {
          case 'light':
            (window as any).hapticFeedback.impactOccurred('light');
            break;
          case 'medium':
            (window as any).hapticFeedback.impactOccurred('medium');
            break;
          case 'heavy':
            (window as any).hapticFeedback.impactOccurred('heavy');
            break;
          case 'selection':
            (window as any).hapticFeedback.selectionChanged();
            break;
        }
      } catch (error) {
        // Fallback to vibration if haptic feedback fails
        navigator.vibrate?.(10);
      }
    }
  };

  return { triggerHaptic };
}

// Hook for touch-friendly interactions
export function useTouchInteraction() {
  const handleTouchStart = (callback?: () => void) => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = 'scale(0.98)';
    e.currentTarget.style.transition = 'transform 0.1s ease';
    callback?.();
  };

  const handleTouchEnd = (callback?: () => void) => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = 'scale(1)';
    setTimeout(() => {
      e.currentTarget.style.transition = '';
    }, 100);
    callback?.();
  };

  const handleTouchCancel = () => (e: React.TouchEvent) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.transition = '';
  };

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchCancel
  };
}

// Hook for pull-to-refresh functionality
export function usePullToRefresh(onRefresh: () => Promise<void> | void) {
  const elementRef = useRef<HTMLElement>(null);
  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const isRefreshing = useRef<boolean>(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (element.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (element.scrollTop === 0 && !isRefreshing.current) {
        currentY.current = e.touches[0].clientY;
        const pullDistance = currentY.current - startY.current;

        if (pullDistance > 0) {
          e.preventDefault();
          const pullRatio = Math.min(pullDistance / 100, 1);
          element.style.transform = `translateY(${pullDistance * 0.5}px)`;
          element.style.opacity = (1 - pullRatio * 0.3).toString();
        }
      }
    };

    const handleTouchEnd = async () => {
      if (element.scrollTop === 0 && !isRefreshing.current) {
        const pullDistance = currentY.current - startY.current;

        if (pullDistance > 80) {
          isRefreshing.current = true;
          element.style.transform = 'translateY(40px)';
          
          try {
            await onRefresh();
          } finally {
            isRefreshing.current = false;
            element.style.transform = '';
            element.style.opacity = '';
            element.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
            
            setTimeout(() => {
              element.style.transition = '';
            }, 300);
          }
        } else {
          element.style.transform = '';
          element.style.opacity = '';
          element.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
          
          setTimeout(() => {
            element.style.transition = '';
          }, 200);
        }
      }

      startY.current = 0;
      currentY.current = 0;
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onRefresh]);

  return elementRef;
}
