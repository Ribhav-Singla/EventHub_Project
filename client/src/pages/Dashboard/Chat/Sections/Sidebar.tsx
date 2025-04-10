import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilState } from "recoil";
import { chatState } from "../../../../recoil";
import { useSocket } from "../../../../lib/SocketProvider";
import { formatChatTime, stringAvatar } from "../../../../utils";
import { Avatar } from "@mui/material";

export default function Sidebar({
  isOpen,
  toggleSidebar,
}: {
  isOpen: boolean;
  toggleSidebar: () => void;
}) {
  const socket = useSocket();
  const [chat, setChat] = useRecoilState(chatState);
  const selectedUser = chat.selectedUser;
  const onlineUsers = chat.onlineUsers;
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState<
    {
      id: string;
      user: { id: string; firstname: string; lastname: string };
      messages: { text: string; createdAt: string }[];
    }[]
  >([]);

  const onlineChats = showOnlineOnly
    ? chats.filter((chat) => onlineUsers.includes(chat.user.id))
    : chats;

  // initialise chats
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/chat/organizer`,
          {
            headers: {
              Authorization: `${localStorage.getItem("token")}`,
            },
          }
        );
        setChats(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  // get online users
  useEffect(() => {
    if (socket) {
      socket.emit("getOnlineUsers");

      socket.on("onlineUsers", (onlineUsers: string[]) => {
        setChat((prevChat) => ({ ...prevChat, onlineUsers: onlineUsers }));
      });

      socket.on("userConnected", (userId: string) => {
        setChat((prevChat) => ({
          ...prevChat,
          onlineUsers: [...prevChat.onlineUsers, userId],
        }));
      });

      socket.on("userDisconnected", (userId: string) => {
        setChat((prevChat) => ({
          ...prevChat,
          onlineUsers: prevChat.onlineUsers.filter((id) => id !== userId),
        }));
      });
    }
    return () => {
      if (socket) {
        socket.off("onlineUsers");
        socket.off("userConnected");
        socket.off("userDisconnected");
      }
    };
  }, [socket]);

  if (loading) {
    return (
      <div
        className={`fixed inset-0 md:z-0 z-40 w-96 bg-[#000a26] border-r border-neutral-200/20 md:relative flex flex-col min-h-[calc(100vh-72px)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex justify-center items-center w-full h-full">
          <span className="loader"></span>
        </div>
      </div>
    );
  }
  

  return (
    <div
      className={`fixed inset-0 md:z-0 z-40 w-96 bg-[#000a26] border-r border-neutral-200/20 md:relative flex flex-col min-h-[calc(100vh-72px)]  transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      }`}
    >
      {/* Header */}
      <div className="px-4 h-16 md:mt-0 mt-16 flex items-center justify-between border-b border-neutral-200/20">
        <h1 className="font-bold text-xl text-white">Chats</h1>
        <p className="cursor-pointer text-white" onClick={()=>toggleSidebar()}>☰</p>
      </div>
      <div className="mt-3 flex items-center gap-2 mx-auto">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm"
          />
          <span className="text-sm text-white">Show online only</span>
        </label>
        <span className="text-xs text-zinc-300">
          ({Math.max(0, onlineUsers.length)} online)
        </span>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto  min-h-0 max-h-[calc(100vh-170px)]">
        {onlineChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center px-4 py-3 gap-3 border-gray-100 cursor-pointer 
              ${
                (selectedUser as any)?.id === chat.user.id
                  ? "bg-[#0f52ba]"
                  : "hover:bg-[#0f52ba]"
              }`}
            onClick={() => {
              if (chat.user?.id) {
                setChat((prev) => ({
                  ...prev,
                  chatId: chat.id,
                  selectedUser: chat.user,
                }));
                toggleSidebar()
              }
            }}
          >
            <div className="relative flex-shrink-0">
              <Avatar
                {...stringAvatar(
                  `${chat.user.firstname} ${chat.user.lastname}`
                )}
              />

              {/* Online/Offline Dot */}
              <div
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${
                  onlineUsers.includes(chat.user.id)
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              ></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {chat.user.firstname} {chat.user.lastname}
              </p>
              <p className="text-xs text-gray-300 truncate">
                {chat.messages.length > 0
                  ? chat.messages[0].text
                  : "No messages yet"}
              </p>
            </div>
            <div className="flex flex-col items-end">
              {chat.messages.length > 0 && (
                <span className="text-xs text-gray-300">
                  {formatChatTime(chat.messages[0].createdAt)}
                </span>
              )}
            </div>
          </div>
        ))}
        {onlineChats.length === 0 && (
          <div className="text-center flex justify-center items-center w-full h-full text-gray-300">
            No online users
          </div>
        )}
      </div>
    </div>
  );
}
