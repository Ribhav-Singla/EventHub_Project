import { useEffect, useState } from "react";
import moment from "moment-timezone";

function EventTimer({ date }: { date: string }) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const eventDate = new Date(date);
    const interval = setInterval(() => {
      const currentDateTimeIST = moment.utc().add(5, 'hours').add(30, 'minutes').format('YYYY-MM-DDTHH:mm:ss[Z]');   
      const now = new Date(currentDateTimeIST);
      const diff = eventDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeRemaining({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <h3 className="text-xl font-bold text-[#212529] mb-3">
        Event Starts In:
      </h3>
      <div className="grid grid-cols-4 gap-2 text-center">
        {Object.entries(timeRemaining).map(([key, value]) => (
          <div key={key} className="bg-[#f8f9fa] p-3 rounded">
            <span className="block text-2xl font-bold text-blue-600 hover:text-blue-700">
              {value.toString().padStart(2, "0")}
            </span>
            <span className="text-sm text-[#6c757d]">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EventTimer;
