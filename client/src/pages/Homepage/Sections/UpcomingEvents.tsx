import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner2 from "../../../components/Spinner/Spinner2";
import { EVENT_TYPE } from "../../../recoil";

function UpcomingEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/event/upcoming?limit=3&skip=1`
        );
        setLoading(false);
        setEvents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <section id="UpcomingEvents" className="pt-10 pb-14 bg-gradient-to-b from-white to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeIn">
              Upcoming Events
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto relative overflow-hidden">
              <div className="absolute h-full w-full bg-blue-400 animate-slide"></div>
            </div>
          </div>
          {loading ? (
            <Spinner2 />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: EVENT_TYPE, index) => {
                return (
                  <div
                    className="group bg-white cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInUp"
                    key={index}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <div className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-300">
                        {event.images && event.images[0] ? (
                          <img
                            src={`${import.meta.env.VITE_STATIC_BACKEND_URL}${
                              event.images[0]
                            }`}
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full bg-gray-200">
                            <p className="text-gray-500 text-2xl font-semibold">
                              Event Image
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full">
                        ₹{event.general_ticket_price}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-neutral-900 line-clamp-1 overflow-hidden">
                        {event.title}
                      </h3>
                      <div className="flex items-center text-neutral-600 mt-2">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        <span>
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center text-neutral-600 mt-2">
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          ></path>
                        </svg>
                        <span>{event.location[0].venue}</span>
                      </div>
                      <p className="mt-4 text-neutral-600 line-clamp-2 overflow-hidden">
                        {event.description}
                      </p>
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                        Book Tickets
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default UpcomingEvents;
