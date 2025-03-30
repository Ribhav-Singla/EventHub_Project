import { useState } from "react";
import { useRecoilState } from "recoil";
import { chatState } from "../../../../recoil";
import axios from "axios";

function MessageInput() {
  const [chat, setChat] = useRecoilState(chatState);
  const chatId = chat.chatId;
  const receiverId = chat.selectedUser?.id;
  const [text, setText] = useState("");

  const sendMessage = async (messageData: any) => {
    if (!messageData.trim()) {
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/chat/sendmessage/${chatId}`,
        { text:messageData, receiverId },
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
    }
  };

  return (
    <div>
      {/* Chat Input */}
      <div className="h-16 border-t border-neutral-200/20 p-4 flex items-center bg-[#000a26]">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border-[#0f52ba] border-2 rounded-md p-2 focus:ring-[#0f52ba] outline-none bg-[#000a26] text-white"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(text)}
        />
        <button
          className="ml-2 bg-[#0f52ba] text-white px-4 py-2 rounded-md"
          onClick={() => sendMessage(text)}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MessageInput;
