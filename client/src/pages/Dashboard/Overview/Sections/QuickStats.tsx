import Metrics from "./Metrics";
import Upcoming from "./Upcoming";

function QuickStats({ metrics, upcomingEvents }:{metrics: {
  totalEvents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  conversionRate: string;
},upcomingEvents:any}) {
  return (
    <div className="p-5 pb-0">
      <Metrics metrics={metrics} />
      <Upcoming upcomingEvents={upcomingEvents} />
    </div>
  );
}

export default QuickStats;
