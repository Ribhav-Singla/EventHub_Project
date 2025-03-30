
function Metrics({
  metrics,
}: {
  metrics: {
    totalRevenue: number;
    totalTicketsSold: number;
    avgTicketPrice: string;
  };
}) {
  return (
    <div>
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5">
        <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-300">${metrics.totalRevenue}.00</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-500"
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
          </div>
        </div>

        <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white">Total Tickets Sold</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-300">{metrics.totalTicketsSold}</h3>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-500"
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
          </div>
        </div>

        <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-white">Average Ticket Price</p>
              <h3 className="text-2xl font-bold mt-1 text-gray-300">${metrics.avgTicketPrice}</h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
