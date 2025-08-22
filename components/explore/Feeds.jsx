"use client"
import { useState } from "react"
import { Play } from "lucide-react"
import StoryDialog from "./StoryDialog"
import Artwork from "./Artwork"

const mockFeeds = [
  {
    id: 1,
    type: "image",
    author: "nature_lover",
    mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9sAaby5ZCCma4xZ5q7rWQyX67UFRCfOXOdA&s",
    mediaType: "image",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9sAaby5ZCCma4xZ5q7rWQyX67UFRCfOXOdA&s",
    caption: "Beautiful nature landscape",
    tags: ["nature", "landscape", "peaceful"],
    products: [],
    durationSec: 0,
    likesCount: 1250,
    viewsCount: 5600,
    commentsCount: 89,
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    type: "story",
    author: "city_explorer",
    mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    mediaType: "video",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFoa6dqANx1FTiSrrenPQ2aOIFvFw2FEZb1g&s",
    caption: "Amazing city vibes at sunset 🌆",
    tags: ["city", "sunset", "urban", "vibes"],
    products: [
      { name: "Urban Photography Course", price: "$49" },
      { name: "City Guide Book", price: "$25" },
    ],
    durationSec: 45,
    likesCount: 2890,
    viewsCount: 12400,
    commentsCount: 156,
    createdAt: "2024-01-14T18:45:00Z",
  },
  {
    id: 3,
    type: "image",
    author: "foodie_chef",
    mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEJo5momVWs33PaKkBY27ArtTdnX1sZlz3gg&s",
    mediaType: "image",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEJo5momVWs33PaKkBY27ArtTdnX1sZlz3gg&s",
    caption: "Homemade pasta with fresh ingredients",
    tags: ["food", "pasta", "homemade", "italian"],
    products: [
      { name: "Pasta Making Kit", price: "$35" },
      { name: "Italian Cookbook", price: "$28" },
    ],
    durationSec: 0,
    likesCount: 1876,
    viewsCount: 7200,
    commentsCount: 234,
    createdAt: "2024-01-13T12:20:00Z",
  },
  {
    id: 4,
    type: "image",
    author: "wanderlust_traveler",
    mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVo0keNjGR2EvD0iODP-dVmkoaqwFEtab-iw&s",
    mediaType: "image",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVo0keNjGR2EvD0iODP-dVmkoaqwFEtab-iw&s",
    caption: "Mountain adventure awaits!",
    tags: ["travel", "mountains", "adventure", "hiking"],
    products: [
      { name: "Hiking Backpack", price: "$89" },
      { name: "Travel Guide", price: "$22" },
    ],
    durationSec: 0,
    likesCount: 3245,
    viewsCount: 9800,
    commentsCount: 187,
    createdAt: "2024-01-12T08:15:00Z",
  },
  {
    id: 5,
    type: "story",
    author: "car_enthusiast",
    mediaUrl: "https://www.w3schools.com/html/movie.mp4",
    mediaType: "video",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQya3fiEtH65Pdnp7h0hOCpDO9Q8wpUSNHczA&s",
    caption: "Epic car review - this beast is incredible! 🚗💨",
    tags: ["cars", "review", "automotive", "speed"],
    products: [
      { name: "Car Care Kit", price: "$45" },
      { name: "Auto Magazine Subscription", price: "$30" },
    ],
    durationSec: 80,
    likesCount: 4567,
    viewsCount: 18900,
    commentsCount: 298,
    createdAt: "2024-01-11T16:30:00Z",
  },
  {
    id: 6,
    type: "story",
    author: "speed_demon",
    mediaUrl: "https://www.w3schools.com/html/movie.mp4",
    mediaType: "video",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSi0xFF1t4uq8WcT1Dt9OIMqlCdK76KQX9LiA&s",
    caption: "Racing through the city streets",
    tags: ["racing", "cars", "speed", "adrenaline"],
    products: [],
    durationSec: 80,
    likesCount: 2134,
    viewsCount: 8700,
    commentsCount: 145,
    createdAt: "2024-01-10T20:45:00Z",
  },
  {
    id: 7,
    type: "image",
    author: "beach_lover",
    mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVvx3H1sI5ko4utMuSxxiVISuJVFl4VCCtA&s",
    mediaType: "image",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsVvx3H1sI5ko4utMuSxxiVISuJVFl4VCCtA&s",
    caption: "Paradise found 🏖️",
    tags: ["beach", "paradise", "vacation", "tropical"],
    products: [{ name: "Beach Essentials Kit", price: "$55" }],
    durationSec: 0,
    likesCount: 2876,
    viewsCount: 11200,
    commentsCount: 167,
    createdAt: "2024-01-09T14:20:00Z",
  },
  {
    id: 8,
    type: "image",
    author: "sunset_chaser",
    mediaUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRatau0-NWTYCzRf5x99fIvbX2CETw-T5I_g&s",
    mediaType: "image",
    thumbnailUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRatau0-NWTYCzRf5x99fIvbX2CETw-T5I_g&s",
    caption: "Golden hour magic ✨",
    tags: ["sunset", "golden hour", "photography", "nature"],
    products: [
      { name: "Photography Course", price: "$75" },
      { name: "Camera Filters Set", price: "$40" },
    ],
    durationSec: 0,
    likesCount: 1987,
    viewsCount: 6800,
    commentsCount: 123,
    createdAt: "2024-01-08T19:30:00Z",
  },
]

export default function Feeds() {
  const [activereel, setActivereel] = useState(null)
  const [activeArtwork, setActiveArtwork] = useState(null)

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleFeedClick = (feed) => {
    if (feed.type === "image") {
      setActiveArtwork(feed)
    } else if (feed.type === "story") {
      setActivereel(feed)
    }
  }

  return (
    <div className="p-4">
      {/* Masonry Grid */}
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {mockFeeds.map((feed) => (
          <div
            key={feed.id}
            className="relative mb-4 break-inside-avoid cursor-pointer overflow-hidden rounded-xl shadow hover:shadow-lg transition"
            onClick={() => handleFeedClick(feed)}
          >
            <img
              src={feed.thumbnailUrl || "/placeholder.svg"}
              alt={feed.caption}
              className="w-full h-auto object-cover rounded-xl"
              loading="lazy"
            />

            {/* Overlay for reels */}
            {feed.type === "story" && (
              <div className="absolute top-3 right-3 bg-black/60 px-2 py-1 rounded-md text-xs text-white flex items-center gap-1">
                <Play size={12} /> {formatDuration(feed.durationSec)}
              </div>
            )}
          </div>
        ))}
      </div>

      {activereel && <StoryDialog reel={activereel} isOpen={!!activereel} onClose={() => setActivereel(null)} />}
      {activeArtwork && (
        <Artwork artwork={activeArtwork} isOpen={!!activeArtwork} onClose={() => setActiveArtwork(null)} />
      )}
    </div>
  )
}
