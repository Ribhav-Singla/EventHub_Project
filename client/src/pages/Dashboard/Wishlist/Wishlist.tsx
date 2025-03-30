import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../../../components/Spinner/Spinner";
import { addToWishlist, formatDate, validateStatus } from "../../../utils";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../lib/useDebounce";
import toast from "react-hot-toast";

function Wishlist() {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");

  const debounced_category = useDebounce(category, 500);
  const debounced_status = useDebounce(status, 500);

  useEffect(() => {
    const fetch_wishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/wishlist/?page=${page}&category=${category}&status=${status}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setWishlist(response.data.wishlist);
        setWishlistCount(response.data.wishlistCount);
        setPage(1);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetch_wishlist();
  }, [page, debounced_category, debounced_status]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const handleToggleWishlist = async (
    eventId: string,
    heart: boolean = false
  ) => {
    try {
      await addToWishlist(eventId, heart);
      toast.success("Removed from wishlist!");

      setWishlist((prevWishlist) =>
        // @ts-ignore
        prevWishlist.filter((item) => item.event.id !== eventId)
      );
      setWishlistCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="p-5 bg-[#000a26] h-screen">
      {/* Header with Filters */}
      <div className="flex justify-between sm:items-center sm:flex-row flex-col gap-4 sm:gap-0">
        <h2 className="text-xl font-semibold text-left text-white">
          My Wishlist
        </h2>
        <div className="flex sm:space-x-4 sm:flex-row flex-col w-full sm:w-fit gap-4 sm:gap-0">
          <select
            className="border border-neutral-200/20 bg-white rounded-lg px-4 py-2 w-full sm:w-fit"
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
          <select
            className="border border-neutral-200/20 bg-white rounded-lg px-4 py-2 w-full sm:w-fit"
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
      </div>

      {loading ? (
        <div className="mt-5">
          <Spinner />
        </div>
      ) : (
        <>
          {wishlist.length ? (
            <>
              {/* Wishlist Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
                {wishlist.map((item: any, index) => {
                  return (
                    <div
                      className="bg-[#000a26] border border-neutral-200/20 rounded-lg overflow-hidden"
                      key={index}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3
                              className="text-lg font-semibold truncate text-white"
                              title={item.event.title}
                            >
                              {item.event.title.length > 20
                                ? `${item.event.title.slice(0, 20)}...`
                                : item.event.title}
                            </h3>
                            <p className="text-sm text-gray-300">
                              {item.event.location[0].city},{" "}
                              {item.event.location[0].country}
                            </p>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              handleToggleWishlist(item.event.id, false)
                            }
                          >
                            <svg
                              className="w-6 h-6"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </button>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Date:</span>
                            <span className="text-gray-400">
                              {formatDate(item.event.date).slice(
                                formatDate(item.event.date).indexOf(",") + 2
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Price:</span>
                            <span className="text-gray-400">
                              ${item.event.general_ticket_price}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">Status:</span>
                            {validateStatus(item.event.date) ? (
                              <span className="text-green-500 font-semibold">
                                Active
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold">
                                Closed
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="mt-4">
                          {validateStatus(item.event.date) ? (
                            <button
                              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-semibold"
                              onClick={() =>
                                navigate(`/event/${item.event.id}`)
                              }
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

              {/* Pagination */}
              <div className="flex items-center justify-end border-t border-neutral-200/20 py-4 mt-5">
                <Pagination
                  count={Math.ceil(wishlistCount / 6)}
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
                <svg
                  className="mx-auto h-12 w-12 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">
                  No saved events
                </h3>
                <p className="mt-1 text-sm text-gray-400">
                  Start saving events you're interested in attending.
                </p>
                <div className="mt-6">
                  <button
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600"
                    onClick={() => navigate("/event/all")}
                  >
                    Browse Events
                  </button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Wishlist;
