"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
const UserContext = createContext();

export const useArtist = () => useContext(UserContext);

export const ArtistProvider = ({ id, children }) => {
    const [artist, setArtist] = useState(null);
    const [stories, setStories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userId } = useUser();
    const fetchUserData = async (id = userId) => {
        try {
            setLoading(true);
            const userRes = await fetch(`/api/users/${id}`);
            if (!userRes.ok) {
                if (userRes.status === 404) setError("User not found");
                else setError("Something went wrong");
                return;
            }
            const userData = await userRes.json();
            setArtist(userData);

            const storiesRes = await fetch(
                `/api/stories?author=${userData.id}`
            );
            if (storiesRes.ok) {
                const storiesData = await storiesRes.json();
                setStories(storiesData);
            }

            const productsRes = await fetch(
                `/api/products?artist=${userData.id}`
            );
            if (productsRes.ok) {
                const productsData = await productsRes.json();
                setProducts(productsData);
            }
        } catch (err) {
            setError("Failed to fetch user data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (!id) return;
        fetchUserData(userId);
    }, [id, userId]);

    return (
        <UserContext.Provider
            value={{ artist, stories, products, loading, error, fetchUserData }}
        >
            {children}
        </UserContext.Provider>
    );
};
