import { Router } from "express";
import { registerUser, loginUser, logoutUser, getUserInfo, updateUser} from "../controllers/userController";
import { isAuthenticated } from "../middleware/authMiddleware";
import upload from "../utils/multer";

const router = Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser); 
router.put("/update", isAuthenticated, upload.single("profilePicture"), updateUser);
// Protected routes     

router.get("/me", isAuthenticated , getUserInfo); // Add route to fetch user info
export default router;