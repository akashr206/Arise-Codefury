"use client";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, ShoppingCart, Tag } from "lucide-react";
import StoryDialog from "./StoryDialog";
import ProductUploadDialog from "../uploads/productUpload";
import UploadStoryDialog from "../uploads/storyUpload";
import { Plus } from "lucide-react";

function TabsComponent({ stories = [], products = [], artistId }) {
    const [selectedStory, setSelectedStory] = useState(null);
    const [storyDialogOpen, setStoryDialogOpen] = useState(false);
    const [productUpploadOpen, setProductUploadOpen] = useState(false);
    const [storyUploadOpen, setStoryUploadOpen] = useState(false);
    const { user } = useUser();
    const handleStoryClick = (story) => {
        setSelectedStory(story);
        setStoryDialogOpen(true);
    };

    const handleCloseStory = () => {
        setStoryDialogOpen(false);
        setSelectedStory(null);
    };

    return (
        <div className="flex max-w-6xl mx-auto justify-center">
            <Tabs defaultValue="artworks" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="artworks">
                        Artworks ({products.length})
                    </TabsTrigger>
                    <TabsTrigger value="stories">
                        Stories ({stories.length})
                    </TabsTrigger>
                </TabsList>
                <ProductUploadDialog
                    open={productUpploadOpen}
                    onClose={setProductUploadOpen}
                ></ProductUploadDialog>
                <TabsContent value="artworks" className="mt-6">
                    {products.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Artworks Yet
                            </h3>
                            <p className="text-accent-foreground mb-2">
                                This artist hasn't uploaded any artworks yet.
                            </p>
                            {artistId === user.id && (
                                <ProductUploadDialog
                                    open={productUpploadOpen}
                                    onClose={setProductUploadOpen}
                                    showTrigger={true}
                                ></ProductUploadDialog>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
                            {products.map((product) => (
                                <div
                                    key={product._id}
                                    className="group bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-lg transition-all duration-200"
                                >
                                    <div className="relative aspect-square overflow-hidden">
                                        <img
                                            src={
                                                product.images?.[0] ||
                                                "/placeholder.svg"
                                            }
                                            alt={product.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />

                                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-semibold mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>

                                        <p className="text-sm text-accent-foreground mb-3 line-clamp-2">
                                            {product.description}
                                        </p>

                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-lg font-bold text-primary">
                                                ₹
                                                {product.price?.toLocaleString()}
                                            </span>
                                            {product.medium && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {product.medium}
                                                </Badge>
                                            )}
                                        </div>

                                        {product.tags &&
                                            product.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {product.tags
                                                        .slice(0, 3)
                                                        .map((tag, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="secondary"
                                                                className="text-xs bg-accent text-accent-foreground"
                                                            >
                                                                #{tag}
                                                            </Badge>
                                                        ))}
                                                    {product.tags.length >
                                                        3 && (
                                                        <Badge
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {product.tags
                                                                .length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="flex-1 bg-primary hover:bg-primary/90"
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Buy Now
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="px-3"
                                            >
                                                <Heart className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {artistId === user.id && (
                                <button
                                    onClick={() => setProductUploadOpen(true)}
                                    className="group bg-card rounded-xl flex flex-col gap-3 items-center justify-center shadow-sm border border-border border-dashed overflow-hidden hover:shadow-lg transition-all h- duration-200"
                                >
                                    <Plus className="w-24 h-24"></Plus>
                                    Add ArtWork
                                </button>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="stories" className="mt-6">
                    <UploadStoryDialog
                        open={storyUploadOpen}
                        onClose={setStoryUploadOpen}
                    ></UploadStoryDialog>
                    {stories.length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No Stories Yet
                            </h3>
                            <p className="text-gray-500">
                                This artist hasn't shared any stories yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 p-4">
                            {stories?.map((story) => (
                                <div
                                    key={story._id}
                                    className="relative aspect-[9/16] bg-black overflow-hidden rounded-lg cursor-pointer group hover:scale-105 transition-transform duration-200"
                                    onClick={() => handleStoryClick(story)}
                                >
                                    {/* Story Media */}
                                    {story.mediaType === "video" ? (
                                        <video
                                            src={story.mediaUrl}
                                            className="w-full h-full object-cover"
                                            muted
                                            loop
                                        />
                                    ) : (
                                        <img
                                            src={story.mediaUrl}
                                            alt="Story"
                                            className="w-full h-full object-cover"
                                        />
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {story.caption && (
                                            <p className="text-white text-xs line-clamp-2 mb-2">
                                                {story.caption}
                                            </p>
                                        )}

                                        <div className="flex items-center gap-3 text-white/80 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                <span>
                                                    {story.likesCount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="w-3 h-3" />
                                                <span>
                                                    {story.commentsCount || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                <span>
                                                    {story.viewsCount || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="absolute top-2 right-2">
                                        <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                                            {story.mediaType === "video" ? (
                                                <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                                            ) : (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {artistId === user.id && (
                                <button
                                    onClick={() => setStoryUploadOpen(true)}
                                    className="group bg-card rounded-xl flex flex-col gap-3 items-center justify-center shadow-sm border border-border border-dashed overflow-hidden hover:shadow-lg transition-all h- duration-200"
                                >
                                    <Plus className="w-24 h-24"></Plus>
                                    Add Story
                                </button>
                            )}
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {selectedStory && (
                <StoryDialog
                    story={selectedStory}
                    open={storyDialogOpen}
                    onOpenChange={handleCloseStory}
                />
            )}
        </div>
    );
}

export default TabsComponent;
