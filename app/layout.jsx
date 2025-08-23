import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import { UserProvider } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { ArtistProvider } from "@/hooks/useArtist";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "Team Arise",
    description: "Team Arise's Codefury project",
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <html lang="en">
                <body
                    className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                >
                    <ThemeProvider attribute={"class"}>
                        <UserProvider>
                            <ArtistProvider>
                                <Navbar></Navbar>
                                {children}
                            </ArtistProvider>
                        </UserProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
