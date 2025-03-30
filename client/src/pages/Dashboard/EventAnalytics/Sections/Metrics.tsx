
function Metrics({
  metrics,
}: {
  metrics: {
    totalRevenue: number;
    totalTicketsSold: number;
    maleAttendees: number;
    femaleAttendees: number;
    averageTicketPrice: number;
  };
}) {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Total revenue */}
        <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-sm">Total Revenue</h3>
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
          <p className="text-2xl font-semibold mt-2 text-gray-300">${metrics.totalRevenue}</p>
        </div>

        {/* tickets sold */}
        <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
          <div className="flex justify-between items-center">
            <h3 className="text-sm text-white">Tickets Sold</h3>
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
          <p className="text-2xl font-semibold mt-2 text-gray-300">{metrics.totalTicketsSold}</p>
        </div>

        {/* Gender breakdown */}
        <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-sm">Gender Breakdown</h3>
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
          </div>
          <p className="text-2xl font-semibold mt-2 text-gray-300">{metrics.maleAttendees} <span className="text-sm text-gray-500 font-semibold">M</span> / {metrics.femaleAttendees} <span className="text-sm text-gray-500 font-semibold">F</span></p>
        </div>

        {/* Average ticket price */}
        <div className="bg-[#000a26] p-4 rounded-lg border border-neutral-200/20">
          <div className="flex justify-between items-center">
            <h3 className="text-white text-sm">Average Ticket Price</h3>
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
          <p className="text-2xl font-semibold mt-2 text-gray-300">{metrics.averageTicketPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default Metrics;
