import { useEffect, useState } from "react";
import TransactionList from "./Sections/TransactionList";
import Spinner from "../../../components/Spinner/Spinner";
import axios from "axios";
import { Pagination } from "@mui/material";
import useDebounce from "../../../lib/useDebounce";

function Purchases() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [transactionCount, setTransactionCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [status, setStatus] = useState("all");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const debouncedDateRange = useDebounce(dateRange, 500);
  const debouncedTitle = useDebounce(title, 1000);
  const debouncedType = useDebounce(type, 500);
  const debouncedStatus = useDebounce(status, 500);

  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/user/transactions/bulk?page=${page}&dateRange=${dateRange}&type=${type}&status=${status}&title=${title}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setTransactionCount(response.data.total_transactions);
        setTransactions(response.data.transactions);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetch_data();
  }, [
    page,
    debouncedType,
    debouncedDateRange,
    debouncedStatus,
    debouncedTitle,
  ]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-[#000a26]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-5 lg:w-[calc(100vw-255px)] w-screen bg-[#000a26] h-screen">
      {/* Header with Filters */}
      <div className="bg-[#000a26] border border-neutral-200/20 rounded-lg p-4 mx-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Date Range
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-200/60 rounded-lg"
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Time</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 3 Months</option>
              <option value="365">Last Year</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Event Type
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-200/20 rounded-lg"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Types</option>
              <option value="Conference">Conference</option>
              <option value="Exhibition">Exhibition</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Meetup">Meetup</option>
              <option value="Networking">Networking</option>
              <option value="Panel Discussion">Panel Discussion</option>
              <option value="Seminar">Seminar</option>
              <option value="Training">Training</option>
              <option value="Webinar">Webinar</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border border-neutral-200/20 rounded-lg"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full px-3 py-2 border border-neutral-200/60 rounded-lg"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </div>
      <TransactionList transactions={transactions} />
      {/* Pagination */}
      <div className="flex items-center justify-end border-t bg-[#000a26] w-full border-neutral-200/20 py-4 mt-5 px-5">
        <Pagination
          count={Math.ceil(transactionCount / 6)}
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

export default Purchases;
