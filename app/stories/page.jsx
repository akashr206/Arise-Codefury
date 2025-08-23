"use client";
import { useEffect, useState, useRef } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default function StoryFeed() {
    const [stories, setStories] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef({});
    const [isLoading, setIsLoading] = useState(true);
    const [linkedProducts, setLinkedProducts] = useState({});

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch("/api/stories/all");
                let data = await res.json();
                data = shuffleArray(data.stories);
                console.log(data);

                setStories(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStories();
    }, []);

    const fetchLinkedProducts = async (storyIndex) => {
        const story = stories[storyIndex];
        console.log("Fetching linked products for story:", story);

        if (!story?.products || story.products.length === 0) {
            setLinkedProducts((prev) => ({ ...prev, [storyIndex]: [] }));
            return;
        }

        try {
            const productPromises = story.products.map(async (productId) => {
                const response = await fetch(`/api/products/${productId}`);
                if (response.ok) return await response.json();
                return null;
            });

            const products = await Promise.all(productPromises);
            setLinkedProducts((prev) => ({
                ...prev,
                [storyIndex]: products.filter(Boolean),
            }));
        } catch (err) {
            console.error("Error fetching linked products:", err);
            setLinkedProducts((prev) => ({ ...prev, [storyIndex]: [] }));
        }
    };

    const handleProductClick = (product) => {
        console.log("Clicked product:", product);
    };

    useEffect(() => {
        const handleScroll = () => {
            const container = document.querySelector(".story-container");
            if (!container) return;

            const scrollTop = container.scrollTop;
            const itemHeight = window.innerHeight;
            const newIndex = Math.round(scrollTop / itemHeight);
            console.log(newIndex);

            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
                fetchLinkedProducts(newIndex);
            }
        };

        const container = document.querySelector(".story-container");
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [currentIndex, stories]);

    useEffect(() => {
        Object.keys(videoRefs.current).forEach((key, index) => {
            const video = videoRefs.current[key];
            if (video) {
                if (index === currentIndex) {
                    video.play().catch(console.error);
                } else {
                    video.pause();
                }
            }
        });
    }, [currentIndex]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => (document.body.style.overflow = "auto");
    }, []);

    // Fetch products for the first story when stories are loaded
    useEffect(() => {
        if (stories.length > 0 && currentIndex === 0) {
            fetchLinkedProducts(0);
        }
    }, [stories]);

    if (!stories.length) {
        return (
            <div className="flex flex-col h-screen items-center justify-center">
                <Loader2 className="animate-spin"></Loader2>
                Loading stories
            </div>
        );
    }

    return (
        <div className="story-container pb-32 h-screen mt-[85px] w-full pt-20 overflow-y-scroll snap-y snap-mandatory ">
            {stories.map((story, idx) => (
                <div
                    key={story.id || idx}
                    className="h-[calc(100vh-85px)] w-full flex max-w-xl mx-auto flex-col justify-between snap-start  relative"
                >
                    <div className="flex-1 aspect-[9/16] w-full h-full flex items-center justify-center relative overflow-hidden">
                        {story.mediaType === "video" ? (
                            <video
                                ref={(el) => {
                                    if (el) videoRefs.current[idx] = el;
                                }}
                                src={story.mediaUrl}
                                className="w-full h-full object-contain"
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                onLoadStart={() => {
                                    setIsLoading(true);
                                    console.log(`Loading video ${idx}`);
                                }}
                                onCanPlay={(e) => {
                                    console.log(`Video ${idx} can play`);
                                    setIsLoading(false);
                                    e.currentTarget.play().catch((err) => {
                                        console.warn("Autoplay blocked:", err);
                                    });
                                }}
                                onError={(e) =>
                                    console.error(`Video ${idx} error:`, e)
                                }
                            />
                        ) : (
                            <img
                                src={story.mediaUrl}
                                alt="story"
                                className="w-full  h-full object-contain"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/400x800/333/fff?text=Image+Not+Found";
                                }}
                            />
                        )}
                        {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="h-10 w-10 border-4  border-white/50 border-t-white animate-spin rounded-full" />
                            </div>
                        )}
                    </div>
                    <div className=" w-full">
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                            <div>
                                <Link
                                    href={`/profile/${story.authorUsername}`}
                                    className="mb-3 w-max"
                                >
                                    <div className="flex items-center w-max gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                                            <img
                                                src={story.authorProfile}
                                                alt={story.authorName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display =
                                                        "none";
                                                    e.target.nextSibling.style.display =
                                                        "flex";
                                                }}
                                            />
                                            <span className="text-white font-semibold hidden">
                                                {story.authorName
                                                    ?.charAt(0)
                                                    .toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-white">
                                                {story.authorName}
                                            </span>
                                            <span className="text-xs text-white/70">
                                                @{story.authorUsername}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                                {story.caption && (
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        {story.caption}
                                    </p>
                                )}
                            </div>
                            <div>
                                {linkedProducts[idx] &&
                                    linkedProducts[idx].length > 0 && (
                                        <>
                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                {linkedProducts[idx].map(
                                                    (product) => (
                                                        <Link
                                                            key={product._id}
                                                            href={`/artworks/${product._id}`}
                                                            className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[200px] border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                                                            onClick={() =>
                                                                handleProductClick(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/20">
                                                                    <img
                                                                        src={
                                                                            product
                                                                                .images?.[0] ||
                                                                            "/placeholder.svg"
                                                                        }
                                                                        alt={
                                                                            product.title
                                                                        }
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-white font-medium text-sm truncate">
                                                                        {
                                                                            product.title
                                                                        }
                                                                    </p>
                                                                    <p className="text-white/70 text-xs truncate">
                                                                        ₹
                                                                        {product.price?.toLocaleString()}
                                                                    </p>
                                                                    {product.medium && (
                                                                        <Badge
                                                                            variant="secondary"
                                                                            className="mt-1 text-xs bg-white/20 text-white border-white/30"
                                                                        >
                                                                            {
                                                                                product.medium
                                                                            }
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="text-white hover:bg-white/20 p-1"
                                                                >
                                                                    <ExternalLink className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </Link>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                            </div>
                        </div>
                    </div>
                    {story.mediaType === "video" && (
                        <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
                            <div className="w-3 h-3 bg-white rounded-full opacity-60"></div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
