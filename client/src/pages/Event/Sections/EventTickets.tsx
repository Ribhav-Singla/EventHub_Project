import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ticketState } from "../../../recoil";

function EventTickets({
  eventId,
  vip_ticket_price,
  vip_tickets_count,
  vip_tickets_sold,
  general_ticket_price,
  general_tickets_count,
  general_tickets_sold,
  event_title,
  event_category,
  event_date,
  event_time,
  event_venue,
}: {
  eventId: string | undefined;
  vip_ticket_price: number;
  vip_tickets_count: number;
  vip_tickets_sold: number;
  general_ticket_price: number;
  general_tickets_count: number;
  general_tickets_sold: number;
  event_title: string;
  event_category: string;
  event_date: string;
  event_time: string | null;
  event_venue: string;
}) {
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useRecoilState(ticketState);

  // Initialize local state with Recoil values
  const [ticketQuantity, setTicketQuantity] = useState<number>(
    ticketData.ticket_quantity || 1
  );
  const [ticketCategory, setTicketCategory] = useState<string>(
    ticketData.ticket_category || "General Admission"
  );

  // Determine ticket price
  const price =
    ticketCategory === "VIP Access" ? vip_ticket_price : general_ticket_price;

  // Calculate remaining tickets
  let remaining_tickets: number | "unlimited";
  let tickets_sold: number;
  let total_tickets: number | "unlimited";

  if (ticketCategory === "VIP Access") {
    total_tickets = vip_tickets_count === -1 ? "unlimited" : vip_tickets_count;
    tickets_sold = vip_tickets_sold;
    remaining_tickets =
      vip_tickets_count === -1
        ? "unlimited"
        : vip_tickets_count - vip_tickets_sold;
  } else {
    total_tickets =
      general_tickets_count === -1 ? "unlimited" : general_tickets_count;
    tickets_sold = general_tickets_sold;
    remaining_tickets =
      general_tickets_count === -1
        ? "unlimited"
        : general_tickets_count - general_tickets_sold;
  }

  // Handle ticket quantity change
  const handleQuantityChange = (action: "increase" | "decrease") => {
    setTicketQuantity((prev) => {
      const newQuantity =
        action === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1;

      // Update Recoil state
      setTicketData((prevState) => ({
        ...prevState,
        ticket_quantity: newQuantity,
      }));

      return newQuantity;
    });
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setTicketCategory(category);
    setTicketData((prevState) => ({
      ...prevState,
      ticket_category: category,
    }));
  };

  // Handle booking action
  const handleBooking = () => {
    if (
      remaining_tickets !== "unlimited" &&
      ticketQuantity > remaining_tickets
    ) {
      alert("Not enough tickets available.");
      return;
    }

    if (ticketQuantity < 1) {
      alert("Please select at least one ticket.");
      return;
    }

    // Update Recoil state with all ticket info before navigating
    setTicketData((prevState): any => ({
      ...prevState,
      ticket_quantity: ticketQuantity,
      ticket_category: ticketCategory,
      ticket_price: price,
      ticket_amount: ticketQuantity * price,
      vip_ticket_price,
      vip_tickets_count,
      vip_tickets_sold,
      general_ticket_price,
      general_tickets_count,
      general_tickets_sold,
      event_title,
      event_category,
      event_date,
      event_venue,
      event_time,
    }));

    navigate(`/event/${eventId}/tdetails`, { state: { flow: "event-flow" } });
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow-lg p-6 top-24 z-10 animate__fadeIn">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-800">
            Book Your Tickets
          </h3>
          <p className="text-blue-600 text-lg font-semibold">₹{price}/person</p>
        </div>

        <div className="space-y-4 mb-6">
          {/* Ticket Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Tickets
            </label>
            <div className="flex items-center border rounded-lg">
              <button
                className="px-4 py-2 text-blue-600 hover:bg-gray-100"
                onClick={() => handleQuantityChange("decrease")}
              >
                -
              </button>
              <span className="w-full text-center border-none">
                {ticketQuantity}
              </span>
              <button
                className="px-4 py-2 text-blue-600 hover:bg-gray-100"
                onClick={() => handleQuantityChange("increase")}
              >
                +
              </button>
            </div>
          </div>

          {/* Ticket Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              value={ticketCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option
                value="General Admission"
                disabled={general_tickets_count == 0}
              >
                General Admission
              </option>
              <option value="VIP Access" disabled={vip_tickets_count == 0}>
                VIP Access
              </option>
            </select>
          </div>
        </div>

        {/* Book Now Button */}
        <button
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={handleBooking}
        >
          Book Now
        </button>

        {/* Ticket Info */}
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            {`${tickets_sold} tickets sold, ${
              remaining_tickets === "unlimited"
                ? "unlimited"
                : `${remaining_tickets} tickets remaining`
            } out of ${
              total_tickets === "unlimited" ? "unlimited" : total_tickets
            } total tickets`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default EventTickets;
