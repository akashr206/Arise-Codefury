"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import StoryDialog from "@/components/profile/StoryDialog";
import { shuffleArray } from "@/lib/utils";

export default function Feeds({ stories = [], products = [] }) {
    const router = useRouter();
    const [activereel, setActivereel] = useState(null);

    const combinedFeeds = useMemo(() => {
        let feeds = [];

        stories.forEach((story) => {
            feeds.push({
                id: story._id || story.id,
                type: "story",
                author: story.author,
                authorName: story.authorName || "Unknown",
                authorProfile: story.authorProfile,
                mediaUrl: story.mediaUrl,
                mediaType: story.mediaType,
                thumbnailUrl: story.mediaUrl,
                caption: story.caption || "",
                tags: story.tags || [],
                products: story.products || [],
                durationSec: story.durationSec || 0,
                likesCount: story.likesCount || 0,
                viewsCount: story.viewsCount || 0,
                commentsCount: story.commentsCount || 0,
                createdAt: story.createdAt,
                isStory: true,
                originalStory: story,
            });
        });

        products.forEach((product) => {
            feeds.push({
                id: product._id || product.id,
                type: "product",
                author: product.artist,
                authorName: product.artistName || "Unknown Artist",
                authorProfile: product.artistProfile,
                mediaUrl: product.images?.[0] || "",
                mediaType: "image",
                thumbnailUrl: product.images?.[0] || "",
                caption: product.title,
                description: product.description,
                tags: product.tags || [],
                price: product.price,
                medium: product.medium,
                year: product.year,
                category: product.category,
                dimensions: product.dimensions,
                isFramed: product.isFramed,
                location: product.location,
                favorites: product.favorites || 0,
                createdAt: product.createdAt,
                isProduct: true,
                originalProduct: product,
            });
            feeds = shuffleArray(feeds);
        });

        return feeds.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
    }, [stories, products]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleFeedClick = (feed) => {
        if (feed.type === "product") {
            router.push(`/artworks/${feed.id}`);
        } else if (feed.type === "story") {
            setActivereel(feed);
        }
    };

    return (
        <div className="p-4">
            <div className="columns-2 max-w-5xl mx-auto md:columns-3 lg:columns-4 gap-4 space-y-4">
                {combinedFeeds.map((feed) => (
                    <div
                        key={feed.id}
                        className="relative mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl shadow hover:shadow-lg transition"
                        onClick={() => handleFeedClick(feed)}
                    >
                        {feed.mediaType === "video" ? (
                            <video
                                src={feed.mediaUrl}
                                className="w-full h-auto object-cover rounded-xl"
                                preload="metadata"
                                muted
                                playsInline
                            />
                        ) : (
                            <img
                                src={feed.thumbnailUrl || "/placeholder.svg"}
                                alt={feed.caption}
                                className="w-full h-auto object-cover rounded-xl"
                                loading="lazy"
                            />
                        )}

                        {feed.type === "story" && feed.durationSec > 0 && (
                            <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                                <Play size={12} />{" "}
                                {formatDuration(feed.durationSec)}
                            </div>
                        )}

                        {feed.type === "product" && (
                            <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white">
                                ${feed.price}
                            </div>
                        )}

                        {feed.type === "product" && feed.category && (
                            <div className="absolute top-3 left-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white">
                                {feed.category}
                            </div>
                        )}
                    </div>
                ))}
            </div>

                         {activereel && (
                 <StoryDialog
                     story={activereel}
                     open={!!activereel}
                     onOpenChange={(open) => !open && setActivereel(null)}
                 />
             )}
        </div>
    );
}