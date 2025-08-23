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
import { X, Plus, Palette } from "lucide-react";

export default function EditProductDialog({ product, open, onClose, onUpdate }) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        medium: "",
        year: "",
        location: "",
        category: "",
        isFramed: false,
        dimensions: {
            width: "",
            height: "",
            depth: "",
            unit: "cm",
        },
    });
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                description: product.description || "",
                price: product.price || "",
                medium: product.medium || "",
                year: product.year || "",
                location: product.location || "",
                category: product.category || "",
                isFramed: product.isFramed || false,
                dimensions: {
                    width: product.dimensions?.width || "",
                    height: product.dimensions?.height || "",
                    depth: product.dimensions?.depth || "",
                    unit: product.dimensions?.unit || "cm",
                },
            });
            setTags(product.tags || []);
        }
    }, [product]);

    const handleInputChange = (field, value) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

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
            const response = await fetch(`/api/products/${product._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...formData,
                    tags,
                    price: parseFloat(formData.price),
                    year: parseInt(formData.year),
                }),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                onUpdate(updatedProduct);
                onClose();
            } else {
                throw new Error("Failed to update product");
            }
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product. Please try again.");
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
            <DialogContent className="max-w-2xl mt-12 max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Artwork</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title *</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                placeholder="Artwork title"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Price (₹) *</label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleInputChange("price", e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Describe your artwork..."
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Medium</label>
                            <Input
                                value={formData.medium}
                                onChange={(e) => handleInputChange("medium", e.target.value)}
                                placeholder="e.g., Oil on Canvas"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Year</label>
                            <Input
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleInputChange("year", e.target.value)}
                                placeholder="2024"
                                min="1900"
                                max="2030"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Category</label>
                            <Input
                                value={formData.category}
                                onChange={(e) => handleInputChange("category", e.target.value)}
                                placeholder="e.g., Abstract"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Location</label>
                        <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="e.g., Mumbai, India"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Dimensions</label>
                        <div className="grid grid-cols-4 gap-2">
                            <Input
                                value={formData.dimensions.width}
                                onChange={(e) => handleInputChange("dimensions.width", e.target.value)}
                                placeholder="Width"
                                type="number"
                                min="0"
                                step="0.1"
                            />
                            <Input
                                value={formData.dimensions.height}
                                onChange={(e) => handleInputChange("dimensions.height", e.target.value)}
                                placeholder="Height"
                                type="number"
                                min="0"
                                step="0.1"
                            />
                            <Input
                                value={formData.dimensions.depth}
                                onChange={(e) => handleInputChange("dimensions.depth", e.target.value)}
                                placeholder="Depth"
                                type="number"
                                min="0"
                                step="0.1"
                            />
                            <select
                                value={formData.dimensions.unit}
                                onChange={(e) => handleInputChange("dimensions.unit", e.target.value)}
                                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
                            >
                                <option value="cm">cm</option>
                                <option value="in">in</option>
                                <option value="m">m</option>
                            </select>
                        </div>
                    </div>

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

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="isFramed"
                            checked={formData.isFramed}
                            onChange={(e) => handleInputChange("isFramed", e.target.checked)}
                            className="rounded border-gray-300"
                        />
                        <label htmlFor="isFramed" className="text-sm font-medium">
                            Artwork is framed
                        </label>
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
                            {updating ? "Updating..." : "Update Artwork"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
