import Pagination from "@mui/material/Pagination";
import FilterEvents from "../../components/FilterEvents/FilterEvents";
import { useEffect, useState } from "react";
import Spinner2 from "../../components/Spinner/Spinner2";
import axios from "axios";
import { EVENT_TYPE, FILTER_STATE, filterState } from "../../recoil";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { formatFilterObj, validateStatus } from "../../utils";

function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total_events, setTotalEvents] = useState(0);
  const [page, setPage] = useState(1);
  const [filterApplied, setFilterApplied] = useState(false);
  const filterObj: FILTER_STATE = useRecoilValue(filterState);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);

        // Format the filter object
        const formattedFilters = formatFilterObj(filterObj);

        // Convert the formatted filters to query params
        const queryParams = new URLSearchParams();

        for (const [key, value] of Object.entries(formattedFilters)) {
          if (Array.isArray(value)) {
            value.forEach((v) => queryParams.append(key, v));
          } else {
            queryParams.append(key, value);
          }
        }

        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/event/?page=${page}&${queryParams.toString()}`
        );
        setLoading(false);
        setEvents(response.data.events);
        setTotalEvents(response.data.total_events);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, [page, filterApplied]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-100">
        <Spinner2 />
      </div>
    );
  }

  return (
    <div>
      <FilterEvents setFilterApplied={setFilterApplied} setPage={setPage}/>

      {events && events.length ? (
        <>
          <section id="Events" className="pt-2 pb-10 bg-neutral-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event: EVENT_TYPE, index) => {
                  return (
                    <div
                      className="group bg-white cursor-pointer rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate__animated animate__fadeInUp"
                      key={index}
                      onClick={() =>
                        validateStatus(event.date)
                          ? navigate(`/event/${event.id}`)
                          : ""
                      }
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
                        <div className="mt-3">
                          {validateStatus(event.date) ? (
                            <button
                              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold"
                              onClick={() => navigate(`/event/${event.id}`)}
                            >
                              Buy Tickets
                            </button>
                          ) : (
                            <button
                              className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed font-semibold"
                              disabled
                            >
                              Event Closed
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <div className="flex justify-center bg-neutral-100 pb-10">
            <Pagination
              count={Math.ceil(total_events / 9)}
              page={page}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </>
      ) : (
        <>
          {/* Empty State */}
          <div className="bg-neutral-100 border border-neutral-200/20 rounded-lg text-center py-20 pb-24">
            <h3 className="mt-2 text-sm font-medium text-neutral-900">
              No events
            </h3>
            <p className="mt-1 text-sm text-neutral-500">
              Start publishing events you're interested in attending.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Events;
