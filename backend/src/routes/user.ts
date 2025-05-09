import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserInfo} from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser); 
// Protected routes     

router.get("/me", isAuthenticated , getUserInfo); // Add route to fetch user info
export default router;