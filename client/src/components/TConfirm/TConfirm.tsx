import { useNavigate, useParams } from "react-router-dom";
import { ATTENDEE_DETAILS } from "../../recoil";
import { usePDF } from "react-to-pdf";
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner2 from "../Spinner/Spinner2";
import { extractTimeRange, formatDate } from "../../utils";

function TConfirm() {
  const navigate = useNavigate();
  const transactionId = useParams().transactionId;
  const [ticket, setTicket] = useState({
    amount: 0,
    attendees: [],
    event_details: {
      title: "",
      category: "",
      date: "",
      time_frame: [],
      location: [
        {
          venue: "",
          city: "",
          country: "",
        },
      ],
    },
  });
  const [loading, setLoading] = useState(true);

  const { toPDF, targetRef } = usePDF({ filename: "ticket.pdf" });

  useEffect(() => {
    const fetch_data = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/user/ticket/${transactionId}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setTicket({
          ...response.data.ticket_details,
          event_details: response.data.event_details,
          amount: response.data.amount,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetch_data();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center bg-neutral-100">
        <Spinner2 />
      </div>
    );
  }

  return (
    <div>
      <section
        id="ConfirmationPage"
        className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-28"
        ref={targetRef}
      >
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your tickets have been booked
              successfully.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
            <div className="border-b border-gray-200 p-6">
              <div className="flex sm:justify-between items-center sm:flex-row flex-col sm:gap-0 gap-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Booking Details
                </h2>
                <p className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium text-center">
                  Transaction ID: {transactionId}
                </p>
              </div>
            </div>

            {/* Event Details */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Event Information</h3>
                <div className="grid sm:grid-cols-2 gap-4 grid-cols-1 text-sm">
                  <div>
                    <span className="text-gray-600">Event Name:</span>
                    <p className="font-medium">{ticket.event_details.title}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <p className="font-medium">
                      {formatDate(ticket.event_details.date)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <p className="font-medium">
                      {extractTimeRange(ticket.event_details.time_frame)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Venue:</span>
                    <p className="font-medium">
                      {ticket.event_details.location[0].venue},{" "}
                      {ticket.event_details.location[0].city},{" "}
                      {ticket.event_details.location[0].country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attendee List */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Attendee Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {ticket.attendees.map(
                    (attendee: ATTENDEE_DETAILS, index: number) => {
                      return (
                        <div
                          className="flex justify-between items-center"
                          key={index}
                        >
                          <div className="flex items-center space-x-3">
                            <div>
                              <p className="font-medium">
                                {attendee.name},{" "}
                                <span className="text-sm text-gray-500">
                                  ({attendee.gender})
                                </span>
                              </p>
                              <p className="text-sm text-gray-500">
                                Age: {attendee.age}
                              </p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                            Ticket #{index + 1}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium">Total Amount Paid</span>
                  <span className="font-bold text-green-600">
                    ${ticket.amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => toPDF()}
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                ></path>
              </svg>
              Download Tickets
            </button>
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => navigate(`/`)}
            >
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                ></path>
              </svg>
              Return to Home
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TConfirm;
