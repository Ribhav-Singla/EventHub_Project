import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import axios from "axios";
import { extractTimeRange, formatDate } from "../../../utils";
import Metrics from "./Sections/Metrics";
import TicketsTypeSoldChart from "./Sections/TicketsTypeSoldChart";
import RevenueChart from "./Sections/RevenueChart";
import PaymentTypeChart from "./Sections/PaymentTypeChart";
import { ArrowUpward, ArrowDownward, Remove } from "@mui/icons-material";

function EventAnalytics() {
  const eventId = useParams().eventId;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    id: "",
    title: "",
    type: "",
    category: "",
    date: "",
    time_frame: [],
    vip_tickets_count: 0,
    general_tickets_count: 0,
    todayLabel: "",
    todayRevenue: 0,
    revenueChange: {
      amount: 0,
      percentage: "",
      direction: "",
    },
    metrics: {
      totalRevenue: 0,
      totalTicketsSold: 0,
      maleAttendees: 0,
      femaleAttendees: 0,
      averageTicketPrice: 0,
    },
    ticketsTypeSoldChart: {},
    revenueTrendChart: {},
    paymentTypeChart: {},
  });

  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/dashboard/analytics/${eventId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetch_data();
  }, [eventId]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#000a26]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#000a26]">
      {/* Event details */}
      <div className="flex flex-col md:flex-row justify-between mb-6 bg-[#000a26] border border-neutral-200/20 p-4 rounded-lg">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-semibold text-white">{data.title}</h1>
          <p className="text-lg text-gray-300">
            {data.type} | {data.category}
          </p>
        </div>
        <div className="text-left md:text-right text-gray-400">
          <p className="font-medium">
            <span className="font-semibold text-gray-300">Date:</span>{" "}
            {formatDate(data.date)}
          </p>
          <p className="font-medium">
            <span className="font-semibold text-gray-300">Time Range:</span>{" "}
            {extractTimeRange(data.time_frame)}
          </p>
        </div>
      </div>

      {/* Metrics card */}
      <Metrics metrics={data.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-5">
        <TicketsTypeSoldChart chartData={data.ticketsTypeSoldChart} />
        {/* PaymentTypeChart */}
        <PaymentTypeChart chartData={data.paymentTypeChart} />
        {/* Vertical metrics info */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-5">
        {/* RevenueChart spanning 3 columns */}
        <div className="lg:col-span-3">
          <RevenueChart chartData={data.revenueTrendChart} />
        </div>
        <div className="gap-5 flex flex-col">
          {/* Revenue trend comparison */}
          <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm">Today's Revenue</h3>
              {data.revenueChange.direction === "increase" ? (
                <ArrowUpward className="w-5 h-5 text-green-500" />
              ) : data.revenueChange.direction === "decrease" ? (
                <ArrowDownward className="w-5 h-5 text-red-500" />
              ) : (
                <Remove className="w-5 h-5 text-gray-500" />
              )}
            </div>
            <p className="text-2xl font-semibold mt-2 text-gray-300">
              ${data.todayRevenue.toFixed(2)}
            </p>
            <div
              className={`text-sm mt-1 flex justify-between ${
                data.revenueChange.direction === "increase"
                  ? "text-green-500"
                  : data.revenueChange.direction === "decrease"
                  ? "text-red-500"
                  : "text-gray-500"
              }`}
            >
              <p>{data.revenueChange.amount.toFixed(2)}</p>
              <p> ({data.revenueChange.percentage}%)</p>
            </div>
          </div>
          {/* General tickets count */}
          <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm">
                Total general tickets count
              </h3>
              <svg
                className="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
            </div>
            <p className="text-2xl font-semibold mt-2 text-gray-300">
              {data.general_tickets_count == -1
                ? "Unlimited"
                : data.general_tickets_count}
            </p>
          </div>
          {/* vip tickets count */}
          <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-sm">
                Total vip tickets count
              </h3>
              <svg
                className="w-5 h-5 text-purple-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                ></path>
              </svg>
            </div>
            <p className="text-2xl font-semibold mt-2 text-gray-300">
              {data.vip_tickets_count == -1
                ? "Unlimited"
                : data.vip_tickets_count}
            </p>
          </div>

          <div className="bg-[#000a26] p-[10px] rounded-lg border border-neutral-200/20">
            <p className="text-gray-300 text-center">
              More features coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventAnalytics;
