"use client";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import { Poppins } from "next/font/google";

const PoppinsFont = Poppins({
    variable: "--font-poppins",
    subsets: ["latin"],
    weight: ["400", "700"],
});

export default function HeroSection() {
    const imgs = [
        { src: "/madhu.jpeg", alt: "madhubani", title: "Madhubani" },
        { src: "/pithora.jpeg", alt: "pithora", title: "Pithora" },
        { src: "/warli.jpeg", alt: "warli", title: "Warli" },
        { src: "/gond.jpeg", alt: "gond", title: "Gond" },
    ];
    return (
        <section
            className={`${PoppinsFont.className} --font-poppins min-h-screen flex flex-col items-center bg-background justify-center overflow-hidden`}
        >
            <motion.div className="h-[40vh] w-full text-8xl flex flex-col max-lg:text-7xl max-md:tracking-tighter max-md:text-[55px] max-md:font-bold font-semibold items-center justify-end ">
                <motion.h1
                    initial={{ opacity: 0.5, y: -10, filter: "blur(40px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                >
                    EXPLORE THE
                </motion.h1>
                <motion.h1
                    initial={{ opacity: 0.5, y: -10, filter: "blur(40px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.5 }}
                >
                    WORLD OF ART
                </motion.h1>
            </motion.div>
            <div className="md:min-h-[60vh] text-center px-6 py-4 bg-foreground w-full">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center items-center justify-center">
                    {imgs.map((img, i) => (
                        <motion.div
                            key={img.alt}
                            initial={{
                                y: 50,
                                opacity: 0.5,
                                filter: "blur(20px)",
                            }}
                            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.5, delay: i * 0.2 }}
                            className="overflow-hidden group rounded-2xl"
                        >
                            <div className="overflow-hidden rounded-2xl">
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-[350px] h-[350px] object-cover transition-transform duration-300 group-hover:scale-110 rounded-2xl"
                                />
                            </div>
                            <p className="text-xl font-bold uppercase text-background text mt-2">
                                {img.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
                <div className="flex gap-2 mt-4 items-center justify-center">
                    <Button variant={"secondary"}>Explore</Button>
                    <Button variant={"primary"} className={" text-background border hover:opacity-85"}>
                        Shop now
                        <ArrowUpRight></ArrowUpRight>
                    </Button>
                </div>
            </div>
        </section>
    );
}
