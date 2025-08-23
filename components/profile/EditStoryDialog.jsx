"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Image, Video } from "lucide-react";

export default function EditStoryDialog({ story, open, onClose, onUpdate }) {
    const [caption, setCaption] = useState("");
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (story) {
            setCaption(story.caption || "");
            setTags(story.tags || []);
        }
    }, [story]);

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        
        try {
            const response = await fetch(`/api/stories/${story._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    caption,
                    tags,
                }),
            });

            if (response.ok) {
                const updatedStory = await response.json();
                onUpdate(updatedStory);
                onClose();
            } else {
                throw new Error("Failed to update story");
            }
        } catch (error) {
            console.error("Error updating story:", error);
            alert("Failed to update story. Please try again.");
        } finally {
            setUpdating(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[85vh] mt-12 overflow-auto">
                <DialogHeader>
                    <DialogTitle>Edit Story</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Story Preview</label>
                        <div className="relative aspect-[1/1] bg-black overflow-hidden w-52 mx-auto rounded-lg">
                            {story?.mediaType === "video" ? (
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
                            <div className="absolute top-2 right-2">
                                <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                                    {story?.mediaType === "video" ? (
                                        <div className="w-0 h-0 border-l-[6px] border-l-white border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                                    ) : (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Caption</label>
                        <Textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption for your story..."
                            rows={3}
                        />
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags</label>
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Add a tag and press Enter"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={addTag}
                                variant="outline"
                                size="sm"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {tags.map((tag, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="ml-1 hover:text-destructive"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={updating}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={updating}
                            className="bg-primary hover:bg-primary/90"
                        >
                            {updating ? "Updating..." : "Update Story"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
