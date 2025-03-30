import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ticketState, TICKET, ATTENDEE_DETAILS } from "../../recoil";

const TDetails: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [ticketData, setTicketData] = useRecoilState<TICKET>(ticketState);
  const [ticketQuantity, setTicketQuantity] = useState<number>(
    ticketData.ticket_quantity || 1
  );
  const [ticketCategory, setTicketCategory] = useState<string>(
    ticketData.ticket_category || "General Admission"
  );
  const [attendees, setAttendees] = useState<ATTENDEE_DETAILS[]>(
    ticketData.attendees?.length
      ? ticketData.attendees
      : Array.from({ length: ticketData.ticket_quantity || 1 }, () => ({
          name: "",
          age: null,
          gender: "",
        }))
  );

  useEffect(() => {
    setAttendees((prevAttendees) =>
      Array.from({ length: ticketQuantity }, (_, i) => ({
        name: prevAttendees[i]?.name || "",
        age: prevAttendees[i]?.age || null,
        gender: prevAttendees[i]?.gender || "",
      }))
    );
  }, [ticketQuantity]);

  useEffect(() => {
    setTicketData((prevState) => ({
      ...prevState,
      attendees,
    }));
  }, [attendees]);

  // Calculate remaining tickets
  let remaining_tickets: number | "unlimited";
  if (ticketCategory === "VIP Access") {
    remaining_tickets =
      ticketData.vip_tickets_count === -1
        ? "unlimited"
        : ticketData.vip_tickets_count - ticketData.vip_tickets_sold;
  } else {
    remaining_tickets =
      ticketData.general_tickets_count === -1
        ? "unlimited"
        : ticketData.general_tickets_count - ticketData.general_tickets_sold;
  }

  const handleQuantityChange = (action: "increase" | "decrease") => {
    setTicketQuantity((prev) => {
      const newQuantity =
        action === "increase" ? prev + 1 : Math.max(prev - 1, 1);

      const newAmount = newQuantity * ticketData.ticket_price;
      setTicketData((prevState) => ({
        ...prevState,
        ticket_quantity: newQuantity,
        ticket_amount: newAmount,
      }));
      return newQuantity;
    });
  };

  const handleCategoryChange = (category: string) => {
    const newPrice =
      category == "VIP Access"
        ? ticketData.vip_ticket_price
        : ticketData.general_ticket_price;
    const newAmount = ticketQuantity * newPrice;

    setTicketCategory(category);
    setTicketData((prevState) => ({
      ...prevState,
      ticket_category: category,
      ticket_price: newPrice,
      ticket_amount: newAmount,
    }));
  };

  const handleAttendeeChange = (
    index: number,
    field: "name" | "age" | "gender",
    value: string
  ) => {
    setAttendees((prevAttendees) =>
      prevAttendees.map((attendee, i) =>
        i === index
          ? {
              ...attendee,
              [field]: field === "age" ? parseInt(value, 10) : value,
            }
          : attendee
      )
    );
  };

  const validateAttendees = (): boolean => {
    for (const attendee of attendees) {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!attendee.name.trim() || !nameRegex.test(attendee.name.trim())) {
        alert("Please enter a valid name for all attendees (letters only).");
        return false;
      }

      const age = attendee.age;
      if (age === null || isNaN(age) || age < 1 || age > 100) {
        alert(
          "Please enter a valid age for all attendees (number between 1 and 100)."
        );
        return false;
      }

      if (!attendee.gender) {
        alert("Please select a gender for all attendees.");
        return false;
      }
    }
    return true;
  };

  const handleProceedToPayment = () => {
    if (
      remaining_tickets !== "unlimited" &&
      ticketQuantity > remaining_tickets
    ) {
      alert("Not enough tickets available.");
      return;
    }
    if (validateAttendees()) {
      // setting up timeout fetaure for payments
      sessionStorage.setItem('current-transaction', JSON.stringify({
        eventId,
        startedAt: Date.now(),
        step: 'tdetails'
      }));
      
      navigate(`/event/${eventId}/tpayment`, {
        state: { flow: "tdetails-flow" },
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <section
        id="TicketBookingPage"
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Select Tickets
            </h2>
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Tickets
                  </label>
                  <div className="flex items-center border rounded-lg overflow-hidden justify-between">
                    <button
                      className="px-4 py-2 text-blue-600 hover:bg-gray-100 focus:outline-none"
                      onClick={() => handleQuantityChange("decrease")}
                    >
                      -
                    </button>
                    <span className="px-8 py-2 text-lg font-semibold text-gray-800 border-l border-r border-gray-200">
                      {ticketQuantity}
                    </span>
                    <button
                      className="px-4 py-2 text-blue-600 hover:bg-gray-100 focus:outline-none"
                      onClick={() => handleQuantityChange("increase")}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Category
                  </label>
                  <select
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={ticketCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    <option disabled={ticketData.general_tickets_count == 0}>
                      General Admission
                    </option>
                    <option disabled={ticketData.vip_tickets_count == 0}>
                      VIP Access
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                {attendees.map((attendee, index) => (
                  <div className="grid md:grid-cols-3 gap-6" key={index}>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Attendee Name {index + 1}
                      </label>
                      <input
                        type="text"
                        className="mt-2 block w-full rounded-lg border-gray-300 bg-slate-50 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter attendee's name"
                        value={attendee.name}
                        maxLength={50}
                        onChange={(e) =>
                          handleAttendeeChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Attendee Age {index + 1}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={100}
                        className="mt-2 block w-full rounded-lg border-gray-300 bg-slate-50 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter attendee's age"
                        value={attendee.age ?? ""}
                        onChange={(e) =>
                          handleAttendeeChange(index, "age", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Attendee Gender {index + 1}
                      </label>
                      <select
                        className="mt-2 block w-full rounded-lg border-gray-300 bg-slate-50 shadow-sm px-4 py-3 focus:border-blue-500 focus:ring-blue-500"
                        value={attendee.gender}
                        onChange={(e) =>
                          handleAttendeeChange(index, "gender", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center text-lg font-semibold text-gray-800">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">
                    ${ticketQuantity * ticketData.ticket_price}.00
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => navigate(`/event/${eventId}`)}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TDetails;
