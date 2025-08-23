"use client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import Feeds from "@/components/explore/Feeds";

export default function ExplorePage() {
    const [stories, setStories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const [storiesRes, productsRes] = await Promise.all([
                    fetch(`/api/stories/all?limit=100`),
                    fetch(`/api/products/all?limit=100`),
                ]);

                if (!storiesRes.ok || !productsRes.ok) {
                    throw new Error("Failed to fetch data");
                }

                const storiesData = await storiesRes.json();
                const productsData = await productsRes.json();

                setStories(storiesData.stories || []);
                setProducts(productsData.products || []);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Something went wrong while fetching explore data");
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    if (loading)
        return (
            <div className="mt-20 w-screen h-screen flex flex-col items-center justify-center">
                <Loader2 className="animate-spin"></Loader2>
                Loading
            </div>
        );
    if (error) return <div className="mt-20 text-red-500">{error}</div>;

    return (
        <div className="mt-20">
            <Feeds stories={stories} products={products} />
        </div>
    );
}
