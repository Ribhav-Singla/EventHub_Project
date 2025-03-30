import { useState, useEffect } from "react";
import axios from "axios";
import QuickStats from "./Sections/QuickStats";
import Activity from "./Sections/Activity";
import Spinner from "../../../components/Spinner/Spinner";

function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    totalRevenue: 0,
    totalTicketsSold: 0,
    conversionRate: "0",
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [activity, setActivity] = useState({
    events: [],
    transactions: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [overviewResponse, activityResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/user/dashboard/overview`,
            {
              headers: { Authorization: `${token}` },
            }
          ),
          axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/user/dashboard/overview/recent-activity`,
            {
              headers: { Authorization: `${token}` },
            }
          ),
        ]);

        setMetrics(overviewResponse.data.metrics);
        setUpcomingEvents(overviewResponse.data.upcomingEvents);
        setActivity(activityResponse.data);
      } catch (err) {
        setError("Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-72px)] bg-[#000a26]">
        <Spinner />
      </div>
    );

  if (error) return <div className="text-center text-red-500 bg-[#000a26]">{error}</div>;

  return (
    <div className="lg:w-[calc(100vw-255px)] w-screen bg-[#000a26] h-screen">
      <QuickStats metrics={metrics} upcomingEvents={upcomingEvents} />
      <Activity activity={activity} />
    </div>
  );
}

export default Overview;
