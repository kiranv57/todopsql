import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import UserFeed from "./pages/UserFeed";
import SignInPage from "./pages/signin";
import ProtectedRoute from "./components/ProtectedRoute";
import SignupPage from "./pages/signup";
import ChatPage from "./components/ChatPage";
import TodoDashboard from "./pages/TodoDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 


function App() {
  return (
    <Router>
    <main className="flex min-h-screen w-full bg-gray-700 text-4xl justify-center items-center">
      <Routes>
        {/* Public Route */}
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {/* Protected Route */}
        {/* <Route
          path="/feed"
          element={
            <ProtectedRoute>
              <UserFeed />
            </ProtectedRoute>
          }
        /> */}

        {/* Default Route */}
        
        <Route path="/signin" element={<Navigate to="/signin" replace />} />
        <Route path="/" element={<ProtectedRoute><UserFeed /></ProtectedRoute>}>
          <Route path="/" element={<TodoDashboard />} />
          <Route path="/chat/:friendId" element={<ChatPage />} />
        </Route>

        

        
      </Routes>
      <ToastContainer />
    </main>
  </Router>
  );
}

export default App;
