import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import axios from "axios";
import { EVENT_TYPE } from "../../../recoil";
import { deleteEvent, formatDate } from "../../../utils";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../lib/useDebounce";

function ManageEvents() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [total_events, setTotalEvents] = useState(0);
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [title, setTitle] = useState("");

  const debounced_status = useDebounce(status, 500);
  const debounced_category = useDebounce(category, 500);
  const debounced_title = useDebounce(title, 1000);

  const fetch_events = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/events/?page=${page}&category=${category}&title=${title}&status=${status}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setEvents(response.data.events);
      setTotalEvents(response.data.total_events);
      setPage(1);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetch_events();
  }, [page, debounced_category, debounced_title, debounced_status]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleDeleteEvent = async (eventId: string, eventTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the event "${eventTitle}"?`
    );
    if (confirmed) {
      try {
        await deleteEvent(eventId);
        await fetch_events();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="p-5 bg-[#000a26] h-screen">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Manage Events</h2>
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            ></path>
          </svg>
          <span onClick={() => navigate("/dashboard/publish")}>
            Create New Event
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 my-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-white">
              Status
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-neutral-200/20 shadow-sm p-2"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Category
            </label>
            <select
              className="mt-1 block w-full rounded-md border border-neutral-200/20 shadow-sm p-2"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Categories</option>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-white">
              Search
            </label>
            <input
              type="text"
              placeholder="Search events..."
              className="mt-1 block w-full rounded-md border border-neutral-200/60 outline-none shadow-sm p-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#000a26]">
          <Spinner />
        </div>
      ) : (
        <>
          {events.length ? (
            <>
              {/* Events Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#00a26]">
                {events.map((event: EVENT_TYPE, index) => {
                  return (
                    <div
                      className="bg-[#000a26] border border-neutral-200/20 rounded-lg overflow-hidden"
                      key={index}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-lg font-semibold truncate text-white"
                              title={event.title}
                            >
                              {event.title.length > 20
                                ? `${event.title.slice(0, 20)}...`
                                : event.title}
                            </h3>
                            <p className="text-sm text-gray-300">
                              {event.location[0].city},{" "}
                              {event.location[0].country}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-500 hover:text-blue-600"
                              onClick={() =>
                                navigate(`/dashboard/update/${event.id}`)
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                ></path>
                              </svg>
                            </button>
                            <button
                              className="text-red-500 hover:text-red-600"
                              onClick={() =>
                                handleDeleteEvent(event.id, event.title)
                              }
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                ></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Date:</span>
                            <span className="text-gray-400">
                              {formatDate(event.date).slice(
                                formatDate(event.date).indexOf(",") + 2
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-300">
                              Tickets Sold:
                            </span>
                            <span className="text-gray-400">
                              {(event as any).general_tickets_sold +
                                (event as any).vip_tickets_sold}
                              {event.general_tickets_count != -1 &&
                              event.vip_tickets_count != -1
                                ? ` / ${
                                    event.general_tickets_count +
                                    event.vip_tickets_count
                                  }`
                                : ""}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-2">
                            <span className="text-gray-300">Revenue:</span>
                            <span className="text-gray-400">
                              $
                              {Number(event.general_ticket_price) *
                                (event as any).general_tickets_sold +
                                Number(event.vip_ticket_price) *
                                  (event as any).vip_tickets_sold}
                            </span>
                          </div>
                        </div>
                        {event.general_tickets_count != -1 &&
                        event.vip_tickets_count != -1 ? (
                          <div className="mt-4">
                            <div className="w-full bg-neutral-400 rounded-full h-2">
                              <div
                                className="bg-blue-500 rounded-full h-2"
                                style={{
                                  width: `${
                                    ((Number((event as any).vip_tickets_sold) +
                                      Number(
                                        (event as any).general_tickets_sold
                                      )) /
                                      (Number(event.vip_tickets_count) +
                                        Number(event.general_tickets_count))) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-sm text-neutral-500 mt-1">
                              {`${Math.round(
                                ((Number((event as any).vip_tickets_sold) +
                                  Number((event as any).general_tickets_sold)) /
                                  (Number(event.vip_tickets_count) +
                                    Number(event.general_tickets_count))) *
                                  100
                              )}% tickets sold`}
                            </p>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="border-t border-neutral-200/20 p-4 flex justify-between items-center">
                        <button
                          className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                          onClick={() =>
                            navigate(`/dashboard/analytics/event/${event.id}`)
                          }
                        >
                          View Analytics →
                        </button>
                        <br />
                        <button
                          className="text-red-500 hover:text-red-600 text-sm font-medium"
                          onClick={() =>
                            navigate(
                              `/dashboard/event/registrations/${event.id}`
                            )
                          }
                        >
                          View Registrations →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-end border-t bg-[#000a26] border-neutral-200/20 py-4 mt-5">
                <Pagination
                  count={Math.ceil(total_events / 6)}
                  page={page}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  sx={{
                    backgroundColor: "#000a26",
                    color: "white",
                    "& .MuiPaginationItem-root": {
                      color: "white", 
                      borderColor: "white",
                    },
                    "& .MuiPaginationItem-outlined": {
                      borderColor: "white",
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <>
              {/* Empty State */}
              <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-8 text-center mt-5">
                <h3 className="mt-2 text-sm font-medium text-white">
                  No events
                </h3>
                <p className="mt-1 text-sm text-gray-300">
                  Start publishing events you're interested in attending.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default ManageEvents;
