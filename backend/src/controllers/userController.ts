import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prismaClient"; // Assuming you're using Prisma

const JWT_SECRET = "fdajkjferjkkanvcczlurions"; // Replace with a secure secret

// Register a new user
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login a user
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Logout a user
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear the authentication cookie
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      
      res.status(401).json({ error: "Unauthorized: User not authenticated" });
      return 
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        username: true,
        email: true,
        bio: true,
        profilePicture: true,
      },
    });

    if (!user) {
      
      res.status(404).json({ error: "User not found" });
      return 
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
};