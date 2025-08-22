import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Mail,
  Instagram,
  Twitter,
  Globe,
  Calendar,
  UserPlus,
} from "lucide-react";

export default function UserInfo({ artist }) {
  const {
    name = "Shree Vishnu A",
    username = "shree_vishnu_a",
    profileImage = "/professional-artist-portrait.png",
    bio = "Contemporary artist specializing in abstract expressionism and mixed media. My work explores the intersection of emotion and color, creating pieces that speak to the human experience.",
    location = "Bangalore,Karnataka",
    email = "shreevishnu1746@gmail.com",
    joinDate = "August 2025",
    followers = "1.3K",
    following = "892",
    artworks = "56",
    stories = "25",
    specialties = [
      "Abstract Art",
      "Oil Painting",
      "Mixed Media",
      "Digital Art",
    ],
  } = artist || {};

  return (
    <Card className="w-full max-w-4xl mt-20 mx-auto border-none ">
      <CardContent className="p-8">
        <div className="flex gap-10">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row gap-8 items-start ">
            {/* Profile Image */}
            <div className="flex flex-col gap-4">
              <div className="flex-shrink-0 ">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 ring-4 ring-primary/20">
                  <AvatarImage
                    src={profileImage || "/placeholder.svg"}
                    alt={name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold bg-muted">
                    {name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Contact & Social */}
              <div className="flex flex-wrap gap-3 flex-col">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Follow
                </Button>
                <div className="flex justify-evenly ">
                  <Button className="bg-white text-black hover:text-white">
                    <Instagram />
                  </Button>
                  <Button className="bg-white text-black hover:text-white">
                    <Twitter />
                  </Button>
                  <Button className="bg-white text-black hover:text-white">
                    <Mail />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {/* Main Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {name}
                </h1>
                <p className="text-lg text-muted-foreground mb-1">{username}</p>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{location}</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-foreground leading-relaxed max-w-2xl">{bio}</p>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-accent text-accent-foreground"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6 py-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {artworks}
                  </div>
                  <div className="text-sm text-muted-foreground">Artworks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stories}
                  </div>
                  <div className="text-sm text-muted-foreground">Stories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {followers}
                  </div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {following}
                  </div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
