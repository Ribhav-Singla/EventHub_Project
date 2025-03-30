import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "../../recoil";
import useSocket from "../../socket/useSocket";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../utils";
import toast from "react-hot-toast";

function ChatComponent({
  eventId,
  organizerEmail,
  organizerId,
}: {
  eventId: string | undefined;
  organizerEmail: string;
  organizerId: string;
}) {
  const auth = useRecoilValue(authState);
  const [isOpen, setIsOpen] = useState(false);
  const [chat, setChat] = useState<{ id: string; messages: any[] }>({
    id: "",
    messages: [],
  });
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // fetch the initial chat
  useEffect(() => {
    const fetch_chat = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/chat/${organizerId}`,
          { eventId },
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setChat(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    if (!isOpen) {
      return;
    }
    fetch_chat();
  }, [isOpen]);

  // subscribe to socket
  useEffect(() => {
    if (!socket) return;
    if (isOpen) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("setOnlineStatus");
      socket.on("newMessage", (newMessage: any) => {
        setChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      });
    } else {
      socket.off("newMessage");
      socket.disconnect();
    }

    return () => {
      if (socket) {
        socket.off("newMessage");
        socket.disconnect();
      }
    };
  }, [isOpen, socket]);

  // scroll to bottom whenever a newMessage arrives
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const sendMessage = async (messageData: any) => {
    if (!messageData.trim()) {
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chat/sendmessage/${chat.id}`,
        { text: messageData, receiverId: organizerId },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      setText("");
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, response.data],
      }));
    } catch (error) {
      console.error(error);
      if ((error as any).response?.data?.message) {
        toast.error(`${(error as any).response.data.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <section
        id="ChatComponent"
        className="min-h-screen flex items-center justify-center"
      >
        {/* Help Icon Button */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle chat"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </button>
        </div>

        {/* Chat Box */}
        {isOpen && (
          <div className="fixed bottom-20 right-2 sm:bottom-24 sm:right-6 w-[calc(100%-1rem)] max-w-xs sm:max-w-sm md:max-w-md bg-white rounded-lg shadow-xl z-30">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-3 sm:p-4 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar {...stringAvatar(`${organizerEmail} `)} />
                <span className="font-semibold text-sm sm:text-base">
                  Help Chat
                </span>
              </div>
              <button
                className="text-white hover:text-gray-200"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-72 sm:h-80">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Chat Messages */}
                <div className="h-72 md:h-80 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {(chat as any)?.messages?.map((msg: any, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-1 sm:space-x-2 ${
                        msg.senderId === auth.id ? "justify-end" : ""
                      }`}
                    >
                      {msg.senderId !== auth.id && (
                        <Avatar {...stringAvatar(`${organizerEmail} `)} />
                      )}
                      <div
                        className={`rounded-lg p-2 sm:p-3 max-w-[75%] ${
                          msg.senderId === auth.id
                            ? "bg-blue-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <p className="text-xs sm:text-sm break-words">
                          {msg.text}
                        </p>
                        <span className="text-[10px] sm:text-xs text-gray-500 mt-1 block">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          , {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {msg.senderId === auth.id && (
                        <Avatar
                          {...stringAvatar(
                            `${auth.firstname} ${auth.lastname}`
                          )}
                        />
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="p-2 sm:p-4 border-t">
                  <div className="flex space-x-1 sm:space-x-2">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 border rounded-lg px-2 py-1 sm:px-4 sm:py-2 text-sm sm:text-base focus:outline-none focus:border-blue-500"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage(text)}
                    />
                    <button
                      className="bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      onClick={() => sendMessage(text)}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ChatComponent;
