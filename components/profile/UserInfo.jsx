"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserContext } from "@/contexts/UserContext";
import EditUserDialog from "./EditUserDialog";
import { MapPin, Mail, Instagram, Twitter, UserPlus } from "lucide-react";

export default function UserInfo({ artist }) {
    const { user: currentUser } = useUserContext();

    const isOwnProfile =
        currentUser && currentUser.username === artist?.username;

    return (
        <Card className="w-full shadow-none max-w-4xl mt-20 mx-auto border-none ">
            <CardContent className="p-8">
                <div className="flex gap-10">
                    <div className="flex flex-col md:flex-row gap-8 items-start ">
                        <div className="flex flex-col gap-4">
                            <div className="flex-shrink-0 ">
                                <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-primary/20">
                                    <AvatarImage
                                        src={
                                            artist?.profile ||
                                            "/placeholder.svg"
                                        }
                                        alt={artist?.name}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="text-2xl font-bold bg-muted">
                                        {artist?.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            <div className="flex flex-wrap gap-3 flex-col">
                                {isOwnProfile ? (
                                    <EditUserDialog />
                                ) : (
                                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Follow
                                    </Button>
                                )}
                                <div className="flex justify-evenly ">
                                    {artist?.instagram && (
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                window.open(
                                                    `https://instagram.com/${artist.instagram}`,
                                                    "_blank"
                                                )
                                            }
                                            className="hover:bg-pink-50 hover:border-pink-300"
                                        >
                                            <Instagram className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {artist?.twitter && (
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                window.open(
                                                    `https://twitter.com/${artist.twitter}`,
                                                    "_blank"
                                                )
                                            }
                                            className="hover:bg-blue-50 hover:border-blue-300"
                                        >
                                            <Twitter className="w-4 h-4" />
                                        </Button>
                                    )}
                                    {artist?.email && (
                                        <Button
                                            variant={"outline"}
                                            onClick={() =>
                                                window.open(
                                                    `mailto:${artist.email}`,
                                                    "_blank"
                                                )
                                            }
                                            className="hover:bg-gray-50 hover:border-gray-300"
                                        >
                                            <Mail className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center">
                        <div className="flex-1 space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                                    {artist?.name}
                                </h1>
                                <p className="text-lg text-muted-foreground mb-1">
                                    {artist?.username}
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>{artist?.location}</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <p className="text-foreground leading-relaxed max-w-2xl">
                                {artist?.bio}
                            </p>

                            {/* Specialties */}
                            <div className="flex flex-wrap gap-2">
                                {(artist?.categories || []).map(
                                    (category, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-accent text-accent-foreground"
                                        >
                                            {category}
                                        </Badge>
                                    )
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex gap-6 py-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {artist?.artworksCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Artworks
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {artist?.storiesCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Stories
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {artist?.followersCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Followers
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-primary">
                                        {artist?.followingCount || 0}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Following
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
