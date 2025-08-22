"use client";

import { useState, useEffect } from "react";
import { useUserContext } from "@/contexts/UserContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X, Edit3 } from "lucide-react";

export default function EditUserDialog() {
    const { user, refreshUser } = useUserContext();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        bio: "",
        location: "",
        categories: [],
        instagram: "",
        twitter: "",
    });
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        if (user && open) {
            setFormData({
                name: user.name || "",
                username: user.username || "",
                bio: user.bio || "",
                location: user.location || "",
                categories: user.categories || [],
                instagram: user.instagram || "",
                twitter: user.twitter || "",
            });
        }
    }, [user, open]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const addCategory = () => {
        if (newCategory.trim() && !formData.categories.includes(newCategory.trim())) {
            setFormData(prev => ({
                ...prev,
                categories: [...prev.categories, newCategory.trim()]
            }));
            setNewCategory("");
        }
    };

    const removeCategory = (categoryToRemove) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.filter(cat => cat !== categoryToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCategory();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`/api/users/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to update profile");
            }

            await refreshUser();
            setOpen(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Name *
                            </label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                placeholder="Enter your full name"
                                required
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Username *
                            </label>
                            <Input
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                placeholder="Enter username"
                                required
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <Textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={4}
                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Location
                        </label>
                        <Input
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            placeholder="City, Country"
                            className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Instagram
                            </label>
                            <Input
                                value={formData.instagram}
                                onChange={(e) => handleInputChange("instagram", e.target.value)}
                                placeholder="Instagram username"
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Twitter
                            </label>
                            <Input
                                value={formData.twitter}
                                onChange={(e) => handleInputChange("twitter", e.target.value)}
                                placeholder="Twitter username"
                                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Categories
                        </label>
                        <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg min-h-12 focus-within:border-blue-400">
                            {formData.categories.map((category, index) => (
                                <Badge
                                    key={index}
                                    variant="secondary"
                                    className="bg-accent text-accent-foreground"
                                >
                                    {category}
                                    <button
                                        type="button"
                                        onClick={() => removeCategory(category)}
                                        className="ml-1.5 hover:text-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                            <input
                                type="text"
                                placeholder={formData.categories.length === 0 ? "Add categories..." : ""}
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={handleKeyPress}
                                onBlur={addCategory}
                                className="flex-1 min-w-20 bg-transparent outline-none text-sm placeholder-gray-400"
                            />
                        </div>
                        <p className="text-xs text-gray-400">
                            Press Enter to add categories
                        </p>
                    </div>

                    <DialogFooter className="pt-6 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={loading}
                            className="border-gray-200 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {loading ? (
                                <div className="flex items-center space-x-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Saving...</span>
                                </div>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
