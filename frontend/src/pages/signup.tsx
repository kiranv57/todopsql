import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(""); // Clear any previous errors
        try {
            // Send data to the backend
            await axios.post("http://localhost:5000/api/auth/register", {
                username: name,
                email,
                password,
            });
            alert("Registration successful! Please log in.");
            navigate("/signin"); // Redirect to the Sign In page
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data?.message || err);
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gray-100">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <h2 className="text-xl font-semibold text-center">Sign Up</h2>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button type="submit" className="w-full">
                            Sign Up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-gray-500">
                        Already have an account?{" "}
                        <a href="/signin" className="text-blue-500 hover:underline">
                            Sign In
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default SignupPage;