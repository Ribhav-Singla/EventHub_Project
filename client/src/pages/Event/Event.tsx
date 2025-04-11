import ImageGallery from "./Sections/ImageGallery";
import EventSchedule from "./Sections/EventSchedule";
import EventOrganizer from "./Sections/EventOrganizer";
import EventTimer from "../../components/EventTimer/EventTimer";
import EventDetails from "./Sections/EventDetails";
import EventTickets from "./Sections/EventTickets";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { authState, EVENT_TYPE } from "../../recoil";
import Spinner2 from "../../components/Spinner/Spinner2";
import Wishlist from "../../components/Wishlist/Wishlist";
import { extractTimeRange } from "../../utils";
import ChatComponent from "../../components/ChatComponent/ChatComponent";
import { useRecoilValue } from "recoil";
import QRCodePopup from "../../components/QRCodePopup/QRCodePopup";
import { CommentSection } from "../../components/CommentSection/CommentSection";

function Event() {
  const eventId = useParams().eventId;
  const [event, setEvent] = useState<EVENT_TYPE | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [heart, setHeart] = useState(false);
  const auth = useRecoilValue(authState);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/event/${eventId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setEvent(response.data.event);
        setHeart(response.data.heart);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvent();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <Spinner2 />
      </div>
    );
  }

  if (!event) {
    return <div>Error: Event not found.</div>;
  }

  return (
    <div>
      <section
        id="eventDetails"
        className="min-h-screen bg-gradient-to-b from-white to-gray-100"
      >
        {/* Event Header Banner */}
        <div className="relative h-[35vh] bg-[#000a26]">
          <div className="absolute inset-0"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center sm:items-start">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate__fadeInUp">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-2 sm:gap-4 text-white animate__fadeInUp animate__delay-1s">
                  <span className="bg-blue-600 px-4 py-2 rounded-full text-sm">
                    {event.category}
                  </span>
                  <span className="bg-neutral-700 px-4 py-2 rounded-full text-sm">
                    {event.type}
                  </span>
                </div>
              </div>
              <div className="flex justify-end w-full sm:w-fit">
                <Wishlist eventId={eventId} heart={heart} />
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Event Information */}
            <div className="lg:w-2/3 space-y-8">
              <EventDetails
                title={event.title}
                description={event.description}
                date={event.date}
                time_frame={event.time_frame}
                location={event.location}
              />
              <EventSchedule time_frame={event.time_frame} />
              <ImageGallery images={event.images} />
            </div>

            {/* Right Column - Ticket Booking */}
            <div className="lg:w-1/3">
              <EventTickets
                eventId={eventId}
                vip_ticket_price={event.vip_ticket_price}
                vip_tickets_count={event.vip_tickets_count}
                vip_tickets_sold={(event as any).vip_tickets_sold}
                general_ticket_price={event.general_ticket_price}
                general_tickets_count={event.general_tickets_count}
                general_tickets_sold={(event as any).general_tickets_sold}
                event_title={event.title}
                event_category={event.category}
                event_date={event.date}
                event_time={extractTimeRange(event.time_frame)}
                event_venue={`${event.location[0].venue}, ${event.location[0].city}, ${event.location[0].country},`}
              />
              <div className="">
                <QRCodePopup
                  title={event.title}
                  url={`${window.location.origin}/event/${eventId}`}
                />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6 mt-8 animate__fadeIn">
                <EventTimer date={event.date} />
              </div>
              {/* Contact Organizer Section */}
              <EventOrganizer organizer_details={event.organizer_details} />
              {auth.isAuthenticated &&
                event.organizer_details?.[0]?.user &&
                auth.id !== (event.organizer_details[0].user as any).id && (
                  <ChatComponent
                    eventId={eventId}
                    organizerEmail={event.organizer_details[0].user.email}
                    organizerId={(event.organizer_details[0].user as any).id}
                  />
                )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-10">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Event Information */}
            <div className="lg:w-2/3 space-y-8">
              <CommentSection
                title={event.title}
                description={event.description}
              />
            </div>

            {/* Right Column */}
            <div className="lg:w-1/3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Event;
