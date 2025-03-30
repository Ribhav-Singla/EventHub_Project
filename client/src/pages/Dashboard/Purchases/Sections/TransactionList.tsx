import { validateStatus } from "../../../../utils";
import { useNavigate } from "react-router-dom";

function TransactionList({ transactions }: { transactions: any }) {


  const navigate = useNavigate();
  return (
    <div className="bg-[#000a26] p-5 pt-0 pb-0">
      {/* Transactions List */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg my-5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200/20">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/20">
              {transactions.map((transaction: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 flex flex-col items-center">
                      #TRX-{transaction.id}
                      <span className="px-2 mt-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-200 text-blue-800 items-center justify-center">
                        {transaction.ticket_details[0].payment_type}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-300">
                          {transaction.event.title}
                        </div>
                        <div className="text-sm text-gray-400">
                          {transaction.event.location[0].venue},{" "}
                          {transaction.event.location[0].city},{" "}
                          {transaction.event.location[0].country}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(transaction.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-300">
                          {transaction.ticket_details[0].ticket_quantity} x{" "}
                          {transaction.ticket_details[0].ticket_category}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ₹{transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {validateStatus(transaction.event.date) ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800">
                          Closed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {validateStatus(transaction.event.date) ? (
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() =>
                              navigate(`/event/${transaction.event.id}`)
                            }
                          >
                            View
                          </button>
                        ) : (
                          ""
                        )}
                        <button
                          className="text-gray-300 hover:text-neutral-700"
                          onClick={() =>
                            navigate(`/event/${transaction.id}/eticket`, {
                              state: {
                                amount: transaction.amount,
                                attendees:
                                  transaction.ticket_details[0].attendees,
                                event_details: {
                                  title: transaction.event.title,
                                  category: transaction.event.category,
                                  date: transaction.event.date,
                                  time_frame: transaction.event.time_frame,
                                  location: transaction.event.location,
                                },
                              },
                            })
                          }
                        >
                          Download
                        </button>
                      </div>
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

export default TransactionList;
