"use client";
import { useEffect, useState, use } from "react";
import UserInfo from "@/components/profile/UserInfo";
import TabsComponent from "@/components/profile/TabsComponent";
import { Loader2 } from "lucide-react";
import { useArtist } from "@/hooks/useArtist";
import Chatbot from "@/components/profile/Chatbot";


const UserPage = ({ params }) => {
    const { id } = use(params);
    const { artist, stories, products, loading, error, fetchUserData } =
        useArtist();
    useEffect(() => {
        fetchUserData(id);
    }, [id]);

    if (loading)
        return (
            <p className="text-center h-screen flex items-center justify-center w-screen">
                <Loader2 className="animate-spin"></Loader2>
                Loading
            </p>
        );
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <div className="flex flex-col gap-4">
            <UserInfo id={id} artist={artist} fetchUserData={fetchUserData} />
            <div className="sticky top-80">
                <TabsComponent
                    stories={stories}
                    products={products}
                    artistId={artist?.id}
                    fetchUserData={fetchUserData}
                />
            </div>
            <Chatbot/>
        </div>
    );
};

export default UserPage;
