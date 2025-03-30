import { UPCOMING_EVENT } from "../../../../recoil";
import { extractTimeRange, formatDate } from "../../../../utils";

export default function Upcoming({
  upcomingEvents,
}: {
  upcomingEvents: UPCOMING_EVENT[];
}) {
  return (
    <div>
      {/* Upcoming Events */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 mt-5">
        <h2 className="text-lg font-semibold mb-4 text-white">Upcoming Events</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-neutral-200/20">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Sales
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/20">
              {upcomingEvents.map((event:UPCOMING_EVENT, index:number) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-white">
                          {event.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {formatDate(event.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {extractTimeRange(event.time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.ticketsSold} tickets
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
