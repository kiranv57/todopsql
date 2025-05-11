import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCamera } from "react-icons/fa";
import { connectSocket, disconnectSocket } from "../utils/socket";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import { useUserStore } from "@/store/userStore";



const UserProfile: React.FC = () => {
  const { user, otherUsers, setUser, fetchUser, fetchOtherUsers } = useUserStore();
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const { setSelectedFriend } = useUserStore(); // Access setselectedFriend from Zustand store
  
  useEffect(() => {
      fetchUser();
      fetchOtherUsers();

     const socket = connectSocket();
      return () => {
      disconnectSocket();
     };
  }, []);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await axios.put("http://localhost:5000/api/auth/update", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data.user);
      setUploading(false);
    } catch (err: any) {
      console.error("Error updating profile picture:", err);
      setError(err.response?.data?.error || "Failed to update profile picture.");
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login page
    } catch (err: any) {
      console.error("Error logging out:", err);
      setError(err.response?.data?.error || "Failed to log out.");
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-64 bg-white shadow-md p-4 rounded-lg">
      <div className="relative w-24 h-24 mx-auto mb-4">
        {user.profilePicture ? (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500 text-xl">+</span>
          </div>
        )}
        <label
          htmlFor="profilePicture"
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600"
        >
          <FaCamera />
        </label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </div>

      <h2 className="text-xl font-semibold text-center">{user.username}</h2>
      <p className="text-gray-600 text-sm text-center">{user.email}</p>

      {uploading && <p className="text-sm text-gray-500 mt-2 text-center">Uploading...</p>}

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Friend list</h3>
        <ul className="mt-2">
          {otherUsers.map((otherUser) => (
            <Button
              variant={"secondary"}
              key={otherUser.id}
              className="flex justify-start gap-2 mt-2 w-full cursor-pointer"
              onClick={() => {
                navigate(`/chat/${otherUser.id}`)
                setSelectedFriend(otherUser); // Set the selected friend in the store
              }} // Navigate to chat page
            >
              {otherUser.profilePicture ? (
                <img
                  src={otherUser.profilePicture}
                  alt={otherUser.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300"></div>
              )}
              <span className="text-sm">{otherUser.username}</span>
            </Button>
          ))}
        </ul>
      </div>

      <Button 
        className="text-sm w-full text-center"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;