import { Router } from "express";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getTodosById,
} from "../controllers/todoController";
import { isAuthenticated } from "../middleware/authMiddleware";

const router = Router();

// Protect all routes with the isAuthenticated middleware
router.get("/", isAuthenticated, getTodos);
router.get("/:id", isAuthenticated, getTodosById);
router.post("/create", isAuthenticated, createTodo);
router.put("/:id", isAuthenticated, updateTodo);
router.delete("/:id", isAuthenticated, deleteTodo);

export default router;