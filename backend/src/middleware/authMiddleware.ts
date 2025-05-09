import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; email: string };
    }
  }
}
const JWT_SECRET = "fdajkjferjkkanvcczlurions"; 

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  console.log('authheader is ',authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return 
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
    req.user = decoded; // Attach the decoded user info to the request object
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return 
  }
};