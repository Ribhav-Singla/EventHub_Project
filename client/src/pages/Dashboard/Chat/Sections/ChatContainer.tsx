import { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import { useRecoilState, useRecoilValue } from "recoil";
import { authState, chatState } from "../../../../recoil";
import MessageInput from "./MessageInput";
import axios from "axios";
import { useSocket } from "../../../../lib/SocketProvider";

function ChatContainer() {
  const auth = useRecoilValue(authState);
  const [chat, setChat] = useRecoilState(chatState);
  const messages = chat.messages;
  const [loading, setLoading] = useState(true);
  const socket = useSocket();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // fetch messages from server
  useEffect(() => {
    const fetch_messages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chat/${chat.chatId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setChat((prevChat) => ({
          ...prevChat,
          messages: response.data.messages,
        }));
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetch_messages();
  }, [chat.selectedUser]);

  // listen for a newMessage
  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: any) => {
        if (newMessage.senderId !== chat.selectedUser?.id) return;
        setChat((prevChat) => ({
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
        }));
      });
    }
    return () => {
      if (socket) {
        socket.off("newMessage");
      }
    };
  }, [socket, chat.selectedUser?.id]);

  // scroll to bottom whenever a newMessage arrives
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [chat.messages, chat.chatId]);

  if (loading) {
    return (
      <div className="w-full">
        <ChatHeader />
        <div className="flex justify-center items-center min-h-[calc(100vh-136px)] bg-[#000a26]">
          <p className="text-white">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <ChatHeader />

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 md:min-h-[calc(100vh-200px)] md:max-h-[calc(100vh-200px)] min-h-[calc(100vh-250px)] max-h-[calc(100vh-250px)] bg-[#000a26]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === auth.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg p-3 max-w-xs text-white ${
                  msg.senderId === auth.id ? "bg-[#0f52ba]" : "bg-gray-800"
                }`}
              >
                {msg.text}
                <div className="text-xs text-gray-300 text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString()},{" "}
                  {new Date(msg.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="shrink-0">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
