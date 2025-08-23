"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { BadgeCheck } from "lucide-react";

export default function StoryDialog({ story, open, onOpenChange }) {
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [linkedProducts, setLinkedProducts] = useState([]);

    useEffect(() => {
        if (open && story) {
            setIsPlaying(true);
            if (story.products && story.products.length > 0) {
                fetchLinkedProducts();
            }
        }
    }, [open, story]);

    const fetchLinkedProducts = async () => {
        try {
            const productPromises = story.products.map(async (productId) => {
                const response = await fetch(`/api/products/${productId}`);
                if (response.ok) {
                    return await response.json();
                }
                return null;
            });

            const products = await Promise.all(productPromises);
            setLinkedProducts(products.filter(Boolean));
        } catch (error) {
            console.error("Error fetching linked products:", error);
        }
    };

    if (!story) return null;

    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const handleShare = () => {
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
            <DialogContent className="max-w-4xl max-h-[90vh] mt-10 overflow-hidden p-0 bg-black">
                <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
                    <DialogTitle></DialogTitle>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3">
                                {console.log(story)}
                                <Avatar className="w-10 h-10 border-2 border-white">
                                    <AvatarImage
                                        src={story.authorProfile}
                                        alt={story.authorName}
                                    />
                                    <AvatarFallback>
                                        {story.authorName
                                            ? story.authorName
                                                  .charAt(0)
                                                  .toUpperCase()
                                            : "A"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-white font-semibold text-sm">
                                        {story.authorName || "Anonymous Artist"}
                                        {story.authorVerified && (
                                            <BadgeCheck className="inline-block w-5 h-5 ml-1 fill-blue-500 text-white" />
                                        )}
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
                                className="w-full h-full object-contain"
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

                        {linkedProducts.length > 0 && (
                            <div className="mb-4">
                                <p className="text-white/90 text-sm font-medium mb-3">
                                    🛍️ Products in this story
                                </p>
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {linkedProducts.map((product) => (
                                        <Link
                                            key={product._id}
                                            href={`/artworks/${product._id}`}
                                            className="flex-shrink-0 bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[200px] border border-white/20 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                                            onClick={() =>
                                                handleProductClick(product)
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
                                                        alt={product.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-medium text-sm truncate">
                                                        {product.title}
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
                                                            {product.medium}
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
                                    ))}
                                </div>
                            </div>
                        )}

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
