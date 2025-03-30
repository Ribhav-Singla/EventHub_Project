import LocalActivityIcon from "@mui/icons-material/LocalActivity";
import EventIcon from "@mui/icons-material/Event";
import EditIcon from "@mui/icons-material/Edit";
import moment from "moment-timezone";

export default function Activity({ activity }:{activity:any}) {
  return (
    <div className="px-5 pb-5 pt-5 bg-[#000a26]">
      {/* Recent Transactions */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4 text-white">Recent Transactions</h2>
        <div className="space-y-4">
          {activity.transactions.map((txn:any, index:number) => (
            <div className="flex items-center space-x-4" key={index}>
              <div className="flex-shrink-0">
                <LocalActivityIcon sx={{ width: 30, height: 30, color: "#4CAF50" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">New ticket purchase</p>
                <p className="text-sm text-gray-300">
                  Purchased {txn.ticket_details[0].ticket_quantity} tickets for {txn.event.title}.
                </p>
              </div>
              <div className="text-sm text-gray-400">{moment(txn.created_at).fromNow()}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Event History */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-6 mt-5">
        <h2 className="text-lg font-semibold mb-4 text-white">Event History</h2>
        <div className="space-y-4">
          {activity.events.map((event:any, index:number) => (
            <div className="flex items-center space-x-4" key={index}>
              <div className="flex-shrink-0">
                {event.created_at !== event.updated_at ? (
                  <EditIcon sx={{ width: 30, height: 30, color: "#FFA726" }} />
                ) : (
                  <EventIcon sx={{ width: 30, height: 30, color: "#42A5F5" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300">
                  Event {event.created_at !== event.updated_at ? "updated" : "created"}
                </p>
                <p className="text-sm text-gray-300">
                  {event.title} has been {event.created_at !== event.updated_at ? "updated" : "created"}.
                </p>
              </div>
              <div className="text-sm text-gray-400">
                {moment(event.created_at !== event.updated_at ? event.updated_at : event.created_at).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
