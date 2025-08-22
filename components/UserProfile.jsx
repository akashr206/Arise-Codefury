"use client";

import { useUserContext } from "@/contexts/UserContext";

export default function UserProfile() {
    const { user, loading, error, refreshUser } = useUserContext();

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-gray-600">Loading user...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">Error: {error}</p>
                <button
                    onClick={refreshUser}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-gray-600">Not authenticated</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-4">
                {user.profile && (
                    <img
                        src={user.profile}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                )}
                <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {user.name}
                    </h2>
                    <p className="text-gray-600">@{user.username}</p>
                    {user.bio && (
                        <p className="text-gray-700 mt-2">{user.bio}</p>
                    )}
                </div>
                <button
                    onClick={refreshUser}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Refresh
                </button>
            </div>
            
            {user.categories && user.categories.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {user.categories.map((category, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                                {category}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                    <p className="text-2xl font-bold text-gray-900">
                        {user.artworksCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">Artworks</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">
                        {user.followersCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">Followers</p>
                </div>
                <div>
                    <p className="text-2xl font-bold text-gray-900">
                        {user.followingCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">Following</p>
                </div>
            </div>
        </div>
    );
}
