import { Request, Response } from "express";
import prisma from "../config/prismaClient";
import { broadcastEvent, getSocketInstance } from "../utils/socket";

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated
    console.log("here",req.user)
    if (!req.user || !req.user.id) {

      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return 
    }

    // Fetch todos for the authenticated user
    const todos = await prisma.todo.findMany({
      // where: { authorId: Number(req.user.id) }, // Filter by the authenticated user's ID
    });

    res.json(todos);
    return
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
    return
  }
};


export const getTodosById = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated
    console.log("here",req.user)
    if (!req.user || !req.user.id) {

      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return 
    }

    const { id } = req.params;

    // Fetch todos for the authenticated user
    const todos = await prisma.todo.findMany({
      where: { authorId: Number(id) }, // Filter by the authenticated user's ID
    });

    res.json(todos);
    return
  } catch (err) {
    console.error("Error fetching todos:", err);
    res.status(500).json({ error: "Failed to fetch todos" });
    return
  }
};

export const createTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "Missing required fields" });
    }

    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        authorId: Number(req?.user?.id), // Use the authenticated user's ID as the author
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: todo.authorId },
      select: { username: true },
    })

    const newTodo = {
      ...todo, username: user?.username
    }

    const socket = getSocketInstance();
    socket?.emit("todoCreated", newTodo); // Emit the event to the socket server
    // Broadcast the new todo to all connected clients

    // broadcastEvent(socket, "todoCreated", newTodo);

    res.status(201).json(todo);

  } catch (err: any) {
    console.error("Error creating todo:", err);
    res.status(500).json({ error: "Failed to create todo", details: err.message });
  }
};

export const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!todo || !req.user || String(todo.authorId) !== String(req.user.id)) {
      res.status(403).json({ error: "Forbidden: You do not own this todo" });
      return;
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: parseInt(id, 10) },
      data: { title, description },
    });
    const socket = getSocketInstance();
    socket?.emit("todoUpdated", updatedTodo); // Emit the event to the socket server
     // Broadcast the updated todo to a ll connected clients
    //  broadcastEvent("todoUpdated", updatedTodo);

     res.status(200).json(updatedTodo);

  } catch (err) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const todo = await prisma.todo.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!todo || !req.user || String(todo.authorId) !== String(req.user.id)) {
      res.status(403).json({ error: "Forbidden: You do not own this todo" });
    }

    const deletedTodo = await prisma.todo.delete({
      where: { id: parseInt(id, 10) },
    });

    const socket = getSocketInstance();
    socket?.emit("todoDeleted", todo); // Emit the event to the socket server
    // Broadcast the deleted todo ID to all connected clients
    // broadcastEvent("todoDeleted", { id: deletedTodo.id });

    res.status(200).json({ "success": true, deletedTodo});
  } catch (err) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};