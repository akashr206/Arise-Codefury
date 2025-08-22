"use client";
import {
    SignedIn,
    SignInButton,
    SignedOut,
    ClerkLoaded,
    useUser,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/contexts/UserContext";

const UserActions = () => {
    const { theme } = useTheme();
    const { user } = useUserContext();
    const router = useRouter();

    return (
        <ClerkLoaded>
            <SignedIn>
                <div
                    className="cursor-pointer"
                    onClick={() => router.push(`/profile/${user?.username}`)}
                >
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profile} alt={user?.name} />
                        <AvatarFallback>
                            {user?.firstName?.charAt(0) || "A"}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </SignedIn>
            <SignedOut>
                <Button className="rounded-full" asChild>
                    <SignInButton />
                </Button>
            </SignedOut>
        </ClerkLoaded>
    );
};

export default UserActions;
