import { useRecoilValue } from "recoil";
import { chatState } from "../../../../recoil";
import { Avatar } from "@mui/material";
import { stringAvatar } from "../../../../utils";

function ChatHeader() {
  const chat = useRecoilValue(chatState);
  const selectedUser = chat.selectedUser;
  const onlineUsers = chat.onlineUsers;
  return (
    <div>
      {/* Chat Header */}
      <div className="h-16 border-b border-neutral-200/20 px-4 flex items-center bg-[#000a26] shadow-sm gap-3">
        <div className="relative flex-shrink-0">
        <Avatar
                {...stringAvatar(`${selectedUser?.firstname} ${selectedUser?.lastname}`)}
              />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">
            Chatting with {selectedUser?.firstname} {selectedUser?.lastname}
          </p>
          <p className="text-xs text-gray-300">{onlineUsers.includes(selectedUser?.id) ? 'Online' : 'Offline'}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;
