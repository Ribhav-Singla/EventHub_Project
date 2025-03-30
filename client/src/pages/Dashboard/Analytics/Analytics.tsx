import { useEffect, useState } from "react";
import Metrics from "./Sections/Metrics";
import TopPerforming from "./Sections/TopPerforming";
import Spinner from "../../../components/Spinner/Spinner";
import axios from "axios";
import { TOP_EVENT } from "../../../recoil";
import AttendeeChart from "./Sections/AttendeeChart";
import RevenueChart from "./Sections/RevenueChart";
import useDebounce from "../../../lib/useDebounce";

function Analytics() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    totalTicketsSold: 0,
    avgTicketPrice: "0",
  });
  const [topEvents, setTopEvents] = useState<TOP_EVENT[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [timePeriod, setTimePeriod] = useState("7");

  const debouncedTimePeriod = useDebounce(timePeriod, 500);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/dashboard/analytics?timePeriod=${timePeriod}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );

        setMetrics(response.data.metrics);
        setTopEvents(response.data.topEvents);
        setChartData(response.data.chartData);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetch_data();
  }, [debouncedTimePeriod]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#000a26]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-5 lg:w-[calc(100vw-255px)] w-screen bg-[#000a26]">
      {/* Time Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Analytics Overview</h2>
        <select
          className="bg-white border border-neutral-200/20 rounded-lg px-4 py-2"
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
        >
          <option value={"7"} defaultChecked>
            Last 7 days
          </option>
          <option value={"30"}>Last 30 days</option>
          <option value={"90"}>Last 3 months</option>
          <option value={"366"}>Last 12 months</option>
        </select>
      </div>
      <Metrics metrics={metrics} />
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Revenue Trend */}
        <RevenueChart chartData={chartData.revenueTrendAnalysis} />
        {/* Attendee Distribution */}
        <AttendeeChart chartData={chartData.ageDistribution} />
      </div>
      <TopPerforming topEvents={topEvents} />
    </div>
  );
}

export default Analytics;
