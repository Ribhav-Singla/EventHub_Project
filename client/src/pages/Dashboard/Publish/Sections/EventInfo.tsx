import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useRecoilState } from "recoil";
import { eventState } from "../../../../recoil";

type Inputs = {
  title: string;
  type: string;
  category: string;
  description: string;
};

function EventInfo() {
  const [eventData, setEventData] = useRecoilState(eventState);

  const {
    register,
    watch,
    formState: { errors },
    reset,
  } = useFormContext<Inputs>();

  const handleInputChange = (field: keyof Inputs, value: string) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const description = watch("description") || "";

  // Sync form with Recoil state
  useEffect(() => {
    reset({
      title: eventData.title,
      type: eventData.type,
      category: eventData.category,
      description: eventData.description,
    });
  }, [eventData, reset]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-300">Event Information</h2>

      {/* Event Title */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-400">
          Event Title
        </label>
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter event title"
            maxLength={100}
            value={eventData.title}
            {...register("title", {
              required: "Title is required",
              onChange: (e) => handleInputChange("title", e.target.value),
            })}
          />
          <span className="absolute right-2 top-2 text-sm text-gray-500">
            {watch("title")?.length || 0}/100
          </span>
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>
      </div>

      {/* Event Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Event Type
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.type}
            {...register("type", {
              required: "Event type is required",
              onChange: (e) => handleInputChange("type", e.target.value),
            })}
          >
            <option value="">Choose Type</option>
            <option value="Conference">Conference</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Networking">Networking</option>
            <option value="Webinar">Webinar</option>
            <option value="Meetup">Meetup</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Training">Training</option>
            <option value="Panel Discussion">Panel Discussion</option>
            <option value="Exhibition">Exhibition</option>
          </select>
          {errors.type && (
            <span className="text-red-500 text-sm">{errors.type.message}</span>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-400">
            Category
          </label>
          <select
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={eventData.category}
            {...register("category", {
              required: "Category is required",
              onChange: (e) => handleInputChange("category", e.target.value),
            })}
          >
            <option value="">Choose Category</option>
            <option value="Art">Art</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Health">Health</option>
            <option value="Music">Music</option>
            <option value="Science">Science</option>
            <option value="Sports">Sports</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Wellness">Wellness</option>
          </select>
          {errors.category && (
            <span className="text-red-500 text-sm">
              {errors.category.message}
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-400">
          Description
        </label>
        <textarea
          rows={4}
          className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter event description"
          value={eventData.description}
          maxLength={500}
          {...register("description", {
            required: "Description is required",
            onChange: (e) => handleInputChange("description", e.target.value),
          })}
        ></textarea>
        <div className="mt-1 flex justify-between text-sm text-gray-400">
          <span>{description.length}/500 words</span>
          <div className="w-48 h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${(description.length / 500) * 100}%` }}
            ></div>
          </div>
        </div>
        {errors.description && (
          <span className="text-red-500 text-sm">
            {errors.description.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default EventInfo;
