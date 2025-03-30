import { useEffect, useState } from "react";
import Spinner from "../../../../components/Spinner/Spinner";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Pagination } from "@mui/material";

function EventRegistrations() {
  const eventId = useParams().eventId;
  const [registrations, setRegistrations] = useState([]);
  const [totalRegistrations,setTotalRegistrations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page,setPage] = useState(1);

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/dashboard/event/registrations/${eventId}?page=${page}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setRegistrations(response.data.registrationsData)
        setTotalRegistrations(response.data.totalRegistrations)
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRegistrations();
  }, [page]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#000a26]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-5 bg-[#000a26] h-screen">
      {/* Transactions List */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg my-5">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200/20">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Transaction date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/20">
              {registrations.map((registration: any, index: number) => {
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 font-semibold">
                      {registration.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(registration.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {registration.ticket_quantity} x {registration.ticket_category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {registration.amount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-end border-t border-neutral-200/20 pt-4 mt-5">
        <Pagination
          count={Math.ceil(totalRegistrations / 6)}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          sx={{
            backgroundColor: "#000a26",
            color: "white",
            "& .MuiPaginationItem-root": {
              color: "white", 
              borderColor: "white",
            },
            "& .MuiPaginationItem-outlined": {
              borderColor: "white",
            },
          }}
        />
      </div>
    </div>
  );
}

export default EventRegistrations;
