import { ChangeEvent } from "react";
import { useRecoilState } from "recoil";
import { eventState } from "../../../../recoil";

function EventDateTime() {
  const [eventData, setEventData] = useRecoilState(eventState);

  // Function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Function to format the API date (ISO 8601) to YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Update time slot values
  const handleInputChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const updatedTimeSlots = [...eventData.time_frame];
    updatedTimeSlots[index] = {
      ...updatedTimeSlots[index],
      [event.target.name]: event.target.value,
    };
    setEventData({ ...eventData, time_frame: updatedTimeSlots });
  };

  // Add a new time slot
  const handleAddSlot = (): void => {
    const updatedTimeSlots = [
      ...eventData.time_frame.slice(0, 1),
      { title: "", description: "", time: "" },
      ...eventData.time_frame.slice(1),
    ];
    setEventData({ ...eventData, time_frame: updatedTimeSlots });
  };

  // Remove a time slot
  const handleRemoveSlot = (index: number): void => {
    if (index > 0 && index < eventData.time_frame.length - 1) {
      const updatedTimeSlots = eventData.time_frame.filter((_, i) => i !== index);
      setEventData({ ...eventData, time_frame: updatedTimeSlots });
    }
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-300">Date and Time</h2>

        {/* Event Date Input */}
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Event Date
          </label>
          <input
            type="date"
            className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.date ? formatDate(eventData.date) : getTodayDate()}
            onChange={(e) =>
              setEventData({ ...eventData, date: e.target.value })
            }
            min={getTodayDate()} // Ensure the date cannot be earlier than today
          />
        </div>

        {/* Time Slots Section */}
        <div className="space-y-4 bg-[#000a26]">
          {eventData.time_frame.map((slot, index) => (
            <div key={index} className="p-4 border border-neutral-200/20 rounded-md bg-[#000a26]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Time Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={slot.title}
                    onChange={(e) => handleInputChange(index, e)}
                    className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder={
                      index === eventData.time_frame.length - 1
                        ? `e.g., Closing Ceremony`
                        : `e.g., Opening Ceremony`
                    }
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={slot.description}
                    onChange={(e) => handleInputChange(index, e)}
                    className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={slot.time}
                    onChange={(e) => handleInputChange(index, e)}
                    className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Only show remove button for slots between the fixed slots */}
              {index > 0 && index < eventData.time_frame.length - 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveSlot(index)}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-200 hover:bg-red-50"
                >
                  Remove Time Slot
                </button>
              )}
            </div>
          ))}

          {/* Button to add new time slot */}
          <button
            type="button"
            onClick={handleAddSlot}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Another Time Slot
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventDateTime;
