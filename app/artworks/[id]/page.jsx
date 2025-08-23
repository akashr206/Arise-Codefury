"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Artwork from "@/components/explore/Artwork";

const ArtworkPage = () => {
    const params = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${params.id}`);
                
                if (!response.ok) {
                    throw new Error('Product not found');
                }
                
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProduct();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading artwork...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Artwork Not Found</h1>
                    <p className="text-gray-600">{error || "The artwork you're looking for doesn't exist."}</p>
                </div>
            </div>
        );
    }

    return <Artwork artwork={product} />;
};

export default ArtworkPage;
