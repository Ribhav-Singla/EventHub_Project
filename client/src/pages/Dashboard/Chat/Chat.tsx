import { useState } from "react";
import Sidebar from "./Sections/Sidebar";
import { useRecoilValue } from "recoil";
import { chatState } from "../../../recoil";
import NoChatSelected from "./Sections/NoChatSelected";
import ChatContainer from "./Sections/ChatContainer";

function Chat() {
  const { selectedUser } = useRecoilValue(chatState);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="bg-gray-100 min-h-full flex flex-col overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      {/* <button
          className="md:hidden absolute top-3 left-3 z-50 bg-white p-2 rounded-md shadow"
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          aria-label="Toggle sidebar"
        >
          Users list
        </button> */}
      <div
        className="py-3 text-center bg-[#000a26] text-gray-300 hover:text-gray-200 md:hidden cursor-pointer border-t border-b border-neutral-200/20"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        <p className="font-medium">Show All Users</p>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={() => setSidebarOpen(false)}
        />

        {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
      </div>
    </div>
  );
}

export default Chat;
