import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface TransactionState {
  startedAt: number;
}

interface SessionTimerProps {
  eventId: string | undefined;
}

const SessionTimer: React.FC<SessionTimerProps> = ({ eventId }) => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const hasShownWarningRef = useRef<boolean>(false);
  
  const clearSession = useCallback(() => {
    if (timerIdRef.current) {
      window.clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    sessionStorage.removeItem('current-transaction');
  }, []);

  // Set up the timer once when component mounts
  useEffect(() => {
    const calculateTimeLeft = () => {
      const transactionData = sessionStorage.getItem('current-transaction');
      if (!transactionData) {
        return null;
      }

      try {
        const transactionState = JSON.parse(transactionData) as TransactionState;
        
        if (!transactionState?.startedAt) {
          return null;
        }

        const now = Date.now();
        const startTime = transactionState.startedAt;
        const timeLimit = 5 * 60 * 1000; // 5 minutes
        const remaining = timeLimit - (now - startTime);
        
        return Math.max(0, remaining);
      } catch (error) {
        console.error('Error parsing transaction state:', error);
        return null;
      }
    };

    // Initial calculation
    const initialTimeLeft = calculateTimeLeft();
    setTimeLeft(initialTimeLeft);

    // If no valid timer, don't set up interval
    if (initialTimeLeft === null) {
      return;
    }

    // Timer update function
    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      
      if (remaining === null) {
        clearSession();
        return;
      }
      
      setTimeLeft(remaining);
      
      // Show warning at 1 minute
      if (remaining <= 60000 && remaining > 59000 && !hasShownWarningRef.current) {
        toast.error('Session will expire in 1 minute!');
        hasShownWarningRef.current = true;
      }
      
      if (remaining === 0) {
        clearSession();
        toast.error('Session timeout! Please start over.');
        navigate(`/event/${eventId}`);
      }
    };

    // Update timer every second
    timerIdRef.current = window.setInterval(updateTimer, 1000);

    // Expose clearSession method
    (window as any).clearSessionTimer = clearSession;

    // Cleanup on unmount
    return () => {
      if (timerIdRef.current) {
        window.clearInterval(timerIdRef.current);
      }
      (window as any).clearSessionTimer = undefined;
    };
  }, [eventId, navigate, clearSession]);

  // If timeLeft is null, don't render the timer
  if (timeLeft === null) {
    return null;
  }

  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <span className={`${minutes < 2 ? 'text-red-600' : 'text-gray-600'}`}>
        ⏱️ Session expires in: {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default SessionTimer;