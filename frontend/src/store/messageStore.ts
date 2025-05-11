import { create } from "zustand";
import axios from "axios";
import { useUserStore } from "./userStore"; // Import userStore to access selectedFriend

interface Message {
  id: number;
  content: string;
  senderId: number;
  createdAt: string;
}

interface MessageStore {
  messages: Message[];
  loading: boolean;
  error: string;
  fetchMessages: () => Promise<void>;
  sendMessages: (content: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  loading: false,
  error: "",

  // Fetch messages for the selected friend
  fetchMessages: async () => {
    const { selectedFriend } = useUserStore.getState(); // Access selectedFriend from userStore
    if (!selectedFriend) {
      set({ error: "No friend selected.", loading: false });
      return;
    }

    try {
      set({ loading: true, error: "" });

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/auth/chats/${selectedFriend.id}/messages`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({ messages: response.data, loading: false });
    } catch (err: any) {
      console.error("Error fetching messages:", err);
      set({ error: err.response?.data?.error || "Failed to fetch messages.", loading: false });
    }
  },

  // Send a new message to the selected friend
  sendMessages: async (content: string) => {
    const { selectedFriend } = useUserStore.getState(); // Access selectedFriend from userStore
    if (!selectedFriend) {
      set({ error: "No friend selected." });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/api/auth/chats/${selectedFriend.id}/messages`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add the new message to the messages array
      get().addMessage(response.data);
    } catch (err: any) {
      console.error("Error sending message:", err);
      set({ error: err.response?.data?.error || "Failed to send message." });
    }
  },

  // Add a new message to the messages array
  addMessage: (message) => {
    set((state) => ({ messages: [...state.messages, message] }));
  },
}));