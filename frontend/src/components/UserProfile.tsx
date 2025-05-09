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
};

const UserProfile: React.FC<UserProfileProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/auth/upload-profile-picture",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(response.data.user); // Update the user state with the new profile picture
      setUploading(false);
    } catch (err: any) {
      console.error("Error uploading profile picture:", err);
      setError(err.response?.data?.error || "Failed to upload profile picture.");
      setUploading(false);
    }
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!user) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="w-64 bg-white shadow-md p-4 rounded-lg h-full flex flex-col justify-between">
      <div>
        {user.profilePicture && (
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
        )}
        <h2 className="text-xl font-semibold text-center">{user.username}</h2>
        <p className="text-gray-600 text-sm text-center">{user.email}</p>
        <div className="border border-b border-black m-4"></div>
        {user.bio && <p className="mt-4 text-gray-800">{user.bio}</p>}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Upload Profile Picture</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="mt-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
      </div>

      <Button className="cursor-pointer mt-4" variant={"secondary"} onClick={() => logoutHandler()}>
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;