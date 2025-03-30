import { useEffect, useState } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { eventState } from "../../../recoil";
import { useForm, FormProvider } from "react-hook-form";
import { publishEvent, updateEvent } from "../../../utils";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import EventImages from "./Sections/EventImages";
import EventDateTime from "./Sections/EventDateTime";
import EventInfo from "./Sections/EventInfo";
import EventPrice from "./Sections/EventPrice";
import EventLocation from "./Sections/EventLocation";
import EventOrganizer from "./Sections/EventOrganizer";

export default function Publish() {
  const navigate = useNavigate();
  const location = useLocation();
  const eventData = useRecoilValue(eventState);
  const resetEventState = useResetRecoilState(eventState);
  const [btnLoader, setBtnLoader] = useState(false);

  const methods = useForm({
    defaultValues: {
      title: eventData?.title || "",
      type: eventData?.type || "",
      category: eventData?.category || "",
      description: eventData?.description || "",
      date: eventData?.date || "",
      time_frame: eventData?.time_frame || "",
      location: eventData?.location || "",
      images: eventData?.images || [],
      organizer_details: eventData?.organizer_details || {},
    },
  });

  const onSubmit = async (_: any) => {
    setBtnLoader(true);
    const response = !location.pathname.includes("update")
      ? await toast.promise(publishEvent(eventData), {
          loading: "Publishing...",
          success: "Published, redirecting!",
          error: "Internal server error!",
        })
      : await toast.promise(updateEvent(eventData), {
          loading: "Updating...",
          success: "Updated, redirecting!",
          error: "Internal server error!",
        });

    setBtnLoader(false);
    setTimeout(() => {
      if (response.eventId) {
        navigate(`/event/${response.eventId}`);
      }
    }, 500);
  };

  useEffect(() => {
    if (!location.pathname.includes("update")) {
      resetEventState();
    }
    window.scrollTo(0, 0);
  }, [location.pathname, resetEventState]);

  useEffect(() => {
    if (eventData && methods.reset) {
      methods.reset({
        title: eventData?.title,
        type: eventData?.type,
        category: eventData?.category,
        description: eventData?.description,
        date: eventData?.date,
        time_frame: eventData?.time_frame,
        location: eventData?.location,
        images: eventData?.images,
        organizer_details: eventData?.organizer_details,
      });
    }
  }, [eventData, methods]);

  const headingText = location.pathname.includes("update")
    ? "Update Event"
    : "Create New Event";

  return (
    <div className="bg-[#000a26]">
      <section id="EventCreationForm" className="container mx-auto p-5">
        <div className="max-w-6xl mx-auto bg-[#000a26] rounded-lg shadow-sm border border-neutral-200/20 p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">
            {headingText}
          </h1>
          <FormProvider {...methods}>
            <form
              className="space-y-8"
              onSubmit={methods.handleSubmit(onSubmit)}
            >
              {/* Event Information */}
              <EventInfo />

              {/* Pricing and Tickets */}
              <EventPrice />

              {/* Date and Time */}
              <EventDateTime />

              {/* Location */}
              <EventLocation />

              {/* Image Upload */}
              <EventImages />

              {/* Organizer Details */}
              <EventOrganizer />

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  disabled={btnLoader}
                >
                  {btnLoader
                    ? "Please wait"
                    : location.pathname.includes("update")
                    ? "Update Event"
                    : "Create Event"}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </div>
  );
}
