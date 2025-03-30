import { TOP_EVENT } from "../../../../recoil";
import { validateStatus } from "../../../../utils";

function TopPerforming({ topEvents }: { topEvents: TOP_EVENT[] }) {
  return (
    <div>
      {/* Top Performing Events */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 mt-5">
        <h3 className="text-lg font-semibold mb-4 text-white">Top Performing Events</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="border-b border-neutral-200/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tickets Sold
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/20">
              {topEvents.map((event: TOP_EVENT, index: number) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${event.revenue}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.ticketsSold}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.conversionRate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {validateStatus(event.status) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                          Closed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default TopPerforming;
