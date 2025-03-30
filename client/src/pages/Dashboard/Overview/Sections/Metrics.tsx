

function Metrics({
  metrics,
}: {
  metrics: {
    totalEvents: number;
    totalRevenue: number;
    totalTicketsSold: number;
    conversionRate: string;
  };
}) {
  return (
    <div>
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#000a26] border border-neutral-200/20 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Total Events</h3>
            <svg
              className="w-5 h-5 text-blue-500"
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
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-300">{metrics.totalEvents}</p>
          {/* <p className="text-sm text-green-500 mt-2">↑ 12% from last month</p> */}
        </div>

        <div className="p-4 bg-[#000a26] border border-neutral-200/20 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Total Revenue</h3>
            <svg
              className="w-5 h-5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-300">${metrics.totalRevenue}</p>
          {/* <p className="text-sm text-green-500 mt-2">↑ 8.2% from last month</p> */}
        </div>

        <div className="p-4 bg-[#000a26] border border-neutral-200/20 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Tickets Sold</h3>
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
          <p className="text-2xl font-bold mt-2 text-gray-300">{metrics.totalTicketsSold}</p>
          {/* <p className="text-sm text-red-500 mt-2">↓ 3.4% from last month</p> */}
        </div>

        <div className="p-4 bg-[#000a26] border border-neutral-200/20 rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-white">Conversion Rate</h3>
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <p className="text-2xl font-bold mt-2 text-gray-300">{metrics.conversionRate}%</p>
          {/* <p className="text-sm text-green-500 mt-2">↑ 4.2% from last month</p> */}
        </div>
      </div>
    </div>
  );
}

export default Metrics;
