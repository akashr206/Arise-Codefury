"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Eye,
    MessageCircle,
    Share2,
    X,
    Play,
    Pause,
} from "lucide-react";

export default function StoryDialog({ story, open, onOpenChange }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (open && story) {
            setIsPlaying(true);
        }
    }, [open, story]);

    if (!story) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
        // TODO: Implement like functionality
    };

    const handleShare = () => {
        // TODO: Implement share functionality
        if (navigator.share) {
            navigator.share({
                title: story.caption || "Check out this story",
                url: window.location.href,
            });
        }
    };

    const handleVideoToggle = () => {
        setIsPlaying(!isPlaying);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-black">
                <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {story.authorName
                                        ? story.authorName
                                              .charAt(0)
                                              .toUpperCase()
                                        : "A"}
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">
                                        {story.authorName || "Anonymous Artist"}
                                    </p>
                                    <p className="text-white/70 text-xs">
                                        {story.createdAt
                                            ? new Date(
                                                  story.createdAt
                                              ).toLocaleDateString()
                                            : "Recently"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            className="text-white hover:bg-white/20"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </DialogHeader>

                <div className="relative h-full">
                    <div className="relative aspect-[9/16] max-h-[80vh] mx-auto">
                        {story.mediaType === "video" ? (
                            <div className="relative w-full h-full">
                                <video
                                    src={story.mediaUrl}
                                    className="w-full h-full object-cover"
                                    autoPlay={isPlaying}
                                    muted={!isPlaying}
                                    loop
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Button
                                        onClick={handleVideoToggle}
                                        size="lg"
                                        variant="ghost"
                                        className="w-16 h-16 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 hover:opacity-100 transition-opacity duration-200"
                                    >
                                        {isPlaying ? (
                                            <Pause className="w-8 h-8" />
                                        ) : (
                                            <Play className="w-8 h-8 ml-1" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <img
                                src={story.mediaUrl}
                                alt="Story"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                        {story.caption && (
                            <p className="text-white text-lg mb-4 leading-relaxed">
                                {story.caption}
                            </p>
                        )}

                        {story.tags && story.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {story.tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                                    >
                                        #{tag}
                                    </Badge>
                                ))}
                            </div>
                        )}

                        {/* Linked Products */}
                        {story.products && story.products.length > 0 && (
                            <div className="mb-4">
                                <p className="text-white/80 text-sm mb-2">
                                    Linked Products:
                                </p>
                                <div className="flex gap-2">
                                    {story.products.map((productId, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-blue-500/20 text-blue-200 border-blue-400/30 hover:bg-blue-400/30"
                                        >
                                            Product {index + 1}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLike}
                                className={`text-white hover:bg-white/20 ${
                                    isLiked ? "text-red-400" : ""
                                }`}
                            >
                                <Heart
                                    className={`w-5 h-5 ${
                                        isLiked ? "fill-current" : ""
                                    }`}
                                />
                                <span className="ml-2">
                                    {story.likesCount || 0}
                                </span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white hover:bg-white/20"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="ml-2">
                                    {story.commentsCount || 0}
                                </span>
                            </Button>

                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleShare}
                                className="text-white hover:bg-white/20"
                            >
                                <Share2 className="w-5 h-5" />
                            </Button>

                            <div className="ml-auto flex items-center text-white/80 text-sm">
                                <Eye className="w-4 h-4 mr-1" />
                                {story.viewsCount || 0} views
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
