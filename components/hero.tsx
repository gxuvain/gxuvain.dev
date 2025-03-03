import Image from "next/image";
import Link from "next/link";
import { unstable_ViewTransition as ViewTransition } from "react";
import Github from "@/components/svg/github";
import X from "@/components/svg/x";

const Hero = () => {
    return (
        <div>
            <div className="flex items-center gap-4 md:gap-8 mt-20 md:mt-32">
                <Image
                    src="/assets/avatar.jpeg"
                    alt="Avatar"
                    width={600}
                    height={600}
                    className="rounded-full h-16 w-16 md:h-24 md:w-24"
                />

                <h1 className="text-2xl md:text-3xl text-black">
                    Hi, there! 👋
                </h1>
            </div>
            <h2>Gauvain Palanga</h2>

            <div className="mt-6 md:mt-10 max-w-[900px] text-sm md:text-base">
                I am Gauvain, a passionate computer science student, who wants
                to share his love for software development. Currently, I am
                working for a company called ENGLAB, where I create Python and
                React applications.
            </div>
            <div className="mt-8 flex gap-8 items-center">
                <Link
                    href="https://x.com/1weiho"
                    target="_blank"
                    className="flex items-center gap-2 hover:text-black duration-300 group text-sm md:text-base"
                >
                    <X className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                    Twitter
                </Link>

                <Link
                    href="https://github.com/1weiho"
                    target="_blank"
                    className="flex items-center gap-2 hover:text-black duration-300 group text-sm md:text-base"
                >
                    <Github className="grayscale-0 md:grayscale opacity-100 md:opacity-50 transition-all duration-300 md:group-hover:grayscale-0 md:group-hover:opacity-100" />
                    GitHub
                </Link>
            </div>
        </div>
    );
};

export default Hero;
