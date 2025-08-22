"use client";

import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Eye,
  Share,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function StoryDialog({ reel, isOpen, onClose }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Start with false to prevent immediate play
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef(null);

  // Handle video playback and time updates
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reel?.mediaType !== "video") return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => setDuration(video.duration || 0);

    const handleCanPlay = () => {
      if (isOpen) {
        video.currentTime = 0;
        video
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("canplay", handleCanPlay);

    if (isOpen) {
      video.load();
    } else {
      video.pause();
      setIsPlaying(false);
      video.currentTime = 0;
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata); // ✅ fixed
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [isOpen, reel]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false)); // Handle play promise rejection
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (!reel) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm sm:max-w-md lg:max-w-lg p-0 bg-black border-0 overflow-hidden rounded-2xl mt-10 sm:rounded-3xl shadow-2xl">
        <div className="relative h-[85vh] sm:h-[80vh] lg:h-[85vh] bg-black">
          {/* Media Content */}
          <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
            {reel.mediaType === "video" ? (
              <video
                ref={videoRef}
                src={reel.mediaUrl}
                className="w-full h-full object-cover"
                loop
                muted={isMuted}
                playsInline
                poster={reel.thumbnailUrl}
                preload="metadata"
              />
            ) : (
              <img
                src={reel.mediaUrl || "/placeholder.svg"}
                alt={reel.caption || "Reel content"}
                className="w-full h-full object-cover"
              />
            )}

            {/* Top Control Buttons */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
              {/* Close Button - Left side */}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-black/40 bg-black/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 hover:scale-110 shadow-lg border border-white/10"
                onClick={onClose}
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Sound Button - Right side, only for videos */}
              {reel.mediaType === "video" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-black/40 bg-black/20 backdrop-blur-sm rounded-full p-2.5 transition-all duration-200 hover:scale-110 shadow-lg border border-white/10"
                  onClick={toggleMute}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
              )}
            </div>

            {/* Video Controls Overlay */}
            {reel.mediaType === "video" && (
              <>
                <div
                  className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-[1px]"
                  onClick={togglePlayPause}
                >
                  <div className="bg-black/60 backdrop-blur-sm rounded-full p-4 transform hover:scale-110 transition-transform duration-200 shadow-lg">
                    {isPlaying ? (
                      <Pause className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    ) : (
                      <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" />
                    )}
                  </div>
                </div>

                <div className="absolute bottom-24 sm:bottom-26 left-4 right-4 ">
                  <div className="bg-white/20 backdrop-blur-sm h-1 rounded-full overflow-hidden shadow-sm">
                    <div
                      className="bg-gradient-to-r from-white to-white/90 h-full transition-all duration-200 rounded-full"
                      style={{
                        width: `${
                          duration > 0 && currentTime >= 0
                            ? Math.min((currentTime / duration) * 100, 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4">
              <div className="flex items-center gap-3 mb-2">
                <Avatar className="w-9 h-9 sm:w-10 sm:h-10 border border-white/70">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=40&width=40&query=${reel.author}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                    {reel.author.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">
                    {reel.author}
                  </p>
                  <p className="text-white/60 text-xs truncate">
                    {new Date(
                      reel.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Caption compressed to 2 lines */}
              {reel.caption && (
                <p className="text-white text-xs sm:text-sm mb-2 leading-snug line-clamp-2">
                  {reel.caption}
                </p>
              )}

              {/* Tags inline, compact */}
              {reel.tags && reel.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {reel.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-[10px] sm:text-xs px-1 py-0.5 rounded-full bg-white/15 text-white"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "text-white hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110",
                      isLiked && "text-red-400"
                    )}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart
                      className={cn(
                        "w-5 h-5 sm:w-6 sm:h-6",
                        isLiked && "fill-current"
                      )}
                    />
                    <span className="text-xs sm:text-sm ml-1 font-medium">
                      {formatCount(reel.likesCount + (isLiked ? 1 : 0))}
                    </span>
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-xs sm:text-sm ml-1 font-medium">
                      {formatCount(reel.commentsCount)}
                    </span>
                  </Button>

                  <div className="flex items-center text-white/70 px-2">
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm ml-1 font-medium">
                      {formatCount(reel.viewsCount)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  {reel.mediaType === "video" && (
                    <span className="text-white/70 text-xs sm:text-sm font-mono bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                      {formatDuration(currentTime)} /{" "}
                      {formatDuration(duration || reel.durationSec || 0)}
                    </span>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <Share className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
