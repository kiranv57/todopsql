import React, { useEffect } from "react";

import UserProfile from "@/components/UserProfile";
import { Outlet } from "react-router-dom";
import { useTodoStore } from "@/store/todoStore";
import { useUserStore } from "@/store/userStore";



const UserFeed: React.FC = () => {
  
  const { loading, error, fetchTodosById, fetchTodos } = useTodoStore(); 
  // const { user } = useUserStore();
  const user = useUserStore(state => state.user);
  

  useEffect( () => {
    const fetch = async () => {
      if(user?.id) {
      try {
        await fetchTodosById(user.id)  
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    else{
       try {
        await fetchTodos()  
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
      
    }
    }
    fetch();
  }, [user?.id]);

 

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    console.log(user),
    <div className="flex min-h-screen bg-gray-100 flex items-stretch w-full "> 
    {/* Sidebar */}
    <div className="w-64 min-h-full sticky top-0">
      <UserProfile />
    </div>

    {/* Main Content */}
    <div className="flex-1 p-6 min-h-full ">
      <Outlet/>
    </div>
  </div>
     
   
  );
};

export default UserFeed;