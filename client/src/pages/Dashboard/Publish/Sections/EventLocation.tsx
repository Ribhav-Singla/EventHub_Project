import { useFormContext } from "react-hook-form";
import { useRecoilState } from "recoil";
import { eventState } from "../../../../recoil";

type Inputs = {
  location: {
    venue: string;
    city: string;
    country: string;
  };
};

function EventLocation() {
  const [eventData, setEventData] = useRecoilState(eventState);

  const {
    register,
    formState: { errors },
  } = useFormContext<Inputs>();

  const handleInputChange = (
    field: keyof Inputs["location"],
    value: string
  ) => {
    setEventData((prev) => ({
      ...prev,
      location: [
        {
          ...prev.location[0], // Ensure you're updating the first object in the array
          [field]: value,
        },
      ],
    }));
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-300">Location</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Venue Name
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 outline-none border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter venue name"
              {...register("location.venue", {
                required: "Venue name is required",
                maxLength: {
                  value: 50,
                  message:
                    "Venue name must be less than or equal to 50 characters",
                },
              })}
              value={eventData.location[0]?.venue || ""}
              onChange={(e) => handleInputChange("venue", e.target.value)}
            />
            {errors.location?.venue && (
              <p className="mt-1 text-sm text-red-500">
                {errors.location.venue.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              City
            </label>
            <input
              type="text"
              className={`mt-1 block w-full px-3 py-2 outline-none border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter city"
              {...register("location.city", {
                required: "City is required",
                maxLength: {
                  value: 50,
                  message: "City must be less than or equal to 50 characters",
                },
              })}
              value={eventData.location[0]?.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
            />
            {errors.location?.city && (
              <p className="mt-1 text-sm text-red-500">
                {errors.location.city.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">
            Country
          </label>
          <select
            className={`mt-1 block w-full px-3 py-2 border rounded-md border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
            {...register("location.country", {
              required: "Country is required",
            })}
            value={eventData.location[0]?.country || ""}
            onChange={(e) => handleInputChange("country", e.target.value)}
          >
            <option value="">Select Country</option>
            <option value="Australia">Australia</option>
            <option value="Canada">Canada</option>
            <option value="China">China</option>
            <option value="France">France</option>
            <option value="Germany">Germany</option>
            <option value="India">India</option>
            <option value="Japan">Japan</option>
            <option value="N/A">N/A</option>
            <option value="South Korea">South Korea</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United States">United States</option>
          </select>
          {errors.location?.country && (
            <p className="mt-1 text-sm text-red-500">
              {errors.location.country.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventLocation;
