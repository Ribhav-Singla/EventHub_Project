import { useFormContext } from "react-hook-form";
import { useRecoilState } from "recoil";
import { eventState } from "../../../../recoil";

type Inputs = {
  organizer_details: {
    phone: string;
    email: string;
  };
};

function EventOrganizer() {
  const [eventData, setEventData] = useRecoilState(eventState);

  const {
    register,
    formState: { errors },
  } = useFormContext<Inputs>();

  const hanleOrganizerEmailChange = (
    field: keyof Inputs["organizer_details"],
    value: string
  ) => {
    setEventData((prev) => ({
      ...prev,
      organizer_details: [
        {
          ...prev.organizer_details[0],
          user: {
            ...prev.organizer_details[0].user,
            [field]: value,
          },
        },
      ],
    }));
  };

  const hanleOrganizerPhoneChange = (
    field: keyof Inputs["organizer_details"],
    value: string
  ) => {
    setEventData((prev) => ({
      ...prev,
      organizer_details: [
        {
          ...prev.organizer_details[0],

          [field]: value,
        },
      ],
    }));
  };

  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-gray-300">Organizer Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Phone Number
            </label>
            <input
              {...register("organizer_details.phone", {
                required: "Phone number is required",
                minLength: {
                  value: 10,
                  message: "Phone number must be exactly 10 digits",
                },
                maxLength: {
                  value: 10,
                  message: "Phone number must be exactly 10 digits",
                },
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be numeric and exactly 10 digits",
                },
                onChange: (e) => hanleOrganizerPhoneChange("phone", e.target.value),
              })}
              type="text"
              className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+1 (123) 456-7890"
              value={eventData.organizer_details[0]?.phone || ""}
            />
            {errors.organizer_details?.phone && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizer_details?.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400">
              Email
            </label>
            <input
              {...register("organizer_details.email", {
                required: "Email is required",
                maxLength: {
                  value: 50,
                  message: "Email cannot exceed 50 characters",
                },
                pattern: {
                  value: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Enter a valid email address",
                },
                onChange: (e) =>
                  hanleOrganizerEmailChange("email", e.target.value),
              })}
              type="email"
              className="mt-1 block w-full px-3 py-2 outline-none border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="organizer@example.com"
              value={eventData.organizer_details[0]?.user.email || ""}
            />
            <p className="text-right text-gray-400"><span className="text-red-500">*</span>Organizer's email must be registered</p>
            {errors.organizer_details?.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.organizer_details?.email.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventOrganizer;
