import { create } from "zustand";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

interface UserStore {
  user: User | null;
  otherUsers: User[];
  selectedFriend: User | null; // Add selectedFriend state
  error: string;
  loading: boolean;
  fetchUser: () => Promise<void>;
  fetchOtherUsers: () => Promise<void>;
  setUser: (user: User | null) => void;
  setSelectedFriend: (friend: User | null) => void; // Add action to set selected friend
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  otherUsers: [],
  selectedFriend: null, // Initialize selectedFriend as null
  error: "",
  loading: false,

  fetchUser: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ error: "You must be logged in to view your profile.", loading: false });
        return;
      }

      set({ loading: true, error: "" });

      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ user: response.data, loading: false });
    } catch (err: any) {
      console.error("Error fetching user:", err);
      set({ error: err.response?.data?.error || "Failed to fetch user.", loading: false });
    }
  },

  fetchOtherUsers: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set({ error: "You must be logged in to view other users.", loading: false });
        return;
      }

      set({ loading: true, error: "" });

      const response = await axios.get("http://localhost:5000/api/auth/other-users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ otherUsers: response.data, loading: false });
    } catch (err: any) {
      console.error("Error fetching other users:", err);
      set({ error: err.response?.data?.error || "Failed to fetch other users.", loading: false });
    }
  },

  setUser: (user) => set({ user }),

  setSelectedFriend: (friend) => set({ selectedFriend: friend }), // Action to set selected friend
}));