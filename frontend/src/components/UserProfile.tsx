import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";

interface UserProfileProps {}

interface User {
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
}

const logoutHandler = async () => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
        throw new Error("You must be logged in to log out.");
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
    }
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your profile.");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-64 bg-white shadow-md p-4 rounded-lg h-full flex flex-col justify-between ">
      <div>
      {user.profilePicture && (
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <h2 className="text-xl font-semibold text-center ">{user.username}</h2>
      <p className="text-gray-600 text-sm text-center">{user.email}</p>
      <div className="border border-b border-black m-4"></div>
      {user.bio && <p className="mt-4 text-gray-800">{user.bio}</p>}
    </div>
     <Button className="cursor-pointer" variant={"secondary"} onClick={()=>logoutHandler()}>Logout</Button>
      </div>
      
  );
};

export default UserProfile;