import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/userStore";
import { useMessageStore } from "@/store/messageStore";

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");

  const { selectedFriend} = useUserStore(); // Access selectedFriend from Zustand store
  const { fetchMessages, sendMessages, addMessage } = useMessageStore();
  useEffect(() => {
    if (!selectedFriend) return; // If no friend is selected, do nothing

   

    fetchMessages();
  }, [selectedFriend]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedFriend) return;

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/auth/chats/${selectedFriend.id}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(err.response?.data?.error || "Failed to send message.");
    }
  };

  if (!selectedFriend) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No friend selected. Please select a friend to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
        <div>
          <h2 className="text-lg font-semibold">{selectedFriend.username}</h2>
          {selectedFriend.bio && <p className="text-sm">{selectedFriend.bio}</p>}
        </div>
        {selectedFriend.profilePicture ? (
          <img
            src={selectedFriend.profilePicture}
            alt={selectedFriend.username}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
        )}
      </div>

      {/* Message Box */}
      <div className="flex-1 overflow-y-scroll p-4 bg-gray-100">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 ${
              message.senderId === selectedFriend.id ? "text-left" : "text-right"
            }`}
          >
            <p
              className={`inline-block p-2 rounded-lg ${
                message.senderId === selectedFriend.id
                  ? "bg-white text-black"
                  : "bg-blue-500 text-white"
              }`}
            >
              {message.content}
            </p>
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={sendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;