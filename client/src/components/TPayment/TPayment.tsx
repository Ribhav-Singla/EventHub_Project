import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { ATTENDEE_DETAILS, TICKET, ticketState } from "../../recoil";
import { useEffect, useState } from "react";
import { handleTransaction } from "../../utils";
import toast from "react-hot-toast";
import SessionPaymentTimer from "../SessionPaymentTimer/SessionPaymentTimer";

function TPayment() {
  const navigate = useNavigate();
  const eventId = useParams().eventId;
  const [ticket, setTicket] = useRecoilState<TICKET>(ticketState);
  const [selectedPaymentMode, setSelectedPaymentMode] = useState<string | null>(
    null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePaymentMode = (value: string) => {
    // Only allow payment mode selection if amount is not 0
    if (ticket.ticket_amount > 0) {
      setTicket((prevTicket) => ({ ...prevTicket, payment_type: value }));
      setSelectedPaymentMode(value);
    }
  };

  const handlePayment = async () => {
    if (ticket.ticket_amount === 0) {
      const response = await toast.promise(
        handleTransaction({ ...ticket, payment_type: "Free" }, eventId),
        {
          loading: "Processing...",
          success: "Ticket confirmed!",
          error: "Internal server error!",
        }
      );
      if (response.transactionId) {
        // Clear session timer
        (window as any).clearSessionTimer?.();
        setTimeout(() => {
          navigate(`/event/${response.transactionId}/tconfirm`, {
            state: { flow: "tpayment-flow" },
          });
        }, 500);
      }
      return;
    }

    const response = await toast.promise(handleTransaction(ticket, eventId), {
      loading: "Please wait...",
      success: "Ticket confirmed!",
      error: "Internal server error!",
    });
    if (response.transactionId) {
      // Clear session timer
      (window as any).clearSessionTimer?.();
      setTimeout(() => {
        navigate(`/event/${response.transactionId}/tconfirm`, {
          state: { flow: "tpayment-flow" },
        });
      }, 500);
    }
  };

  return (
    <div>
      <section
        id="PaymentPage"
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28"
      >
        <div className="max-w-3xl mx-auto">
          {/* Booking Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Booking Summary
              </h1>
              <SessionPaymentTimer eventId={eventId} />
            </div>
            <div className="p-6 space-y-4">
              <div className="sm:flex sm:justify-between sm:items-center sm:flex-row flex-col">
                <p className="text-gray-600">Event</p>
                <p className="font-medium">{ticket.event_title}</p>
              </div>
              <div className="sm:flex sm:justify-between sm:items-center sm:flex-row flex-col">
                <p className="text-gray-600">Category</p>
                <p className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium w-fit mt-2 sm:mt-0">
                  {ticket.event_category}
                </p>
              </div>
              <div className="sm:flex sm:justify-between sm:items-center sm:flex-row flex-col">
                <p className="text-gray-600">Number of Tickets</p>
                <p className="font-medium">{ticket.ticket_quantity}</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-3">
                  Attendee Details
                </h3>
                <div className="space-y-2">
                  {ticket.attendees.map((attendee: ATTENDEE_DETAILS, index) => (
                    <div
                      className="flex justify-between items-center text-sm"
                      key={index}
                    >
                      <span>
                        {attendee.name}{" "}
                        <span className="text-sm text-gray-500">
                          ({attendee.gender})
                        </span>
                      </span>
                      <span className="text-gray-500">Age: {attendee.age}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>Total Amount</span>
                  <span className="text-blue-600">
                    {ticket.ticket_amount === 0
                      ? "Free"
                      : `$${ticket.ticket_amount}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section - Only show if amount is not 0 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {ticket.ticket_amount === 0
                  ? "Confirm Free Ticket"
                  : "Complete Payment"}
              </h2>
              <div className="space-y-6">
                {/* Payment Options - Only show if amount is not 0 */}
                {ticket.ticket_amount > 0 && (
                  <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
                    <div
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        selectedPaymentMode === "Credit Card"
                          ? "border-blue-500 bg-blue-100"
                          : "hover:border-blue-500"
                      }`}
                      onClick={() => handlePaymentMode("Credit Card")}
                    >
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Credit Card</span>
                    </div>
                    <div
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        selectedPaymentMode === "Digital Wallet"
                          ? "border-blue-500 bg-blue-100"
                          : "hover:border-blue-500"
                      }`}
                      onClick={() => handlePaymentMode("Digital Wallet")}
                    >
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Digital Wallet
                      </span>
                    </div>
                    <div
                      className={`border rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        selectedPaymentMode === "Bank Transfer"
                          ? "border-blue-500 bg-blue-100"
                          : "hover:border-blue-500"
                      }`}
                      onClick={() => handlePaymentMode("Bank Transfer")}
                    >
                      <svg
                        className="w-8 h-8 mx-auto mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      <span className="text-sm font-medium">Bank Transfer</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="sm:flex justify-between sm:items-center sm:flex-row flex-col items-center pt-6">
                  <div className="w-full sm:w-fit sm:mb-0 mb-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-fit"
                      onClick={() =>
                        navigate(`/event/${eventId}/tdetails`, {
                          state: { flow: "event-flow" },
                        })
                      }
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back to Booking
                    </button>
                  </div>
                  <div className="w-full sm:w-fit">
                    <button
                      type="button"
                      className={`inline-flex items-center justify-end px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white w-full sm:w-fit ${
                        ticket.ticket_amount === 0 || selectedPaymentMode
                          ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                          : "bg-gray-400 cursor-not-allowed"
                      }`}
                      onClick={handlePayment}
                      disabled={
                        ticket.ticket_amount > 0 && !selectedPaymentMode
                      }
                    >
                      <span>
                        {ticket.ticket_amount === 0
                          ? "Confirm Free Ticket"
                          : `Pay Now $${ticket.ticket_amount}`}
                      </span>
                      <svg
                        className="ml-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TPayment;
