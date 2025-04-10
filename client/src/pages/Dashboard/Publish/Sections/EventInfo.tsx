import { useEffect, useState } from "react";
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
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    register,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useFormContext<Inputs>();

  const handleInputChange = (field: keyof Inputs, value: string) => {
    setEventData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const description = watch("description") || "";
  const title = watch("title") || "";
  const type = watch("type") || "";
  const category = watch("category") || "";

  // Generate description using GROQ AI
  const generateDescription = async () => {
    if (!title || !type || !category) {
      alert("Please fill in the title, type, and category fields first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that writes engaging event descriptions."
            },
            {
              role: "user",
              content: `Write a concise and engaging description (under 1450 characters) for an event with the following details:
              Title: ${title}
              Type: ${type}
              Category: ${category}
              
              Keep it professional but appealing. Don't use any placeholder text.`
            }
          ],
          max_tokens: 1200
        })
      });

      const data = await response.json();
      const generatedDescription = data.choices[0].message.content.trim().replace(/"/g, '');
      
      // Update both form and recoil state
      setValue("description", generatedDescription);
      handleInputChange("description", generatedDescription);
      
    } catch (error) {
      console.error("Error generating description:", error);
      alert("Failed to generate description. Please try again later.");
    } finally {
      setIsGenerating(false);
    }
  };

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
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-400">
            Description
          </label>
          <button
            type="button"
            className="text-sm px-3 py-2 mb-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            onClick={generateDescription}
            disabled={isGenerating || !title || !type || !category}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>Generate with AI</>
            )}
          </button>
        </div>
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
          <span>{description.length}/500 characters</span>
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