"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isSignedIn, userId } = useAuth();

    const fetchUser = async () => {
        if (!isSignedIn || !userId) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch user data");
            }

            const data = await response.json();
            setUser(data.user);
        } catch (err) {
            console.error("Error fetching user:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    useEffect(() => {
        fetchUser();
    }, [isSignedIn, userId]);

    return {
        user,
        loading,
        error,
        refreshUser,
        isSignedIn,
        userId,
    };
};
