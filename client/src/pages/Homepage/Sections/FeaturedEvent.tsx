import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { EVENT_TYPE } from "../../../recoil";
import EventTimer from "../../../components/EventTimer/EventTimer";
import { extractTimeRange, formatDate } from "../../../utils";
import Spinner2 from "../../../components/Spinner/Spinner2";

export default function () {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/event/upcoming?limit=1`
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
    <>
      <section
        id="featuredEvent"
        className="pt-10 pb-5 bg-gradient-to-b from-white to-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 relative">
            <h2 className="text-4xl font-bold text-neutral-900 mb-4 animate__animated animate__fadeIn">
              Latest Featured Event
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto relative overflow-hidden">
              <div className="absolute h-full w-full bg-blue-400 animate-slide"></div>
            </div>
          </div>

          {loading ? (
            <Spinner2 />
          ) : (
            <>
              {events.map((event: EVENT_TYPE, index: number) => {
                return (
                  <div
                    className="flex flex-col lg:flex-row gap-8 bg-white rounded-xl cursor-pointer shadow-lg overflow-hidden animate__animated animate__fadeInUp"
                    key={index}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    <div className="lg:w-1/2 overflow-hidden group">
                      <div className="bg-neutral-300 h-full w-full relative overflow-hidden transition-transform duration-500 group-hover:scale-105">
                        {event.images && event.images[0] ? (
                          <img
                            src={`${import.meta.env.VITE_STATIC_BACKEND_URL}${
                              event.images[0]
                            }`}
                            className="bg-cover h-full w-full"
                          />
                        ) : (
                          <div className="flex justify-center items-center h-full bg-gray-200">
                            <p className="text-gray-500 text-2xl font-semibold">
                              Event Image
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:w-1/2 p-8">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-bold text-neutral-800 font-montserrat">
                          {event.title}
                        </h3>
                        <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-semibold">
                          ₹{event.general_ticket_price}
                        </span>
                      </div>

                      <div className="mb-3 space-y-1">
                        <div className="flex items-center text-neutral-600">
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
                            />
                          </svg>
                          <span>
                            {formatDate(event.date)} |{" "}
                            {extractTimeRange(event.time_frame)}
                          </span>
                        </div>
                        <div className="flex items-center text-neutral-600">
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
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>Central Park Amphitheater</span>
                        </div>
                      </div>

                      <p className="text-neutral-600 mb-4 line-clamp-3 overflow-hidden">
                        {event.description}
                      </p>
                      <EventTimer date={event.date} />
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>
    </>
  );
}
