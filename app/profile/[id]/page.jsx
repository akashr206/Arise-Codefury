"use client";
import { useEffect, useState, use } from "react";
import UserInfo from "@/components/profile/UserInfo";
import TabsComponent from "@/components/profile/TabsComponent";

const UserPage = ({ params }) => {
    const { id } = use(params);
    const [artist, setArtist] = useState(null);
    const [stories, setStories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                const userRes = await fetch(`/api/users/${id}`);
                if (!userRes.ok) {
                    if (userRes.status === 404) {
                        setError("User not found");
                    } else {
                        setError("Something went wrong");
                    }
                    return;
                }
                const userData = await userRes.json();
                setArtist(userData);

                // Fetch user's stories
                const storiesRes = await fetch(`/api/stories?author=${userData.id}`);
                if (storiesRes.ok) {
                    const storiesData = await storiesRes.json();
                    setStories(storiesData);
                }

                // Fetch user's products
                const productsRes = await fetch(`/api/products?artist=${userData.id}`);
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

        if (id) fetchUserData();
    }, [id]);

    if (loading) return <p className="text-center">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex flex-col gap-4">
            <UserInfo id={id} artist={artist} />
            <div className="sticky top-80">
                <TabsComponent 
                    stories={stories} 
                    products={products}
                    artistId={artist?.id}
                />
            </div>
        </div>
    );
};

export default UserPage;
