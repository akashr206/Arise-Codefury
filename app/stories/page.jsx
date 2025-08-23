"use client";
import { useEffect, useState, useRef } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
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

    useEffect(() => {
        const fetchStories = async () => {
            try {
                const res = await fetch("/api/stories/all");
                let data = await res.json();

                console.log(data);
                data = shuffleArray(data.stories);

                setStories(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchStories();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const container = document.querySelector(".story-container");
            if (!container) return;

            const scrollTop = container.scrollTop;
            const itemHeight = window.innerHeight;
            const newIndex = Math.round(scrollTop / itemHeight);

            if (newIndex !== currentIndex) {
                setCurrentIndex(newIndex);
            }
        };

        const container = document.querySelector(".story-container");
        if (container) {
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, [currentIndex]);

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

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        <Link href={`/profile/${story.authorUsername}`} className="mb-3 w-max">
                            <div className="flex items-center w-max gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                                    
                                    <img
                                        src={story.authorProfile}
                                        alt={story.authorName}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
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
                                    <span className="text-xs text-accent">
                                        @{story.authorUsername}
                                    </span>
                                </div>
                            </div>
                        </Link>
                        {story.caption && (
                            <p className="text-sm text-accent leading-relaxed">
                                {story.caption}
                            </p>
                        )}
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
