"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Heart,
  Share2,
  Star,
  MapPin,
  Calendar,
  Palette,
  Ruler,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Eye,
  Brush,
  Camera,
} from "lucide-react"

export default function Artwork({ artwork, onBack }) {
  const [isLoved, setIsLoved] = useState(false)
  const [viewCount] = useState(127) // Static additional views instead of random
  const [isZooming, setIsZooming] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const handleMouseEnter = () => {
    setIsZooming(true)
  }

  const handleMouseLeave = () => {
    setIsZooming(false)
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setZoomPosition({ x, y })
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const convertFeedToArtwork = (feed) => {
    if (!feed) return null

    return {
      id: feed.id,
      title: feed.caption || "Untitled Creation",
      artist: {
        name: feed.author || "Anonymous Artist",
        avatar: "/artist-portrait.png",
        rating: 4.9,
        followers: 2847, // Fixed static value instead of random
        location: "Creative Studio",
        verified: true,
        bio: "Passionate artist exploring the boundaries of creativity and emotion through visual storytelling.",
      },
      images: [
        feed.mediaUrl,
        "/sunset-mountain-painting-detail.png",
        "/sunset-mountain-painting-frame.png",
        "/sunset-mountain-painting-studio.png",
      ],
      medium: "Digital Art",
      dimensions: "Infinite × Boundless",
      year: 2024,
      style: "Contemporary Expression",
      subject: feed.tags?.[0] || "Abstract Emotion",
      description: `${feed.caption || "A beautiful expression of creativity"} - This captivating piece invites viewers into a world of imagination and wonder. Every element has been carefully crafted to evoke emotion and spark conversation about the human experience.`,
      story:
        "Born from a moment of pure inspiration, this artwork represents the artist's journey through color, form, and meaning. Each stroke carries intention, each hue tells a story of passion and dedication to the craft.",
      inspiration:
        "This piece was inspired by the interplay of light and shadow in everyday moments, transformed into something extraordinary through the artist's unique vision.",
      technique:
        "Created using innovative digital techniques combined with traditional artistic principles, resulting in a harmonious blend of old and new.",
      emotion: "Joy, Wonder, Contemplation",
      tags: feed.tags || ["art", "creativity", "expression"],
      views: 6234, // Fixed static value instead of random
      loves: 189, // Fixed static value instead of random
    }
  }

  const defaultArtwork = {
    id: "1",
    title: "Whispers of the Golden Hour",
    artist: {
      name: "Luna Artiste",
      avatar: "/artist-portrait.png",
      rating: 4.9,
      followers: 3247,
      location: "Atelier Dreams, Paris",
      verified: true,
      bio: "Capturing the poetry of light and the symphony of colors that dance in everyday moments.",
    },
    images: [
      "/sunset-mountain-painting.png",
      "/sunset-mountain-painting-detail.png",
      "/sunset-mountain-painting-frame.png",
      "/sunset-mountain-painting-studio.png",
    ],
    medium: "Oil & Dreams",
    dimensions: "24 × 36 inches of pure emotion",
    year: 2024,
    style: "Neo-Impressionist Soul",
    subject: "Nature's Symphony",
    description:
      "This enchanting piece captures the magical moment when day surrenders to night, painting the sky in hues of gold and amber. Each brushstroke whispers stories of tranquility and wonder, inviting viewers to lose themselves in the beauty of the natural world.",
    story:
      "Created during a transformative journey through the mountains, this artwork embodies the artist's deep connection with nature's rhythms. Over three months of patient observation and passionate creation, every detail was lovingly crafted to share this moment of pure serenity.",
    inspiration:
      "The inspiration struck during a solitary hike at sunset, when the mountains seemed to glow with an inner light that spoke directly to the soul.",
    technique:
      "Layered oil painting technique with palette knife textures, creating depth and movement that brings the scene to life.",
    emotion: "Serenity, Wonder, Connection",
    tags: ["landscape", "sunset", "mountains", "serenity", "nature"],
    views: 8432,
    loves: 234,
  }

  const artworkData = convertFeedToArtwork(artwork) || defaultArtwork

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-primary/10 transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium">Back to Gallery</span>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="relative group">
              <div
                className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 to-secondary/5 shadow-2xl hover:shadow-primary/20 transition-all duration-500 float-animation cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={artworkData.images[selectedImageIndex] || "/placeholder.svg"}
                  alt={artworkData.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {isZooming && (
                  <div
                    className="absolute w-32 h-32 border-2 border-primary/60 rounded-full pointer-events-none bg-white/10 backdrop-blur-sm shadow-lg"
                    style={{
                      left: mousePosition.x - 64,
                      top: mousePosition.y - 64,
                      transform: "translate(0, 0)",
                    }}
                  />
                )}
              </div>

              {isZooming && (
                <div className="absolute top-0 left-full ml-4 w-64 h-64 bg-white rounded-2xl shadow-2xl border-2 border-primary/20 overflow-hidden z-10 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div
                    className="w-full h-full bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${artworkData.images[selectedImageIndex] || "/placeholder.svg"})`,
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      backgroundSize: "600%", // Increased zoom level from 300% to 600% for more detailed view
                    }}
                  />
                  <div className="absolute inset-0 border border-primary/30 rounded-2xl" />
                  <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    Zoom View
                  </div>
                </div>
              )}

              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2 shadow-lg">
                <Eye className="w-4 h-4 text-secondary" />
                <span className="text-sm font-medium">{artworkData.views + viewCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {artworkData.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                    selectedImageIndex === index
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${artworkData.title} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

          
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Original Creation
                </Badge>
                {artworkData.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="border-secondary/30 text-secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-tight">
                {artworkData.title}
              </h1>

              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{artworkData.artist.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span>{artworkData.loves} loves</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-secondary" />
                  <span>{artworkData.views + viewCount} views</span>
                </div>
              </div>
            </div>

            <Card className="border-primary/20 shadow-lg hover:shadow-primary/10 transition-all duration-300 glow-effect">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={artworkData.artist.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {artworkData.artist.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{artworkData.artist.name}</h3>
                      {artworkData.artist.verified && <Sparkles className="w-5 h-5 text-primary" />}
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{artworkData.artist.bio}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3 text-red-400" />
                        <span>{artworkData.artist.followers} followers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{artworkData.artist.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Palette className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Medium</span>
                  </div>
                  <p className="text-foreground">{artworkData.medium}</p>
                </div>
                <div className="bg-card/50 rounded-xl p-4 border border-secondary/10 hover:border-secondary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Ruler className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-sm">Dimensions</span>
                  </div>
                  <p className="text-foreground">{artworkData.dimensions}</p>
                </div>
                <div className="bg-card/50 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Created</span>
                  </div>
                  <p className="text-foreground">{artworkData.year}</p>
                </div>
                <div className="bg-card/50 rounded-xl p-4 border border-secondary/10 hover:border-secondary/20 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Brush className="w-4 h-4 text-secondary" />
                    <span className="font-medium text-sm">Style</span>
                  </div>
                  <p className="text-foreground">{artworkData.style}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:scale-105"
                    onClick={() => setIsLoved(!isLoved)}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLoved ? "fill-white" : ""}`} />
                    {isLoved ? "Loved!" : "Love This Art"}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-secondary/30 hover:bg-secondary/10 bg-transparent"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="lg" className="border-primary/30 hover:bg-primary/10 bg-transparent">
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-gradient-to-r from-secondary/5 to-primary/5 border-primary/20 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Connect with Artist
                </Button>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  )
}
